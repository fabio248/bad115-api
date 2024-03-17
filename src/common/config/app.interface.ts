export interface IAppConfig {
  port: number;
  databaseUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
    expiresInRefresh: string;
  };
  sendgrid: {
    apiKey: string;
    email: string;
    templates: {
      welcome: string;
    };
  };
}
