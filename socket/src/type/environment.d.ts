export {};

declare global {
   namespace NodeJS {
      interface ProcessEnv {
         DB_NAME: string;
         DB_HOST: string;
         DB_USER: string;
         DB_PASSWORD: string;
         DB_PORT: number;

         SOCKET_PORT: number
         CLIENT_URL: string
      }
   }
}
