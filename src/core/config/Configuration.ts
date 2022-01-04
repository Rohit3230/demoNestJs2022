export default () => ({
  port: parseInt(process.env.PORT, 10),
  mongoUri: process.env.MONGO_DB_STRING,
  auth: {
    username: process.env.BASIC_AUTH_USERNAME,
    password: process.env.BASC_AUTH_PASSWORD,
  }
});
