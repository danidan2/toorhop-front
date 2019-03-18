<template>
  <div class="text-xs-center">
    <v-dialog v-model="showModal" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card class="elevation-0">
        <v-toolbar color="grey lighten-2" height="70px" card>
          <v-btn icon @click="onClose">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-toolbar>

        <v-stepper alt-labels class="elevation-0" v-model="e1">
          <v-stepper-header class="elevation-0">
            <v-stepper-step :complete="e1 > 1" step="1">
              <small>Choose your payment</small>
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2">
              <small>Payment summary</small>
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">
              <small>Complete order</small>
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-list two-line style="margin-top: -20px;">
                <template v-for="item in payments">
                  <v-list-tile :key="item.title" avatar @click="toSummary(item)">
                    <v-list-tile-avatar>
                      <img :src="getLogo(item.logo)">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.name"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="item.description"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-list>
            </v-stepper-content>

            <v-stepper-content step="2">
              <div v-if="e1 === 2">
                <v-layout
                  row
                  wrap
                  v-if="currentPayment && currentPayment.slug !== 'credit-card'"
                  class="mb-4"
                >
                  <v-flex xs6>
                    <span class="grey--text">OrderId</span>
                    <div class="headline">{{ orderDetail.order_id }}</div>
                  </v-flex>
                  <v-flex xs6>
                    <span class="grey--text">Amount (IDR)</span>
                    <div class="headline">{{ getAmount() }}</div>
                  </v-flex>
                  <v-flex
                    v-if="currentPayment && currentPayment.instructions && currentPayment.instructions.length"
                    class="mt-4"
                    xs12
                  >
                    <v-tabs align-with-title color="grey lighten-2">
                      <v-tabs-slider color="primary"/>
                      <v-tab
                        v-for="p in currentPayment.instructions"
                        :key="p.id"
                        :href="generateLink(p.name)"
                      >{{ p.name }}</v-tab>

                      <v-tab-item
                        v-for="p in currentPayment.instructions"
                        :key="p.id"
                        :value="generateTarget(p.name)"
                      >
                        <v-card flat>
                          <v-card-text v-html="p.content"></v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs>
                    <div>
                      <v-btn @click="toChoose">Back</v-btn>
                      <v-btn color="primary" @click="process" :loading="loading">Process</v-btn>
                    </div>
                  </v-flex>
                </v-layout>
                <v-layout
                  row
                  wrap
                  v-if="currentPayment && currentPayment.slug === 'credit-card'"
                  class="mb-4"
                >
                  <v-flex xs6 class="mx-2">
                    <label>Card Number</label>
                    <input type="text" v-model="cardNumber">
                  </v-flex>
                  <v-flex xs6 class="mx-2">
                    <label>Card CVV</label>
                    <input type="text" v-model="cardCvv" size="4">
                  </v-flex>
                  <v-flex xs6 class="mx-2">
                    <label>Expiration (Month)</label>
                    <input type="text" v-model="expMonth" size="2">
                  </v-flex>
                  <v-flex xs6 class="mx-2">
                    <label>Expiration (Year)</label>
                    <input type="text" v-model="expYear" size="4">
                  </v-flex>
                  <v-flex xs12>
                    <v-btn>Process</v-btn>
                  </v-flex>
                </v-layout>
              </div>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-layout row wrap v-if="e1 === 3" class="mb-4">
                <v-flex xs6>
                  <span class="grey--text">OrderId</span>
                  <div class="headline">{{ orderDetail.order_id }}</div>
                </v-flex>
                <v-flex xs6>
                  <span class="grey--text">Amount (IDR)</span>
                  <div class="headline">{{ getAmount() }}</div>
                </v-flex>
                <v-flex xs12 class="mt-4">
                  <span class="grey--text">Va Number</span>
                  <div class="headline">{{ vaNumber }}</div>
                </v-flex>
                <v-flex xs12 class="mt-4">
                  <span class="grey--text">Please complete payment before:</span>
                  <div class="headline">{{ getExpiry() }}</div>
                </v-flex>

                <v-flex
                  v-if="currentPayment && currentPayment.instructions && currentPayment.instructions.length"
                  class="mt-4"
                  xs12
                >
                  <v-tabs align-with-title color="grey lighten-2">
                    <v-tabs-slider color="primary"/>
                    <v-tab
                      v-for="p in currentPayment.instructions"
                      :key="p.id"
                      :href="generateLink(p.name)"
                    >{{ p.name }}</v-tab>

                    <v-tab-item
                      v-for="p in currentPayment.instructions"
                      :key="p.id"
                      :value="generateTarget(p.name)"
                    >
                      <v-card flat>
                        <v-card-text v-html="p.content"></v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs>
                  <div>
                    <v-btn @click="onClose">Close</v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import { MIDTRANS_PAYMENT_URL } from '../lib/constants.js'
