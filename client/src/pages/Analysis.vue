<template>
  <q-page>
    <div class="row justify-center q-py-md">
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="home"
          label="Go Home"
          to="/"
        />
      </div>
    </div>
    <div class="row flex flex-center">
      <div class="col-4 q-px-md">
        <tweets-component />
      </div>
      <div class="col-6 q-px-md">
        <chart-component />
      </div>
    </div>
  </q-page>
</template>

<script>
import tweetsComponent from '../components/tweetsComponent'
import chartComponent from '../components/chartComponent'

export default {
  name: 'Analysis',
  components: {
    tweetsComponent,
    chartComponent
  }

}
</script>
