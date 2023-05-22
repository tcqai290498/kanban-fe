<template>
  <div class="login-form">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email:</label>
        <br />
        <input
          type="text"
          v-model="email"
          id="email"
          name="email"
          placeholder="Enter your email"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <br />
        <input
          type="password"
          v-model="password"
          id="password"
          name="password"
          placeholder="Enter your password"
        />
      </div>
      <div class="error" v-show="isErrorLogin">* Your email/password is incorrect!</div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      // Dispatch the login action to the Vuex store
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password,
      });
    },
  },
  computed: {
    ...mapGetters(["isErrorLogin"]),
  }
};
</script>

<style>
.error {
  color: red;
}
</style>
