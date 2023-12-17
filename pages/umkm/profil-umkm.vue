<template>
  <div>
    <h1 class="mb-2 font-bold text-xl">Profil UMKM</h1>
    <ToastList class="" :toasts="toasts" />
    <div class="w-full sm:w-96">
      <form @submit.prevent="handleSubmit()">
        <div class="my-8">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Logo</label>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleImageUpload"
          />
          <img :src="logoPreview ?? '/images/image-thumbnail.png'" class="w-20 h-20 border object-cover border-gray-300 cursor-pointer hover:opacity-50" loading="lazy" alt="" @click="triggerInputLogo()" />
          <small class="block mb-2 text-xs text-gray-500 mt-2">File harus berupa gambar dengan ekstensi <b>.png</b>, <b>.webp</b>, <b>.jpg</b>, atau <b>.jpeg</b> dengan ukuran file max. 1 MB</small>
        </div>
        <div class="my-8">
          <fwb-input
            v-model="enterprise.name"
            placeholder="Nama UMKM"
            label="Nama UMKM"
            class="w-full"
            disabled
          />
        </div>
        <div class="my-8">
          <fwb-input
            v-model="enterprise.nib"
            placeholder="NIB"
            label="NIB"
            class="w-full"
            disabled
          />
        </div>
        <div class="my-8">
          <fwb-select
            v-model="selectedType"
            :options="typeList"
            label="Tipe UMKM"
            class="w-full"
          />
        </div>
        <div class="my-8">
          <fwb-input
            v-model="enterprise.shortDescription"
            placeholder="Deskripsi Singkat UMKM"
            label="Deskripsi Singkat UMKM"
            class="w-full"
          >
            <template #helper>
              <span class="text-xs text-slate-800">Contoh: Toko Baju Batik</span>
            </template>
          </fwb-input>
          <small v-if="!enterprise.shortDescription" class="text-red-500 block mt-2">Deskripsi Singkat UMKM harus diisi</small>
        </div>
        <div class="my-8">
          <fwb-textarea
            v-model="enterprise.description"
            :rows="4"
            label="Deskripsi UMKM"
            placeholder="Deksripsikan UMKM kamu..."
          />
          <small v-if="!enterprise.description" class="text-red-500 block mt-2">Deskripsi UMKM harus diisi</small>
        </div>
        <div class="my-8">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Kategori</label>
  
          <div class="flex items-center flex-wrap gap-2">
            <span v-for="(category, i) in categoryList" :key="i" class="px-4 py-1 rounded-full bg-primary-light text-primary-dark text-xs">{{ category.name }}</span>
            <button type="button" class="px-4 py-1 flex items-center gap-1 rounded-full border border-primary text-primary text-xs" @click="showModal(true)">
              <Icon name="material-symbols:add-circle-outline-rounded" class="text-sm" />
              Tambah Kategori
            </button>
          </div>
          <small v-if="categoryList.length == 0" class="text-red-500 block mt-2">Minimal pilih 1 kategori</small>
          
          <fwb-modal v-if="isShowModal" @close="showModal(false)">
            <template #header>
              <div class="flex items-center text-lg">
                Tambah Kategori
              </div>
            </template>
            <template #body>
              <fwb-input
                v-model="searchCategoryKeyword"
                placeholder="Pencarian"
                size="lg"
                class="w-full"
              >
                <template #prefix>
                  <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                  </svg>
                </template>
              </fwb-input>
              <div class="w-full h-36 overflow-auto">
                <div v-for="(category, i) in categories" :key="i" :class="getCategoryIndex(category) > -1 ? '!border-green-500' : 'border-slate-300'" class="w-full p-4 flex items-center justify-between duration-200 border my-2 rounded" @click="addOrRemoveCategory(category)">
                  <span>{{ category.name }}</span>
                  <Icon v-if="getCategoryIndex(category) > -1" name="material-symbols:check-small" class="text-green-500 text-2xl" />
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-end">
                <fwb-button color="alternative" @click="showModal(false)">
                  Tutup
                </fwb-button>
              </div>
            </template>
          </fwb-modal>
        </div>
        <div class="my-8">
          <fwb-textarea
            v-model="enterprise.keywords"
            :rows="4"
            label="Kata kunci"
            placeholder="Masukkan kata kunci untuk UMKM kamu..."
          />
          <span class="text-xs text-slate-800">Pisahkan kata kunci dengan tanda koma (,)<br>contoh: <b>Baju, Baju Pria, Baju Wanita</b>.</span>
          <small v-if="!enterprise.keywords" class="text-red-500 block mt-2">Kata kunci harus diisi</small>
        </div>
        <div class="my-8">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Link Toko</label>
          <small class="block mb-2 text-xs text-gray-500">Link dapat berupa link ecommerce (Tokopedia/Shopee/Lazada/dll), Sosial media (Instagram/Tiktok/Facebook), Whatsapp, ataupun Link peta lokasi toko.</small>
          <template v-for="(data, i) in newStoreUrl" :key="i">
            <div class="flex flex-wrap gap-2">
              <div class="my-1 w-[30%]">
                <fwb-input
                  v-model="newStoreUrl[i].name"
                  :placeholder="'Judul ke ' + (i + 1) + (i > 0 ? ' (Opsional)' : '')"
                  class=""
                  @keyup="setStoreUrl()"
                />
              </div>
              <div class="my-1 w-2/3">
                <fwb-input
                  v-model="newStoreUrl[i].url"
                  :placeholder="'Link ke ' + (i + 1) + (i > 0 ? ' (Opsional)' : '')"
                  class=""
                  @keyup="setStoreUrl()"
                />
              </div>
            </div>
          </template>
          <small v-if="newStoreUrl.length == 1 && (newStoreUrl[0].name == '' || newStoreUrl[0].url == '') " class="text-red-500 block mt-2">Minimal masukkan 1 link</small>
        </div>
        <fwb-button color="blue" class="w-full flex justify-center !rounded !bg-primary" :loading="isLoading" :disabled="isLoading">Simpan</fwb-button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: 'umkm'
  })

  import Swal from 'sweetalert2';
  import {
    FwbButton,
    FwbModal,
    FwbInput,
    FwbSelect,
    FwbTextarea,
  } from 'flowbite-vue'

  const typeList = ref([
    { value: 'product', name: 'Produk' },
    { value: 'service', name: 'Jasa' },
    { value: 'both', name: 'Produk & Jasa' },
  ])
  
  const toasts = ref<{ type: string, message: string }[]>([]);

  const searchCategoryKeyword = ref("")
  const isShowModal = ref(false)
  const isLoading = ref(false)
  const categories = ref()

  const enterprise = ref<Enterprise>({
    name: '',
    value: undefined
  })
  const categoryList = ref<Category[]>([])
  const selectedType = ref()
  const newStoreUrl = ref<{ name: string, url: string }[]>([{
    name: "",
    url: ""
  }])
  const logoUrl = ref(null)

  onMounted(async () => {
    await loadData();
  })

  watch(() => searchCategoryKeyword.value, () => loadCategories())

  const loadData = async () => {
    try {
      const req = await useAxios.get<Enterprise>('/user/enterprise')

      enterprise.value = req.data
      selectedType.value = req.data.type
      logoPreview.value = req.data.logoUrl
  
      categoryList.value = JSON.parse(req.data.categories ?? "[]");
      newStoreUrl.value = JSON.parse(req.data.storeUrl ?? "[]");

      await setStoreUrl()
      await loadCategories()
    } catch (error) {
      console.error(error);
    }

    
  }

  const loadCategories = async () => {
    try {
      const req = await useAxios.get(`/categories?searchKeyword=${searchCategoryKeyword.value}`);
      categories.value = req.data.data
    } catch (error) {
      console.error(error);
    }
  }

  const showModal = (value: boolean) => isShowModal.value = value

  const addOrRemoveCategory = (category: Category) => {
    
    const categoryExistIndex = getCategoryIndex(category)

    if (categoryExistIndex == -1) {
      categoryList.value.push({
        id: category.id,
        name: category.name
      })
    } else {
      categoryList.value.splice(categoryExistIndex, 1)
    }
    
  }

  const getCategoryIndex = (category: Category) => {
    const categoryExistIndex = categoryList.value.findIndex((x: Category) => x.name === category.name)

    return categoryExistIndex
  }

  const setStoreUrl = () => {    
    if (newStoreUrl.value[newStoreUrl.value.length - 1].url != "" && newStoreUrl.value[newStoreUrl.value.length - 1].name != "") {
      newStoreUrl.value.push({
        name: "",
        url: ""
      })
    } else if (newStoreUrl.value.length > 1 && newStoreUrl.value[newStoreUrl.value.length - 2].url == ""){
      newStoreUrl.value.pop()
    }
  }

  const fileInput = ref()
  const logoPreview = ref()
  const triggerInputLogo = () => fileInput.value.click()

  const handleImageUpload = (event: any) => {
    const selectedFile = event.target.files[0];
    let errorMessage = null
      
    errorMessage = selectedFile.size / (1024 * 1024) > 1 ? "Ukuran file > 1 MB. Silahkan ganti file gambar dengan ukuran < 1 MB" : errorMessage;
    errorMessage = selectedFile && /^(image\/png|image\/jpeg|image\/webp)$/.test(selectedFile.type) ? errorMessage : "File gambar atau ekstensi tidak valid!"

    if (errorMessage) {
      event.target.value = null;
      logoUrl.value = null;
      logoPreview.value = enterprise.value.logoUrl;

      Swal.fire("Peringatan!", errorMessage, "warning")
    } else {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];

      if (file) {
        logoPreview.value = URL.createObjectURL(file);
      } else {
        logoPreview.value = null;
      }
    }
  }

  const handleSubmit = async () => {
    isLoading.value = true
    newStoreUrl.value = newStoreUrl.value.length > 1 ? newStoreUrl.value.filter(x => x.url !== "" && x.name !== "") : newStoreUrl.value

    enterprise.value.storeUrl = JSON.stringify(newStoreUrl.value)
    enterprise.value.categories = JSON.stringify(categoryList.value)
    enterprise.value.type = selectedType.value
    enterprise.value.logoUrl = fileInput.value.files[0]

    toasts.value.push({
      type: "success",
      message: "Katalog telah dihapus!"
    });
    
    const { description, keywords, shortDescription, storeUrl, categories, type} = enterprise.value
    
    if (!description || !keywords || !shortDescription || !storeUrl || !categories || !type) {      
      await Swal.fire("Peringatan!", "Formulir masi belum lengkap! Mohon isi dan lengkap seluruh form", "warning")
      isLoading.value = false
    } else {
      await updateUMKMProfile()
    }    
  }

  const updateUMKMProfile = async () => {
    
    const { description, keywords, shortDescription, storeUrl, categories, type, logoUrl} = enterprise.value

    try {
      await useAxios.put('/user/enterprise', {
        shortDescription,
        description, 
        keywords, 
        storeUrl, 
        categories, 
        type, 
        logoUrl
      })

      location.reload()
    } catch (error: any) {
      
      isLoading.value = false
      Swal.fire("Error!", "Terjadi kesalahan di server!", "error")
      console.error(error);
    }
  }

</script>

<style>

</style>
