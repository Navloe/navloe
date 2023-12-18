<template>
  <div>
    <div class="container mx-auto px-2 sm:px-8">
      <span class="block my-2 text-sm text-gray-700">Terdapat 1,432 data dari hasil pencarian “{{ searchKeyword }}”.</span>
      <div class="flex mb-4 mt-2 gap-3">
        <!-- <button class="max-md:hidden bg-white w-12 h-12 text-sm text-black border border-primary"><Icon name="material-symbols:filter-alt" class="text-2xl" /></button> -->
        <button class="w-36 h-12 text-white rounded text-sm bg-primary">Produk</button>
        <button class="w-36 h-12 text-white rounded text-sm bg-primary">Jasa</button>
        <button class="w-36 h-12 text-white rounded text-sm bg-primary">UMKM</button>
      </div>
      <div v-if="type == 'product' || type == 'service'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        <CatalogCard :catalog="catalog" />
        <CatalogCard :catalog="catalog" />
        <CatalogCard :catalog="catalog" />
        <CatalogCard :catalog="catalog" />
      </div>
      <div v-else-if="type == 'umkm'" class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <EnterpriseCard />
        <EnterpriseCard />
        <EnterpriseCard />
        <EnterpriseCard />
        <EnterpriseCard />
        <EnterpriseCard />
        <EnterpriseCard />
      </div>
      
      <div class="flex justify-end">
        <fwb-pagination v-model="pagination.currentPage" class="mt-4" :total-items="pagination.totalData" :per-page="pagination.limitPerPage"></fwb-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {FwbPagination} from 'flowbite-vue'
  const searchKeyword = ref()
  const route = useRoute()

  const catalog = ref({
    name: "Controller Gaming CG001"
  })

  const type = ref("umkm")
  
  const pagination = ref<Pagination>({
    limitPerPage: 10,
    currentPage: 1,
    totalPage: 1,
    displayedData: 0,
    totalData: 0
  })

  onMounted(() => {
    searchKeyword.value = route.query.s || ""
  })
</script>

<style>

</style>
