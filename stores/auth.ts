import { defineStore } from 'pinia'

export const useMyAuthStore = defineStore({
  id: 'myAuthStore',
  state: () => ({ }),
  actions: {
    async login(){
      console.log("ea");
    }
  },
})
