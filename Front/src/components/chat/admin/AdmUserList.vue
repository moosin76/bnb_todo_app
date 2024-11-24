<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 100%; max-width: 900px">
      <q-card-section class="row items-center">
        <div>회원관리</div>
        <q-space></q-space>
        <q-btn icon="mdi-close" dense round flat v-close-popup></q-btn>
      </q-card-section>
      <q-card-section>
        <q-table :rows="rows" :columns="columns">
          <template #body-cell-role="props">
            <q-td :props="props">
              <q-select
                :model-value="props.value"
                :options="roleOptions"
                @update:model-value="(value) => roleChange(value, props.row)"
                dense
                outlined
              ></q-select>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import socketApi from "src/apis/socketApi";
import useChat from "src/stores/useChat";
import { mapActions } from "pinia";

export default defineComponent({
  name: "AdmUserList",
  emits: ["ok", "hide"],
  props: {
    rows: { type: Array, required: true },
    role: { type: String, required: true },
  },
  data() {
    return {
      columns: [
        {
          name: "userId",
          label: "ID",
          field: "userId",
          sortable: true,
          align: "center",
        },
        {
          name: "userName",
          label: "이름",
          field: "userName",
          sortable: true,
          align: "center",
        },
        {
          name: "nickName",
          label: "별명",
          field: "nickName",
          sortable: true,
          align: "center",
        },
        {
          name: "role",
          label: "역활",
          field: "role",
          sortable: true,
          align: "center",
        },
        {
          name: "connected",
          label: "접속여부",
          field: "connected",
          sortable: true,
          align: "center",
          format: (val, row) => {
            return val ? "On" : "Off";
          },
          classes: (row) => {
            return row.connected
              ? "bg-green text-white text-weight-bold"
              : "bg-red text-white";
          },
        },
      ],
    };
  },
  computed: {
    roleOptions() {
      switch (this.role) {
        case "Master":
          return ["Manager", "User", "Block"];
        case "Manager":
          return [, "User", "Block"];
      }
    },
  },
  methods: {
    ...mapActions(useChat, ["userRoleChange"]),
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {
      this.$emit("hide");
    },
    onOKClick() {
      this.$emit("ok");
      this.hide();
    },
    onCancelClick() {
      this.hide();
    },
    roleChange(value, user) {
      console.log(value, user);

      this.$q
        .dialog({
          title: "회원 역활 변경",
          message: `${user.userName}님의 역활을 ${value}로 변경하시겠습니까?`,
          cancel: true,
        })
        .onOk(async () => {
          console.log("변경 확인!!!");
          //TODO: 변경 할거 확인 거치고
          // socket 서버에 변경을 요청하고
          // roomId userId role -> DB 업데이트하고, 다른 룸에 변경 알림
          try {
            const data = await socketApi.roleChange(
              user.roomId,
              user.userId,
              value
            );
            if (data) {
              this.userRoleChange(user.roomId, user.userId, value);
              this.$q.notify({
                type: "info",
                message: `${user.userName}님의 역활을 ${value}로 변경하였습니다.`,
              });
            }
          } catch (msg) {
            this.$q.notify({ type: "negative", message: msg });
          }

          // 변경 알림 오면 변경해주는데.
          // 일단 Block 이 팅겨야됨!!
        });
    },
  },
  mounted() {
    console.log(this.role, this.roleOptions);
  },
});
</script>

<style lang='scss' scoped>
</style>
