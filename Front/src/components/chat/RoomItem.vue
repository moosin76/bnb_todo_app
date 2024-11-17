<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ room.name }}</q-item-label>
      <q-item-label caption>{{ room.desc }}</q-item-label>
    </q-item-section>
    <q-item-section v-if="isAdmin" side>
      <q-btn icon="mdi-cog" dense round flat @click.stop="null">
        <q-menu>
          <q-list separator>
            <q-item clickable @click="showMemberList">
              <q-item-section>회원관리</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>비밀번호 변경</q-item-section>
            </q-item>
            <q-item v-if="myRole == 'Master'">
              <q-item-section>방 위임</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState } from "pinia";
import { defineComponent } from "vue";
import useUser from "stores/useUser";
import AdmUserList from "components/chat/admin/AdmUserList.vue";

export default defineComponent({
  name: "RoomItem",
  props: {
    room: { type: Object, required: true },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(useUser, ["user"]),
    myRole() {
      const find = this.room.users.find((user) => user.userId == this.user.id);
      if (find) {
        return find.role;
      }
    },
    isAdmin() {
      return this.myRole == "Master" || this.myRole == "Manager";
    },
  },
  methods: {
    showMemberList() {
      let rows = [];
      switch (this.myRole) {
        case "Master":
          rows = this.room.users.filter((user) => user.userId != this.user.id);
          break;
        case "Manager":
          rows = this.room.users.filter(
            (user) => user.role == "User" || user.role == "Block"
          );
          break;
      }
      this.$q.dialog({
        component: AdmUserList,
        componentProps: {
          rows: rows,
          role: this.myRole,
        },
        persistent: true,
      }).onOk(()=>{
        console.log('ok');
      });
    },
  },
});
</script>

<style lang='scss' scoped>
</style>
