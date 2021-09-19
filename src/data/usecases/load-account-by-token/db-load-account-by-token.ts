import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'

export class DbLoadAccountByToken implements LoadAccountByToken {
  private readonly decrypter: Decrypter

  constructor (decrypter: Decrypter) {
    this.decrypter = decrypter
  }

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    await this.decrypter.decrypt(accessToken)
    return {
      id: ''
    }
  }
}
