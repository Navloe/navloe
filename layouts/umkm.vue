<template>
  <div v-if="!isLoading">
    <nav>
      <div class="flex items-center">
        <button aria-controls="separator-sidebar" type="button" class="inline-flex items-center p-2 mr-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" @click="showSidenav = !showSidenav">
          <span class="sr-only">Open sidebar</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path v-if="showSidenav" clip-rule="evenodd" fill-rule="evenodd" d="M 2 2 C 4 4 7 7 18 18 M 18 2 C 10 10 10 10 2 18" stroke="#000000" stroke-width="1" fill="#000000" />
            <path v-else clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>
        <nuxt-img src="/images/navloeLogo.png" class="w-8 mr-3" alt="navloe logo" />
        <h2 class="font-semibold">Navloe UMKM</h2>
      </div>
      <div class="relative">
        <div class="flex items-center py-1 px-2 border-2 rounded-md cursor-pointer" :class="showNavDropdown ? 'border-primary-light' : 'border-transparent'" @click="showNavDropdown = !showNavDropdown">
          <nuxt-img src="/images/avatar-102x102.png" class="w-8 rounded-full" />
          <span class="max-sm:hidden ml-2 text-xs select-none">{{ name }}</span>
        </div>
        <div v-if="showNavDropdown" class="absolute top-10 right-0 w-44 border shadow-md bg-white z-10">
          <div class="w-full flex items-center h-12 px-4 bg-white hover:bg-gray-100 cursor-pointer" @click="logout()">
            <Icon name="material-symbols:logout" color="#FF4444" />
            <h4 class="text-sm ml-2">Keluar</h4>
          </div>
        </div>
      </div>
    </nav>
    <div v-if="showSidenav" class="overlay w-full fixed h-screen top-16 z-10 backdrop-blur-md" @click="showSidenav = false"></div>
    <fwb-sidebar class="transform sm:translate-x-0 top-16 !h-[calc(100vh-64px)]" :class="!showSidenav ? 'max-sm:-translate-x-full' : '!translate-x-0 max-w-[100%-44px]'">
      <fwb-sidebar-item link="/umkm/dashboard" class="!font-normal !text-sm" @click="showSidenav = false">
        <template #icon>
          <Icon name="material-symbols:dashboard" color="#1560BD77" class="text-xl" />
        </template>
        <template #default>Dashboard</template>
      </fwb-sidebar-item>
      <fwb-sidebar-item link="/umkm/profil-umkm" class="!font-normal !text-sm" @click="showSidenav = false">
        <template #icon>
          <Icon name="material-symbols:enterprise" color="#1560BD77" class="text-xl" />
        </template>
        <template #default>Profil UMKM</template>
      </fwb-sidebar-item>
      <!-- <fwb-sidebar-item link="/umkm/katalog" class="!font-normal !text-sm" @click="showSidenav = false">
        <template #icon>
          <Icon name="material-symbols:inbox-rounded" color="#1560BD77" class="text-xl" />
        </template>
        <template #default>Katalog</template>
      </fwb-sidebar-item> -->
      
      <fwb-sidebar-dropdown-item class="!font-normal !text-sm">
        <template #icon>
          <Icon name="material-symbols:inbox-rounded" color="#1560BD77" class="text-xl" />
        </template>
        <template #trigger> <span class="!text-sm">Katalog</span> </template>
        <template #default>
          <fwb-sidebar-item class="pl-11" link="/umkm/katalog" @click="showSidenav = false"> Data Katalog </fwb-sidebar-item>
          <fwb-sidebar-item class="pl-11" link="/umkm/katalog/tambah" @click="showSidenav = false"> Tambah Katalog </fwb-sidebar-item>
        </template>
      </fwb-sidebar-dropdown-item>
    </fwb-sidebar>

    <div class="p-4 h-[calc(100vh-64px)] sm:w-[calc(100%-256px)] sm:ml-64 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { FwbSidebar, FwbSidebarItem, FwbSidebarDropdownItem } from 'flowbite-vue'
  import { ref } from "vue";

  const showSidenav = ref(false)
  const showNavDropdown = ref(false)
  const isLoading = ref(true)
  const name = ref("")

  onMounted(async () => {
    await validateAccount()
  })

  const validateAccount = async () => {
    
    try {
      const user = await useAxios.get('/auth/whoami')
      
      if (user.data.role != 'umkm') {
        showError({ statusCode: 404, statusMessage: "" })
      } else {
        name.value = user.data.name
        isLoading.value = false
      }
    } catch (error) {
      showError({ statusCode: 404, statusMessage: "" })
      console.error(error);
    }
  }

  const logout = () => {
    useTokenStore().deleteToken()
    navigateTo('/')
  }
</script>

<style lang="postcss" scoped>
  nav{
    @apply w-full h-16 flex items-center justify-between px-5 border-b border-b-gray-200;
  }

  aside a span{
    @applt !font-light;
  }
</style>
