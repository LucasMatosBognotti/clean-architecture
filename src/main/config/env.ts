export default {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-architecture',
  PORT: process.env.PORT ?? 3456,
  JWT_SECRET: process.env.JWT_SECRET ?? '213@#@#afaDADWAWDOPKD'
}
