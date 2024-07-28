<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="glossy">
        <q-btn
          flat
          dense
          round
          icon="mdi-menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-space></q-space>
      </q-toolbar>
      <div class="q-px-lg q-pt-xl q-mb-md">
        <div class="text-h3">Todo</div>
        <div class="text-subtitle1">{{ todayDate }}</div>
      </div>
      <q-img src="/images/road.jpg" class="header-image absolute-top"></q-img>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="600"
    >
      <q-scroll-area
        style="
          height: calc(100% - 192px);
          margin-top: 192px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-item
            v-for="menu in menuList"
            :key="menu.label"
            clickable
            v-ripple
            :to="menu.to"
            exact
          >
            <q-item-section avatar>
              <q-icon :name="menu.icon" />
            </q-item-section>
            <q-item-section> {{ menu.label }} </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img v-if="isLogin" class="absolute-top" src="/images/road.jpg" style="height: 192px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar
            size="56px"
            class="q-mb-sm"
            color="primary"
            text-color="white"
          >
            {{ user.userName[0] }}
						<q-menu>
							<q-list>
								<LogoutBtn>로그아웃</LogoutBtn>
							</q-list>
						</q-menu>
          </q-avatar>
          <div class="text-weight-bold">{{ user.nickName }}</div>
          <div>{{user.phone}}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { date } from "quasar";
import LogoutBtn from "src/components/LogoutBtn.vue";
import { mapState } from "pinia";
import useUser from "src/stores/useUser";
// import { socket } from "boot/socket";
// import useSocketListner from "src/composables/useSocketListner";

export default defineComponent({
  name: "MainLayout",
  components: { LogoutBtn },
	// setup() {
  //   useSocketListner(socket, {
  //     "users": (users) => {
  //       console.log("users listen", users);
  //     },
  //   });
  // },
  data() {
    return {
      leftDrawerOpen: false,
      menuList: [
        {
          to: { name: "todo" },
          label: "Todo",
          icon: "mdi-checkbox-marked-circle-auto-outline",
        },
        {
          to: { name: "chat" },
          label: "Chat",
          icon: "mdi-chat-processing-outline",
        },
      ],
    };
  },
  computed: {
		...mapState(useUser, ['user', 'isLogin']),
    todayDate() {
      // 영상 10분 30초 까지 봤음
      const timeStamp = Date.now();
      return date.formatDate(timeStamp, "YYYY-MM-DD dddd");
    },
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
});
</script>

<style lang="scss">
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>