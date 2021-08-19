import { AddAccount, Encrypter, AddAccountModel, AccountModel } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const acc = {
      id: '',
      name: '',
      email: '',
      password: ''
    }

    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve(acc))
  }
}
