<template>
  <div>
    <div class="container mx-auto px-2 sm:px-8 min-h-[calc(100vh-96px)]">
      <div class="flex">
        <img src="/images/enterprise/profile.jpg" class="w-24 h-24" alt="">
        <div class="flex flex-col justify-center ml-6">
          <h4 class="font-bold">Rexas Gaming</h4>
          <small class="text-gray-500 my-1">Toko Gaming</small>
          <div class="flex flex-wrap gap-1 mt-2">
            <div class="bg-primary-light text-primary py-1 px-3 rounded-full text-[0.5rem] md:text-xs w-max">Gaming</div>
            <div class="bg-primary-light text-primary py-1 px-3 rounded-full text-[0.5rem] md:text-xs w-max">Gaming</div>
            <div class="bg-primary-light text-primary py-1 px-3 rounded-full text-[0.5rem] md:text-xs w-max">Gaming</div>
            <div class="bg-primary-light text-primary py-1 px-3 rounded-full text-[0.5rem] md:text-xs w-max">Gaming</div>
          </div>
        </div>
      </div>
      <p class="my-4 text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, dolorem alias iste voluptatum quia laborum repellendus. Assumenda doloremque neque quisquam possimus. Voluptatibus blanditiis commodi perferendis aspernatur error neque possimus cum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, dolorem alias iste voluptatum quia laborum repellendus. Assumenda doloremque neque quisquam possimus. Voluptatibus blanditiis commodi perferendis aspernatur error neque possimus cum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, dolorem alias iste voluptatum quia laborum repellendus. Assumenda doloremque neque quisquam possimus. Voluptatibus blanditiis commodi perferendis aspernatur error neque possimus cum?</p>
      <h4>Katalog</h4>
      <div class="flex mb-4 mt-2 gap-3">
        <!-- <button class="max-md:hidden bg-white w-12 h-12 text-sm text-black border border-primary"><Icon name="material-symbols:filter-alt" class="text-2xl" /></button> -->
        <button class="w-36 h-12 text-white rounded text-sm bg-primary">Produk</button>
        <button class="w-36 h-12 text-white rounded text-sm bg-primary">Jasa</button>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        <CatalogCard :catalog="catalog" />
        <CatalogCard :catalog="catalog" />
        <CatalogCard :catalog="catalog" />
        <CatalogCard :catalog="catalog" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const catalog = ref({
    name: "Controller Gaming CG001"
  })
</script>



<style>

</style>
