<template>
  <div>
    <div class="container mx-auto px-2 sm:px-8">
      <carousel class="w-full" :wrap-around="true">
        <slide v-for="(slide, i) in pictures" :key="i">
          <img src="/images/banner1.png" class="w-full h-36 md:h-64 object-cover" alt="">
        </slide>
        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>

      <section class="w-full mt-8">
        <div class="flex justify-between items-center">
          <h4 class="font-semibold">Kategori Pilihan</h4>
          <!-- <nuxt-link to="/kategori" class="text-primary underline text-sm">Lihat Semua</nuxt-link> -->
        </div>
        <div class="mt-4 w-full grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/aksesoris.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">aksesoris</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/alat musik.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">alat musik</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/dekorasi rumah.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">dekorasi rumah</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/desain logo dan poster.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">desain logo</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/kerajinan tangan.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">kerajinan tangan</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/makanan.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">makanan</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/pakaian pria.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">pakaian pria</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/pakaian wanita.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">pakaian wanita</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/peralatan dapur.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">peralatan dapur</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/peralatan rumah.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">peralatan rumah</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/perawatan kulit.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">perawatan kulit</h4>
          </div>
          <div class="w-full bg-primary relative xl:mb-4">
            <LazyNuxtImg src="images/categories/service tv.jpg" class="h-full w-full object-cover relative opacity-50" />
            <h4 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold capitalize text-white">service tv</h4>
          </div>
        </div>
      </section>
      <section class="w-full mt-8">
        <h4 class="font-semibold mb-4">Produk & Jasa yang Mungkin Kamu Suka</h4>
        <div class="flex gap-3 mt-4 w-full">
          <carousel :breakpoints="catalogBreakpoints" :wrap-around="true">
            <slide v-for="slide in 10" :key="slide">
              <CatalogCard :catalog="catalog" class="w-full" />
            </slide>

            <template #addons>
              <navigation />
              <pagination />
            </template>
          </carousel>
        </div>
      </section>
      <section class="w-full mt-8">
        <h4 class="font-semibold mb-4">UMKM yang mungkin kamu suka</h4>
        <div class="flex gap-3 mt-4 w-full">
          <carousel :breakpoints="enterpriseBreakpoints" :wrap-around="true" class="cagie">
            <slide v-for="slide in 10" :key="slide">
              <EnterpriseCard class="w-full" />
            </slide>

            <template #addons>
              <navigation />
              <pagination />
            </template>
          </carousel>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import 'vue3-carousel/dist/carousel.css'
  import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

  const pictures = ref([
    {
      src: "/images/banner1.png",
      alt: "banner 1"
    },
  ])
  const catalogBreakpoints = ref({
    0: {
      itemsToShow: 2.5,
      snapAlign: 'start',
    },
    700: {
      itemsToShow: 3.5,
      snapAlign: 'start',
    },
    // 1024 and up
    1024: {
      itemsToShow: 5,
      snapAlign: 'start',
    },
  })
  const enterpriseBreakpoints = ref({
    0: {
      itemsToShow: 1,
      snapAlign: 'start',
    },
    700: {
      itemsToShow: 1.75,
      snapAlign: 'start',
    },
    // 1024 and up
    1024: {
      itemsToShow: 2.5,
      snapAlign: 'start',
    },
  })
  const catalog = ref({
    name: "Controller Gaming CG001"
  })
  const catalogs = ref()
  const categories = [
    "aksesoris",
    "alat musik",
    "dekorasi rumah",
    "desain logo dan poster",
    "kerajinan tangan",
    "makanan",
    "pakaian pria",
    "pakaian wanita",
    "peralatan dapur",
    "peralatan rumah",
    "perawatan kulit",
    "produk perawatan kulit",
    "service laptop dan barang elektronik",
    "service tv",
    "vitamin dan suplemen",
  ]

  onMounted(async () => {
    await loadData()
  })

  const loadData = async () => {
    const req = await useAxios.get('/catalogs?limit=12')

    catalogs.value = req.data.data

    console.log(catalogs.value);
  }
</script>

<style lang="postcss" scoped>
.carousel{
  @apply w-full;
  .carousel__pagination{
    display: none;
  }
}

.carousel-custom-class img{
  height: 100% !important;
}
</style>
