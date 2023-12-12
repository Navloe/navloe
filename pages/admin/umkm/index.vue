<template>
  <div>
    <h1 class="mb-2 font-bold text-xl">UMKM</h1>
    <div class="sm:flex my-4 justify-between">
      <div class="flex gap-2">
        <fwb-select
          v-model="selectedType"
          :options="typeList"
          class="max-sm:block max-sm:mb-4"
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
        <fwb-table-head-cell>Nama UMKM</fwb-table-head-cell>
        <fwb-table-head-cell>NIB</fwb-table-head-cell>
        <fwb-table-head-cell>Pemilik</fwb-table-head-cell>
        <fwb-table-head-cell>Tgl Daftar</fwb-table-head-cell>
        <fwb-table-head-cell>
        </fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body>
        <fwb-table-row v-for="(data, i) in datas" :key="i">
          <fwb-table-cell>1</fwb-table-cell>
          <fwb-table-cell>{{ data.name }}</fwb-table-cell>
          <fwb-table-cell>
            <span class="block">{{ data.nib }}</span>
            <a class=" cursor-pointer text-primary underline text-xs mr-2" @click="copyNIB(data.nib)">Copy NIB</a>
            <a href="https://www.badanperizinan.co.id/nib.html" target="_blank" class="text-primary underline text-xs">Cek disini</a>
          </fwb-table-cell>
          <fwb-table-cell><b>{{ data.user.name }}</b> <br /> <small>{{ data.user.phoneNumber }}</small> <br /> <small>{{ data.user.email }}</small></fwb-table-cell>
          <fwb-table-cell>19 November 2023, 23:00:00</fwb-table-cell>
          <fwb-table-cell class="flex gap-2 items-center">
            Edit
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>
    <fwb-pagination v-if="!isLoading && datas.length != 0" v-model="pagination.currentPage" class="mt-4" :total-items="pagination.totalData" :per-page="pagination.limitPerPage"></fwb-pagination>
    <div v-else class="text-left text-gray-500 flex items-center justify-center gap-2 mt-4 text-sm">
      <template v-if="isLoading">
        <fwb-spinner />
        <span>Loading</span>
      </template>
      <template v-else-if="datas.length == 0">
        <span>Data tidak ditemukan</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: 'admin'
  })

  import {
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

  const datas = shallowRef()
  const pagination = ref<Pagination>({
    limitPerPage: 10,
    currentPage: 1,
    totalPage: 1,
    displayedData: 0,
    totalData: 0
  })
  const searchKeyword = ref('')
  const isLoading = ref(true)
  const typeList = ref([
    { value: 'all', name: 'Semua' },
    { value: 'product', name: 'Produk' },
    { value: 'service', name: 'Jasa' },
    { value: 'both', name: 'Produk & Jasa' },
  ])
  const selectedType = ref('all')

  onMounted(async () => {
    await loadData()
  })
  
  watch(() => pagination.value.currentPage, () => loadData())
  watch(() => searchKeyword.value, () => searchData())
  watch(() => selectedType.value, () => searchData())

  const loadData = async () => {
    isLoading.value = true
    datas.value = null
    const req = await useAxios.get(`/admin/enterprises?type=${selectedType.value == 'all' ? '' : selectedType.value}&page=${pagination.value.currentPage}&limit=${pagination.value.limitPerPage}&searchKeyword=${searchKeyword.value}&status=active`)
    datas.value = req.data.data
    pagination.value = req.data.pagination

    isLoading.value = false
  }

  const searchData = async () => {
    pagination.value.currentPage = 1
    await loadData()
  }

  const copyNIB = (nib: string) => navigator.clipboard.writeText(nib)
</script>

<style>

</style>
