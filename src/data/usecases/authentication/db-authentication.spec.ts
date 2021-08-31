import { DbAuthentication } from './db-authentication'
import {
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  AccountModel
} from './db-authentication.protocols'

interface SystemUnderTestTypes {
  systemUnderTest: DbAuthentication
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const systemUnderTest = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    systemUnderTest,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await systemUnderTest.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepostory throws', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = systemUnderTest.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return undefined of LoadAccountByEmailRepository returns undefined', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(undefined)))
    const accessToken = await systemUnderTest.auth(makeFakeAuthentication())
    expect(accessToken).toBeUndefined()
  })

  test('Should call HashComparer with correct values', async () => {
    const { systemUnderTest, hashComparerStub } = makeSystemUnderTest()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await systemUnderTest.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { systemUnderTest, hashComparerStub } = makeSystemUnderTest()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = systemUnderTest.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return undefined if HashComparer return false', async () => {
    const { systemUnderTest, hashComparerStub } = makeSystemUnderTest()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await systemUnderTest.auth(makeFakeAuthentication())
    expect(accessToken).toBeUndefined()
  })

  test('Should call Encrypter with correct id', async () => {
    const { systemUnderTest, encrypterStub } = makeSystemUnderTest()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await systemUnderTest.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { systemUnderTest, encrypterStub } = makeSystemUnderTest()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = systemUnderTest.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const accessToken = await systemUnderTest.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { systemUnderTest, updateAccessTokenRepositoryStub } = makeSystemUnderTest()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await systemUnderTest.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { systemUnderTest, updateAccessTokenRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = systemUnderTest.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
