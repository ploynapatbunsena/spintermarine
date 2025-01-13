<template>
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
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script setup>
import router from '@/router'
import { ref, reactive } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errors = reactive({
  email: '',
  password: ''
})

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
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    // Add your login logic here
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulating API call
    console.log('Login attempt:', {
      email: email.value,
      password: password.value
    })

    // Navigate to /Homepage after login
    router.push('/Homepage')

  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
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