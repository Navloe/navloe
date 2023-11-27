<template>
  <Loading :isLoading="true" />
</template>

<script setup lang="ts">
  definePageMeta({
    layout: false,
  });

  // const route = useRoute();

  // async function verifyAccount() { 
  //   try {
  //     await useAxios.put(`auth/activate/${route.params.id}`);

  //     await useSwal.fire({
  //       icon: 'success',
  //       title: 'Sukses',
  //       text: 'Akun berhasil diaktifkan',
  //       timer: 3000,
  //       showCancelButton: false,
  //     })

  //     navigateTo('/auth/login', {
  //       replace: true,
  //     });

  //   } catch (error) {
  //     await useSwal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Akun gagal diaktifkan',
  //       timer: 3000,
  //       showCancelButton: false,
  //     })

  //     navigateTo('/auth/login', {
  //       replace: true,
  //     });
  //   } 
  // }

  onMounted(()=> {
    // verifyAccount();
  })
</script>
