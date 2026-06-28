import type { Product, VoiceState } from '@/lib/types';
import type { VoiceErrorCode } from '@/lib/voice-error';
import { ProductCarousel } from './product-carousel';

interface CallViewProps {
  storeName: string;
  storeLogo?: string;
  primaryColor: string;
  products?: Product[];
  voiceState: VoiceState;
  transcript: string;
  agentText: string;
  voiceError: { code: VoiceErrorCode; message: string } | null;
  onEndCall: () => void;
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function getStateLabel(state: VoiceState): string {
  switch (state) {
    case 'connecting': return 'Connecting...';
    case 'listening': return 'Listening...';
    case 'processing': return 'Thinking...';
    case 'speaking': return 'Speaking...';
    case 'error': return 'Error';
    default: return 'Ready';
  }
}

function getStateColor(state: VoiceState, primaryColor: string): string {
  switch (state) {
    case 'connecting': return '#f59e0b';
    case 'listening': return primaryColor;
    case 'processing': return '#3b82f6';
    case 'speaking': return '#8b5cf6';
    case 'error': return '#ef4444';
    default: return '#6b7280';
  }
}

function getErrorMessage(code: VoiceErrorCode): string {
  switch (code) {
    case 'mic-denied': return 'Microphone access was denied. Please allow mic access in your browser settings and try again.';
    case 'mic-unavailable': return 'No microphone found. Please connect a microphone and try again.';
    case 'ws-failed': return 'Could not connect to the voice server. Please check your internet connection.';
    case 'ws-lost': return 'Connection was lost. Please try starting a new call.';
    case 'server-error': return 'The server encountered an error. Please try again.';
    default: return 'Something went wrong. Please try again.';
  }
}

export function CallView({ 
  storeName, 
  storeLogo, 
  primaryColor, 
  products, 
  voiceState,
  transcript,
  agentText,
  voiceError,
  onEndCall 
}: CallViewProps) {
  const hasProducts = products && products.length > 0;

  const stateLabel = getStateLabel(voiceState);
  const stateColor = getStateColor(voiceState, primaryColor);

  return (
    <div className={`flex-1 flex flex-col w-full min-w-0 ${hasProducts ? 'pt-10' : 'pt-6'} pb-2 bg-gray-50 animate-leaf-fade-in`}>
      <div className={`flex flex-col items-center mt-6 ${hasProducts ? 'mb-6' : 'mb-4'}`}>
        <div className={`relative flex items-center justify-center ${hasProducts ? 'mb-10' : 'mb-6'}`}>
          <div
            className={`absolute w-28 h-28 rounded-full opacity-20 ${voiceState === 'listening' ? 'animate-leaf-glow-pulse' : voiceState === 'speaking' ? 'animate-leaf-glow-pulse' : ''}`}
            style={{ backgroundColor: stateColor, animationDelay: '0s' }}
          />
          <div
            className={`absolute w-24 h-24 rounded-full opacity-30 ${voiceState === 'listening' ? 'animate-leaf-glow-pulse' : voiceState === 'speaking' ? 'animate-leaf-glow-pulse' : ''}`}
            style={{ backgroundColor: stateColor, animationDelay: '0.4s' }}
          />
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg animate-leaf-glow-breathe"
            style={{ backgroundColor: stateColor }}
          >
            {storeLogo ? (
              <img src={storeLogo} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <MicIcon />
            )}
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-800 mb-0.5 mt-6">{storeName}</h3>
        <p className="text-sm font-medium mb-2" style={{ color: stateColor }}>
          {stateLabel}
        </p>
        
        {voiceError && voiceState === 'error' && (
          <div className="px-6 text-center animate-leaf-fade-in max-w-[300px]">
            <p className="text-sm text-red-600">{getErrorMessage(voiceError.code)}</p>
          </div>
        )}
      </div>

      {hasProducts && (
        <div className="w-full mb-2 animate-leaf-slide-up">
          <ProductCarousel
            products={products}
            primaryColor={primaryColor}
            label="Recommended for you"
          />
        </div>
      )}

      <div className={`flex justify-center ${hasProducts ? 'mt-auto mb-6' : 'mt-10 mb-4'}`}>
        <button
          onClick={onEndCall}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 text-white font-medium text-sm hover:bg-red-600 active:scale-95 transition-all cursor-pointer shadow-lg shadow-red-500/25"
          aria-label="End call"
        >
          <PhoneIcon />
          End Call
        </button>
      </div>
    </div>
  );
}
