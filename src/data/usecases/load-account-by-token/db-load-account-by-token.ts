import { Decrypter, LoadAccountByToken, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  private readonly decrypter: Decrypter
  private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository

  constructor (decrypter: Decrypter, loadAccountByTokenRepository: LoadAccountByTokenRepository) {
    this.decrypter = decrypter
    this.loadAccountByTokenRepository = loadAccountByTokenRepository
  }

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      const accountId = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (accountId) {
        return accountId
      }
    }
    return {
      id: ''
    }
  }
}
