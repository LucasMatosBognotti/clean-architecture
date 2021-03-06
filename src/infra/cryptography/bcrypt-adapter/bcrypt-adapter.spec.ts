import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSystemUnderTest = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCrypt Adaptar', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await systemUnderTest.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on sucess', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const hash = await systemUnderTest.hash('any_value')
      expect(hash).toBe('hash')
    })

    test('Should throw if hash throws', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => await Promise.reject(new Error()))
      const promise = systemUnderTest.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct value', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await systemUnderTest.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const isValid = await systemUnderTest.compare('any_value', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async (): Promise<boolean> => await new Promise(resolve => resolve(false)))
      const isValid = await systemUnderTest.compare('any_value', 'any_hash')
      expect(isValid).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => await Promise.reject(new Error()))
      const promise = systemUnderTest.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
