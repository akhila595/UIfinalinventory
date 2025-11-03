// src/env.d.ts

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_URL?: string;     // optional
  readonly VITE_OTHER_KEY?: string;   // optional
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
