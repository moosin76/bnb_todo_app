<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="max-width: 900px; width: 100%">
      <div class="row bg-grey-3 q-pa-md">
        <div class="text-h4">Rooms</div>
        <q-space></q-space>
        <q-input
          label="검색"
          v-model="pagination.search"
          filled
          dense
          clearable
          @clear="clearSearch"
        >
          <template #after>
            <q-btn
              icon="mdi-magnify"
              @click="onRequest({ pagination })"
            ></q-btn>
          </template>
        </q-input>
        <q-space></q-space>
        <q-btn @click="createRoom">create</q-btn>
        <q-btn icon="mdi-close" round flat @click="hide"></q-btn>
      </div>
      <q-card-section>
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
          @request="onRequest"
        >
					<template #body-cell-cmd="props">
						<q-td :props="props">
							<q-btn icon="mdi-chat-plus" round dense @click="addUser(props.row.id)"></q-btn>
						</q-td>
					</template>
				</q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
  <RoomForm ref="roomForm" @created="selectRoom"></RoomForm>
</template>

<script>
import { defineComponent } from "vue";
import RoomForm from "components/chat/RoomForm.vue";
import chatApi from "src/apis/chatApi";
import { date } from "quasar";

export default defineComponent({
  components: { RoomForm },
  emits: ["selected"],
  name: "RoomSearch",
  data() {
    return {
      dialog: false,
      loading: false,
      pagination: {
        sortBy: "createdAt",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        search: "",
      },
      rows: [],
      columns: [
        {
          name: "category",
          label: "category",
          field: "category",
          sortable: true,
        },
        { name: "name", label: "방이름", field: "name", sortable: true },
        { name: "desc", label: "설명", field: "desc", sortable: false },
        {
          name: "secret",
          label: "공개여부",
          field: "secret",
          sortable: true,
          format: (val, row) => (val == 0 ? "공개" : "비공개"),
        },
        {
          name: "userName",
          label: "방장명",
          field: "userName",
          sortable: true,
        },
        {
          name: "userCnt",
          label: "참여인원",
          field: "userCnt",
          sortable: true,
        },
        {
          name: "createAt",
          label: "개설일",
          field: "createdAt",
          sortable: true,
          format: (val, row) => {
            const day = new Date(val);
            return date.formatDate(day, "YYYY-MM-DD");
          },
        },
        {
          name: "cmd",
        },
      ],
    };
  },
  methods: {
    show() {
      this.onRequest({ pagination: this.pagination });
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
    createRoom() {
      this.$refs.roomForm.show();
    },
    async addUser(roomId) {
      const data = await chatApi.addChatUser(roomId);
      console.log("addUser", data);
      this.selectRoom(roomId);
    },
    selectRoom(roomId) {
      console.log("select Room", roomId);
      this.$emit("selected", roomId);
      this.hide();
    },
    async onRequest({ pagination }) {
      // console.log(pagination);
      this.loading = true;
      const data = await chatApi.roomList(pagination);
      if (data) {
        this.rows = data.rows;
        this.pagination = {
          ...pagination,
          rowsNumber: data.count,
        };
      }
      this.loading = false;
      // console.log(data);
    },
    clearSearch() {
      this.pagination.search = "";
      this.onRequest({ pagination: this.pagination });
    },
  },
  mounted() {},
});
</script>

<style lang='scss' scoped>
</style>
