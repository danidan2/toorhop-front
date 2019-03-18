<template>
  <div class="grid-container">

    <div class="grid-x grid-padding-x">
      <div class="cell medium-offset-3 medium-6">    
        <h1>Whoops!</h1>
        <div class="grid-x grid-padding-x">
          <div class="cell medium-8">
            <p>We can't find the page you’re looking for.</p>
            <p>Error code: 404</p>
            <p>Here are some helpful links:<br>
            <router-link to="/tours">Search Toors</router-link><br>
            <router-link to="/faq">FAQ</router-link><br>
            <router-link to="/">Become a Guide</router-link>
            </p>
          </div>
          <div class="cell medium-4 hide-for-small-only">
            <img src="/static/img/sad-bunny.png" alt="">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'help',
  data () {
    return {
      title: 'TOOR'
    }
  }
}
</script>

<style lang="scss" scoped>
label {
  @include breakpoint(medium) {
    text-align: right;
  }
}
</style>
