export default () => ({
  database: {
    host: process.env.MONGO_URI || 'mongodb://localhost:27017/lex'
  },
  auth: {
    token: process.env.AUTH_TOKEN
  }
});
