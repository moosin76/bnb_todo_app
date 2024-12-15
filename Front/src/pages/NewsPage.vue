<template>
  <q-page padding>
    <!-- <q-btn @click="fetchData">크롤링 시작</q-btn> -->
    <q-table
      style="height: calc(100vh - 240px)"
      virtual-scroll
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      @request="onRequest"
      :grid="isGrid"
    >
      <template #top>
        <q-input
          label="검색"
          dense
          color="primary"
          v-model="pagination.search"
          clearable
          @clear="clearSearch"
          @keypress.enter="fetchData"
        >
          <template v-slot:append>
            <q-icon
              name="mdi-magnify"
              class="cursor-pointer"
              @click="fetchData"
            />
          </template>
        </q-input>
        <q-space></q-space>

        <q-btn-toggle
          v-model="isGrid"
          toggle-color="primary"
          :options="[
            { label: '', value: true, slot: 'grid' },
            { label: '', value: false, slot: 'list' },
          ]"
        >
          <template v-slot:grid>
            <q-icon name="mdi-grid"></q-icon>
          </template>
          <template v-slot:list>
            <q-icon name="mdi-view-list"></q-icon>
          </template>
        </q-btn-toggle>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td rowspan="2" style="text-align: center; width: 220px">
            <img
              :src="props.row.img"
              :alt="props.row.title"
              style="height: 100px"
            />
          </q-td>
          <q-td style="border-bottom: 0px" class="text-weight-bold">
            {{ props.row.title }}
          </q-td>
          <q-td rowspan="2" style="width: 140px">
            {{ displayDate(props.row.time) }}
          </q-td>
        </q-tr>
        <q-tr :props="props">
          <q-td style="border-top: 0px">
            <div style="white-space: pre-wrap" class="ellipsis-3-lines">
              {{ props.row.content.trim() }}
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card>
            <q-img
              :src="props.row.img"
              :alt="props.row.title"
              :ratio="16 / 9"
            />

            <q-card-section class="q-pb-sm">
              <div class="text-h6 ellipsis-2-lines">{{ props.row.title }}</div>
            </q-card-section>
            <q-card-section class="q-pt-none q-pb-sm">
              <div class="ellipsis-3-lines">{{ props.row.content }}</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="row">
                <div>{{ getWriter(props.row.content) }}</div>
                <q-space></q-space>
                <div class="text-grey-7">{{ displayDate(props.row.time) }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template #bottom>
        <div class="row full-width q-py-md">
          <q-space></q-space>
          <q-pagination
            v-model="pagination.page"
            color="grey-8"
            :max="pagesNumber"
            @update:model-value="fetchData"
          />
          <q-space></q-space>
          <q-select
            v-model="pagination.rowsPerPage"
            :options="[12, 24]"
            @update:model-value="fetchData"
            dense
            outlined
          ></q-select>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import newsApi from "src/apis/newsApi";
import { date } from "quasar";

export default defineComponent({
  name: "NewsPage",
  data() {
    return {
      pagination: null,
      rows: [],
      isGrid: true,
    };
  },
  computed: {
    columns: () => newsApi.columns,
    defaultPagination: () => newsApi.pagination,
    pagesNumber() {
      return Math.ceil(
        this.pagination.rowsNumber / this.pagination.rowsPerPage
      );
    },
  },
  methods: {
    async crawling() {
      const data = await newsApi.crawling();
      console.log(data);
    },
    async onRequest({ pagination }) {
      this.$q.loading.show();
      console.log(pagination);

      const data = await newsApi.list(pagination);
      if (data) {
        this.pagination = {
          ...pagination,
          rowsNumber: data.count,
        };
        this.rows = data.rows;
      }

      this.$q.loading.hide();
    },
    fetchData() {
      this.onRequest({ pagination: this.pagination });
    },
    displayDate(val) {
      return date.formatDate(val, "YYYY-MM-DD HH:mm");
    },
    clearSearch() {
      this.pagination.search = "";
      this.fetchData();
    },
    getWriter(str) {
      const pattern = /\(.+\).+기자/g;
      const matches = pattern.exec(str);
      // console.log(matches);
      return matches ? matches[0] : "";
    },
  },
  created() {
    this.pagination = this.defaultPagination;
  },
  mounted() {
    this.fetchData();
  },
});
</script>

<style lang='scss' scoped>
</style>
