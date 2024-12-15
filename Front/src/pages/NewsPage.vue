<template>
  <q-page padding>
    <!-- <q-btn @click="fetchData">크롤링 시작</q-btn> -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      @request="onRequest"
    >
    </q-table>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import newsApi from "src/apis/newsApi";

export default defineComponent({
  name: "NewsPage",
  data() {
    return {
      pagination: null,
      rows: [],
    };
  },
  computed: {
    columns: () => newsApi.columns,
    defaultPagination: () => newsApi.pagination,
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