import { setHeaders, getVa } from '../lib'
import changeCase from 'change-case'
import moment from 'moment'

export default {
  data () {
    return {
      title: 'Choose your payment',
      showModal: false,
      payments: [],
      currentPayment: null,
      e1: 0,
      tabActive: null,
      currentResponse: null,
      vaNumber: null,
      loading: false,
      cardNumber: '4811 1111 1111 1114',
      cardCvv: '123',
      expMonth: '01',
      expYear: '20'
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    orderDetail: {
      type: Object,
      required: false,
      default: {}
    }
  },
  watch: {
    show () {
      this.showModal = this.show
    }
  },

  mounted () {
    this.getPayments()
  },

  methods: {
    async getPayments () {
      try {
        const headers = await setHeaders()
        const resp = await axios
          .get(`${MIDTRANS_PAYMENT_URL}/midtrans-payment-list`, { headers })
          .then(res => res.data)
        if (resp.meta.status === 200) {
          this.payments = resp.data
        }
      } catch (e) {
        console.log('e', e)
        this.cancel()
      }
    },
    getLogo (logo) {
      if (logo && logo !== '') return logo
      else return '/static/images/brokenimage.png'
    },
    toChoose () {
      this.e1 = 1
      this.title = 'Choose Your Payment'
    },
    toSummary (p) {
      this.currentPayment = p
      this.e1 = 2
      this.title = 'Payment Summary'
    },
    getAmount () {
      let total = 0
      this.orderDetail.item_details.map(
        item => (total += item.price * item.quantity)
      )
      return total.toLocaleString()
    },
    async process () {
      try {
        this.loading = true
        const headers = await setHeaders()
        this.orderDetail.midtrans_payment_id = this.currentPayment.id
        const resp = await axios
          .post(`${MIDTRANS_PAYMENT_URL}/midtrans-charge`, this.orderDetail, {
            headers
          })
          .then(res => res.data)
        if (resp.meta.status === 200) {
          this.currentResponse = resp.data
          this.vaNumber = getVa(this.currentPayment.bank, this.currentResponse)
          this.e1 = 3
          this.title = 'Complete Order'
        }
        this.loading = false
      } catch (e) {
        console.log('e', e.response)
        this.loading = false
      }
    },

    getExpiry () {
      // Set expiry in accordance with you midtrans setting in midtrans dashboard
      // This expiry setting is just for user info, not the real expiry
      // Expiry setting can be set at midtrans dashboard
      const now = moment()
      now.add(1, 'days')
      return now.format('D MMMM YYYY HH:mm')
    },
    onClose () {
      this.toChoose()
      this.$emit('onClose')
    },
    generateLink (text) {
      return '#' + changeCase.snakeCase(text)
    },
    generateTarget (text) {
      return changeCase.snakeCase(text)
    }
  }
}
</script>

<style scoped>
.ivu-cell-title {
  text-align: center;
}
</style>
