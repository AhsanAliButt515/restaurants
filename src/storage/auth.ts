import AsyncStorage from "@react-native-async-storage/async-storage";
const ACCESS_FLAG = "@access_granted";
const AUTH_USER_KEY = "@auth_user";
const AUTH_TOKEN_KEY = "@auth_token";
export const saveToken = (token: string) =>
  AsyncStorage.setItem(AUTH_TOKEN_KEY, token)

export const getToken = () =>
  AsyncStorage.getItem(AUTH_TOKEN_KEY)

export const removeToken = () =>
  AsyncStorage.removeItem(AUTH_TOKEN_KEY)

export const saveUser = (user: any) =>
  AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))

export const getUser = () =>
  AsyncStorage.getItem(AUTH_USER_KEY)

export const removeUser = () =>
  AsyncStorage.removeItem(AUTH_USER_KEY)

export const saveAccess = (access: string) =>
  AsyncStorage.setItem(ACCESS_FLAG, access)

export const getAccess = () =>
  AsyncStorage.getItem(ACCESS_FLAG)

export const removeAccess = () =>
  AsyncStorage.removeItem(ACCESS_FLAG)

