'use strict'

import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

class Database {
  //create single Class with Singeleton Pattern
  static instance: any = null

  constructor() {
    this.connect()
  }

  connect() {
    mongoose
      .connect((process.env.MONGOOSE_URL as string) || '')
      .then((_) => console.log(`Connected MongoDB success`))
      .catch((err) => console.log(`Error connection !`, err))
  }

  // SINGLETON PATTERN
  static getInstance() {
    if (!Database?.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
  static disconnect() {
    if (Database.instance) {
      mongoose.disconnect()
    }
  }
}

export default Database
