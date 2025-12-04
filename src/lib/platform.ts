/**
 * Platform utilities with safe guards for browser APIs
 * These utilities ensure the app works in all environments including WKWebView
 */

export const isBrowser = typeof window !== 'undefined';
export const isClient = typeof document !== 'undefined';

export const safeWindow = {
  open: (url: string, target = '_blank') => {
    if (isBrowser && window.open) {
      window.open(url, target);
    }
  },
  addEventListener: (event: string, handler: EventListener) => {
    if (isBrowser) {
      window.addEventListener(event, handler);
    }
  },
  removeEventListener: (event: string, handler: EventListener) => {
    if (isBrowser) {
      window.removeEventListener(event, handler);
    }
  },
  matchMedia: (query: string) => {
    if (isBrowser && window.matchMedia) {
      return window.matchMedia(query);
    }
    return { matches: false, addEventListener: () => {}, removeEventListener: () => {} } as any;
  },
  location: {
    get href() {
      return isBrowser ? window.location.href : '';
    },
    reload: () => {
      if (isBrowser) {
        window.location.reload();
      }
    }
  }
};

export const safeDocument = {
  get fullscreenElement() {
    return isClient ? document.fullscreenElement : null;
  },
  exitFullscreen: () => {
    if (isClient && document.exitFullscreen) {
      document.exitFullscreen();
    }
  },
  cookie: {
    get: () => {
      return isClient ? document.cookie : '';
    },
    set: (value: string) => {
      if (isClient) {
        document.cookie = value;
      }
    }
  }
};

export const safeNavigator = {
  get onLine() {
    return isBrowser ? navigator.onLine : true;
  }
};
