<template>
  <div>
    <q-card>
      <div class="q-pa-md row items-center">
        <div v-if="loadingState" class="col" style="width:500px; height:300px">
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
  </div>
</template>

<script>
import axios from 'axios'
import loading from './loading'
export default {
  name: 'searchComponent',
  components: {
    loading
  },
  data () {
    return {
      loadingState: false,
      stockTicker: null,
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
      this.stockTicker = row.symbol
      this.exchangeSymbol = row.exchange
      console.log(this.stockTicker)
      console.log(this.exchangeSymbol)
    }
  },
  mounted () {
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
