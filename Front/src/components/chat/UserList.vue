<template>
  <div v-if="isAdmin">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="user" label="유저" />
      <q-tab name="block" label="블럭" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="user">
        <q-list separator>
          <UserItem
            v-for="user in useUsers"
            :key="user.userId"
            :user="user"
            :my-role="myRole"
          >
          </UserItem>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="block">
        <q-list separator>
          <UserItem
            v-for="user in blockUsers"
            :key="user.userId"
            :user="user"
            :my-role="myRole"
          >
          </UserItem>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
  <div v-else>
    <q-list separator>
      <UserItem
        v-for="user in useUsers"
        :key="user.userId"
        :user="user"
        :my-role="myRole"
      >
      </UserItem>
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import UserItem from "components/chat/UserItem.vue";
import { mapState } from "pinia";
import useUser from "src/stores/useUser";

export default defineComponent({
  components: { UserItem },
  name: "UserList",
  props: {
    users: { type: Array, required: true },
  },
  data() {
    return {
      tab: "user",
    };
  },
  computed: {
    ...mapState(useUser, ["user"]),
    blockUsers() {
      return this.users.filter((user) => user.role == "Block");
    },
    useUsers() {
      return this.users.filter((user) => user.role != "Block");
    },
    myRole() {
      // 내 역활
      //내가 Master 이거나 Manager 이면 관리자로 한다.
      const find = this.users.find((user) => user.userId == this.user.id);
      if (find) {
        return find.role;
      } else {
        return "Block";
      }
    },
    isAdmin() {
      return this.myRole == 'Master' || this.myRole == 'Manager';
    }
  },
  methods: {},
});
</script>

<style lang='scss' scoped>
</style>
