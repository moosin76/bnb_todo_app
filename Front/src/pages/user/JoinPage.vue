<template>
  <q-page padding class="flex flex-center">
    <q-card style="width: 100%; max-width: 400px">
      <q-card-section class="bg-grey-8 text-white">
        <div class="text-h5 text-center">회원가입</div>
      </q-card-section>
      <q-form @submit.stop="save">
        <q-card-section class="q-gutter-y-sm">
          <q-input
            outlined
            v-model="form.id"
            label="ID"
            dense
            :rules="[
              (v) => !!v || '필수 입력입니다.',
              (v) => v.length > 2 || '아이디는 3글자 이상 작성하세요.',
            ]"
          />
          <q-input
            outlined
            v-model="form.password"
            label="Password"
            :type="pwShow ? 'text' : 'password'"
            dense
            :rules="[
              (v) => !!v || '필수 입력입니다.',
              (v) => v.length > 6 || '7자 이상 작성하세요.',
              pwRegex,
            ]"
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
          <q-input
            outlined
            v-model="form.userName"
            label="이름"
            dense
            :rules="[
              (v) => !!v || '필수 입력입니다.',
              (v) => v.length > 1 || '이름은 2글자 이상 작성하세요.',
            ]"
          />
          <q-input
            outlined
            v-model="form.nickName"
            label="별명"
            dense
            :rules="[
              (v) => !!v || '필수 입력입니다.',
              (v) => v.length > 1 || '별명 2글자 이상 작성하세요.',
            ]"
          />
          <q-input
            outlined
            v-model="form.phone"
            label="휴대폰 번호"
            dense
            mask="###-####-####"
            :rules="[(v) => !!v || '필수 입력입니다.']"
          />

          <q-field
            v-model="form.gender"
            outlined
            label="성별"
            dense
            :rules="[(v) => !!v || '성별을 선택하세요']"
          >
            <template v-slot:control>
              <q-radio
                v-model="form.gender"
                val="M"
                label="남성"
                dense
                style="margin-left: 40px; margin-top: -12px"
              />
              <q-radio
                v-model="form.gender"
                val="F"
                label="여성"
                dense
                class="q-ml-md"
                style="margin-top: -12px"
              />
            </template>
          </q-field>
          <InputPost
            v-model:zipcode="form.zipcode"
            v-model:address="form.address"
            v-model:detail="form.address2"
          ></InputPost>
        </q-card-section>
        <q-card-actions>
          <q-btn type="button" :to="{name:'login'}">로그인</q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">회원가입</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import InputPost from "components/form/InputPost.vue";
import userApi from "src/apis/userApi";

export default defineComponent({
  name: "JoinPage",
  components: { InputPost },
  data() {
    return {
      pwShow: false,
      form: {
        id: "id",
        password: "Abc123#",
        userName: "남기용",
        nickName: "이지코드",
        phone: "010-1111-2222",
        gender: "M",
        zipcode: "06761",
        address: "서울 성북구 아리랑로 3",
        address2: "503호",
      },
    };
  },
  methods: {
    async save() {
      const data = await userApi.join(this.form);
      if (data) {
        this.$q.notify({
          type: "info",
          message: `${this.form.userName}님 회원가입을 환영합니다.`,
        });

        this.$router.push({ name: "login" });
      }
    },
    pwRegex(v) {
      // return true;
      const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])\S{7,}$/;
      return (
        regex.test(v) ||
        "비밀번호는 대소문자 숫자 특수문자가 포함되어야 합니다."
      );
    },
  },
});
</script>

<style lang='scss' scoped>
</style>