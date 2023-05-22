<template>
  <div class="kanban-board">
    <div class="process" v-for="process in filteredProcesses" :key="process.id">
      <button class="del-btn" @click="deleteProcess(process)">Delete</button>
      <br/>
      <div @click="showProcessActions(process.id)">
        <div class="process-detail">
          Process
          <input
            @click.stop.prevent
            v-model="process.title"
            type="text"
            placeholder="Title"
          />
          <input
            @click.stop.prevent
            v-model="process.description"
            type="text"
            placeholder="Description"
          />
        </div>
        <div>
          <button @click="saveProcess(process)">Save</button>
        </div>
      </div>

      <div
        v-for="task in process.tasks"
        :key="task.id"
      >
        <input v-model="task.title" type="text" placeholder="Title" />
        <input v-model="task.description" type="text" placeholder="Description" />

        <button @click="deleteTask(task)">del</button>
        <button @click="saveTask(task)">save</button>
      </div>
      <div class="add-task">
        <input
          v-model="getTaskInputs[process.id].title"
          type="text"
          placeholder="Title"
        />
        <input
          v-model="getTaskInputs[process.id].description"
          type="text"
          placeholder="Description"
        />
        <button @click="addTask(process.id)">Add Task</button>
      </div>
    </div>

    <div class="add-process">
      <input v-model="newProcess.title" type="text" placeholder="Title" />
      <input v-model="newProcess.description" type="text" placeholder="Description" />
      <br />
      <button @click="addProcess(newProcess)">Add Process</button>
    </div>
  </div>

  <button @click="logout">Logout</button>
</template>

<style>
.process {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Adjust alignment as per your needs */
  margin-right: 10px; /* Adjust the margin as per your needs */
}
</style>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  mounted() {
    this.fetchProcesses();
  },
  data() {
    return {
      newProcess: {
        title: "",
        description: "",
      },
      isEditableProcess: false,
    };
  },
  computed: {
    ...mapGetters(["filteredProcesses", "getTaskInputs"]),
  },
  methods: {
    ...mapActions([
      "fetchProcesses",
      "addProcess",
      "showProcessActions",
      "getTargetProcess",
      "saveProcess",
      "deleteProcess",
      "toggleTaskActions",
      "addTask",
      "saveTask",
      "deleteTask",
      "logout"
    ]),
  },
};
</script>

<style scoped>
.kanban-board {
  display: flex;
}

.process {
  position: relative;
  flex: 1;
  margin: 10px;
  padding: 10px;
  background-color: #f0f0f0;
}

.process-detail {
  background-color: rebeccapurple;
  width: 100%;
  height: 100%;
  color: white;
}

.add-process {
  margin-top: 20px;
}

.task {
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
}

.add-task {
  margin-top: 20px;
}

.del-btn {
  position: absolute; /* Position the delete button absolutely */
  top: 0; /* Align to the top */
  right: 0; /* Align to the right */
}
</style>
