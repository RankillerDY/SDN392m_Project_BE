import jwt, { SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import Demo from '~/models/example.schema'

dotenv.config()

export type ErrorResponse = { error: { type: string; message: string } }
export type AuthResponse = ErrorResponse | { userId: string }
export type CreateUserResponse = ErrorResponse | { userId: string }
export type LoginUserResponse = ErrorResponse | { token: string; userId: string; expireAt: Date }

const privateKey = process.env.PRIVATE_KEY || 'privateKey'
const publicKey = process.env.PUBLIC_KEY || 'publicKey'

const privateSecret = {
  key: privateKey,
  passphrase: process.env.PASSPHRASE || 'passphrase'
}

const publicSecret = {
  key: publicKey
}

const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '3d'
}

function createAuthToken(userId: string): Promise<{ token: string; expireAt: Date }> {
  return new Promise(function (resolve, reject) {
    jwt.sign({ userId: userId }, privateSecret, signOptions, (err: Error | null, encoded: string | undefined) => {
      if (err === null && encoded !== undefined) {
        const expireAfter = 2 * 604800 /* two weeks */
        const expireAt = new Date()
        expireAt.setSeconds(expireAt.getSeconds() + expireAfter)

        resolve({ token: encoded, expireAt: expireAt })
      } else {
        reject(err)
      }
    })
  })
}

async function login(login: string, password: string): Promise<LoginUserResponse> {
  try {
    const user = await Demo.findOne({ email: login })
    if (!user) {
      return { error: { type: 'invalid_credentials', message: 'Invalid Login/Password' } }
    }

    // const passwordMatch = await user.comparePassword(password)
    // if (!passwordMatch) {
    //   return { error: { type: 'invalid_credentials', message: 'Invalid Login/Password' } }
    // }

    const authToken = await createAuthToken(user._id.toString())
    return { userId: user._id.toString(), token: authToken.token, expireAt: authToken.expireAt }
  } catch (err) {
    console.error(`login: ${err}`)
    return Promise.reject({ error: { type: 'internal_server_error', message: 'Internal Server Error' } })
  }
}
