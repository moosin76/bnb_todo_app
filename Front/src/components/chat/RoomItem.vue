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
            <q-item clickable @click="changPassword">
              <q-item-section>비밀번호 변경</q-item-section>
            </q-item>
            <q-item v-if="myRole == 'Master'" clickable @click="showManagerList" >
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
import chatApi from "src/apis/chatApi";

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
      this.$q
        .dialog({
          component: AdmUserList,
          componentProps: {
            rows: rows,
            role: this.myRole,
          },
          persistent: true,
        })
        .onOk(() => {
          console.log("ok");
        });
    },
    changPassword() {
      this.$q
        .dialog({
          title: "비밀번호 변경",
          message: "새로운 비밀번호를 입력하세요.",
          prompt: {
            model: "",
            type: "password", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk(async (password) => {
          // console.log(this.room.id, password);
          if (!password) {
            this.$q.notify({
              type: "negative",
              message: `비밀번호는 필수 입력입니다.`,
            });
            return;
          }
          const data = await chatApi.changePassword(this.room.id, password);
          if (data) {
            this.$q.notify({
              type: "info",
              message: `비밀번호가 변경되었습니다.`,
            });
          } else {
            this.$q.notify({
              type: "negative",
              message: `비밀번호 변경 실패`,
            });
          }
        });
    },
    showManagerList() {
      let rows = this.room.users.filter((user) => user.role == 'Manager' );

      this.$q
        .dialog({
          component: AdmUserList,
          componentProps: {
            rows: rows,
            role: this.myRole,
            delegate: true,
          },
          persistent: true,
        })
        .onOk(() => {
          console.log("ok");
        });
    },
  },
});
</script>

<style lang='scss' scoped>
</style>
