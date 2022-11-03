import { Account, Client, Databases, Functions, Storage } from 'appwrite'

export const client = new Client()
  .setEndpoint('http://localhost/v1')
  .setProject('6353ef7fb1bd65cf8845')

export const account = new Account(client)
export const functions = new Functions(client)
export const storage = new Storage(client)
export const databases = new Databases(client)

