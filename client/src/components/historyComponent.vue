<template>
  <div style="max-height: 300px;width:500px">
    <q-card class="full-height">
      <div class="row items-center">
        <div class="text-h3 q-pa-md text-left text-bold">Your Tickers</div>
        <div class="col-auto">
          <q-btn
            color="primary"
            text-color="white"
            label="Add Ticker"
            @click="dialog = true"
          />
          <q-dialog v-model="dialog">
            <q-card>
              <div class="q-pa-md row items-center">
                <div
                  v-if="loadingState"
                  class="col"
                  style="width:500px; height:300px"
                >
                  <loading />
                </div>
                <div class="col" style="width:500px" v-if="!loadingState">
                  <div class="text-h5 text-bold">
                    Click on a ticker
                  </div>
                  <div class="q-py-md">
                    <q-table
                      color="primary"
                      style="height:300px"
                      :data="stockTickerSearch"
                      :columns="stockTickerColumns"
                      row-key
                      virtual-scroll
                      :virtual-scroll-item-size="48"
                      @request="searchTickerQuery"
                      @row-click="rowClick"
                    />
                  </div>
                </div>
              </div>
            </q-card>
          </q-dialog>
        </div>
      </div>
      <div v-if="tickers.length == 0" class="q-pa-md" style="height:200px">
        You need to search some tickers. Click Add Ticker.
      </div>
      <div class="list scroll q-pa-md" style="height:200px">
      <q-list>
        <q-item
          v-for="ticker in tickers"
          :key="ticker.ticker"
          clickable
        >
          <q-item-section class="text-body text-bold">
            {{ ticker.ticker }}
          </q-item-section>
          <q-item-section side>
            <q-icon
              name="edit"
              color="primary"
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
import loading from './loading'
import axios from 'axios'
export default {
  name: 'historyComponent',
  components: {
    loading
  },
  data () {
    return {
      items: [],
      dialog: false,
      tickers: [],
      loadingState: false,
      stockTickerSearch: [],
      stockTickerColumns: [
        {
          name: 'symbol',
          required: true,
          label: 'Ticker',
          field: row => row.symbol,
          align: 'left',
          sortable: false
        },
        {
          name: 'description',
          required: true,
          label: 'Description',
          field: row => row.description,
          align: 'left',
          sortable: false
        },
        {
          name: 'exchange',
          required: true,
          label: 'Exchange',
          field: row => row.exchange,
          align: 'left',
          sortable: false
        }
      ]
    }
  },
  methods: {
    addTickers () {
      // make an axios call, update the chart data
    },
    updateTicker (ticker, exchange) {
      this.tickers.push({ ticker: ticker, exchange: exchange })
      console.log(this.tickers)
    },
    searchTickerQuery (ticker) {
      axios
        .get('api/tradingview/search-ticker?ticker=' + ticker)
        .then(response => {
          this.stockTickerSearch = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    rowClick (evt, row) {
      this.tickers.push({ ticker: row.symbol, exchange: row.exchange })
      console.log(this.tickers)
      axios.post('api/ticker/current-ticker', {
        ticker: row.symbol,
        exchange: row.exchange
      }).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.dialog = false
      })
    }
  },
  mounted () {
    // on mounted, it needs to go out and fetch the current tickers from the database
    this.loadingState = true
    axios
      .get('api/tradingview/search-top-tickers')
      .then(response => {
        this.stockTickerSearch = response.data
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.loadingState = false
      })
  }
}
</script>
