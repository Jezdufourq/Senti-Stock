<template>
  <div>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="col row text-h2 text-bold">
          <div>Sign Up.</div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="signUp.name"
            name="name"
            label="name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-input
            filled
            v-model="signUp.email"
            name="email"
            label="email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-input
            label="password"
            v-model="signUp.password"
            filled
            :type="isPwd ? 'password' : 'text'"
            hint="Please enter a password"
            :rules="[ val => val && val.length > 6 || 'Password must be longer than 6 characters']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            label="re-enter password"
            v-model="signUp.password2"
            filled
            :type="isPwd ? 'password' : 'text'"
            hint="Re-enter the same password"
            :rules="[ val => val && val.length > 6 || 'Password must be longer than 6 characters']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div class="items-between">
            <q-btn
              label="Sign Up"
              type="submit"
              color="primary"
            />
            <q-btn
              label="Go Back To Login"
              color="primary"
              to='/'
            />
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'signupComponent',
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
      axios.post('api/users/register', this.signUp)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
