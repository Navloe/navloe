<template>
  <div class="relative border rounded-lg">
    <nuxt-link to="/">
      <LazyNuxtImg src="/images/products/img.png" :alt="catalog.name" class="w-full rounded" />
    </nuxt-link>
    <IconCss name="material-symbols:favorite-outline" class="text-2xl text-gray-500 absolute top-3 right-3" />
    <div class="p-4">
      <nuxt-link to="/">
        <h4 class="font-semibold">{{ catalog.name }}</h4>
      </nuxt-link>
      <div class="flex mt-2 gap-1">
        <div class="bg-primary-light text-primary py-1 px-3 rounded-full text-xs">Gaming</div>
        <div class="bg-primary-light text-primary py-1 px-3 rounded-full text-xs">Gaming</div>
      </div>
      <nuxt-link to="/">
        <div class="flex items-center mt-3">  
          <NuxtImg src="/images/enterprise/profile.jpg" :alt="catalog.name" class="w-9 rounded-full mr-2" />
          <h5 class="text-primary-dark font-medium text-sm">Rexas Gaming</h5>
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
