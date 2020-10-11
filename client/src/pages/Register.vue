<template>
  <q-page class="flex flex-center row">
    <div>
      <signup-component />
    </div>
  </q-page>
</template>

<script>
import signupComponent from '../components/signupComponent'

export default {
  name: 'Index',
  components: {
    signupComponent
  }
}
</script>
