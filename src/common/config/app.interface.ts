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
      unblock: string;
      rejectUnblock: string;
      approveUnblock: string;
      confirmationMeet: string;
    };
  };
  aws: {
    region: string;
    key: string;
    secret: string;
    bucket: string;
  };
}
