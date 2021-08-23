import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'

MongoHelper.connect(env.mongoURL)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.PORT, () => console.log(`🚀 Server is runing at http://localhost:${env.PORT} 👽`))
  })
  .catch(console.error)
