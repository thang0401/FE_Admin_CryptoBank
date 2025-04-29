// ** JWT import
import jwt from 'jsonwebtoken'

// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Default AuthConfig
import defaultAuthConfig from 'src/configs/auth'

// ** Types
import { UserDataType } from 'src/context/types'

const users: UserDataType[] = [
  {
    id: 'd027fqa0dvbkmmmsoc40',
    role: 'ADMIN',
    password: 'admin',
    fullName: 'Trần Tín',
    username: 'tin',
    email: 'tin@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKQ36Zc9Lv3pSJF_DqmUo_VURNuDQkqYbcxQmywwF1-GwTj-w=s96-c',
    isChangePass: false,
    url: [
      '/report-and-statistic/transaction-flow',
      '/report-and-statistic/risk-and-security',
      '/report-and-statistic/customer-and-promotion',
      '/asset-management',
      '/customer-management',
      '/transactions-management',
      '/employee-management',
      '/role-management',
      '/savings-management',
      '/term-management',
      '/referrals',
      '/usdc-orders-management/buy-orders',
      '/usdc-orders-management/sell-orders',
      '/user-profile/security',
      '/user-profile/account',
      '/user-profile/notification/'
    ]
  },
  {
    id: 'employee-002',
    role: 'EMPLOYEE_BUYS_USDC',
    password: 'client',
    fullName: 'Nguyễn Cao Thăng',
    username: 'thangclient',
    email: 'thangclient@gmail.com',
    isChangePass: true,
    url: [
      '/usdc-orders-management/buy-orders',
      '/user-profile/security',
      '/user-profile/account',
      '/user-profile/notification/'
    ],
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKQ36Zc9Lv3pSJF_DqmUo_VURNuDQkqYbcxQmywwF1-GwTj-w=s96-c'
  }
]

// ! These two secrets should be in .env file and not in any other file
const jwtConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
}

type ResponseType = [number, { [key: string]: any }]

mock.onPost('/jwt/login').reply(request => {
  const { email, password } = JSON.parse(request.data)

  let error = {
    email: ['Something went wrong']
  }

  const user = users.find(u => u.email === email && u.password === password)

  if (user) {
    const accessToken = jwt.sign({ id: user.id }, jwtConfig.secret as string, { expiresIn: jwtConfig.expirationTime })

    const response = {
      accessToken,
      userData: { ...user, password: undefined }
    }

    return [200, response]
  } else {
    error = {
      email: ['email or Password is Invalid']
    }

    return [400, { error }]
  }
})

mock.onGet('/auth/me').reply(config => {
  // ** Get token from header
  // @ts-ignore
  const token = config.headers.Authorization as string

  // ** Default response
  let response: ResponseType = [200, {}]

  // ** Checks if the token is valid or expired
  jwt.verify(token, jwtConfig.secret as string, (err, decoded) => {
    // ** If token is expired
    if (err) {
      // ** If onTokenExpiration === 'logout' then send 401 error
      if (defaultAuthConfig.onTokenExpiration === 'logout') {
        // ** 401 response will logout user from AuthContext file
        response = [401, { error: { error: 'Invalid User' } }]
      } else {
        // ** If onTokenExpiration === 'refreshToken' then generate the new token
        const oldTokenDecoded = jwt.decode(token, { complete: true })

        // ** Get user id from old token
        // @ts-ignore
        const { id: userId } = oldTokenDecoded.payload

        // ** Get user that matches id in token
        const user = users.find(u => u.id === userId)

        // ** Sign a new token
        const accessToken = jwt.sign({ id: userId }, jwtConfig.secret as string, {
          expiresIn: jwtConfig.expirationTime
        })

        // ** Set new token in localStorage
        window.localStorage.setItem(defaultAuthConfig.storageTokenKeyName, accessToken)

        const obj = { userData: { ...user, password: undefined } }

        // ** return 200 with user data
        response = [200, obj]
      }
    } else {
      // ** If token is valid do nothing
      // @ts-ignore
      const userId = decoded.id

      // ** Get user that matches id in token
      const userData = JSON.parse(JSON.stringify(users.find((u: UserDataType) => u.id === userId)))

      delete userData.password

      // ** return 200 with user data
      response = [200, { userData }]
    }
  })

  return response
})
