import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer, tokenGenerator: TokenGenerator) {
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth ({ email, password }: AuthenticationModel): Promise<string | undefined> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      await this.hashComparer.compare(password, account.password)
      await this.tokenGenerator.generate(account.id)
    }
    return undefined
  }
}
