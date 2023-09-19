interface Cache {
  set(key: string, value: string): void;
  get(key: string): string | null;
  setJSON(key: string, jsonValue: any): void;
  getJSON(key: string): any | null;
  remove(key: string): void;
}

const sessionCache: Cache = {
  set: (key, value) => {
    if (!sessionStorage) {
      return;
    }
    if (key != null && value != null) {
      sessionStorage.setItem(key, value);
    }
  },
  get: (key) => {
    if (!sessionStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }
    return sessionStorage.getItem(key);
  },
  setJSON: (key, jsonValue) => {
    if (jsonValue != null) {
      sessionCache.set(key, JSON.stringify(jsonValue));
    }
  },
  getJSON: (key) => {
    const value = sessionCache.get(key);
    if (value != null) {
      return JSON.parse(value);
    }
  },
  remove: (key) => {
    sessionStorage.removeItem(key);
  },
};

const localCache: Cache = {
  set: (key, value) => {
    if (!localStorage) {
      return;
    }
    if (key != null && value != null) {
      localStorage.setItem(key, value);
    }
  },
  get: (key) => {
    if (!localStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }
    return localStorage.getItem(key);
  },
  setJSON: (key, jsonValue) => {
    if (jsonValue != null) {
      localCache.set(key, JSON.stringify(jsonValue));
    }
  },
  getJSON: (key) => {
    const value = localCache.get(key);
    if (value != null) {
      return JSON.parse(value);
    }
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
};

export default {
  /**
   * 会话级缓存
   */
  session: sessionCache,
  /**
   * 本地缓存
   */
  local: localCache,
};
