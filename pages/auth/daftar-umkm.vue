<template>
  <div class="flex justify-center min-h-screen">
    <nuxt-link to="/" class="absolute top-6 left-6 flex items-center">
      <Icon name="material-symbols:arrow-back-rounded" color="gray" class="text-xl mr-2" />
      <span class="text-sm">Kembali</span>
    </nuxt-link>
    <div class="py-12 px-4 w-[400px]">
      <img src="@/assets/images/navloeLogo.png" class="w-20 mx-auto" alt="">
      <h4 class="my-4 text-center text-lg">Pendaftaran UMKM</h4>
      <div class="step">
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
        <ToastList class="" :toasts="toasts" />
        <fwb-alert v-if="deniedReason" class="border-t-4 rounded-none" type="danger">
          <span class="font-bold">UMKM kamu ditolak!</span>
          <p class="mt-1">{{ deniedReason }}</p>
        </fwb-alert>

        <!-- content display -->
        <template v-if="tab == 0">
          <div class="flex justify-center">
            <fwb-spinner size="12" color="blue" class="mt-4" />
          </div>
        </template>
        <template v-else-if="tab == 1">
          <div class="my-4">
            <label for="#name" class="block text-sm">Nama <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Masukkan Nama</small>
            <input v-model="name" type="text" class="form-input" placeholder="Cagie Mustika" required />
            <small class="text-red-500">{{ nameMessage }}</small>
          </div>
          <div class="my-4">
            <label for="#phoneNumber" class="block text-sm">No. Telepon <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Masukkan No. Telepon</small>
            <input v-model="phoneNumber" type="text" class="form-input" placeholder="08123456789" required />
            <small class="text-red-500">{{ phoneNumberMessage }}</small>
          </div>
          <div class="my-4">
            <label for="#email" class="block text-sm">Email <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Masukkan Email</small>
            <input v-model="email" type="email" class="form-input" placeholder="hi@example.com" required />
            <small class="text-red-500">{{ emailMessage }}</small>
          </div>
          <div class="my-4 relative">
            <label for="#email" class="block text-sm">Password <span class="text-red-500">*</span></label>
            <small class="text-xs text-slate-500 my-2">Masukkan Password</small>
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="hi@example.com" required />
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
          <p class="text-justify">UMKM mu sedang diverifikasi oleh admin. Jika proses validasi masih belum ditanggapi dengan jangka waktu maksimal 3x24 jam, silahkan contact ke kami.</p>
          <nuxt-img src="/images/verifikasi.svg" class="w-72 h-72 mx-auto" alt="verifikasi" loading="lazy" />
        </template>

        <!-- footer display -->
        <template v-if="tab > 0 && tab < 3">
          <div class="flex gap-1">
            <button :disabled="tab <= 1 || isLoading" :class="tab == 1 || isLoading ? 'bg-slate-100 border-slate-100 text-slate-400' : 'border-primary bg-white text-black'" type="button" class="flex items-center max-w-1/2 justify-center px-4 py-3 mt-4 border text-sm w-full" @click="!isLoading ? tab-- : ''">
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
          <p class="text-xs text-center mt-4 text-slate-500">
            Tanggal pendaftaran: 09 November 2023 08:00:00
          </p>
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

  // const router = useRouter();

  const isLoading = ref(false);
  const toasts = ref([{}]);

  const email = ref("cagieeeee@gmail.com");
  const emailMessage = ref("");
  const name = ref("Cagie Mustika");
  const nameMessage = ref("");
  const phoneNumber = ref("08980733556");
  const phoneNumberMessage = ref("");
  const nib = ref("0123456789");
  const nibMessage = ref("");
  const enterpriseName = ref("Navloe");
  const enterpriseNameMessage = ref("");
  const enterpriseType = ref("product");
  const enterpriseTypeMessage = ref("");
  const password = ref("123");
  const passwordMessage = ref("");
  
  const submitConfirmed = ref(false);
  const readedTermsAndCondition = ref(false);
  const showPassword = ref(false)
  const enterprisePending = ref(false)
  const deniedReason = ref("Setelah tim kami memeriksa UMKM anda, NIB tidak sesuai dengan data usaha yang kamu inputkan.");

  const tab = ref(0)

  onMounted(() => {
    toasts.value.pop();
    tab.value = enterprisePending.value ? 3 : 1
  })

  const handleRegister = async function() {
    let validationPassed = true;
    clearMessage();
    // Tab 1 validation
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
    if (Number.isNaN(parseInt(phoneNumber.value)) || nib.value.length != 13) {
      nibMessage.value = "NIB tidak valid!";
      validationPassed = false;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value) == false) {
      emailMessage.value = "Email tidak valid!";
      validationPassed = false;
    }
    
    if (validationPassed)  
    {
      isLoading.value = true

      setTimeout(() => {
        toasts.value.push({
          type: "success",
          message: "Pendaftaran berhasil!"
        });
        tab.value = 3;
        enterprisePending.value = true;
        deniedReason.value = "";

      }, 3000);

      // if (password.value == "123") {

      // } else {
      //   toasts.value.push({
      //     type: "danger",
      //     message: "Email atau Password salah!"
      //   });
      //   isLoading.value = false
      // }
    } else {
      submitConfirmed.value = false
      readedTermsAndCondition.value = false
    }
  }

  const clearMessage = function(){
    emailMessage.value = ""
    nameMessage.value = ""
    phoneNumberMessage.value = ""
    nibMessage.value = ""
    enterpriseNameMessage.value = ""
    enterpriseTypeMessage.value = ""
    passwordMessage.value = ""
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
