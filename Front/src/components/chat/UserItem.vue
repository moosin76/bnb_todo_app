<template>
  <q-item>
    <q-item-section avatar>
      <q-icon name="mdi-circle" :color="statusColor"></q-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label overline>{{ user.userName }}</q-item-label>
      <q-item-label>{{ user.nickName }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserItem",
  props: {
    user: { type: Object, required: true },
  },
  data() {
    return {};
  },
  computed: {
    status() {
      if (this.user.blocked) {
        return "block";
      } else if (this.user.connected) {
        return "online";
      } else {
        return "offline";
      }
    },
    statusColor() {
      switch (this.status) {
        case "block":
          return "red";
        case "online":
          return "green";
        case "offline":
          return "grey";
      }
    },
  },
});
</script>

<style lang='scss' scoped>
</style>