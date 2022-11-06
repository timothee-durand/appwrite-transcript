import { Account, Client, Databases, Functions, Storage } from 'appwrite'

export const client = new Client()
  .setEndpoint(import.meta.env.VITE_PROJECT_ENDPOINT)
  .setProject(import.meta.env.VITE_PROJECT_ID)

export const account = new Account(client)
export const functions = new Functions(client)
export const storage = new Storage(client)
export const databases = new Databases(client)
