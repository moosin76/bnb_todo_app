<template>
  <q-page class="bg-grey-3 column">
    <q-form
      ref="form"
      @submit="addTask"
      class="hide-error row bg-primary q-pa-sm"
    >
      <q-input
        class="col"
        bg-color="white"
        square
        filled
        v-model.trim="newTask"
        placeholder="Add task"
        dense
        :rules="[(v) => !!v || '필수입력입니다.']"
      >
        <template v-slot:append>
          <q-btn
            @click="$refs.form.submit()"
            round
            dense
            flat
            icon="mdi-plus"
          />
					<q-btn @click="test">test</q-btn>
        </template>
      </q-input>
    </q-form>

    <q-list v-if="!!tasks.length" class="bg-white" bordered separator>
      <q-item
        v-for="(task, index) in tasks"
        :key="task.id"
        v-ripple
        @click="updateTask(task)"
        clickable
        :class="{ 'done bg-blue-1': task.done }"
        :disable="task.disable"
      >
        <q-item-section avatar>
          <q-checkbox
            v-model="task.done"
            color="primary"
            class="no-pointer-events"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ task.title }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="task.done" side>
          <q-btn
            flat
            round
            dense
            color="negative"
            icon="mdi-delete"
            @click.stop="deleteTask(index, task.id)"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else class="absolute-center" style="opacity: 0.5">
      <q-icon name="mdi-check" color="primary" size="100px"></q-icon>
      <div class="text-center text-h5 text-primary">No Tasks</div>
    </div>

    <div v-if="loading" class="text-center">
      <q-spinner-hourglass color="purple" size="4em" />
    </div>
    <div v-else v-intersection="onIntersection"></div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import todoApi from "src/apis/todoApi";

export default defineComponent({
  name: "TodoPage",
  data() {
    return {
      newTask: "",
      tasks: [
        // { title: "Get bananas", done: false },
        // { title: "Eat bananas", done: true },
        // { title: "Foo bananas", done: false },
      ],
      offset: 0,
      limit: 5,
      rowsNumber: 0,
      loading: false,
    };
  },
  methods: {
    deleteTask(index, id) {
      this.$q
        .dialog({
          title: "할일 삭제",
          message: `${this.tasks[index].title} 삭제 하시겠습니까?`,
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          const isDel = await todoApi.remove(id);
          if (isDel) {
            this.tasks.splice(index, 1);
            this.$q.notify({ type: "positive", message: "삭제되었습니다." });
            this.rowsNumber--;
            this.offset--;
          }
        });
    },
    async addTask() {
      const data = await todoApi.create({ title: this.newTask, done: false });
      // console.log(data);
      this.tasks.push(data);
      this.newTask = "";
      await this.$nextTick();
      this.$refs.form.resetValidation();
    },
    async updateTask(task) {
      task.disable = true;
      const isUpdate = await todoApi.update(task.id, !task.done);
      if (isUpdate) {
        task.done = !task.done;
      }
      task.disable = false;
    },
    async onIntersection(entry) {
      if (!entry.isIntersecting) return;
      if (this.offset > this.rowsNumber) return;

      this.loading = true;
      const data = await todoApi.list(this.offset, this.limit);
      this.rowsNumber = data.count;
      this.offset += this.limit;
      const arr = [...this.tasks, ...data.rows];
      this.tasks = arr;
      this.loading = false;
    },
		async test() {
			const data = await this.$api.get('/api/test/id');
			console.log(data);
		}
   },
});
</script>

<style lang="scss">
.done {
  .q-item__label {
    text-decoration: line-through;
    color: #bbb;
  }
}
.hide-error {
  .q-field--with-bottom {
    padding-bottom: 0px;
  }
  .q-field__bottom {
    display: none;
  }
}
</style>