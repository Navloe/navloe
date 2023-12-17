<template>
  <div>
    <h1 class="mb-2 font-bold text-xl">Tambah Katalog</h1>
    <ToastList class="" :toasts="toasts" />
    <div class="w-full sm:w-96">
      <form @submit.prevent="handleSubmit()">
        <div class="my-8">
          <fwb-input
            v-model="catalogs.name"
            placeholder="Nama Katalog"
            label="Nama Katalog"
            class="w-full"
          />
          <small v-if="!catalogs.name && isSubmitted " class="text-red-500 block mt-2">Nama harus diisi</small>
        </div>
        <div class="my-8">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Link Katalog</label>
          <small class="block mb-2 text-xs text-gray-500">Link dapat berupa link ecommerce (Tokopedia/Shopee/Lazada/dll), Sosial media (Instagram/Tiktok/Facebook), Whatsapp, ataupun Link peta lokasi toko.</small>
          <template v-for="(data, i) in newCatalogUrl" :key="i">
            <div class="flex flex-wrap gap-2">
              <div class="my-1 w-[30%]">
                <fwb-input
                  v-model="newCatalogUrl[i].name"
                  :placeholder="'Judul ke ' + (i + 1) + (i > 0 ? ' (Opsional)' : '')"
                  class=""
                  @keyup="setStoreUrl()"
                />
              </div>
              <div class="my-1 w-2/3">
                <fwb-input
                  v-model="newCatalogUrl[i].url"
                  :placeholder="'Link ke ' + (i + 1) + (i > 0 ? ' (Opsional)' : '')"
                  class=""
                  @keyup="setStoreUrl()"
                />
              </div>
            </div>
          </template>
          <small v-if="newCatalogUrl.length == 1 && (newCatalogUrl[0].name == '' || newCatalogUrl[0].url == '') && isSubmitted " class="text-red-500 block mt-2">Minimal masukkan 1 link</small>
        </div>
        <div class="my-8">
          <fwb-select
            v-model="selectedType"
            :options="typeList"
            label="Tipe Katalog"
            class="w-full"
          />
          <small v-if="!selectedType && isSubmitted" class="text-red-500 block mt-2">Tipe katalog harus diisi</small>
        </div>
        <div class="my-8">
          <fwb-textarea
            v-model="catalogs.description"
            :rows="4"
            label="Deskripsi"
            placeholder="Masukkan deskripsi..."
          />
          <small v-if="!catalogs.description && isSubmitted" class="text-red-500 block mt-2">Deskripsi harus diisi</small>
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
          <small v-if="categoryList.length == 0 && isSubmitted" class="text-red-500 block mt-2">Minimal pilih 1 kategori</small>
          
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
            v-model="catalogs.keywords"
            :rows="4"
            label="Kata kunci"
            placeholder="Masukkan kata kunci untuk UMKM kamu..."
          />
          <span class="text-xs text-slate-800">Pisahkan kata kunci dengan tanda koma (,)<br>contoh: <b>Baju, Baju Pria, Baju Wanita</b>.</span>
          <small v-if="!catalogs.keywords && isSubmitted" class="text-red-500 block mt-2">Kata kunci harus diisi</small>
        </div>
        <div class="my-8">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Foto</label>
          <input
            ref="fileInput1"
            type="file"
            accept="image/*"
            style="display: none"
            data-number="1"
            @change="handleImageUpload"
          />
          <input
            ref="fileInput2"
            type="file"
            accept="image/*"
            style="display: none"
            data-number="2"
            @change="handleImageUpload"
          />
          <input
            ref="fileInput3"
            type="file"
            accept="image/*"
            style="display: none"
            data-number="3"
            @change="handleImageUpload"
          />
          <div class="flex gap-2">
            <img :src="imagePreview1 ?? '/images/image-thumbnail.png'" class="w-20 h-20 border object-cover border-gray-300 cursor-pointer hover:opacity-50" loading="lazy" alt="" @click="triggerInputImage1()" />
            <!-- <div v-if="imagePreview1" class="w-20 h-20 relative overflow-hidden"> -->
            <img :src="imagePreview2 ?? '/images/image-thumbnail.png'" class="w-20 h-20 border object-cover border-gray-300 cursor-pointer hover:opacity-50" loading="lazy" alt="" @click="triggerInputImage2()" />
            <!-- <Icon v-if="imagePreview2" name="material-symbols:close" color="white" class="absolute top-0 right-0 text-xl p-1 cursor-pointer bg-red-500 !text-white" @click="triggerDeleteImage2()" /> -->
            <!-- </div> -->
            <!-- <div v-if="imagePreview2" class="w-20 h-20 relative overflow-hidden"> -->
            <img :src="imagePreview3 ?? '/images/image-thumbnail.png'" class="w-20 h-20 border object-cover border-gray-300 cursor-pointer hover:opacity-50" loading="lazy" alt="" @click="triggerInputImage3()" />
            <!-- <Icon v-if="imagePreview3" name="material-symbols:close" color="white" class="absolute top-0 right-0 text-xl p-1 cursor-pointer bg-red-500 !text-white" @click="triggerDeleteImage3()" /> -->
            <!-- </div> -->
          </div>
          
          <small v-if="(!tempFile1 || !tempFile2 || !tempFile3) && isSubmitted" class="text-red-500 block mt-2">Foto harus diisi</small>

          <small class="block mb-2 text-xs text-gray-500 mt-2">File harus berupa gambar dengan ekstensi <b>.png</b>, <b>.webp</b>, <b>.jpg</b>, atau <b>.jpeg</b> dengan ukuran file max. 1 MB</small>
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
  ])

  const searchCategoryKeyword = ref("")
  const isShowModal = ref(false)
  const isLoading = ref(false)
  const isSubmitted = ref(false)
  const categories = ref()
  
  const toasts = ref<{ type: string, message: string }[]>([]);

  const catalogs = ref<Catalog>({
    categories: '',
    name: '',
    uid: '',
    description: '',
    image1Url: '',
    image2Url: '',
    image3Url: '',
    catalogUrl: '',
    type: '',
    keywords: '',
  })
  const categoryList = ref<Category[]>([])
  const selectedType = ref()
  const newCatalogUrl = ref<{ name: string, url: string }[]>([{
    name: "",
    url: ""
  }])
  // const image1Url = ref(null)
  // const image2Url = ref(null)
  // const image3Url = ref(null)

  onMounted(async () => {
    isSubmitted.value = false
    await loadData();
  })

  watch(() => searchCategoryKeyword.value, () => loadCategories())

  const loadData = async () => {
    try {
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
    if (newCatalogUrl.value[newCatalogUrl.value.length - 1].url != "" && newCatalogUrl.value[newCatalogUrl.value.length - 1].name != "") {
      newCatalogUrl.value.push({
        name: "",
        url: ""
      })
    } else if (newCatalogUrl.value.length > 1 && newCatalogUrl.value[newCatalogUrl.value.length - 2].url == ""){
      newCatalogUrl.value.pop()
    }
  }
  
  const showModal = (value: boolean) => isShowModal.value = value

  const fileInput1 = ref()
  const imagePreview1 = ref()
  const tempFile1 = ref();
  const tempValue1 = ref();
  const triggerInputImage1 = () => fileInput1.value.click()

  const fileInput2 = ref()
  const imagePreview2 = ref()
  const tempFile2 = ref();
  const tempValue2 = ref();
  const triggerInputImage2 = () => fileInput2.value.click()
  // const triggerDeleteImage2 = () => {
  //   fileInput2.value.value = fileInput2.value.files = imagePreview2.value = image2Url.value = tempFile2.value = null
    
  //   if (fileInput3.value.files.length == 1) {
  //     fileInput2.value.files = fileInput3.value.files
  //     imagePreview2.value = imagePreview3.value
  //     image2Url.value = image3Url.value
  //     tempFile2.value = tempFile3.value
  //     triggerDeleteImage3()
  //   }
  // }

  const fileInput3 = ref()
  const imagePreview3 = ref()
  const tempFile3 = ref();
  const tempValue3 = ref();
  const triggerInputImage3 = () => fileInput3.value.click()
  // const triggerDeleteImage3 = () => fileInput3.value.value = fileInput3.value.files = imagePreview3.value = image3Url.value = tempFile3.value = null

  const handleImageUpload = (event: any) => {
    
    const number = event.target.getAttribute('data-number');

    const selectedFile = event.target.files[0];
    let errorMessage = null;

    errorMessage = selectedFile && /^(image\/png|image\/jpeg|image\/webp)$/.test(selectedFile.type) ? errorMessage : "File gambar atau ekstensi tidak valid!";
    errorMessage = selectedFile.size / (1024 * 1024) > 1 ? "Ukuran file > 1 MB. Silahkan ganti file gambar dengan ukuran < 1 MB" : errorMessage;
    
    if (errorMessage) {
      event.target.value = event.target.files = null;
      
      Swal.fire("Peringatan!", errorMessage, "warning");
    } else {

      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
  
      if (file) {
        if (number == 1){
          imagePreview1.value = URL.createObjectURL(file);
          tempFile1.value = event.target.files[0];
          tempValue1.value = event.target.value;
        } else if (number == 2) {
          imagePreview2.value = URL.createObjectURL(file);
          tempFile2.value = event.target.files[0];
          tempValue2.value = event.target.value;
        } else if (number == 3) {
          imagePreview3.value = URL.createObjectURL(file);
          tempFile3.value = event.target.files[0];
          tempValue3.value = event.target.value;
        }
      } else {
        if (number == 1){
          imagePreview1.value = null;
        } else if (number == 2) {
          imagePreview2.value = null;
        } else if (number == 3) {
          imagePreview3.value = null;
        }
    }

    }
  }

  const handleSubmit = async () => {
    isSubmitted.value = true
    isLoading.value = true
    try {
      newCatalogUrl.value = newCatalogUrl.value.length > 1 ? newCatalogUrl.value.filter(x => x.url !== "" && x.name !== "") : newCatalogUrl.value
      
      catalogs.value.catalogUrl = JSON.stringify(newCatalogUrl.value)
      catalogs.value.categories = JSON.stringify(categoryList.value)
      catalogs.value.type = selectedType.value
      catalogs.value.image1Url = tempFile1.value
      catalogs.value.image2Url = tempFile2.value
      catalogs.value.image3Url = tempFile3.value

      const { name, description, keywords, type, catalogUrl, categories, image1Url, image2Url, image3Url } = catalogs.value

      if (!name || !description || !keywords || !categories || !type || !catalogUrl || !image1Url || !image2Url || !image3Url) {      
        await Swal.fire("Peringatan!", "Formulir masi belum lengkap! Mohon isi dan lengkap seluruh form", "warning")
        isLoading.value = false
      } else {
        await addCatalog()
      }
    } catch (error) {
      console.error(error);
    }
    isLoading.value = false
  }

  const addCatalog = async () => {
    const { name, description, keywords, type, catalogUrl, categories, image1Url, image2Url, image3Url } = catalogs.value

    try {
      await useAxios.post('/user/catalog', {
        name, description, keywords, type, catalogUrl, categories, image1Url, image2Url, image3Url
      })

      toasts.value.push({
        type: "success",
        message: "Katalog telah disimpan!"
      });
      
      location.reload()
    } catch (error) {
      console.error(error);
    }
  }

</script>

<style>

</style>
