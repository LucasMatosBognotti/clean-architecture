import path from 'path'
import { readdirSync } from 'fs'
import { Express, Router } from 'express'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(path.resolve(__dirname, '..', 'routes')).map(async file => {
    if (!file.endsWith('.test.ts')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
