<template>
  <v-app>
    <v-main>
      <v-container class="pa-0 ma-0" fluid>
        <v-row no-gutters>
          <!-- Background Image Section -->
          <v-col cols="12" md="6" class="background-section">
            <v-img 
              :src="require('@/assets/Images/bg_login.jpg')"
              height="100vh"
              cover
              position="relative"
            >
              <div class="pa-6 pa-sm-12">
                <v-img
                  :src="require('@/assets/Images/logo_miiot.png')"
                  width="12rem"
                  max-width="16rem"
                  height="3rem"
                  contain
                >
                </v-img>
              </div>
            </v-img>
          </v-col>
          
          <!-- Login Form Section -->
          <v-col cols="12" md="6" class="d-flex justify-center align-center login-section"> 
            <v-card
              class="login-card"
              max-width="450"
              width="85%"
              elevation="5"
              rounded="xl"
            >
              <v-card-text class="pa-6 pa-sm-12">
                <p class="login-title">Login to your account</p>
                <form @submit.prevent="handleLogin">
                  <div class="form-control">
                    <label for="email">Email</label>
                    <input 
                      type="email"
                      v-model="email"
                      placeholder="Enter your email"
                      :class="{ 'error-input' : errors.email}"
                    >
                    <span class="error-text" v-if="errors.email">{{ errors.email }}</span>
                  </div>
                  <div class="form-control">
                    <label for="password">Password</label>
                    <div class="password-wrapper">
                      <input 
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                        placeholder="Enter your password"
                        :class="{ 'error-input' : errors.password}"
                      >
                      <v-icon
                        @click="togglePassword"
                        :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        class="password-toggle"  
                      >
                      </v-icon>
                    </div>
                    <span class="error-text" v-if="errors.password">{{ errors.password }}</span>
                  </div>
                  <div class="login">
                    <button type="submit" :disabled="isLoading">
                      <v-progress-circular
                        v-if="isLoading"
                        indeterminate
                        size="20"
                        width="2"
                        color="white"
                        class="mr-2"
                      ></v-progress-circular>
                      {{ isLoading ? 'Loading...' : 'Login Now' }}
                    </button>
                  </div>
                </form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import router from '@/router'
import { inject } from 'vue'
import { ref, reactive } from 'vue'

const $api = inject('$api');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errors = reactive({
  email: '',
  password: ''
});

const validateForm = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''

  if (!email.value) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!password.value) {
    errors.password = 'Password is required'
    isValid = false
  }
  return isValid
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!validateForm()) return
  isLoading.value = true;
  try {
    const loginData = {
      MemberEmail: email.value,
      MemberPassword: password.value,
    };

    const response = await $api.post('/Member/login', loginData);
    const { accessToken, member } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('member', JSON.stringify(member));

    console.log('Login successful');

    router.push('/Homepage');
  } catch (error) {
    console.error('Login failed:', error);
    if (error.response) {
      if (error.response.status === 401) {
        errors.password = 'Email or password is incorrect';
      } else {
        errors.password = 'Login failed, please try again';
      }
    } else {
      errors.password = 'Cannot connect to server';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss">
.background-section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;

  @media (min-width: 960px) {
    position: relative;
    width: 50%;
  }
}

.login-section {
  position: relative;
  z-index: 1;
  min-height: 100vh;

}

.login-card {
  margin: 16px;
  
  .login-title {
    font-size: 20px;
    margin-bottom: 24px;
    font-weight: 600;

    @media (min-width: 600px) {
      font-size: 24px;
      margin-bottom: 32px;
    }
  }

  .form-control {
    margin-bottom: 16px;

    label {
      font-size: 14px;
      margin-bottom: 6px;
      display: block;
    }

    input {
      width: 100%;
      margin-top: 6px;
      padding: 8px;
      font-size: 14px;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
    }

    input:focus {
      border-color: #D1E9FF;
      box-shadow: 0 0 0 2px #D1E9FF;
      outline: none;
    }

    .error-input {
      border-color: #FDA29B;
      &:focus {
        border-color: #FDA29B;
        box-shadow: 0 0 0 2px #FEE4E2;
      }
    }

    .error-text {
      color: #F04438;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }

    .password-wrapper {
      position: relative;

      .password-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #667085;
      }
    }
  }

  .login {
    button {
      width: 100%;
      padding: 8px;
      margin-top: 16px;
      font-size: 16px;
      background-color: #1570EF;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button:hover {
      background-color: #0d5cb6;
    }

    button:disabled {
      background-color: #84CAFF;
      cursor: not-allowed;
    }
  }
}
</style>