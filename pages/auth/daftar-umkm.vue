<template>
  <div class="flex justify-center min-h-screen">
    <nuxt-link v-if="!isLoading" to="/" class="absolute top-6 left-6 flex items-center">
      <Icon name="material-symbols:arrow-back-rounded" color="gray" class="text-xl mr-2" />
      <span class="text-sm">Kembali</span>
    </nuxt-link>
    <div class="py-12 px-4 w-[400px]">
      <img v-if="!isLoading" src="@/assets/images/navloeLogo.png" class="w-20 mx-auto" alt="">
      <h4 v-if="!isLoading" class="my-4 text-center text-lg">Pendaftaran UMKM</h4>
      <div v-if="!isLoading" class="step">
        <div :class="tab >= 2 ? 'bg-blue-400' : 'bg-slate-200'" class="absolute top-[calc(50%-16px)] h-2 w-[calc(50%-24px)] transform left-6"></div>
        <div :class="tab >= 3 ? 'bg-blue-400' : 'bg-slate-200'" class="absolute top-[calc(50%-16px)] h-2 w-[calc(50%-24px)] transform left-[calc(50%+16px)]"></div>
        <div class="step-items" :class="tab >= 1 ? 'active' : ''">
          <span class="step-number">1</span>
          <span class="step-name">Data diri</span>
        </div>
        <div class="step-items" :class="tab >= 2 ? 'active' : ''">
          <span class="step-number">2</span>
          <span class="step-name">Data UMKM</span>
        </div>
        <div class="step-items" :class="tab >= 3 ? 'active' : ''">
          <span class="step-number">3</span>
          <span class="step-name">Verifikasi</span>
        </div>
      </div>
      <form @submit.prevent="handleRegister()">
        <ToastList v-if="!isLoading" class="" :toasts="toasts" />
        <fwb-alert v-if="deniedReason" class="border-t-4 rounded-none" type="danger">
          <span class="font-bold">Hai {{ enterprise.name }}, Pengajuan UMKM kamu telah ditolak dengan alasan berikut:</span>
          <p class="mt-1">{{ deniedReason }}</p>
          <button type="button" class="text-red-500 text-sm mt-4 underline" @click="logout()">Keluar</button>
        </fwb-alert>

        <!-- content display -->
        <template v-if="tab == 0">
          <div class="flex justify-center items-center h-screen fixed top-0 left-0 w-full">
            <fwb-spinner size="12" color="blue" class="" />
          </div>
        </template>
        <template v-else-if="tab == 1">
          <div class="my-4">
            <label for="#name" class="block text-sm">Nama <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Masukkan Nama</small>
            <input v-model="name" maxlength="16" type="text" class="form-input" placeholder="Cagie Mustika" />
            <small class="text-red-500">{{ nameMessage }}</small>
          </div>
          <div class="my-4">
            <label for="#phoneNumber" class="block text-sm">No. Telepon <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Masukkan No. Telepon</small>
            <input v-model="phoneNumber" maxlength="16" type="text" class="form-input" placeholder="08123456789" />
            <small class="text-red-500">{{ phoneNumberMessage }}</small>
          </div>
          <div class="my-4">
            <label for="#email" class="block text-sm">Email <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Masukkan Email</small>
            <input v-model="email" maxlength="64" type="email" class="form-input" placeholder="hi@example.com" />
            <small class="text-red-500">{{ emailMessage }}</small>
          </div>
          <div class="my-4 relative">
            <label for="#email" class="block text-sm">Password <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Masukkan Password</small>
            <input v-model="password" maxlength="16" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="hi@example.com" />
            <Icon :name="showPassword ? 'material-symbols:visibility-off-outline' : 'material-symbols:visibility-outline'" color="black" class="icon-toggle" @click="showPassword = !showPassword" />
            <small class="text-red-500">{{ passwordMessage }}</small>
          </div>
        </template>
        <template v-else-if="tab == 2">
          <div class="my-4">
            <label for="#nib" class="block text-sm">NIB <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Masukkan NIB</small>
            <input v-model="nib" type="text" class="form-input" placeholder="" required />
            <small class="text-red-500">{{ nibMessage }}</small>
          </div>
          <div class="my-4">
            <label for="#enterpriseName" class="block text-sm">Nama UMKM <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Masukkan Nama UMKM</small>
            <input v-model="enterpriseName" type="text" class="form-input" placeholder="Navloe" required />
            <small class="text-red-500">{{ enterpriseNameMessage }}</small>
          </div>
          <div class="my-4">
            <label for="#enterpriseName" class="block text-sm">Jenis Katalog UMKM <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Pilih Jenis UMKM</small>
            <select id="" v-model="enterpriseType" class="border block border-slate-400 py-2 px-3 mt-2 mb-1 w-full text-sm" required>
              <option value="product">Produk</option>
              <option value="service">Jasa</option>
              <option value="both">Produk & Jasa</option>
            </select>
            <small class="text-red-500">{{ enterpriseTypeMessage }}</small>
          </div>
          <div class="mt-4 flex">
            <input id="submitConfirmed" v-model="submitConfirmed" type="checkbox" class="mr-2" name="" required />
            <label for="submitConfirmed" class="select-none cursor-pointer text-xs text-slate-900 -mt-1 mb-2">Saya telah memeriksa kembali data yang ingin disimpan dan saya sudah memastikan bahwa semua data sudah benar.</label>
          </div>
          <div class="mt-4 flex">
            <input id="readedTermsAndCondition" v-model="readedTermsAndCondition" type="checkbox" class="mr-2" name="" required />
            <label for="readedTermsAndCondition" class="select-none cursor-pointer text-xs text-slate-900 -mt-1 mb-2">Saya telah membaca dan menyetujui <a href="https://google.com" target="_blank" class="text-blue-500 underline">Syarat dan Ketentuan</a> yang berlaku.</label>
          </div>
        </template>
        <template v-else-if="tab == 3">
          <div class="border p-4 mb-4">
            <h6 class="text-xs font-bold">NIB</h6>
            <h4 class="mb-4 mt-1">{{ enterprise.nib }}</h4>
            <h6 class="text-xs font-bold">Nama UMKM</h6>
            <h4 class="mb-4 mt-1">{{ enterprise.name }}</h4>
            <h6 class="text-xs font-bold">Tgl Pendaftaran</h6>
            <h4 class="mb-4 mt-1">{{ useDateFormat(enterprise.createdAt, "DD-MM-YYYY HH:mm:ss").value }}</h4>
            <h6 class="text-xs font-bold">Status</h6>
            <h4 class="mb-4 mt-1 capitalize" :class="enterprise.status == 'rejected' ? 'text-red-500' : 'text-orange-500'">{{ enterprise.status == 'rejected' ? 'Ditolak' : enterprise.status }}</h4>
            <template v-if="enterprise.status == 'rejected'">
              <h6 class="text-xs font-bold">Alasan Dtitolak</h6>
              <h4 class="mb-4 mt-1 capitalize">{{ enterprise.inactiveReason }}</h4>
            </template>
          </div>
          <p class="text-justify">UMKM mu sedang diverifikasi oleh admin. Jika proses validasi masih belum ditanggapi dengan jangka waktu maksimal 3x24 jam, silahkan contact ke kami.</p>
          <nuxt-img src="/images/verifikasi.svg" class="w-72 h-72 mx-auto" alt="verifikasi" loading="lazy" />
        </template>

        <!-- footer display -->
        <template v-if="tab > 0 && tab < 3">
          <div class="flex gap-1">
            <button v-if="!enterprisePending" :disabled="tab <= 1 || isLoading" :class="tab == 1 || isLoading ? 'bg-slate-100 border-slate-100 text-slate-400' : 'border-primary bg-white text-black'" type="button" class="flex items-center max-w-1/2 justify-center px-4 py-3 mt-4 border text-sm w-full" @click="!isLoading ? tab-- : ''">
              Sebelumnya
            </button>
            <button v-if="tab == 1" type="button" class="flex items-center max-w-1/2 justify-center px-4 py-3 mt-4 text-white border border-primary text-sm w-full bg-primary" @click="!isLoading ? tab++ : ''">
              Berikutnya
            </button>
            <button v-else type="submit" :disabled="isLoading" class="flex items-center justify-center max-w-1/2 px-4 py-3 mt-4 text-white border text-sm w-full" :class="isLoading ? 'bg-green-300 border-green-300' : 'border-green-500 bg-green-500'">
              <fwb-spinner v-if="isLoading" size="4" class="mr-2" color="green" />
              Simpan
            </button>
          </div>
          <p class="text-xs text-center mt-4">
            Sudah memiliki akun? <nuxt-link to="/auth/masuk" class="text-primary">Masuk</nuxt-link>
          </p>
        </template>
        <template v-else-if="tab > 0 && tab == 3">
          <div class="w-full flex justify-center">
            <button type="button" class="btn bg-red-100 text-red-500 text-sm mt-4" @click="logout()">Keluar</button>
          </div>
        </template>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: false
  })
  
  import { ref, onMounted } from "vue";
  import { FwbSpinner, FwbAlert } from "flowbite-vue";

  const isLoading = ref(true);
  const toasts = ref([{}]);

  const email = ref("");
  const emailMessage = ref("");
  const name = ref("");
  const nameMessage = ref("");
  const phoneNumber = ref("");
  const phoneNumberMessage = ref("");
  const nib = ref("");
  const nibMessage = ref("");
  const enterpriseName = ref("");
  const enterpriseNameMessage = ref("");
  const enterpriseType = ref("");
  const enterpriseTypeMessage = ref("");
  const password = ref("");
  const passwordMessage = ref("");
  
  const submitConfirmed = ref(false);
  const readedTermsAndCondition = ref(false);
  const showPassword = ref(false)
  const enterprisePending = ref(false)
  const deniedReason = ref("");

  const enterprise = ref()

  const tab = ref(0)

  onMounted(async () => {
    toasts.value.pop();

    if(useTokenStore().getToken()){
      try {
        const whoami = await useAxios.get('/auth/whoami');
        !whoami.data.error ? loadData() : logout()
      } catch (error) {
        console.log(error);
      }
    }
    else{
      tab.value = 1
      isLoading.value = false
    }
  })

  const handleRegister = async function() {
    let validationPassed = true;
    clearMessage();

    // Tab 1 validation
    if (!enterprisePending.value) {
      if (name.value.length > 16) {
        nameMessage.value = "Nama tidak boleh lebih dari 16 karakter!";
        tab.value = 1;
        validationPassed = false;
      }
      if (Number.isNaN(parseInt(phoneNumber.value))) {
        phoneNumberMessage.value = "No. Telepon tidak valid!";
        tab.value = 1;
        validationPassed = false;
      }
      if (phoneNumber.value.length > 16) {
        phoneNumberMessage.value = "No. Telepon tidak boleh lebih dari 16 karakter!";
        tab.value = 1;
        validationPassed = false;
      }
      if (password.value.length < 8 || password.value.length > 16) {
        passwordMessage.value = "Password harus berisi 8-16 karakter!";
        tab.value = 1;
        validationPassed = false;
      }
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value) == false) {
        emailMessage.value = "Email tidak valid!";
        validationPassed = false;
      }
    }

    // Tab 2 validation
    if (Number.isNaN(parseInt(nib.value))) {
      nibMessage.value = "NIB tidak valid!";
      validationPassed = false;
    }
      
    if (validationPassed)  
    {
      isLoading.value = true
      
      enterprisePending.value ? updateRegister() : register()
    } else {
      submitConfirmed.value = false
      readedTermsAndCondition.value = false
    }
  }

  const clearMessage = () => {
    emailMessage.value = ""
    nameMessage.value = ""
    phoneNumberMessage.value = ""
    nibMessage.value = ""
    enterpriseNameMessage.value = ""
    enterpriseTypeMessage.value = ""
    passwordMessage.value = ""
  }

  const register = async () => {
    try {
      await useAxios.post('/auth/register', {
        name: name.value,
        email: email.value,
        password: password.value,
        phoneNumber: phoneNumber.value,
        nib: nib.value,
        enterpriseName: enterpriseName.value,
        enterpriseType: enterpriseType.value
      })

      toasts.value.push({
        type: "success",
        message: "Pendaftaran berhasil!"
      });

      const req = await useAxios.post('/auth/login', {
        email: email.value,
        password: password.value
      })
        
      useTokenStore().setToken(req.data.token);
      
      location.reload()
    } catch (error: any) {
      toasts.value.push({
        type: "danger",
        message: error.response.data.error
      });
      if (error.response.data.error == "Email sudah digunakan!") {
        emailMessage.value = "Email sudah digunakan!"
      }
      tab.value = 1;
      isLoading.value = false
      submitConfirmed.value = false
      readedTermsAndCondition.value = false
    }
  }

  const updateRegister = async () => {
    
    await useAxios.put('/user/enterprise', {
      nib: nib.value,
      name: enterpriseName.value,
      type: enterpriseType.value,
      status: 'pending'
    })

    toasts.value.push({
      type: "success",
      message: "Berhasil disimpan!"
    });

    location.reload()
  }

  const loadData = async () => {
    try {  
      const req = await useAxios.get('/user/enterprise')
      enterprise.value = req.data
      enterpriseName.value = enterprise.value.name
      enterpriseType.value = enterprise.value.type
      nib.value = enterprise.value.nib
      const {status} = enterprise.value
  
      if (status == 'pending') {
        tab.value = 3
        enterprisePending.value = true
      } else if (status == 'rejected'){
        tab.value = 2
        deniedReason.value = enterprise.value.inactiveReason
        enterprisePending.value = true
      } else {
        navigateTo('/umkm/dashboard')
      }
    } catch (error) {
      console.error(error);
      
    }
  }

  const logout = () => {
    useTokenStore().deleteToken()
    navigateTo('/')
  }
  
</script>

<style scoped lang="postcss">
  .step{
    @apply flex justify-between w-full my-8 relative;
    
    .step-items{
      @apply flex flex-col relative;

      .step-number{
        @apply flex items-center justify-center font-bold mx-auto w-12 h-12 mb-2 rounded-full bg-slate-300 text-slate-600;
      }
      &.active{
        .step-number{
          @apply bg-primary text-white;
        }
      }
      .step-name {
        @apply text-sm text-center;
      }

    }
  }

  .icon-toggle{
    @apply absolute top-16 right-4 cursor-pointer;
  }
</style>
