import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    processes: [],
    isAuthenticated: false,
    token: "",
    isErrorLogin: false,
    taskInputs: {}
  },
  mutations: {
    SET_TASK_INPUTS(state, taskInputs) {
      state.taskInputs = taskInputs;
    },
    SET_PROCESSES(state, processes) {
      state.processes = processes;
    },
    ADD_PROCESS(state, process) {
      state.processes.push(process);
    },
    SAVE_PROCESS(state, process) {
      const index = state.processes.findIndex(p => p.id === process.id);
      if (index !== -1) {
        state.processes[index] = process;
      }
    },
    TOGGLE_PROCESS_ACTIONS(state, processId) {
      const targetProcess = state.processes.find(process => process.id === processId);
      if (targetProcess) {
        targetProcess.showActions = !targetProcess.showActions;
      }
    },
    DELETE_PROCESS(state, process) {
      state.processes = state.processes.filter((p) => p.id !== process.id);
    },
    ADD_TASK(state, { processId, task }) {
      const process = state.processes.find(p => p.id === processId);
      if (process) {
        console.log("push process", task)
        process.tasks.push(task);
      }
    },
    SAVE_TASK(state, task) {
      let targetProcess = state.processes.find(p => p.id === task.process);
      let targetTask = targetProcess.tasks.find(t => t.id === task.id);
      if (targetTask) {
        targetTask = task;
      }
    },
    DELETE_TASK(state, task) {
      let targetProcess = state.processes.find((process) => process.id === task.process);
      if (targetProcess) {
        targetProcess.tasks = targetProcess.tasks.filter((t) => t.id !== task.id);
      }
    },    
    TOGGLE_TASK_ACTIONS(state, { processId, taskId }) {
      console.log(processId, taskId);
      const targetProcess = state.processes.find(process => process.id === processId);
      const targetTask = targetProcess.tasks.find(task => task.id === taskId);
      targetTask.showActions = !targetTask.showActions;
    },
    SET_AUTHENTICATED(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
      console.log('SET_AUTHENTICATED', state.isAuthenticated);
    },
    SET_LOGIN_ERR(state, isErrorLogin) {
      state.isErrorLogin = isErrorLogin;
      console.log('SET_LOGIN_ERR', state.isErrorLogin);
    },
  },
  actions: {
    async getTargetProcess({ commit, state }, processId) {
      try {
        let targetProcess = state.processes.find(process => process.id === processId);
        if (!targetProcess) {
          // Fetch the target process from the server if it doesn't exist in the state
          const response = await axios.get(`http://127.0.0.1:8000/process/${processId}`);
          targetProcess = response.data;
          commit("ADD_PROCESS", targetProcess);
        }
        return targetProcess;
      } catch (error) {
        console.error("Error getting target process:", error);
        return null;
      }
    },
    async fetchProcesses({ commit }) {
      try {
        const response = await axios.get("http://127.0.0.1:8000/process/");
        const processes = response.data;
        commit("SET_PROCESSES", processes);

        const taskInputs = {};
        processes.forEach((process) => {
            taskInputs[process.id] = {
              process: process.id,
              title: "",
              description: "",
            }
        });
        console.log(taskInputs);
        commit("SET_TASK_INPUTS", taskInputs);

      } catch (error) {
        console.error("Error fetching processes:", error);
      }
    },
    showProcessActions({ commit }, processId) {
      commit("TOGGLE_PROCESS_ACTIONS", processId);
    },
    async addProcess({state, commit }, newProcess) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/process/', newProcess);
        const addedProcess = response.data;
        console.log(addedProcess);
        commit('ADD_PROCESS', addedProcess);
        state.taskInputs[addedProcess.id] = {
          process: addedProcess.id,
          title: "",
          description: "",
          tasks: []
        };
        newProcess.title = ""
        newProcess.description = ""
      } catch (error) {
        console.error('Error adding process:', error);
      }
    },
    async saveProcess({ commit }, process) {
      try {
        const response = await axios.put(`http://127.0.0.1:8000/process/${process.id}/`, process);
  
        if (response.status === 200) {
          console.log("Process saved successfully!");
          commit('SAVE_PROCESS', process);
        } else {
          console.log("Failed to save process:", response.status);
        }
      } catch (error) {
        console.error("Error saving process:", error);
      }
    },
    async deleteProcess({ commit }, process) {
      try {
        await axios.delete(`http://127.0.0.1:8000/process/${process.id}/`);
        commit('DELETE_PROCESS', process);
      } catch (error) {
        console.error('Error deleting process:', error);
      }
    },
    async addTask({ commit, state }, processId) {
      try {
        console.log(processId);
        const response = await axios.post("http://127.0.0.1:8000/task/", state.taskInputs[processId]);
  
        if (response.status === 201) {
          commit("ADD_TASK", { processId, task: response.data }); // Dispatch the mutation
        } else {
          console.error("Failed to add task:", response.status);
        }

        state.taskInputs[processId] = {
          process: processId,
          title: "",
          description: "",
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    toggleTaskActions({ commit }, processId, taskId) {
      console.log(processId, taskId)
      commit("TOGGLE_TASK_ACTIONS", processId, taskId);
    },    
    async saveTask({commit}, task) {
      console.log("Saving task:", task);
      try {
        const response = await axios.put(`http://127.0.0.1:8000/task/${task.id}/`, task);

        if (response.status === 200) {
          commit('SAVE_TASK', task);
          console.log("Task saved successfully!");
        } else {
          console.log("Failed to save task:", response.status);
        }
      } catch (error) {
        console.error("Error saving task:", error);
      }
    },    
    async deleteTask({ commit }, task) {
      try {
        await axios.delete(`http://127.0.0.1:8000/task/${task.id}/`);
        commit('DELETE_TASK', task );
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    async login({ commit }, credentials) {
      try {
        // Make an API call to the login endpoint
        console.log(credentials);
        const response = await axios.post('http://127.0.0.1:8000/login/', credentials);
        console.log(response.status);
        if (response.status === 200) {
          // Update the authentication state in the store
          commit('SET_AUTHENTICATED', true);
          // Save the authentication token or user data in local storage or cookies if needed
          this.token = response.data.token
        } else {
          commit('SET_LOGIN_ERR', true);
          console.error('Failed to login:', response.status);
        }
      } catch (error) {
        console.error('Error logging in:', error);
        commit('SET_LOGIN_ERR', true);
      }
    },
    async logout({ commit }) {
      try {
        await axios.post('http://localhost:8000/logout/', null, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        });
        commit('SET_AUTHENTICATED', false);
        // Perform any necessary cleanup or redirect the user to the login page
      } catch (error) {
        console.error('Error logging out:', error);
      }
    },
  },
  getters: {
    filteredProcesses: (state) => {
      const filteredProcesses = state.processes.filter((process) => process !== undefined);
      return filteredProcesses;
    },
    getTaskInputs: (state) => {
      return state.taskInputs;
    },
    isAuthenticated: (state) => {
      return state.isAuthenticated;
    },
    isErrorLogin: (state) => {
      return state.isErrorLogin;
    },
  },
});
