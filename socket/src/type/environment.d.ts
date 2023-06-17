export {};

declare global {
   namespace NodeJS {
      interface ProcessEnv {
         POSTGRES_DB: string;
         POSTGRES_HOST: string;
         POSTGRES_USER: string;
         POSTGRES_PASSWORD: string;
         POSTGRES_PORT: number;

         SOCKET_PORT: number
         CLIENT_URL: string
      }
   }
}
