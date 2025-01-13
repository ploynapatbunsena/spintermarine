<template>
  <div>
    <v-app>
      <v-main>
        <v-row>
          <v-col cols="6">
            <v-img 
              :src="require('../assets/bg_login.jpg')"
              height="100vh"
              cover
              position="relative"
            >
              <div class="pa-12">
                <v-img
                  :src="require('../assets/logo_miiot.png')"
                  width="16rem"
                  height="3rem"
                >
                </v-img>
              </div>
            </v-img>
          </v-col>
          <v-col cols="6" class="d-flex justify-center align-center"> 
            <div class="card-box">
              <p>Login to your accout</p>
              <form>
                <div class="form-control">
                  <label for="email">Email</label>
                  <input type="email" placeholder="Enter your email">
                </div>
                <div class="form-control">
                  <label for="password">Password</label>
                  <input type="password" placeholder="Enter your password">
                </div>
                <div class="login">
                  <button type="submit">Login</button>
                </div>
              </form>
            </div>
          </v-col>
        </v-row>
      </v-main>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: "Login",
  }
</script>

<style lang="scss">
.card-box  {
  width: 450px;
  box-shadow: 40px 40px 60px 0px rgba(228, 230, 234, 0.75);
  padding: 48px;
  border-radius: 20px;

  & p {
    font-size: 24px;
    margin-bottom: 32px;
    font-weight: 600;
  }

  & .form-control {
    margin-bottom: 16px;

    & label {
      font-size: 14px;
      margin-bottom: 6px;
    }

    & input {
      width: 100%;
      margin-top: 6px;
      padding: 8px;
      font-size: 14px;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
    }

    & input:focus {
      border-color: #D1E9FF;
      box-shadow: 0 0 0 2px #D1E9FF;
      outline: none;
    }
  }

  & .login {
    & button {
      width: 100%;
      padding: 8px;
      margin-top: 16px;
      font-size: 16px;
      background-color: #1570EF;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    & button:hover {
      background-color: #0d5cb6;
    }
  }
}
</style>