import { createRoot } from 'react-dom/client';
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

  if (!document.getElementById('leaf-font-stylesheet')) {
    const link = document.createElement('link');
    link.id = 'leaf-font-stylesheet';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  const root = createRoot(container);
  root.render(
    <LeafWidget config={config} />
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
