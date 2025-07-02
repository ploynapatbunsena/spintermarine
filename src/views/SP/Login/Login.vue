<template>
  <v-app>
    <v-main>
      <v-container class="pa-0 ma-0" fluid>
        <v-row no-gutters>
          <v-col cols="12" md="6" class="background-section">
            <v-img
              :src="require('@/assets/Images/bg_login.jpg')"
              height="100vh"
              cover
              class="pa-16"
            >
              <v-img
                :src="require('@/assets/Images/logo_miiot.png')"
                width="30vh"
                height="5vh"
              >
              </v-img>
            </v-img>
          </v-col>
          <v-col cols="12" md="6" class="login-section">
            <v-card class="login-card" rounded="xl" elevation="0">
              <v-card-text class="pa-6">
                <p class="login-title">LOGIN</p>
                <form @submit.prevent="fetchMemberData">
                  <div class="form-control">
                    <label for="email">Email</label>
                    <input
                      type="email"
                      v-model="email"
                      @input="filterEmails(email)"
                      @focus="filterEmails(email)"
                      @blur="handleBlur"
                      placeholder="Enter your email"
                      :class="{ 'error-input': errors.email }"
                      autocomplete="email"
                    />
                    <span class="error-text" v-if="errors.email">{{
                      errors.email
                    }}</span>

                    <!-- ส่วนแสดงคำแนะนำอีเมล -->
                    <div
                      class="suggestions-container"
                      v-if="showSuggestions && emailSuggestions.length"
                    >
                      <div
                        v-for="suggestion in emailSuggestions"
                        :key="suggestion"
                        class="suggestion-item"
                        @mousedown="selectEmail(suggestion)"
                      >
                        {{ suggestion }}
                        <v-icon
                          small
                          class="delete-icon"
                          @click.stop="removeEmail(suggestion)"
                        >
                          mdi-close
                        </v-icon>
                      </div>
                    </div>
                  </div>
                  <div class="form-control">
                    <label for="password">Password</label>
                    <div class="password-wrapper">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                        placeholder="Enter your password"
                        :class="{ 'error-input': errors.password }"
                        autocomplete="current-password"
                      />
                      <v-icon
                        @click="togglePassword"
                        :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        class="password-toggle"
                      >
                      </v-icon>
                    </div>
                    <span class="error-text" v-if="errors.password">{{
                      errors.password
                    }}</span>
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
                      {{ isLoading ? "Loading..." : "Login Now" }}
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
import { inject } from "vue"
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"

const $api = inject("$api")
const router = useRouter()

// ตัวแปรสำหรับฟีเจอร์จำอีเมล
const savedEmails = ref([])
const emailSuggestions = ref([])
const showSuggestions = ref(false)

// โหลดอีเมลที่บันทึกไว้เมื่อ component ถูกโหลด
onMounted(() => {
  const storedEmails = localStorage.getItem("savedEmails")
  if (storedEmails) {
    savedEmails.value = JSON.parse(storedEmails)
  }
})

// ตัวแปรเดิม
const email = ref("")
const password = ref("")
const showPassword = ref(false)
const isLoading = ref(false)
const errors = reactive({
  email: "",
  password: "",
})

// ฟังก์ชันสำหรับจัดการอีเมล
const filterEmails = (input) => {
  if (input.length > 0) {
    emailSuggestions.value = savedEmails.value.filter((email) =>
      email.toLowerCase().includes(input.toLowerCase()),
    )
    showSuggestions.value = true
  } else {
    emailSuggestions.value = []
    showSuggestions.value = false
  }
}

const selectEmail = (selectedEmail) => {
  email.value = selectedEmail
  showSuggestions.value = false
}

const removeEmail = (emailToRemove) => {
  savedEmails.value = savedEmails.value.filter(
    (email) => email !== emailToRemove,
  )
  localStorage.setItem("savedEmails", JSON.stringify(savedEmails.value))
  filterEmails(email.value) // อัพเดตคำแนะนำหลังจากลบ
}

