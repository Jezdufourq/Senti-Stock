<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-white">
      <div class="column items-center">
        <div class="col row text-h2 text-bold">
          <div class="text-primary">Senti</div>
          <div class="text-black">Stock</div>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-white q-pa-md">
      <div class="row justify-between">
        <div class="col-auto text-body text-black">Designed by Jeremiah Dufourq</div>
        <div class="col-auto text-body text-black">v1.0</div>
      </div>
    </q-footer>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
