<template>
  <div>
    <nav :class="isScrolledDown ? 'shadow' : ''">
      <div class="container mx-auto flex justify-evenly items-center py-6 px-4 lg:px-8 gap-4 md:gap-8">
        <nuxt-link to="/"><nuxt-img src="/images/navloeLogo.png" class="w-16" /></nuxt-link>
        <button class="max-md:hidden bg-white py-3 px-6 text-sm text-black border border-primary">Kategori</button>
        <div class="relative w-full">
          <input v-model="searchKeyword" type="text" class="h-11 w-full border border-slate-400" placeholder="Cari produk/jasa/UMKM yang kamu inginkan" @keydown.enter="submitSearch()" @focus="toggleShowSearchResultBox(true)" @blur="toggleShowSearchResultBox(false)" />
          <Icon name="material-symbols:search-rounded" class="absolute top-1/2 right-3 transform -translate-y-1/2 p-1 text-2xl bg-white" />
          <nuxt-link v-if="searchKeyword && showSearchResultBox" :to="`/pencarian?s=${searchKeyword}`" class="absolute left-0 top-11 w-full bg-white p-4 border text-sm" @click="toggleShowSearchResultBox(false)"><span class="text-gray-500">Cari</span> {{ searchKeyword }}</nuxt-link>
        </div>
        <nuxt-link to="/auth/daftar-umkm" class="max-sm:text-xs max-sm:px-2 bg-primary py-3 px-6 h-11 text-sm text-white border border-primary whitespace-nowrap">
          Daftar UMKM
        </nuxt-link>
        <!-- <nuxt-link to="/auth/daftar-umkm" class="max-sm:hidden !text-slate-600 h-11 flex whitespace-nowrap items-center text-sm">
          <Icon name="material-symbols:favorite" color="gray" class="text-lg md:mr-2" />
          <span class="max-md:hidden">Favorite</span>
        </nuxt-link> -->
        <!-- <nuxt-link to="/auth/daftar-umkm" class="sm:hidden !text-slate-600 h-11 flex whitespace-nowrap items-center text-sm">
          <Icon name="material-symbols:menu" color="gray" class="text-lg md:mr-2" />
        </nuxt-link> -->
      </div>
    </nav>
    <div class="mt-24"></div>
    <slot />
    <footer class="mt-8">
      <section class="container mx-auto md:px-8">
        <div class="flex flex-wrap justify-between border-t py-8 px-4">
          <NuxtImg src="/images/navloeLogo.png" alt="navloe logo" class="w-36 h-24" />
          <div class="footer-item">
            <h4>Menu</h4>
            <ul>
              <li>Beranda</li>
              <li>Daftar UMKM</li>
              <li>Produk & Jasa</li>
              <li>UMKM</li>
            </ul>
          </div>
          <div class="footer-item">
            <h4>Kategori UMKM</h4>
            <ul>
              <li>Fashion</li>
              <li>Mainan</li>
              <li>Teknologi</li>
              <li>Makanan & Minuman</li>
            </ul>
          </div>
          <div class="footer-item">
            <h4>Kontak Kami</h4>
            <ul>
              <li><Icon name="bx:bxs-phone" class="mr-2" />08980733556</li>
              <li><Icon name="bx:bxs-envelope" class="mr-2" />info@navloe.com</li>
              <li><Icon name="bxl:instagram-alt" class="mr-2" />@navloeofc</li>
            </ul>
          </div>
        </div>
      </section>
      <section class="bg-black text-white px-8">
        <div class="py-6 px-4 text-xs">Copyright &copy; 2023 by Navloe, All Right Reserved.</div>
      </section>
    </footer>
  </div>
</template>

<script setup>
  const searchKeyword = ref("")
  const showSearchResultBox = ref(false)
  const route = useRoute()

  onMounted(() => {
    searchKeyword.value = route.query.s || ""
    showSearchResultBox.value = false
    window.addEventListener('scroll', handleScroll);
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  const scrollY = ref(0);
  const isScrolledDown = ref(false);

  const handleScroll = () => {
    scrollY.value = window.scrollY;
    isScrolledDown.value = scrollY.value > 0;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const submitSearch = () => {
    navigateTo(`/pencarian?s=${searchKeyword.value}`)
    toggleShowSearchResultBox(false)
  }
  
  const toggleShowSearchResultBox = (value) => {
    if (!value) {
      setTimeout(() => {
        showSearchResultBox.value = value
      }, 500);
    } else {
      showSearchResultBox.value = value
    }
  }
</script>

<style lang="postcss" scoped>
  nav{
    @apply fixed top-0 left-0 z-50 !w-full !max-w-none bg-white mx-auto;
  }
  .footer-item{
    @apply relative mb-4 mx-4;
    h4 {
      @apply font-bold text-lg mb-2;
    }
    li {
      @apply my-2 text-slate-500 text-sm;
    }
  }
</style>
