<template>
  <q-form @submit.stop="sendMessage" class="absolute-bottom">
    <div class="row">

      <q-file
        ref="file"
        v-model="file"
        @update:model-value="uploadFile"
        style="display: none"
      ></q-file>
      <q-btn
        icon="mdi-upload"
        unelevated
        dense
        color="green"
        square
        @click="pickFile"
      >
      </q-btn>

      <q-input
        v-model="message"
        type="textarea"
        autogrow
        class="col-grow"
        square
        borderless
        bg-color="grey-2"
        input-class="q-px-sm"
        dense
        @keydown.enter.ctrl="sendMessage"
      >
      </q-input>
      <q-btn
        type="submit"
        icon="mdi-send"
        unelevated
        dense
        color="green"
        square
      ></q-btn>
    </div>
  </q-form>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessageForm",
  props: {},
  emits: ["message", 'upload'],
  data() {
    return {
      message: "",
      file:null,
    };
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.$emit("message", this.message);
        this.message = "";
      }
    },
    pickFile() {
      this.$refs.file.pickFiles();
    },
    uploadFile() {
      this.$emit('upload', this.file);
      this.file = null;
    }
  },
});
</script>

<style lang='scss' scoped>
</style>
