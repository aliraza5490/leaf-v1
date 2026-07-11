import json
from typing import AsyncGenerator
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from sqlmodel import Session, select
from ..models.conversation import Conversation, ChatMessage
from ..utilities.db import engine
from .tools import agent_tools
from ..settings import settings


SYSTEM_PROMPT = """You are Leaf, a friendly and knowledgeable AI shopping assistant for e-commerce stores.

Your role:
- Help customers find products they're looking for
- Provide product recommendations based on their needs
- Answer questions about products, shipping, returns, and store policies
- Be warm, helpful, and concise in your responses

Guidelines:
- When a customer asks about products, use the product_search tool to find relevant items
- Present products naturally in conversation, mentioning key details like name, price, and features
- If no products match, suggest alternative search terms or browse the catalog
- Keep responses concise but informative (2-4 sentences typically)
- Always be helpful and positive

When recommending products, format your response to naturally include the product details. The system will automatically extract product references from your response."""


def _get_llm() -> ChatOpenAI:
    kwargs = {
        "model": settings.OPENAI_MODEL,
        "api_key": settings.OPENAI_API_KEY,
        "streaming": True,
    }
    if settings.OPENAI_BASE_URL:
        kwargs["base_url"] = settings.OPENAI_BASE_URL
    return ChatOpenAI(**kwargs)


def _get_agent():
    llm = _get_llm()
    agent = create_react_agent(llm, agent_tools)
    return agent


def _get_conversation_history(conversation_id: int | str) -> list[BaseMessage]:
    try:
        conversation_id_int = int(conversation_id)
    except (ValueError, TypeError):
        return []
    with Session(engine) as session:
        messages = session.exec(
            select(ChatMessage)
            .where(ChatMessage.conversation_id == conversation_id_int)
            .order_by(ChatMessage.created_at)
        ).all()
        history = []
        for msg in messages:
            if msg.sender == "visitor":
                history.append(HumanMessage(content=msg.content))
            elif msg.sender in ("assistant", "ai", "agent"):
                history.append(AIMessage(content=msg.content))
        return history


def _extract_product_ids(content: str) -> list[int]:
    import re
    ids = set()
    patterns = [
        r'ID:\s*(\d+)',
        r'product[_\s]?(?:id|#)\s*(\d+)',
    ]
    for pattern in patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        ids.update(int(m) for m in matches)
    return list(ids)


def _get_products_by_ids(product_ids: list[int]) -> list[dict]:
    if not product_ids:
        return []
    from ..models.product import Product
    from ..routes.product.service import first_image
    with Session(engine) as session:
        products = session.exec(
            select(Product).where(Product.id.in_(product_ids))
        ).all()
        return [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "image": first_image(p.images),
                "url": p.url,
                "description": p.description,
            }
            for p in products
        ]


async def run_agent_stream(
    conversation_id: int | str,
    user_message: str,
    store_id: int = 1,
) -> AsyncGenerator[dict, None]:
    conv_id_int = None
    try:
        conv_id_int = int(conversation_id)
    except (ValueError, TypeError):
        pass

    with Session(engine) as session:
        conversation = None
        if conv_id_int is not None:
            conversation = session.get(Conversation, conv_id_int)
        
        if not conversation:
            from ..utilities.db import verify_store_exists
            verify_store_exists(store_id, session)
            conversation = Conversation(store_id=store_id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
            conv_id_int = conversation.id

        user_msg = ChatMessage(
            conversation_id=conv_id_int,
            role="user",
            sender="visitor",
            content=user_message,
        )
        session.add(user_msg)
        session.commit()

    agent = _get_agent()
    history = _get_conversation_history(conv_id_int)

    input_messages = [SystemMessage(content=SYSTEM_PROMPT)] + history

    full_response = ""
    tool_outputs = []

    async for event in agent.astream_events(
        {"messages": input_messages + [HumanMessage(content=user_message)]},
        version="v2",
    ):
        kind = event["event"]

        if kind == "on_chat_model_stream":
            chunk = event.get("data", {}).get("chunk")
            if chunk and hasattr(chunk, "content") and chunk.content:
                if isinstance(chunk.content, str):
                    full_response += chunk.content
                    yield {"type": "token", "content": chunk.content}

        elif kind == "on_tool_end":
            tool_output = event.get("data", {}).get("output", "")
            if tool_output:
                tool_outputs.append(str(tool_output))

    product_ids = _extract_product_ids(full_response + " ".join(tool_outputs))
    products = _get_products_by_ids(product_ids)

    if products:
        yield {"type": "products", "products": products}

    with Session(engine) as session:
        assistant_msg = ChatMessage(
            conversation_id=conv_id_int,
            role="assistant",
            sender="ai",
            content=full_response,
            products_json=json.dumps(products) if products else "",
        )
        session.add(assistant_msg)

        conversation = session.get(Conversation, conv_id_int)
        if conversation:
            from datetime import datetime
            conversation.updated_at = datetime.utcnow()
            session.add(conversation)

        session.commit()

    yield {"type": "done", "content": full_response, "products": products}
