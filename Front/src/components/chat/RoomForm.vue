<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="max-width: 400px; width: 100%">
      <div class="row bg-grey-3 q-pa-md">
        <div class="text-h4">Room Create</div>
        <q-space></q-space>
        <q-btn icon="mdi-close" round flat @click="hide"></q-btn>
      </div>
      <q-form @submit="save">
        <q-card-section>
          <q-input
            label="이름"
            v-model="form.name"
            :rules="[(v) => !!v || 'required Field!']"
          ></q-input>
          <q-input
            label="설명"
            v-model="form.desc"
            :rules="[(v) => !!v || 'required Field!']"
          ></q-input>
          <div class="row items-center">
            <div class="cursor-pointer" @click="privateRoom = !privateRoom">
              공개
            </div>
            <q-toggle label="비공개" v-model="privateRoom">
              <template #before>공개</template>
            </q-toggle>
            <q-input
              v-if="privateRoom"
              label="비밀번호"
              v-model="form.password"
              class="q-ml-md col-grow"
              :rules="[(v) => !!v || 'required Field!']"
            ></q-input>
          </div>
          <q-input
            label="Category"
            v-model="form.category"
            :rules="[(v) => !!v || 'required Field!']"
          ></q-input>
        </q-card-section>
        <q-card-actions>
          <q-btn @click="hide">Cancel</q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">Save</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import chatApi from "src/apis/chatApi";

export default defineComponent({
  name: "RoomForm",
  emits: ["created"],
  data() {
    return {
      dialog: true,
      privateRoom: false,
      form: {
        name: "",
        desc: "",
        password: "",
        category: "",
      },
    };
  },
  watch: {
    privateRoom() {
      if (!this.privateRoom) {
        this.form.password = "";
      }
    },
  },
  methods: {
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
    async save() {
      this.$q.loading.show();
      const roomId = await chatApi.createRoom(this.form);
      this.$q.loading.hide();
      if (roomId) {
        this.$emit("created", roomId);
        this.hide();
      }
    },
  },
});
</script>

<style lang='scss' scoped>
</style>