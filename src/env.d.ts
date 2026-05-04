/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORTAL_URL?: string;
  readonly VITE_API_BASE?: string;
  readonly VITE_DEV_LOCAL_LOGIN?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
