<template>
  <q-item >
    <q-item-section>
      <q-item-label>{{ room.name }}</q-item-label>
      <q-item-label caption>{{ room.desc }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "RoomItem",
  props: {
    room: { type: Object, required: true },
  },
  data() {
    return {};
  },
});
</script>

<style lang='scss' scoped>
</style>