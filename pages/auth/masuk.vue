<template>
  <div class="flex items-center justify-center h-screen">
    <nuxt-link to="/" class="absolute top-6 left-6 flex items-center">
      <Icon name="material-symbols:arrow-back-rounded" color="gray" class="text-xl mr-2" />
      <span class="text-sm">Kembali</span>
    </nuxt-link>
    <div class="p-8">
      <nuxt-img src="/images/navloeLogo.png" class="w-20 mx-auto" alt="navloe logo" />
      <h4 class="my-4 text-center text-lg">Masuk ke Navloe</h4>
      <form @submit.prevent="handleLogin()">
        <ToastList class="" :toasts="toasts" />
        <div class="my-4">
          <label for="#email" class="block text-sm">Email <span class="text-red-500">*</span></label>
          <small class="text-xs text-slate-500 my-2">Masukkan Email</small>
          <input v-model="email" type="text" class="border block border-slate-400 py-2 px-3 mt-2 mb-1 w-[300px] text-sm" placeholder="hi@example.com" required />
          <small class="text-red-500">{{ emailMessage }}</small>
        </div>
        <div class="my-4">
          <label for="#email" class="block text-sm">Password <span class="text-red-500">*</span></label>
          <small class="text-xs text-slate-500 my-2">Masukkan Password</small>
          <input v-model="password" type="password" class="border block border-slate-400 py-2 px-3 mt-2 mb-1 w-[300px] text-sm" placeholder="hi@example.com" required />
          <small class="text-red-500"></small>
        </div>
        <p class="text-xs" align="right">
          <nuxt-link to="/masuk" class="text-primary">Lupa Password</nuxt-link>
        </p>
        <button type="submit" class="flex items-center justify-center px-4 py-3 mt-4 text-white border-0 text-sm w-full" :class="isLoading ? 'bg-blue-300' : 'bg-primary'">
          <fwb-spinner v-if="isLoading" size="4" class="mr-2" />
          Masuk
        </button>
      </form>
      <p class="text-xs text-center mt-4">
        Belum memiliki akun? <nuxt-link to="/auth/daftar-umkm" class="text-primary">Daftar Sekarang</nuxt-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: false
  })

  import { ref, onMounted } from "vue";
  import { FwbSpinner } from "flowbite-vue";

  const email = ref("cagiemustikaa@gmail.com");
  const password = ref("123123123");
  const emailMessage = ref("");
  const isLoading = ref(false);
  const toasts = ref([{}]);

  onMounted(() => {
    toasts.value.pop();
  })

  const handleLogin = async function() {
    // eslint-disable-next-line no-useless-escape
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value) == false) {
      emailMessage.value = "Email tidak valid!";
    } else {
      isLoading.value = true
      await login()
      isLoading.value = false

    }
  }

  const login = async () => {
    try {
      const req = await useAxios.post('/auth/login', {
        email: email.value,
        password: password.value
      })
        
      useTokenStore().setToken(req.data.token);
      
      toasts.value.push({
        type: "success",
        message: "Login berhasil!"
      });    

      const user = await useAxios.get('/auth/whoami')
      const {umkmInformationFilled, umkmStatusActived} = user.data

      if (!umkmStatusActived) {
        navigateTo('/auth/daftar-umkm')
      }

    } catch (error: any) {
      toasts.value.push({
        type: "danger",
        message: error.response.data.error
      });
    }
  }
  
</script>

<style>

</style>
