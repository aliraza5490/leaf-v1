import type { Product, VoiceState } from '@/lib/types';
import type { VoiceErrorCode } from '@/lib/voice-error';
import { ProductCarousel } from '@/components/ui/product-carousel';
import { MicIcon } from '@/components/ui/icons';

interface CallViewProps {
  storeLogo?: string;
  primaryColor: string;
  products?: Product[];
  highlightedProductId?: string | null;
  voiceState: VoiceState;
  transcript: string;
  agentText: string;
  voiceError: { code: VoiceErrorCode; message: string } | null;
  onEndCall?: () => void;
  onAddToCart?: (product: Product) => void;
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

function getSpeakerText(state: VoiceState): string {
  switch (state) {
    case 'connecting': return 'Connecting...';
    case 'listening': return 'You are speaking';
    case 'processing': return 'Thinking...';
    case 'speaking': return 'Leaf is speaking';
    case 'error': return 'Error';
    default: return 'In call';
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
  storeLogo, 
  primaryColor, 
  products, 
  highlightedProductId,
  voiceState,
  transcript: _transcript,
  agentText: _agentText,
  voiceError,
  onEndCall: _onEndCall,
  onAddToCart
}: CallViewProps) {
  const hasProducts = products && products.length > 0;
  const stateColor = getStateColor(voiceState, primaryColor);

  return (
    <div className={`flex-1 flex flex-col w-full min-w-0 bg-gray-50 dark:bg-zinc-950 animate-leaf-fade-in`}>
      {/* Unified Voice Status & Orb Visualizer */}
      <div className={`flex flex-col items-center justify-center ${hasProducts ? 'py-4 mt-1' : 'flex-1 my-auto py-6'}`}>
        {/* Pulsing Orb */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute rounded-full opacity-20 animate-leaf-orb-glow"
            style={{
              width: hasProducts ? '72px' : '112px',
              height: hasProducts ? '72px' : '112px',
              backgroundColor: stateColor,
              '--orb-glow-color': stateColor,
            } as any}
          />
          <div
            className="relative rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300"
            style={{
              width: hasProducts ? '52px' : '80px',
              height: hasProducts ? '52px' : '80px',
              backgroundColor: stateColor,
            }}
          >
            {storeLogo ? (
              <img
                src={storeLogo}
                alt=""
                className="rounded-full object-cover"
                style={{
                  width: hasProducts ? '52px' : '80px',
                  height: hasProducts ? '52px' : '80px',
                }}
              />
            ) : (
              <MicIcon size={hasProducts ? 24 : 36} />
            )}
          </div>
        </div>

        {/* Reactive Sound Bars Waveform */}
        <div className={`flex items-center justify-center gap-1 mt-4 ${hasProducts ? 'h-6' : 'h-8'}`}>
          {[...Array(7)].map((_, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-current transition-all duration-300 animate-sound-wave"
              style={{
                height: '100%',
                width: hasProducts ? '3px' : '4px',
                color: stateColor,
                animationDelay: `${[0, 0.15, 0.3, 0.45, 0.3, 0.15, 0][i]}s`,
                animationPlayState: (voiceState === 'speaking' || voiceState === 'listening' || voiceState === 'processing' || voiceState === 'connecting') ? 'running' : 'paused',
                animationDuration: voiceState === 'speaking' || voiceState === 'listening' ? '0.7s' : voiceState === 'processing' ? '1.3s' : '2.2s',
                opacity: voiceState === 'idle' ? 0.15 : 0.85,
              }}
            />
          ))}
        </div>

        {/* Dynamic Speaker Status Text */}
        <p 
          className="text-xs font-semibold mt-3.5 tracking-wide uppercase transition-all duration-300"
          style={{ color: stateColor }}
        >
          {getSpeakerText(voiceState)}
        </p>

        {voiceError && voiceState === 'error' && (
          <div className="px-6 text-center mt-3 animate-leaf-fade-in max-w-[300px]">
            <p className="text-xs text-red-600 font-medium">{getErrorMessage(voiceError.code)}</p>
          </div>
        )}
      </div>

      {/* Suggested Products Section */}
      {hasProducts && (
        <div className="w-full mb-1 animate-leaf-slide-up border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 pt-3 pb-2">
          <ProductCarousel
            products={products}
            primaryColor={primaryColor}
            highlightedProductId={highlightedProductId}
            label="Suggested while we chat"
            onAddToCart={onAddToCart}
          />
        </div>
      )}

    </div>
  );
}
