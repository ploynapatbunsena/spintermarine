<template>
  <v-app>
    <!-- <v-main class="gradient-background"> -->
    <v-main>
      <v-container fluid class="fill-height">
        <v-row class="fill-height align-center justify-center">
          <v-col cols="12" sm="8" md="6" lg="6" xl="3">
            <div class="form-container">
              <v-card 
                class="password-card elevation-0"
              >
                <v-card-text>
                  <v-row class="mb-4">
                    <v-col cols="12" class="text-center">
                      <p class="password-title font-weight-medium text-h5 text-sm-h4 text-lg-h3">Change Password?</p>
                      <p class="password-subtitle text-subtitle-1 text-lg-subtitle-2">
                        Don't worry, we'll help you reset it
                      </p>
                    </v-col>
                  </v-row>

                  <!-- Form Fields -->
                  <v-form>
                    <v-row>
                      <v-col cols="12">
                        <label class="field-label text-subtitle-2">Email Address</label>
                        <v-text-field
                          v-model="email"
                          variant="outlined"
                          density="comfortable"
                          color="#1677FF"
                          placeholder="Enter your email"
                          prepend-inner-icon="mdi-email-outline"
                          class="custom-field"
                          rounded="lg"
                          :rules="[rules.required, rules.email]"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12">
                        <label class="field-label text-subtitle-2">New Password</label>
                        <v-text-field
                          v-model="password"
                          variant="outlined"
                          density="comfortable"
                          color="#1677FF"
                          placeholder="Enter new password"
                          prepend-inner-icon="mdi-lock-outline"
                          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword ? 'text' : 'password'"
                          @click:append-inner="showPassword = !showPassword"
                          class="custom-field"
                          rounded="lg"
                          :rules="[rules.required, rules.minLength]"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mb-4">
                      <v-col cols="12">
                        <label class="field-label text-subtitle-2">Confirm Password</label>
                        <v-text-field
                          v-model="confirmPassword"
                          variant="outlined"
                          density="comfortable"
                          color="#1677FF"
                          placeholder="Confirm new password"
                          prepend-inner-icon="mdi-lock-check-outline"
                          :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          @click:append-inner="showConfirmPassword = !showConfirmPassword"
                          class="custom-field"
                          rounded="lg"
                          :rules="[rules.required, rules.passwordMatch]"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <!-- Submit Button -->
                    <v-row class="mb-3">
                      <v-col cols="12">
                        <v-btn 
                          class="reset-btn text-subtitle-1 text-lg-h6"
                          variant="flat"
                          rounded="lg"
                          size="large"
                          block
                          @click="resetPassword"
                          :disabled="loading">
                          <v-progress-circular
                            v-if="loading"
                            indeterminate
                            size="20"
                            width="2"
                            color="white"
                            class="mr-2"
                          ></v-progress-circular>
                          {{ loading ? "Loading..." : "Reset password" }}
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="text-center">
                        <v-btn
                          :to="{ name: 'Homepage' }"
                          variant="text"
                          color="#1677FF"
                          class="back-btn text-subtitle-1 text-lg-h6"
                        >
                          <v-icon icon="mdi-arrow-left" start></v-icon>
                          Back to Homepage
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- Alert Snackbar -->
      <v-snackbar
        v-model="showAlert"
        :color="alertType"
        :timeout="4000"
        location="top"
        rounded="lg"
      >
        <div class="d-flex align-center">
          <v-icon :icon="alertIcon" class="mr-2"></v-icon>
          {{ alertMessage }}
        </div>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const $api = inject('$api');
const router = useRouter();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const showAlert = ref(false);
const alertType = ref("success");
const alertIcon = ref("mdi-check-circle");
const alertMessage = ref("");

// Form validation rules
const rules = {
  required: value => !!value || 'This field is required',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Please enter a valid email address';
  },
  minLength: value => value.length >= 6 || 'Password must be at least 6 characters',
  passwordMatch: value => value === password.value || 'Passwords do not match'
};

const resetPassword = async() => {
  if (!email.value || !password.value || !confirmPassword.value) {
    showErrorAlert("Please fill in all fields");
    return;
  }

  if (password.value !== confirmPassword.value) {
    showErrorAlert("Passwords do not match");
    return;
  }

  loading.value = true;
  
  try {
    const payload = {
      MemberEmail: email.value,
      MemberPassword: password.value
    };

    const response = await $api.put('member/edit/password', payload);
    // console.log(response);
    if (response.data.Success) {
      showSuccessAlert(response.data.Message)
    } else {
      showErrorAlert(response.data.Message)
    }

  } catch (error) {
    console.error("Failed to reset password:", error);
    if (error.response) {
      showErrorAlert(error.response.data?.Message || "Server error occurred");
    } else if (error.request) {
      showErrorAlert("Network error. Please check your internet connection.");
    } else {
      showErrorAlert("An unexpected error occurred. Please try again.");
    }

  } finally {
    loading.value = false;
  }
};

const showSuccessAlert = (message) => {
  showAlert.value = true;
  alertType.value = "success";
  alertMessage.value = message;
  alertIcon.value = "mdi-check-circle";

  setTimeout(() => {
    router.push({ name: "Homepage" });
  }, 2000);
};

const showErrorAlert = (message) => {
  showAlert.value = true;
  alertType.value = "error";
  alertMessage.value = message;
  alertIcon.value = "mdi-alert-circle";
};
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
}

.gradient-background {
  min-height: 100vh;
  position: relative;
}

.gradient-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.form-container {
  position: relative;
  z-index: 1;
}

.icon-container {
  position: relative;
}

.lock-icon {
  background: linear-gradient(135deg, #1677FF, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.password-title {
  color: #1a237e;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #1677FF, #1a237e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.password-subtitle {
  color: #64748b;
  /* font-size: 0.95rem; */
  margin-bottom: 0;
  opacity: 0.8;
}

.field-label {
  color: #334155;
  margin-bottom: 0.5rem;
  display: block;
}

.custom-field {
  margin-bottom: 0.5rem;
}

.custom-field :deep(.v-field) {
  /* border-radius: 12px; */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.custom-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.custom-field :deep(.v-field--focused) {
  box-shadow: 0 4px 16px rgba(22, 119, 255, 0.2);
}

.reset-btn {
  background: linear-gradient(135deg, #1677FF, #42a5f5) !important;
  color: white !important;
  /* font-weight: 600;
  font-size: 1rem; */
  height: 48px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.reset-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.reset-btn:hover::before {
  left: 100%;
}

.reset-btn:hover {
  transform: translateY(-2px);
}

.back-btn {
  font-weight: 500;
  text-transform: none;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.back-btn:hover {
  opacity: 1;
  transform: translateX(-2px);
}
</style>