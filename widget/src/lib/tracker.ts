import { getOrCreateVisitorId } from './api';

export interface TrackingEvent {
  eventType: string;
  eventData?: Record<string, any>;
}

class LeafTracker {
  private storeId: string = '';
  private clientToken: string = '';
  private apiUrl: string = '';
  private sessionId: string = '';
  private visitorId: string = '';
  private csrfToken: string | null = null;
  private initialized: boolean = false;
  private isFetchingToken: boolean = false;
  private heartbeatInterval: any = null;
  private eventQueue: { eventType: string; eventData?: Record<string, any> }[] = [];

  init(storeId: string, clientToken: string, apiUrl: string) {
    if (this.initialized) return;
    this.storeId = storeId;
    this.clientToken = clientToken;
    this.apiUrl = apiUrl;
    this.visitorId = getOrCreateVisitorId();
    this.sessionId = this.getOrCreateSessionId();
    this.initialized = true;

    // 1. Fetch CSRF token first
    this.fetchCsrfToken().then(() => {
      // 2. Track initial page view & flush queue
      this.trackPageView();
      this.flushQueue();

      // 3. Set up listeners
      this.startHeartbeat();
      this.setupClickListener();
      this.setupHistoryListeners();
    });
  }

  private getOrCreateSessionId(): string {
    try {
      let sid = sessionStorage.getItem('leaf_analytics_session_id');
      if (!sid) {
        sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        sessionStorage.setItem('leaf_analytics_session_id', sid);
      }
      return sid;
    } catch {
      return `s_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    }
  }

  private async fetchCsrfToken(): Promise<void> {
    if (this.isFetchingToken) return;
    this.isFetchingToken = true;

    try {
      const response = await fetch(`${this.apiUrl}/api/v1/analytics/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_id: this.storeId,
          client_token: this.clientToken,
          session_id: this.sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.csrfToken = data.csrf_token;
      } else {
        console.warn('[Leaf Tracker] Failed to retrieve security token:', response.statusText);
      }
    } catch (err) {
      console.warn('[Leaf Tracker] Error establishing security session:', err);
    } finally {
      this.isFetchingToken = false;
    }
  }

  track(eventType: string, eventData?: Record<string, any>) {
    if (!this.initialized) return;

    // If CSRF token is not yet ready, queue the event
    if (!this.csrfToken) {
      if (this.eventQueue.length < 100) {
        this.eventQueue.push({ eventType, eventData });
      }
      return;
    }

    const payload = {
      store_id: this.storeId,
      session_id: this.sessionId,
      visitor_id: this.visitorId,
      event_type: eventType,
      url: window.location.href,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      event_data: eventData ? JSON.stringify(eventData) : null,
    };

    fetch(`${this.apiUrl}/api/v1/analytics/collect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Leaf-CSRF-Token': this.csrfToken,
        'X-Leaf-Session-Id': this.sessionId,
        'X-Leaf-Store-Id': this.storeId,
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn('[Leaf Tracker] Error sending analytics event:', err);
    });
  }

  trackPageView() {
    this.track('pageview');
  }

  private flushQueue() {
    if (!this.csrfToken) return;
    while (this.eventQueue.length > 0) {
      const queued = this.eventQueue.shift();
      if (queued) {
        this.track(queued.eventType, queued.eventData);
      }
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      this.track('heartbeat');
    }, 20000); // Send heartbeat every 20 seconds
  }

  private setupClickListener() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]');
      if (clickable) {
        // Skip clicks inside the chat widget container
        const isInsideWidget = clickable.closest('#leaf-widget-container');
        if (isInsideWidget) return;

        const text = clickable.textContent?.trim() || clickable.getAttribute('aria-label') || clickable.getAttribute('value') || '';
        this.track('click', {
          text: text.substring(0, 100),
          tag: clickable.tagName.toLowerCase(),
          id: clickable.id || null,
          className: clickable.className || null,
          href: clickable.getAttribute('href') || null,
        });
      }
    });
  }

  private setupHistoryListeners() {
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        this.trackPageView();
      }
    });
    
    // Listen for mutations in the body (handles SPA routing changes)
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
    
    window.addEventListener('popstate', () => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        this.trackPageView();
      }
    });
  }
}

export const tracker = new LeafTracker();
