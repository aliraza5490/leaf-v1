from fastapi import HTTPException
from typing import Union
from ...models.group import Group, GroupBase
from sqlmodel import Session, select
from ...models.user import User


def _get_user_group(group_id: int, user: User, session: Session) -> Group:
    """Helper to check if user is a member of the group"""
    group = session.exec(
        select(Group).where(
            Group.id == group_id,
            Group.users.any(email=user.email)
        )
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail=f"Group with id {group_id} not found or you don't have access to it."
        )
    return group


def create_group(group: GroupBase, user: User, session: Session) -> dict:
    """Create a new group with the current user as admin"""
    group_data = Group(
        **group.model_dump(),
        admin=user.email
    )
    group_data.users.append(user)

    session.add(group_data)
    session.commit()
    session.refresh(group_data)
    return {"group_name": group.name, "group_id": group_data.id}


def get_group(group_id: int, user: User, session: Session):
    """Get group by ID if user is a member"""
    group = _get_user_group(group_id, user, session)
    return group


def get_all_groups(user: User, session: Session, q: Union[str, None] = None):
    """Get all groups that user is a member of"""
    query = select(Group).where(Group.users.any(email=user.email))

    if q:
        query = query.where(Group.name.ilike(f"%{q}%"))

    groups = session.exec(query).all()
    return {"groups": groups}


def update_group(group_id: int, group: GroupBase, user: User, session: Session):
    """Update group if user is the admin"""
    group_data = _get_user_group(group_id, user, session)

    if group_data.admin != user.email:
        raise HTTPException(
            status_code=403,
            detail="Only the group admin can update this group"
        )

    update_data = group.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(group_data, key, value)

    session.add(group_data)
    session.commit()
    session.refresh(group_data)

    return {"group_name": group_data.name, "group_id": group_id}


def delete_group(group_id: int, user: User, session: Session):
    """Delete group if user is the admin"""
    group_data = _get_user_group(group_id, user, session)

    if group_data.admin != user.email:
        raise HTTPException(
            status_code=403,
            detail="Only the group admin can delete this group"
        )

    session.delete(group_data)
    session.commit()
    return {"group_id": group_id}


def add_user_to_group(group_id: int, user_to_add_email: str, user: User, session: Session):
    """Add a user to a group if current user is admin"""
    group = _get_user_group(group_id, user, session)

    if group.admin != user.email:
        raise HTTPException(
            status_code=403,
            detail="Only the group admin can add users to this group"
        )

    user_to_add = session.get(User, user_to_add_email)
    if not user_to_add:
        raise HTTPException(
            status_code=404,
            detail=f"User with email {user_to_add_email} not found"
        )

    if user_to_add in group.users:
        return {"message": f"User {user_to_add_email} is already in group {group_id}"}

    group.users.append(user_to_add)
    session.add(group)
    session.commit()

    return {"message": f"User {user_to_add_email} added to group {group_id}"}


def remove_user_from_group(group_id: int, user_to_remove_email: str, user: User, session: Session):
    """Remove a user from a group if current user is admin"""
    group = _get_user_group(group_id, user, session)

    if group.admin != user.email:
        raise HTTPException(
            status_code=403,
            detail="Only the group admin can remove users from this group"
        )

    user_to_remove = session.get(User, user_to_remove_email)
    if not user_to_remove:
        raise HTTPException(
            status_code=404,
            detail=f"User with email {user_to_remove_email} not found"
        )

    if user_to_remove not in group.users:
        return {"message": f"User {user_to_remove_email} is not in group {group_id}"}

    if user_to_remove_email == group.admin:
        raise HTTPException(
            status_code=400,
            detail="Cannot remove the group admin from the group"
        )

    group.users.remove(user_to_remove)
    session.add(group)
    session.commit()

    return {"message": f"User {user_to_remove_email} removed from group {group_id}"}


def get_group_members(group_id: int, user: User, session: Session):
    """Get all members of a group if the user is a member"""
    group = _get_user_group(group_id, user, session)

    return {
        "group_id": group_id,
        "group_name": group.name,
        "members": group.users,
        "admin_email": group.admin
    }


def invite_user_to_group(group_id: int, invite_data, user: User, session: Session):
    """Invite a user to a group by email if current user is admin"""
    group = _get_user_group(group_id, user, session)

    if group.admin != user.email:
        raise HTTPException(
            status_code=403,
            detail="Only the group admin can send invitations to this group"
        )

    user_to_invite = session.exec(select(User).where(User.email == invite_data.email)).first()
    if not user_to_invite:
        return {"message": f"Invitation will be sent to {invite_data.email} once they register"}

    if user_to_invite in group.users:
        return {"message": f"User with email {invite_data.email} is already in group {group_id}"}

    group.users.append(user_to_invite)
    session.add(group)
    session.commit()

    return {"message": f"User with email {invite_data.email} added to group {group_id}"}


def search_groups(search_term: str, user: User, session: Session):
    """Search for groups by name that the user is a member of"""
    if not search_term or len(search_term) < 2:
        raise HTTPException(
            status_code=400,
            detail="Search term must be at least 2 characters long"
        )

    query = select(Group).where(
        Group.users.any(email=user.email),
        Group.name.ilike(f"%{search_term}%")
    )

    groups = session.exec(query).all()
    return {"groups": groups, "search_term": search_term}
