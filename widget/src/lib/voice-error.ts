export type VoiceErrorCode =
  | 'mic-denied'
  | 'mic-unavailable'
  | 'ws-failed'
  | 'ws-lost'
  | 'server-error'
  | 'unknown';

export interface VoiceCallError {
  code: VoiceErrorCode;
  message: string;
}
