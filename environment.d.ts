declare namespace NodeJS {
  interface ProcessEnv {
    readonly GOOGLE_API_CREDENTIALS: string;
    readonly BASE_URL: string | undefined;
  }
}
