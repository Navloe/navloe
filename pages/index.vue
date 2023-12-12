<template>
  <div>
    <div class="container mx-auto px-8">
      <fwb-carousel :pictures="pictures" slide />

      <section class="w-full mt-8">
        <div class="flex justify-between items-center">
          <h4 class="font-semibold">Kategori Pilihan</h4>
          <nuxt-link to="/kategori" class="text-primary underline text-sm">Lihat Semua</nuxt-link>
        </div>
        <div class="flex gap-3 mt-4 w-full">
          <CategoryCard v-for="i in 10" :key="i" />
        </div>
      </section>
      <section class="w-full mt-8">
        <h4 class="font-semibold mb-4">Produk & Jasa yang Mungkin Kamu Suka</h4>
        <div class="flex gap-3 mt-4 w-full">
          <carousel :breakpoints="breakpoints" :wrap-around="true">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { FwbCarousel } from 'flowbite-vue'
  import 'vue3-carousel/dist/carousel.css'
  import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

  const pictures = ref([
    {
      src: "/images/banner1.png",
      alt: "banner 1"
    },
    {
      src: "/images/banner2.png",
      alt: "banner 2"
    },
  ])
  const breakpoints = ref({
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
  const catalog = ref({
    name: "Controller Gaming CG001"
  })
</script>

<style lang="postcss" scoped>
.carousel{
  @apply w-full;
  .carousel__pagination{
    display: none;
  }
}
</style>
