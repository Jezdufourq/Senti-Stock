<template>
  <div>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="col row text-h2 text-bold">
          <div>Welcome.</div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="email"
            name="email"
            label="email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-input
            filled
            v-model="password"
            name="password"
            label="password"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

        </q-form>
      </q-card-section>
      <q-card-section>
        <div class="items-between">
          <q-btn
            label="SignUp"
            color="primary"
            to='/register'
          />
          <q-btn
            label="Login"
            type="submit"
            color="primary"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  name: 'loginComponent',
  data () {
    return {
      email: null,
      password: null
    }
  },
  methods: {
    onSubmit () {
    }
  }
}
</script>
