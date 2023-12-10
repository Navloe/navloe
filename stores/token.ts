import { defineStore } from 'pinia'

const tokenKey= 'navloe-token'

export const useTokenStore = defineStore({
  id: 'token',
  state: () => ({
    token: ''
  }),
  actions: {
    getToken(): string {
      const value= useCookie(tokenKey,{
        sameSite: true,
        secure: true,
      }).value ?? '';

      this.token= value;

      return value;
    },
    setToken(token: string) {
      this.token= token;

      useCookie(tokenKey, {
        sameSite: true,
        secure: true,
        // set cookie for 3 days max age format is seconds
        maxAge: 3 * 24 * 60 * 60
      }).value= token
    },
    deleteToken() {
      this.token= '';

      useCookie(tokenKey).value= null
    }
  },
})