// ฟังก์ชันเดิม
const validateForm = () => {
  let isValid = true
  errors.email = ""
  errors.password = ""

  if (!email.value) {
    errors.email = "กรุณากรอกอีเมล"
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง"
    isValid = false
  }

  if (!password.value) {
    errors.password = "กรุณากรอกรหัสผ่าน"
    isValid = false
  } else if (password.value.length < 4) {
    errors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร"
    isValid = false
  }
  return isValid
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const fetchMemberData = async () => {
  if (!validateForm()) return

  // เพิ่มอีเมลลงในรายการที่เก็บไว้ (ถ้ายังไม่มี)
  if (email.value && !savedEmails.value.includes(email.value)) {
    // จำกัดจำนวนอีเมลที่เก็บไว้ไม่เกิน 10 อัน
    if (savedEmails.value.length >= 10) {
      savedEmails.value.shift() // ลบอีเมลที่เก่าที่สุด
    }
    savedEmails.value.push(email.value)
    localStorage.setItem("savedEmails", JSON.stringify(savedEmails.value))
  }

  localStorage.removeItem("accessToken")
  localStorage.removeItem("member")
  localStorage.removeItem("menuPermission")

  isLoading.value = true
  errors.password = ""

  try {
    const loginResponse = await $api.post("/Member/login", {
      MemberEmail: email.value,
      MemberPassword: password.value,
    })

    if (!loginResponse.data?.accessToken) {
      throw new Error("ไม่พบ Token ใน response")
    }

    const { accessToken, member } = loginResponse.data

    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("member", JSON.stringify(member))

    if (!localStorage.getItem("accessToken")) {
      throw new Error("การเก็บ Token ล้มเหลว")
    }

    try {
      const permissionResponse = await $api.get(
        `/member/permission/${member.MemberId}`,
      )
      if (permissionResponse.data?.menuPermission) {
        localStorage.setItem(
          "menuPermission",
          JSON.stringify(permissionResponse.data.menuPermission),
        )
      }
    } catch (permissionError) {
      console.warn("การดึงข้อมูลสิทธิ์ล้มเหลว:", permissionError)
    }
    router.push("/Homepage")
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", error)

    localStorage.removeItem("accessToken")

    if (error.response) {
      if (error.response.status === 401) {
        errors.password = "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
      } else if (error.response.status === 500) {
        errors.password = "เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่ภายหลัง"
      } else {
        errors.password =
          "เกิดข้อผิดพลาดในการเข้าสู่ระบบ (รหัส: " + error.response.status + ")"
      }
    } else if (error.message.includes("Network Error")) {
      errors.password = "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"
    } else {
      errors.password = "เกิดข้อผิดพลาดที่ไม่คาดคิด"
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.background-section {
  position: fixed;
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  margin: 16px;
  max-width: 450px;
  width: 85%;

  @media (min-width: 2560px) {
    max-width: 1000px;
    width: 85%;
  }

  .login-title {
    text-align: center;
    font-size: 3vh;
    margin-bottom: 3vh;
    font-weight: 700;
  }

  .form-control {
    margin-bottom: 2vh;
    position: relative;

    label {
      font-size: 1.5vh;
    }

    input {
      width: 100%;
      margin-top: 0.5vh;
      padding: 1vh;
      font-size: 2vh;
      border: 1px solid #e5e5e5;
      border-radius: 1vh;
    }

    input:focus {
      border-color: #d1e9ff;
      box-shadow: 0 0 0 2px #d1e9ff;
      outline: none;
    }

    .error-input {
      border-color: #fda29b;
      &:focus {
        border-color: #fda29b;
        box-shadow: 0 0 0 2px #fee4e2;
      }
    }

    .error-text {
      color: #f04438;
      font-size: 1.5vh;
      margin-top: 0.5vh;
      display: block;
    }

    .password-wrapper {
      position: relative;

      .password-toggle {
        position: absolute;
        right: 1.5vw;
        top: 55%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #8d95a5;
        font-size: 2.5vh;
      }
    }

    .suggestions-container {
      position: absolute;
      width: 100%;
      max-height: 200px;
      overflow-y: auto;
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 0 0 1vh 1vh;
      z-index: 10;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-top: -1px;

      .suggestion-item {
        padding: 1vh;
        cursor: pointer;
        font-size: 1.8vh;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover {
          background-color: #f5f5f5;
        }

        .delete-icon {
          opacity: 0.5;
          &:hover {
            opacity: 1;
            color: #f04438;
          }
        }
      }
    }
  }

  .login {
    button {
      width: 100%;
      padding: 1vh;
      margin-top: 4vh;
      font-size: 2vh;
      background-color: #1570ef;
      color: white;
      border: none;
      border-radius: 1vh;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button:hover {
      background-color: #0d5cb6;
    }

    button:disabled {
      background-color: #84caff;
      cursor: not-allowed;
    }
  }
}
</style>
