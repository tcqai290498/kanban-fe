<template>
  <login-form v-if="!isAuthenticated"></login-form>
  <div v-else><KanbanBoard /></div>
</template>

<script>
import KanbanBoard from "./components/KanbanBoard.vue";
import LoginForm from "./components/LoginForm.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    KanbanBoard,
    LoginForm,
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
