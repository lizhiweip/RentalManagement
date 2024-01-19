<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <label>Email:</label>
        <input v-model="loginData.email" type="text" required />
        <br />
        <label>Password:</label>
        <input v-model="loginData.password" type="password" required />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        loginData: {
          email: '',
          password: '',
        },
      };
    },
    methods: {
      login() {
        this.$axios
          .get('http://localhost:8081/login', { params: this.loginData })
          .then(response => {
            console.log('Login successful', response.data);
          })
          .catch(error => {
            console.error('Login error', error.response.data);
          });
      },
    },
  };
  </script>
<style>
</style>