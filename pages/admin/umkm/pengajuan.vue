<template>
  <div>
    <h1 class="mb-2 font-bold text-xl">Pengajuan UMKM</h1>
    <div class="sm:flex my-4 justify-between">
      <div class="flex gap-2">
        <fwb-select
          v-model="selectedStatus"
          :options="statusList"
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
        <fwb-table-head-cell>Tgl Pengajuan</fwb-table-head-cell>
        <fwb-table-head-cell>Status</fwb-table-head-cell>
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
          <fwb-table-cell>{{ useDateFormat(data.createdAt, 'DD-MM-YYYY HH:mm:ss').value }}</fwb-table-cell>
          <fwb-table-cell>
            <fwb-badge :type="data.status == 'pending' ? 'yellow' : 'red'" class="capitalize">{{ data.status }}</fwb-badge>
          </fwb-table-cell>
          <fwb-table-cell v-if="data.status == 'pending'" class="flex gap-2 items-center">
            <button class="btn bg-green-500 text-white hover:bg-green-700" @click="approveEnterprise(data.id, data.name, data.user.name)">Terima</button>
            <button class="btn bg-red-500 text-white hover:bg-red-700" @click="declineEnterprise(data.id, data.name, data.user.name)">Tolak</button>
          </fwb-table-cell>
          <fwb-table-cell v-if="data.status == 'rejected'" class="flex gap-2 items-center">
            <button class="btn bg-orange-500 text-white hover:bg-orange-700" @click="editDeclinedEnterprise(data.id, data.name, data.user.name, data.inactiveReason)">Alasan</button>
            <button class="btn bg-green-500 text-white hover:bg-green-700" @click="approveEnterprise(data.id, data.name, data.user.name)">Terima</button>
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
import Swal from 'sweetalert2';

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
  const statusList = ref([
    { value: 'pending', name: 'Pending' },
    { value: 'rejected', name: 'Ditolak' },
  ])
  const selectedStatus = ref('pending')

  onMounted(async () => {
    await loadData()
  })
  
  watch(() => pagination.value.currentPage, () => loadData())
  watch(() => searchKeyword.value, () => searchData())
  watch(() => selectedStatus.value, () => searchData())
  
  const loadData = async () => {
    isLoading.value = true
    datas.value = null
    const req = await useAxios.get(`/admin/enterprises?status=${selectedStatus.value}&page=${pagination.value.currentPage}&limit=${pagination.value.limitPerPage}&searchKeyword=${searchKeyword.value}`)
    datas.value = req.data.data
    pagination.value = req.data.pagination
    isLoading.value = false
  }

  const searchData = async () => {
    pagination.value.currentPage = 1
    await loadData()
  }

  const copyNIB = (nib: string) => navigator.clipboard.writeText(nib)

  const approveEnterprise = async (id: string, enterpriseName: string, ownerName: string) => {
    const swal = await useSwal.fire({
      icon: 'question',
      html: `Apakah kamu ingin menerima pengajuan dari UMKM <b>${enterpriseName}</b> milik <b>${ownerName}</b>?`,
      showCancelButton: true,
      confirmButtonText: "Terima"
    })
    if(swal.isConfirmed){
      try {
        await useAxios.put(`/admin/enterprise/${id}`, {
          status: 'active',
        })
        
        loadData()
      } catch (error: any) {        
        Swal.fire('Error', error.response.data.message, 'error')     
      }
    }
  }

  const declineEnterprise = async (id: string, enterpriseName: string, ownerName: string) => {
    const swal = await useSwal.fire({
      icon: 'warning',
      html: `Apakah kamu ingin menolak pengajuan dari UMKM <b>${enterpriseName}</b> milik <b>${ownerName}</b>`,
      showCancelButton: true,
      confirmButtonColor: "#FF4444",
      confirmButtonText: "Tolak"
    })
    if(swal.isConfirmed){
      const { value: text } = await useSwal.fire({
        input: "textarea",
        inputLabel: "Alasan menolak",
        inputPlaceholder: "Masukkan alasan menolak...",
        inputAttributes: {
          "aria-label": "Masukkan alasan menolak"
        },
        inputValidator: (value) => {
          if (!value) {
            return "Alasan menolak harus diisi!";
          }
        },
        showCancelButton: true,
        confirmButtonColor: "#FF4444",
        confirmButtonText: "Simpan"
      });
      if (text) {
        try {
          await useAxios.put(`/admin/enterprise/${id}`, {
            status: 'rejected',
            inactiveReason: text
          })
          
          loadData()
        } catch (error: any) {        
          Swal.fire('Error', error.response.data.message, 'error')     
        }
      }
    }
    
  }

  const editDeclinedEnterprise = async (id: string, enterpriseName: string, ownerName: string, inactiveReason: string) => {
    const { value: text } = await useSwal.fire({
      html: `Alasan menolak pengajuan UMKM <b>${enterpriseName}</b> milik <b>${ownerName}</b>`,
      input: "textarea",
      inputValue: inactiveReason,
      inputPlaceholder: "Masukkan alasan menolak...",
      inputAttributes: {
        "aria-label": "Masukkan alasan menolak"
      },
      inputValidator: (value) => {
        if (!value) {
          return "Alasan menolak harus diisi!";
        }
      },
      showCancelButton: true,
      confirmButtonColor: "#FF4444",
      confirmButtonText: "Simpan"
    });
    if (text) {
      try {
        await useAxios.put(`/admin/enterprise/${id}`, {
          inactiveReason: text
        })
        
        loadData()
      } catch (error: any) {        
        Swal.fire('Error', error.response.data.message, 'error')     
      }
    }
  }

  // const getDate = (date: string) => {
  //   const result = useDateFormat(date, 'DD-MM-YYYY HH:mm:ss').value
  //   console.log(result.value);
    
  //   return result
  // }
</script>

<style>

</style>
