<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-9 text-white">
        <q-toolbar-title> TODO APP </q-toolbar-title>
        <q-btn flat dense :to="{name:'join'}"> 회원가입 </q-btn>
        <q-btn flat dense :to="{name:'login'}"> 로그인 </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BlankLayout",
});
</script>

<style lang="scss">
</style>