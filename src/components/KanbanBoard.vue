<template>
  <div class="kanban-board">
    <div class="process" v-for="process in filteredProcesses" :key="process.id">
      <div @click="showProcessActions(process.id)" class="process-detail">
        <button class="del-btn" @click="deleteProcess(process)">Delete</button>
        <br/>
        <div >
          Process
          <br>
          <input
            class="input"
            @click.stop.prevent
            v-model="process.title"
            type="text"
            placeholder="Title"
          />
          <br>
          <input
            class="input"
            @click.stop.prevent
            v-model="process.description"
            type="text"
            placeholder="Description"
          />
        </div>
        <button @click="saveProcess(process)">Save</button>
      </div>

      <div class="task-detail"
        v-for="task in process.tasks"
        :key="task.id"
      >
        <div >
          <input class="input" v-model="task.title" type="text" placeholder="Title" />
          <br>
          <input class="input" v-model="task.description" type="text" placeholder="Description" />
          <br>
          <button @click="deleteTask(task)">Delete</button>
          <button @click="saveTask(task)">Save</button>
        </div>
      </div>
      <div class="add-task">
        <input
          class="input"
          v-model="getTaskInputs[process.id].title"
          type="text"
          placeholder="Title"
        />
        <input
          class="input"
          v-model="getTaskInputs[process.id].description"
          type="text"
          placeholder="Description"
        />
        <br>
        <button @click="addTask(process.id)">Add Task</button>
      </div>
    </div>

    <div class="add-process">
      <input class="input" v-model="newProcess.title" type="text" placeholder="Title" />
      <br />
      <input class="input" v-model="newProcess.description" type="text" placeholder="Description" />
      <br />
      <button @click="addProcess(newProcess)">Add Process</button>
    </div>
  </div>
  <br>
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
  display: inline-flex;
}

.process-container {
  display: flex;
  flex-wrap: wrap;
}

.process {
  position: relative;
  flex: 1;
  margin: 10px;
  padding: 0px;
  background-color: #f0f0f0;
  /* width: 150px; Adjust the width as needed */
}

.process-detail {
  background-color: rebeccapurple;
  width: 100%;
  color: white;
  padding-bottom: 15px;
}

.add-process {
  margin-top: 20px;
}

.task-detail {
  background-color: #b0eaea;
  border-bottom: dotted;
  width: 100%;
}

.add-task {
  margin-top: 20px;
  width: 100%;
}

.del-btn {
  position: absolute; /* Position the delete button absolutely */
  top: 0; /* Align to the top */
  right: 0; /* Align to the right */
}

.input {
  width: 90%;
}
</style>