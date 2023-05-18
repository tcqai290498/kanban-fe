<template>
  <div class="kanban-board">
    <div class="process" v-for="process in filteredProcesses" :key="process.id">
      <h2>{{ process.title ? process.title : "No Title" }}</h2>
      <div>{{ process.description }}</div>
      <div
        class="task"
        v-for="task in process.tasks"
        :key="task.id"
        draggable="true"
        @dragstart="onDragStart(task, process)"
      >
        <p v-if="task">{{ task.title }}</p>
        <p>{{ task.description }}</p>
      </div>
      <div class="add-task">
        <!-- <input v-model="newTask.title" type="text" placeholder="Title"> -->
        <!-- <input v-model="newTask.description" type="text" placeholder="Description"> -->
        <input
          :id="'input-' + process.id"
          v-model="taskInputs[process.id].title"
          type="text"
          placeholder="Title"
          
        />
        <input
          :id="'input-' + process.id"
          v-model="taskInputs[process.id].description"
          type="text"
          placeholder="Description"
        />
        <button @click="addTask(process.id)">Add Task</button>
      </div>
    </div>
    <div class="add-process">
      <input v-model="newProcess.title" type="text" placeholder="Title" />
      <input v-model="newProcess.description" type="text" placeholder="Description" />
      <button @click="addProcess">Add Process</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      processes: [],
      draggedTask: null,
      draggedProcess: null,
      newProcess: {
        title: "",
        description: "",
      },
      taskInputs: {},
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    filteredProcesses() {
      this.processes.forEach((process) => {
        if (!this.taskInputs[process.id]) {
          this.taskInputs[process.id] = {
            title: "",
            description: "",
          };
        }
      });
      return this.processes.filter((process) => process !== undefined);
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/process/");
        this.processes = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    onDragStart(task, process) {
      this.draggedTask = task;
      this.draggedProcess = process;
    },
    onDragOver(event, process) {
      event.preventDefault();
      // Add a class to visually indicate the drop target
      process.isDropTarget = true;
    },
    onDragLeave(process) {
      // Remove the class from the drop target
      process.isDropTarget = false;
    },
    onDrop(event, targetProcess) {
      event.preventDefault();
      targetProcess.isDropTarget = false;

      // Retrieve the dragged task and process
      const draggedTask = this.draggedTask;
      const draggedProcess = this.draggedProcess;

      // If the target process is different from the source process
      if (draggedProcess !== targetProcess) {
        // Find the index of the dragged task in its process
        const draggedTaskIndex = draggedProcess.tasks.findIndex(
          (task) => task.id === draggedTask.id
        );

        if (draggedTaskIndex !== -1) {
          // Remove the task from the source process
          draggedProcess.tasks.splice(draggedTaskIndex, 1);

          // Add the task to the target process
          targetProcess.tasks.push(draggedTask);

          // Perform additional logic here, such as updating the server-side data
        }
      }

      // Clear the dragged task and process data
      this.draggedTask = null;
      this.draggedProcess = null;
    },
    async addProcess() {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/process/",
          this.newProcess
        );

        if (response.status === 201) {
          const newProcess = response.data;
          this.processes.push(newProcess);

          this.newProcess.title = "";
          this.newProcess.description = "";
        } else {
          console.error("Failed to add process:", response.status);
        }
      } catch (error) {
        console.error("Error adding process:", error);
      }
    },
    async addTask(processId) {
      try {
        const taskToAdd = {
          title: this.taskInputs[processId].title ,
          description: this.taskInputs[processId].description,
          process: processId,
        };
        console.log("Adding task:", taskToAdd);
        const response = await axios.post("http://127.0.0.1:8000/task/", taskToAdd);
        console.log("Task added:", response);
        if (response.status === 201) {
          const newTask = response.data;
          
          // Find the target process to add the task to
          const targetProcess = this.processes.find(
            (process) => process.id === newTask.process
          );
          if (!targetProcess) {
            console.log("no process to add")
          }
          targetProcess.tasks.push(newTask);
          
          // Reset input field
          this.taskInputs[processId] = {
            title: '',
            description: '',
          }
        } else {
          console.error("Failed to add task:", response.status);
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
  },
};
</script>

<style scoped>
.kanban-board {
  display: flex;
}

.process {
  flex: 1;
  margin: 10px;
  padding: 10px;
  background-color: #f0f0f0;
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
</style>
