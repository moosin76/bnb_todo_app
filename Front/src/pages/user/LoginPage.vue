<template>
  <q-page padding class="flex flex-center">
    <q-card style="width: 100%; max-width: 400px">
      <q-card-section class="bg-grey-8 text-white">
        <div class="text-h5 text-center">로그인</div>
      </q-card-section>
      <q-form @submit.stop="save">
        <q-card-section class="q-gutter-y-sm">
          <q-input
            outlined
            v-model="form.id"
            label="ID"
            dense
            :rules="[(v) => !!v || '필수 입력입니다.']"
          />
          <q-input
            outlined
            v-model="form.password"
            label="Password"
            :type="pwShow ? 'text' : 'password'"
            dense
            :rules="[(v) => !!v || '필수 입력입니다.']"
          >
            <template #append>
              <q-btn
                :icon="pwShow ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click="pwShow = !pwShow"
                dense
                round
                flat
              ></q-btn>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions class="column">
          <q-btn type="submit" color="primary" class="full-width">로그인</q-btn>
          <q-separator class="q-ma-md full-width" size="1px"></q-separator>
          <div class="row justify-between full-width">
            <q-btn type="button" :to="{ name: 'join' }">회원가입</q-btn>
            <q-space></q-space>
            <q-btn type="button">비밀번호 찾기</q-btn>
          </div>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import userApi from "src/apis/userApi";
import { mapActions } from "pinia";
import useUser from "stores/useUser";

export default defineComponent({
  name: "LoginPage",
  data() {
    return {
      pwShow: false,
      form: {
        id: "id2",
        password: "Abc123#",
      },
    };
  },
  methods: {
    async save() {
      const user = await userApi.login(this.form);
      if (user) {
        this.$q.notify({
          type: "info",
          message: `${user.userName}님 로그인 하셧습니다.`,
        });
        this.$router.push({ name: "todo" });
      }
    },
  },
});
</script>

<style lang='scss' scoped>
</style>