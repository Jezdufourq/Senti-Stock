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
    </div>
  </q-page>
</template>

<script>
import tweetsComponent from '../components/tweetsComponent'

export default {
  name: 'Analysis',
  components: {
    tweetsComponent
  }

}
</script>
