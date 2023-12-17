<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <ToastList class="" :toasts="toasts" />
    <h1 class="mb-2 font-bold text-xl">Katalog</h1>
    <div class="w-full">
      <div class="md:columns-3">
        <div class="w-full h-24 border relative p-6 flex flex-col justify-center">
          <h4 class="font-bold text-xl">{{ catalogStatistic.show?.status || 0 }}</h4>
          <h4 class="text-sm mt-1">Ditampilkan</h4>
        </div>
        <div class="w-full h-24 max-md:my-3 border relative p-6 flex flex-col justify-center">
          <h4 class="font-bold text-xl">{{ catalogStatistic.hidden?.status || 0 }}</h4>
          <h4 class="text-sm mt-1">Disembunyikan</h4>
        </div>
        <div class="w-full h-24 border relative p-6 flex flex-col justify-center">
          <h4 class="font-bold text-xl">{{ catalogStatistic.suspend?.status || 0 }}</h4>
          <h4 class="text-sm mt-1">Ditangguhkan</h4>
        </div>
      </div>
      <div class="lg:flex my-4 justify-between w-full">
        <div class="flex gap-2">
          <fwb-select
            v-model="selectedStatus"
            :options="statusList"
            class="max-lg:block max-lg:mb-4"
          />
          <button class="btn bg-blue-500 text-white text-xs h-10" @click="loadData()">Reload Data</button>
        </div>
        <fwb-input
          v-model="searchKeyword"
          placeholder="Pencarian"
          size="lg"
          class="w-full sm:w-96"
        >
          <template #prefix>
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </template>
        </fwb-input>
      </div>
      <fwb-table>
        <fwb-table-head>
          <fwb-table-head-cell>#</fwb-table-head-cell>
          <fwb-table-head-cell>Gambar</fwb-table-head-cell>
          <fwb-table-head-cell>Nama</fwb-table-head-cell>
          <fwb-table-head-cell>Tipe</fwb-table-head-cell>
          <fwb-table-head-cell>Link</fwb-table-head-cell>
          <fwb-table-head-cell>Status</fwb-table-head-cell>
          <fwb-table-head-cell>
          </fwb-table-head-cell>
        </fwb-table-head>
        <fwb-table-body>
          <fwb-table-row v-for="(data, i) in catalogs" :key="i">
            <fwb-table-cell>{{ i + 1 + pagination.limitPerPage * (pagination.currentPage - 1) }}</fwb-table-cell>
            <fwb-table-cell><img :src="data.image1Url" class="w-16 h-16 object-cover" /></fwb-table-cell>
            <fwb-table-cell>{{ data.name }}</fwb-table-cell>
            <fwb-table-cell>{{ data.type == 'product' ? 'Produk' : 'Jasa' }}</fwb-table-cell>
            <fwb-table-cell v-html="parseCatalogUrl(data.catalogUrl || '')"></fwb-table-cell>
            <fwb-table-cell>
              <fwb-badge :class="getStatus((data.status || ''), 'class')" class="capitalize !text-white">{{ getStatus((data.status || ''), 'text') }}</fwb-badge>
            </fwb-table-cell>
            <fwb-table-cell class="flex gap-2 items-center">
              <button class="btn bg-primary text-white hover:bg-primary-dark">Detail</button>
              <nuxt-link :to="'/umkm/katalog/'+data.id"><button class="btn bg-yellow-400 text-white hover:bg-yellow-700">Edit</button></nuxt-link>
              <button class="btn bg-red-500 text-white hover:bg-red-700" @click="handleDelete((data.id || ''), (data.name || ''))">Hapus</button>
            </fwb-table-cell>
          </fwb-table-row>
        </fwb-table-body>
      </fwb-table>
      <fwb-pagination v-if="!isLoading && catalogs.length != 0" v-model="pagination.currentPage" class="mt-4" :total-items="pagination.totalData" :per-page="pagination.limitPerPage"></fwb-pagination>
      <div v-else class="text-left text-gray-500 flex items-center justify-center gap-2 mt-4 text-sm">
        <template v-if="isLoading">
          <fwb-spinner />
          <span>Loading</span>
        </template>
        <template v-else-if="catalogs.length == 0">
          <span>Data tidak ditemukan</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: 'umkm'
  })

  import Swal from 'sweetalert2';
  import {
    FwbBadge,
    FwbInput,
    FwbPagination,
    FwbSelect,
    FwbTable,
    FwbTableBody,
    FwbTableCell,
    FwbTableHead,
    FwbTableHeadCell,
    FwbTableRow,
  } from 'flowbite-vue'

  const searchKeyword = ref("")
  const selectedStatus = ref("show")
  const statusList = ref([
    { value: 'show', name: 'Ditampilkan' },
    { value: 'hidden', name: 'Disembunyikan' },
    { value: 'suspend', name: 'Ditangguhkan' },
  ])
  const toasts = ref<{ type: string, message: string }[]>([]);

  // const isShowModal = ref(false)
  const isLoading = ref(false)

  const catalogs = ref<Catalog[]>([])
  const pagination = ref<Pagination>({
    limitPerPage: 10,
    currentPage: 1,
    totalPage: 1,
    displayedData: 0,
    totalData: 0
  })
  const catalogStatistic = ref({
    show: {
      status: 0,
      _all: 0
    },
    hidden: {
      status: 0,
      _all: 0
    },
    suspend: {
      status: 0,
      _all: 0
    },
  })

  onMounted(async () => {
    await loadData()    
  })

  watch(() => pagination.value.currentPage, () => loadData())
  watch(() => searchKeyword.value, () => loadData())
  watch(() => selectedStatus.value, () => loadData())

  const loadData = async () => {
    isLoading.value = true
    catalogs.value = []

    const req = await useAxios.get(`/user/catalogs?page=${pagination.value.currentPage}&limit=${pagination.value.limitPerPage}&searchKeyword=${searchKeyword.value}&status=${selectedStatus.value}`);
    
    catalogs.value = req.data.data
    pagination.value = req.data.pagination

    catalogStatistic.value.show = (req.data.catalogStatistic.find((item: any) => item.status == 'show') ?? {_count: null})._count ?? catalogStatistic.value.show
    catalogStatistic.value.hidden = (req.data.catalogStatistic.find((item: any) => item.status == 'hidden') ?? {_count: null})._count ?? catalogStatistic.value.hidden
    catalogStatistic.value.suspend = (req.data.catalogStatistic.find((item: any) => item.status == 'suspend') ?? {_count: null})._count ?? catalogStatistic.value.suspend
    
    isLoading.value = false
  }

  const handleDelete = async (id: string, name: string) => {
    try {
      const swal = await Swal.fire({
        icon: "warning",
        title: "Peringatan!",
        html: `Apakah kamu yakin ingin menghapus katalog "<b>${name}</b>"?`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: '#FF4444',
        confirmButtonText: 'Hapus'
      })

      if (swal.isConfirmed) {
        isLoading.value = true
        await useAxios.delete(`/user/catalog/${id}`)

        toasts.value.push({
          type: "success",
          message: "Katalog telah dihapus!"
        });

        loadData()
      }
    } catch (error) {
      isLoading.value = false
      console.error(error);
    }
  }

  const getStatus = (value: string, type: string) => {
    let result = ""

    if (type == "text") {
      if (value == 'show') {
        result = 'Ditampilkan'
      } else if (value == 'hidden') {
        result = 'Disembunyikan'
      }else if (value == 'suspend') {
        result = 'Ditangguhkan'
      }
    } else if (type == "class") {
      if (value == 'show') {
        result = '!bg-green-500'
      } else if (value == 'hidden') {
        result = '!bg-slate-400'
      }else if (value == 'suspend') {
        result = '!bg-red-500'
      }
    }

    return result
  }

  const parseCatalogUrl = (value: string) => {
    const array = JSON.parse(value)
    let result = "";

    for (let i = 0; i < array.length; i++) {
      result += `<a href='${array[i].url}' class='mb-2 text-primary underline' target='_blank'>${array[i].name}</a> <br/>`;
    }

    return result
  }

</script>

<style>

</style>
