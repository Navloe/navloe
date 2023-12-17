<template>
  <div>
    <h1 class="mb-2 font-bold text-xl">User</h1>
    <div class="sm:flex my-4 justify-between">
      <fwb-button color="default" class="max-sm:mb-2 h-12 rounded-md" size="md">Tambah User</fwb-button>
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
        <fwb-table-head-cell>Nama</fwb-table-head-cell>
        <fwb-table-head-cell>Email</fwb-table-head-cell>
        <fwb-table-head-cell>No.Telp</fwb-table-head-cell>
        <fwb-table-head-cell>
          <span class="sr-only">Edit</span>
        </fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body v-if="!isLoading">
        <fwb-table-row v-for="(data, i) in datas" :key="i">
          <fwb-table-cell>{{ i + 1 }}</fwb-table-cell>
          <fwb-table-cell>{{ data.name }}</fwb-table-cell>
          <fwb-table-cell>{{ data.email }}</fwb-table-cell>
          <fwb-table-cell>{{ data.phoneNumber }}</fwb-table-cell>
          <fwb-table-cell>
            <fwb-a href="#">
              Edit
            </fwb-a>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>

    <fwb-pagination v-if="!isLoading" v-model="pagination.currentPage" class="mt-4" :total-items="pagination.totalData" :per-page="pagination.limitPerPage"></fwb-pagination>
    <div v-else class="text-left text-gray-500 flex items-center justify-center gap-2 mt-4 text-sm">
      <fwb-spinner />
      <span>Loading</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: 'admin'
  })

  import {
    FwbA,
    FwbButton,
    FwbInput,
    FwbPagination,
    FwbSpinner,
    FwbTable,
    FwbTableBody,
    FwbTableCell,
    FwbTableHead,
    FwbTableHeadCell,
    FwbTableRow,
  } from 'flowbite-vue'

  const searchKeyword = ref('')
  const isLoading = ref(true)

  const datas = ref<User[]>()
  const pagination = ref<Pagination>({
    limitPerPage: 10,
    currentPage: 1,
    totalPage: 1,
    displayedData: 0,
    totalData: 0
  })

  onMounted(async () => {
    await loadData()
  })

  watch(() => pagination.value.currentPage, () => loadData())
  watch(() => searchKeyword.value, () => searchData())

  const searchData = async () => {
    pagination.value.currentPage = 1
    await loadData()
  }

  const loadData = async () => {
    try {
      const req = await useAxios.get<{
        data: [], pagination: Pagination
      }>(`admin/users?page=${pagination.value.currentPage}&limit=${pagination.value.limitPerPage}&searchKeyword=${searchKeyword.value}`);
      datas.value = req.data.data
      pagination.value = req.data.pagination;
      isLoading.value = false
    } catch (error) {
      console.error(error);
    }
    
  }
</script>

<style>

</style>
