<template>
  <div>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="col row text-h2 text-bold">
          <div>Sign Up.</div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md" @submit="onSubmit">
          <q-input
            v-model="signUp.name"
            filled
            name="name"
            label="name"
            hint="Please enter your name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            v-model="signUp.email"
            filled
            name="email"
            type="email"
            label="email"
            hint="Please enter your email"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            v-model="signUp.password"
            label="password"
            filled
            :type="isPwd ? 'password' : 'text'"
            hint="Please enter a password"
            :rules="[
              val =>
                (val && val.length > 6) ||
                'Password must be longer than 6 characters'
            ]"
          >
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            v-model="signUp.password2"
            label="re-enter password"
            filled
            :type="isPwd ? 'password' : 'text'"
            hint="Re-enter the same password"
            :rules="[
              val =>
                (val && val.length > 6) ||
                'Password must be longer than 6 characters'
            ]"
          >
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div class="items-between">
            <q-btn label="Sign Up" type="submit" color="primary" />
            <q-btn label="Go Back To Login" color="primary" to="/" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'SignupComponent',
  data () {
    return {
      signUp: {
        email: null,
        password: null,
        password2: null,
        name: null
      },
      isPwd: true
    }
  },
  methods: {
    onSubmit () {
      if (this.signUp.password !== this.signUp.password2) {
        // validation for passwords
        this.$q.notify({
          color: 'negative',
          message: 'Your passwords need to match'
        })
      } else {
        axios
          .post('api/users/register', this.signUp)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
          .finally(() => {
            this.$q.notify({
              color: 'positive',
              textColor: 'white',
              message:
                'Your application has been submitted! Sign in with your email and password'
            })
            // resetting signUp obj
            this.signUp.name = null
            this.signUp.password = null
            this.signUp.password2 = null
            this.signUp.email = null
            this.$router.push('/')
          })
      }
    }
  }
}
</script>
