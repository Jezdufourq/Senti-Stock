<template>
  <q-page class="row">
    <div class="col-auto q-pa-md">
      <history-component />
    </div>
    <div class="col-auto q-pa-md">
      <chart-component />
    </div>
  </q-page>
</template>

<script>
import chartComponent from '../components/chartComponent'
import historyComponent from '../components/historyComponent'

export default {
  name: 'Index',
  components: {
    chartComponent,
    historyComponent
  }
}
</script>
