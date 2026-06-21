import { createRoot } from 'react-dom/client';
import { PipecatClientProvider, PipecatClientAudio } from '@pipecat-ai/client-react';
import { PipecatClient } from '@pipecat-ai/client-js';
import { SmallWebRTCTransport } from '@pipecat-ai/small-webrtc-transport';
import { LeafWidget } from './widget';
import type { WidgetConfig } from './lib/types';
import './styles/widget.css';

const CONTAINER_ID = 'leaf-widget-container';

export function mountWidget(config: WidgetConfig) {
  const existing = document.getElementById(CONTAINER_ID);
  if (existing) {
    existing.remove();
  }

  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  container.className = 'leaf-widget-root';
  container.style.visibility = 'hidden';
  document.body.appendChild(container);

  const transport = new SmallWebRTCTransport({
    webrtcRequestParams: {
      endpoint: `${config.apiUrl || 'http://localhost:8000'}/api/v1/voice/offer`,
    },
  });

  const client = new PipecatClient({
    transport,
    enableMic: true,
    enableCam: false,
  });

  const root = createRoot(container);
  root.render(
    <PipecatClientProvider client={client as any}>
      <LeafWidget config={config} />
      <PipecatClientAudio />
    </PipecatClientProvider>
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.style.visibility = '';
    });
  });
}

export function init(config: WidgetConfig) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mountWidget(config));
  } else {
    mountWidget(config);
  }
}

declare global {
  interface Window {
    Leaf: {
      init: typeof init;
    };
  }
}

window.Leaf = { init };
