<template>
  <q-field v-model="zipcode" borderless dense class="column" :rules="rules">
    <template v-slot:control>
      <q-input
        :model-value="zipcode"
        outlined
        placeholder="우편번호"
        dense
        input-class="q-px-md"
        readonly
      >
        <template #after>
          <q-btn
            icon="mdi-magnify"
            round
            flat
            dense
            @click="dialog = true"
          ></q-btn>
        </template>
      </q-input>
      <q-input
        :model-value="address"
        outlined
        placeholder="주소"
        dense
        class="q-mt-sm full-width"
        input-class="q-px-md"
        readonly
      ></q-input>
      <q-input
        ref="detail"
        :model-value="detail"
        outlined
        placeholder="상세 주소"
        dense
        class="q-mt-sm full-width"
        input-class="q-px-md"
        @change="onChange"
      ></q-input>
    </template>
  </q-field>

  <q-dialog v-model="dialog">
    <VueDaumPostcode @complete="onComplete"></VueDaumPostcode>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { VueDaumPostcode } from "vue-daum-postcode";

export default defineComponent({
  name: "InputPost",
  components: { VueDaumPostcode },
  props: {
    zipcode: { type: String, required: true },
    address: { type: String, required: true },
    detail: { type: String, required: true },
    required: { type: Boolean, default: false },
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    rules() {
      if (this.required) {
        return [(v) => !!v || "주소는 필수 입력입니다."];
      } else {
        return [];
      }
    },
  },
  methods: {
    onComplete(result) {
      const { zonecode, address } = result;
      this.$emit("update:zipcode", zonecode);
      this.$emit("update:address", address);
      this.dialog = false;
      this.$nextTick(() => {
        this.$refs.detail.focus();
      });
    },
    onChange(val) {
      this.$emit("update:detail", val);
    },
  },
});
</script>

<style lang='scss' scoped>
</style>