export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterParams = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

export type UserDataType = {
  id: string
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
  isChangePass : boolean
  url :string[]
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  // loginGoogle: (token: string) => void
}
