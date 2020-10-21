<template>
  <div class="row">
    <div class="col-auto q-pa-md">
      <div style="width:500px">
        <q-card class="full-height">
          <div class="row items-center">
            <div class="text-h3 q-pa-md text-left text-bold">Your Tickers</div>
            <div class="col-auto">
              <q-btn color="primary" text-color="white" label="Add Ticker" @click="dialog = true" />
              <q-dialog v-model="dialog">
                <q-card>
                  <div class="q-pa-md row items-center">
                    <div v-if="loadingState" class="col" style="width:500px; height:300px">
                      <loading />
                    </div>
                    <div class="col" style="width:500px" v-if="!loadingState">
                      <div class="text-h5 text-bold">Click on a ticker</div>
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
          <div
            v-if="currentStockTickers.length === 0"
            class="q-pa-md"
            style="height:200px"
          >You need to search some tickers. Click Add Ticker.</div>
          <div class="list scroll q-pa-md" style="height:200px">
            <q-list>
              <q-item v-for="ticker in currentStockTickers" :key="ticker.ticker_id" clickable>
                <q-item-section class="text-body text-bold">{{ ticker.ticker }}</q-item-section>
                <q-item-section class="text-body text-bold">{{ ticker.exchange }}</q-item-section>
                <q-item-section side>
                  <q-icon name="delete" color="red" class="cursor-pointer" @click="deleteTicker(ticker.ticker_id)"/>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card>
      </div>
    </div>
    <div class="col-auto q-pa-md">
      <q-card class="q-pa-md full-height    ">
        <q-card-section>
          <div class="text-h3 q-pa-md text-left text-bold">Your Chart</div>
          <q-btn color="primary" text-color="white" label="Analyze Tickers" @click="analyzeTickers()" />
        </q-card-section>
        <q-card-section>
          <div class="small">
            <line-chart :chart-data="datacollection" :options="options"></line-chart>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import LineChart from './LineChart.js'
import axios from 'axios'

export default {
  name: 'landingComponent',
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null,
      currentTickers: [],
      chartData: [],
      options: {
        gridLines: {
          display: true
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              distribution: 'series',
              time: {
                unit: 'day',
                displayFormats: {
                  quarter: 'hA D MMM YYYY'
                }
              }
            }
          ]
        }
      },
      items: [],
      dialog: false,
      loadingState: false,
      currentStockTickers: null,
      stockTickerSearch: [],
      tickers: [],
      stockTickerColumns: [
        {
          name: 'symbol',
          required: true,
          label: 'Ticker',
          field: (row) => row.symbol,
          align: 'left',
          sortable: false
        },
        {
          name: 'description',
          required: true,
          label: 'Description',
          field: (row) => row.description,
          align: 'left',
          sortable: false
        },
        {
          name: 'exchange',
          required: true,
          label: 'Exchange',
          field: (row) => row.exchange,
          align: 'left',
          sortable: false
        }
      ]
    }
  },
  mounted () {
    // on mounted, it needs to go out and fetch the current tickers from the database
    this.loadingState = true
    this.resetData()
    axios
      .get('api/ticker/current-tickers')
      .then((response) => {
        console.log(response)
        this.currentStockTickers = response.data.tickers
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {})
    axios
      .get('api/tradingview/search-top-tickers')
      .then((response) => {
        this.stockTickerSearch = response.data
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.loadingState = false
      })

    this.fillData()
    // when chart is mounted, it should pull the data from the serve

    // this.currentTickers.forEach((ticker) => {
    //   promiseArr.push(axios.get(`api/tweets/analysis/$${ticker}`))
    // })
  },
  methods: {
    analyzeTickers () {

    },
    resetData () {
      this.currentStockTickers = []
    },
    fillData () {
      this.datacollection = {
        datasets: [
          {
            label: 'Data One',
            borderColor: '#00A2BF',
            fill: false,
            data: [
              {
                t: new Date(2020, 10, 10, 10, 10, 10, 10),
                y: this.getRandomInt()
              },
              {
                t: new Date(2020, 10, 11, 10, 10, 10, 10),
                y: this.getRandomInt()
              }
            ]
          },
          {
            label: 'Data One',
            borderColor: '#f87979',
            fill: false,
            data: [
              {
                t: new Date(2020, 10, 10, 10, 10, 10, 10),
                y: this.getRandomInt()
              },
              {
                t: new Date(2020, 10, 11, 10, 10, 10, 10),
                y: this.getRandomInt()
              }
            ]
          }
        ]
      }
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
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
        .then((response) => {
          this.stockTickerSearch = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    rowClick (evt, row) {
      this.tickers.push({ ticker: row.symbol, exchange: row.exchange })
      console.log(this.tickers)
      axios
        .post('api/ticker/current-ticker', {
          ticker: row.symbol,
          exchange: row.exchange
        })
        .then((response) => {
          this.currentStockTickers = response.data
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.dialog = false
        })
    },
    deleteTicker (tickerId) {
      console.log(tickerId)
      axios.delete(`api/ticker/delete-ticker/${tickerId}`)
        .then((response) => {
          this.currentStockTickers = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
