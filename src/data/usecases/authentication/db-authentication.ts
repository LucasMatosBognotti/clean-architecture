import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication.protocols'

export class DbAuthentication implements Authentication {
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth ({ email, password }: AuthenticationModel): Promise<string | undefined> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      const isValid = await this.hashComparer.compare(password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return undefined
  }
}
