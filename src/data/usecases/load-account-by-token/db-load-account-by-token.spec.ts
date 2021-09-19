import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (ciphertext: string): Promise<string> {
        return new Promise(resolve => resolve('an_value'))
      }
    }
    const decrypterStub = new DecrypterStub()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const systemUnderTest = new DbLoadAccountByToken(decrypterStub)
    await systemUnderTest.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
