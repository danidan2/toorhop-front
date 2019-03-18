// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import Vuelidate from 'vuelidate'
import * as firebase from 'firebase'
import Toasted from 'vue-toasted'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment-timezone'
import VueMomentJS from 'vue-momentjs'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import App from './App'
import router from './router'
import { db } from './firebase'
import { store } from './store'
import i18n from './lang'
import * as VueGoogleMaps from 'vue2-google-maps'
import Meta from 'vue-meta'
import VueLazyload from 'vue-lazyload'
import VueCookies from 'vue-cookies'
import VueScrollTo from 'vue-scrollto'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)
moment.tz.setDefault('Asia/Jakarta')

Vue.use(VueScrollTo)
Vue.use(VueLazyload)
Vue.use(Vuelidate)
Vue.use(VueFire)
Vue.use(Toasted, {
  position: 'bottom-center',
  duration: 3000,
  iconPack: 'fontawesome'
})
Vue.use(flatPickr)
Vue.use(VCalendar)
Vue.use(VueMomentJS, moment)
Vue.use(Meta)
Vue.use(i18n)
Vue.use(VueCookies)
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_MAPS_API_KEY,
    libraries: 'places'
  }
})
Vue.config.productionTip = false

Vue.mixin({
  data: function () {
    return {
      get imgixDomain () {
        return process.env.IMGIX_DOMAIN
      },
      get googleMapsApiKey () {
        return process.env.GOOGLE_MAPS_API_KEY
      },
      get stripePublicKey () {
        return process.env.STRIPE_PUBLIC_KEY
      }
    }
  },
  methods: {
    getTourStatus: function (tour) {
      if (tour.ready === true) {
        return 'ready'
      }
      if (tour.active === true) {
        return 'active'
      }
      if (tour.reviewing === true) {
        return 'reviewing'
      }
      return 'draft'
    },
    timeAgo (date) {
      var t = new Date(date)
      return this.$moment(t, 'YYYYMMDD').fromNow()
    },
    moment (date, format) {
      if (date === null) {
        return this.$moment().format(format)
      } else {
        var t = new Date(date)
        return this.$moment(t).format(format)
      }
    },
    dateIgnoreTime (date, format) {
      if (!date) {
        return this.$moment().format(format)
      } else {
        return this.$moment(date.substring(0, 10)).format(format)
      }
    },
    timestamp (date) {
      return this.$moment(date).format('x')
    },
    getTourTime: function (tour) {
      let startTime =
        parseInt(tour.startTime.hh) +
        ':' +
        tour.startTime.mm +
        ' ' +
        tour.startTime.a
      let endTime = this.getTourEndTime(tour)
      return startTime + '–' + endTime
    },
    getTourEndTime: function (tour) {
      let hh = parseInt(tour.startTime.hh)
      let mm = tour.startTime.mm
      if (tour.startTime.a === 'pm') {
        hh += 12
      }
      let startTime = hh + ':' + mm + ':00'
      return this.$moment('1980-12-25 ' + startTime)
        .add(tour.duration, 'hours')
        .format('h:mm a')
    },
    getTourDuration: function (tour) {
      if (tour.duration < 24) {
        return tour.duration
      }
      return Math.ceil(tour.duration / 24)
    },
    getTourDurationType: function (tour) {
      if (tour.duration < 24) {
        return tour.duration > 1 ? 'hours' : 'hour'
      }
      let duration = this.getTourDuration(tour)
      return duration === 1 ? 'day' : 'days'
    },
    getTourPricePerType: function (tour) {
      let durationType = this.getTourDurationType(tour)
      return durationType === 'day' || durationType === 'days'
        ? 'per day'
        : 'per person'
    },
    getTourPricePerDurationType: function (tour) {
      if (tour.duration < 24) {
        return tour.costAdult
      } else {
        let duration = this.getTourDuration(tour)
        return Math.ceil(tour.costAdult / duration)
      }
    },
    getTourDurationDays: function (tour) {
      if (!tour.duration) {
        return 1
      }
      if (tour.duration < 24) {
        return 1
      }
      return Math.ceil(tour.duration / 24)
    },
    inArray: function (needle, haystack) {
      for (var i in haystack) {
        if (haystack[i] === needle) {
          return true
        }
      }
      return false
    },
    getMailerParams: function (type, data) {
      var params = {}
      if (
        type === 'guide' ||
        type === 'traveler' ||
        type === 'to' ||
        type === 'from'
      ) {
        params = {
          fullName: data.fullName,
          email: data.email,
          '.key': data['.key']
        }
        var personImage = null
        if (data.photoURL) {
          personImage = data.photoURL
        }
        if (personImage) {
          params.image = 'https:' + personImage
        }
        if (data.background) {
          params.background = data.background
        }
      } else if (type === 'booking') {
        params = {
          requestedDate: data.requestedDate,
          adults: data.adults,
          tourKey: data.tourKey,
          bookingKey: data['.key'],
          '.key': data['.key']
        }
        if (data.fees) {
          params.fees = data.fees
        }
      } else if (type === 'tour') {
        params = {
          name: data.name,
          startTime:
            data.startTime.hh +
            ':' +
            data.startTime.mm +
            ' ' +
            data.startTime.a,
          tourKey: data['.key'],
          '.key': data['.key']
        }
        if (data.tourKey) {
          params.tourKey = data.tourKey
        }
        var tourImage = null
        if (data.images && data.images[0].source === 'unsplash') {
          tourImage = data.images[0].urls.regular
        } else if (data.images) {
          tourImage =
            'https:' +
            this.imgixDomain +
            data.images[0].fullPath +
            '?w=1024&fit=crop'
        }
        if (tourImage) {
          params.image = tourImage
        }
      } else if (type === 'request') {
        params = {
          requestedDate: data.requestedDate,
          adults: data.adults,
          tourKey: data.tourKey,
          requestKey: data['key'],
          '.key': data['key']
        }
      }
      return params
    },
    isFileAnImage: function (file) {
      return (
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/gif'
      )
    },
    formatNumberToUserCurrency: function (options) {
      var currencyToUse = this.$store.getters.defaultCurrency
      if (options.toCurrency !== undefined) {
        currencyToUse = options.toCurrency
      }
      if (currencyToUse) {
        var amount = options.amount
        if (currencyToUse === 'USD') {
          if (options.noDecimals === undefined) {
            return new Intl.NumberFormat('EN', {
              style: 'currency',
              currency: 'USD'
            }).format(amount)
          } else {
            return '$' + amount
          }
        }
        if (currencyToUse === 'JPY') {
          amount = amount * this.$store.getters.currencyConversions.USDJPY
          return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
          }).format(amount)
        }
        if (currencyToUse === 'IDR') {
          amount = amount * this.$store.getters.currencyConversions.USDIDR
          return new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(amount)
        }
        if (currencyToUse === 'AUD') {
          amount = amount * this.$store.getters.currencyConversions.USDAUD
          return new Intl.NumberFormat('AU', {
            style: 'currency',
            currency: 'AUD'
          }).format(amount)
        }
      } else {
        return '$' + amount
      }
    },
    replaceNewlines: function (text) {
      return text.replace(/\n/g, '<br />')
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  db,
  template: '<App/>',
  components: {
    App
  },
  created () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        store.dispatch('setUser', user)
      }
    })
  },
  watch: {
    $route (to, from) {
      db.ref('currencies').on('value', snapshot => {
        store.dispatch('setCurrencyConversions', snapshot.val())
      })
    }
  }
})
