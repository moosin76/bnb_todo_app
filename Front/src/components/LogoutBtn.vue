<template>
  <q-item clickable @click="logout">
    <q-item-section> 
			<slot></slot>
		</q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
import userApi from "src/apis/userApi";
import { mapState } from "pinia";
import useUser from "src/stores/useUser";

export default defineComponent({
  name: "LogoutBtn",
  data() {
    return {};
  },
  computed: {
    ...mapState(useUser, ["user"]),
  },
  methods: {
    logout() {
      const userName = this.user.userName;
      if (userApi.logout()) {
        this.$q.notify({
          type: "info",
          message: `${userName}님 로그아웃 하셧습니다.`,
        });
        this.$router.push({ name: "help" });
      }
    },
  },
});
</script>

<style lang='scss' scoped>
</style>