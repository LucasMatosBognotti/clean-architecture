import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', (req, res) => {
    return res.send({
      name: 'Lucas',
      email: 'lucas@gmail.com',
      password: '123',
      passwordConfirmation: '123'
    })
  })
}
