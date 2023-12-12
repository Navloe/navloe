<template>
  <div>
    <nav>
      <nuxt-img src="/images/navloeLogo.png" class="w-12" />
      <button class="bg-white py-3 px-6 text-sm text-black border border-primary">Kategori</button>
      <div class="relative w-full">
        <input type="text" class="h-11 w-full border border-slate-400" />
        <Icon name="material-symbols:search-rounded" class="absolute top-1/2 right-4 transform -translate-y-1/2" />
      </div>
      <nuxt-link to="/auth/daftar-umkm" class="bg-primary py-3 px-6 h-11 text-sm text-white border border-primary whitespace-nowrap">
        Daftar UMKM
      </nuxt-link>
      <nuxt-link to="/auth/daftar-umkm" class="!text-slate-600 h-11 flex whitespace-nowrap items-center text-sm">
        <Icon name="material-symbols:favorite" color="gray" class="text-lg mr-2" />
        Favorite
      </nuxt-link>
    </nav>
    <slot />
    <footer class="mt-8">
      <section class="container mx-auto px-8">
        <div class="flex justify-between border-t py-8 px-4">
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
</script>

<style lang="postcss" scoped>
  nav{
    @apply container mx-auto flex justify-evenly items-center py-6 px-8 gap-8;
  }
  .footer-item{
    @apply relative;
    h4 {
      @apply font-bold text-lg mb-2;
    }
    li {
      @apply my-2 text-slate-500 text-sm;
    }
  }
</style>
