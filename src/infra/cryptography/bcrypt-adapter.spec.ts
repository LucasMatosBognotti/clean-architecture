import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

describe('BCrypt Adaptar', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12
    const systemUnderTest = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await systemUnderTest.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on sucess', async () => {
    const salt = 12
    const systemUnderTest = new BCryptAdapter(salt)

    const hash = await systemUnderTest.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
