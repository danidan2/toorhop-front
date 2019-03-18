<template>
  <div id="app">

    <main-menu></main-menu>
    
    <main>
      <transition name="fade">
        <router-view :key="$route.fullPath"></router-view>
      </transition>
    </main>
    
    <bottom></bottom>

  </div>
</template>

<script>

export default {
  name: 'app',
  metaInfo: {
    title: 'Toorhop Midtrans'
  }
}
</script>

<style lang="scss">  
  @import './styles/global';
  .fade-enter {
    transition-delay: 1s;
    transition: opacity 500ms !important;
    opacity: 0;
  }
  .fade-enter-to {
    transition: opacity 500ms !important;
    opacity: 1;
  }
  .fade-leave {
    transition: opacity 0s !important;
    opacity: 0;
  }
  .fade-leave-to {
    transition: opacity 0s !important;
    opacity: 0;
  }
</style>
