<template>
  <div style="max-height: 300px;width:500px">
    <q-card class="full-height">
    <div class="row items-center">
      <div class="text-h5 q-pa-md text-left text-bold">Your previous searches</div>
      <div class="col-auto">
        <q-btn color="primary" text-color="white" label="Reset" @click="resetTickers"/>
      </div>
    </div>
    <div v-if="items.length == 0" class="q-pa-md" style="height:200px">
      You need to search some items.
    </div>
    <div class="list scroll q-pa-md" style="height:200px">
      <q-list>
        <q-item
          v-for="item in items"
          :key="item"
          clickable
        >
          <q-item-section class="text-body text-bold">
            {{ item }}
          </q-item-section>
          <q-item-section side>
            <q-icon
              name="search"
              color="primary"
              @click="searchTicker(item)"
              class="cursor-pointer"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    </q-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'tweetsComponent',
  data () {
    return {
      loadingState: false
    }
  },
  computed: {
    items: {
      get () {
        return this.$store.state.searchHistory
      },
      set (payload) {
        this.$store.commit('updateSearchHistory', payload)
      }
    },
    stockTicker: {
      get () {
        return this.$store.state.stockTicker
      },
      set (payload) {
        this.$store.commit('updateStockTicker', payload)
      }
    },
    analysisResult: {
      get () {
        return this.$store.state.analysisResult
      },
      set (payload) {
        this.$store.commit('updateAnalysisResult', payload)
      }
    },
    tweets: {
      get () {
        return this.$store.state.tweets
      },
      set (payload) {
        this.$store.commit('updateTweets', payload)
      }
    }
  },
  methods: {
    resetTickers () {
      this.$store.commit('resetSearchHistory')
    },
    searchTicker (ticker) {
      this.stockTicker = ticker
      var promiseArr = []
      // updating loading state
      this.loadingState = true

      // 1st api call - analysis GET /api/analysis
      promiseArr.push(axios.get('api/analysis?ticker=' + this.stockTicker.toUpperCase()))
      // 2nd api call - tweets GET /api/tweets
      promiseArr.push(axios.get('api/tweets-detailed?ticker=' + this.stockTicker.toUpperCase()))

      Promise.all(promiseArr)
        .then((response) => {
          var analysisObj = {}
          // dealing with the first response
          analysisObj.negative = Math.round(response[0].data.sentiment.negative * 100)
          analysisObj.positive = Math.round(response[0].data.sentiment.positive * 100)
          analysisObj.neutral = Math.round(response[0].data.sentiment.neutral * 100)
          this.analysisResult = analysisObj

          // dealing with the second response
          this.tweets = response[1].data
        })
        .catch((error) => {
          this.notifyError(error)
        })
        .finally(() => {
          this.loadingState = false
          this.$router.push('/analysis')
        })
    }
  }
}
</script>
