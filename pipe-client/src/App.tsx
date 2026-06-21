import { PipecatClient } from "@pipecat-ai/client-js";
import {
  PipecatClientProvider,
  PipecatClientAudio,
  usePipecatClient,
  usePipecatConversation,
} from "@pipecat-ai/client-react";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { ConsoleTemplate, ThemeProvider } from "@pipecat-ai/voice-ui-kit";

// Create the client instance
const client = new PipecatClient({
  transport: new DailyTransport(),
  enableMic: true,
});

// Root component wraps the app with the provider
function App() {
  return (
    <PipecatClientProvider client={client}>
      <VoiceConsole />
      {/* <PipecatClientAudio /> */}
    </PipecatClientProvider>
  );
}

// Component using the client and conversation hooks
function VoiceBot() {
  const client = usePipecatClient();
  const { messages } = usePipecatConversation();

  const handleClick = async () => {
    await client.startBotAndConnect({
      endpoint: `http://localhost:8000/api/v1/voice/webrtc-url`,
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Start Conversation</button>
      <ul>
        {messages.map((msg, i) => (
          <li key={`${msg.createdAt}-${i}`}>
            <strong>{msg.role}:</strong>{" "}
            {msg.parts?.map((part, j) => (
              <span key={j}>
                {typeof part.text === "string"
                  ? part.text
                  : `${part.text.spoken}${part.text.unspoken}`}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}


function VoiceConsole() {
  return (
    <ThemeProvider>
            <ConsoleTemplate
                transportType="smallwebrtc"
                connectParams={{
                    webrtcUrl: "http://localhost:8000/api/v1/voice/offer", 
                }}
                noUserVideo={true}
            />
        </ThemeProvider>
  )
}

export default App;