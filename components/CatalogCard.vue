<template>
  <div class="relative border rounded-lg">
    <nuxt-link to="/rexas-gaming/controller-gaming-cg001">
      <LazyNuxtImg src="/images/products/img.png" :alt="catalog.name" class="w-full rounded" />
    </nuxt-link>
    <!-- <IconCss name="material-symbols:favorite-outline" class="text-2xl text-gray-500 absolute top-3 right-3" /> -->
    <div class="p-2 md:p-4">
      <nuxt-link to="/rexas-gaming/controller-gaming-cg001">
        <h4 class="font-semibold text-left max-md:text-sm">{{ catalog.name }}</h4>
      </nuxt-link>
      <div class="flex overflow-hidden mt-2 gap-1">
        <div class="bg-primary-light text-primary py-1 px-3 rounded-full text-[0.5rem] md:text-xs">Gaming</div>
        <div class="bg-primary-light text-primary py-1 px-3 rounded-full text-[0.5rem] md:text-xs">Gaming</div>
      </div>
      <nuxt-link to="/rexas-gaming">
        <div class="flex items-center mt-3">  
          <NuxtImg src="/images/enterprise/profile.jpg" :alt="catalog.name" class="w-6 md:w-9 rounded-full mr-2" />
          <h5 class="text-primary-dark font-medium text-[0.65em] md:text-sm text-left">Rexas Gaming</h5>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // eslint-disable-next-line vue/require-prop-types
  // defineProps(['catalog'])
  defineProps<{
    catalog: Catalog
  }>()
</script>

<style>

</style>
