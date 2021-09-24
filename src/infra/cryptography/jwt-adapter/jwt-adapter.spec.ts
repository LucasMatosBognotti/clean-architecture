import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  },

  async verify (): Promise<string> {
    return new Promise(resolve => resolve('any_value'))
  }
}))

const makeSystemUnderTest = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const signSpy = jest.spyOn(jwt, 'sign')
      await systemUnderTest.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a token on sign sucess', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const accessToken = await systemUnderTest.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(jwt, 'sign').mockImplementation(() => { throw new Error() })
      const promise = systemUnderTest.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify', () => {
    it('Should call verify with correct values', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await systemUnderTest.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })
  })
})
