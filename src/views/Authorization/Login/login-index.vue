<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { v4 as generateUniqueId } from 'uuid'
import { deviceId } from '@/service/TokenService'
import { ref, reactive, computed, onMounted } from 'vue'

import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@/utils/i18n-validators'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const showPassword = ref(false)

const webMode = ref(JSON.parse(localStorage.getItem('isDark') as string) ?? false)

const form = reactive({
  login: '',
  password: '',
  organizationType: 1,
  clientId: deviceId.get() || generateUniqueId()
})

const rules = computed(() => {
  return {
    login: { required },
    password: { required, minLength: minLength(5) }
  }
})

const $v = useVuelidate(rules, form)

async function submit() {
  // $v.value.$touch()
  // if ($v.value.$invalid) return

  // try {
  //   loading.value = true
  //   const data = await authStore.login(form)
  //   if (data?.token) {
      await router.push({ name: 'MainDashboard' })
  //   }
  // } finally {
  //   loading.value = false
  // }
}

onMounted(() => authStore.authClearInterval())
</script>

<template>
  <div class="p-lg-5 p-4">
    <div>
      <img v-if="!webMode" src="@/assets/aloqa-logo.gif" alt="" height="45" />
      <img v-else src="@/assets/Aloqabank-dark.svg" alt="" height="27" width="135" />
      <p class="text-muted">{{ $t('projectInfo') }}</p>
    </div>

    <div class="mt-4">
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label for="login-username" class="form-label">{{ $t('login') }}</label>
          <input
            v-model="$v.login.$model"
            type="text" class="form-control" 
            id="login-username" :placeholder="$t('enterLogin')"
            :class="{
              'is-invalid': $v.login.$error && $v.login.$dirty,
              error: $v.login.$error
            }"
          />

          <div v-for="(item, index) in $v.login.$errors" :key="index" class="invalid-feedback">
            <span v-if="item.$message">{{ item.$message }}</span>
          </div>
        </div>

        <div class="mb-3">
          <div class="float-end">
            <!-- <router-linkz to="/auth/reset-pwd-cover" class="text-muted">
                          Forgot password?</router-linkz> -->
          </div>
          <label class="form-label" for="login-password">{{ $t('password') }}</label>
          <div class="position-relative auth-pass-inputgroup mb-3">
            <input
              v-model="$v.password.$model"
              :type="showPassword ? 'text' : 'password'"
              id="login-password" :placeholder="$t('enterPassword')"
              class="form-control pe-5" :class="{
                'is-invalid': $v.password.$error && $v.password.$dirty,
                error: $v.password.$error
              }"
            />

            <div v-for="(item, index) in $v.password.$errors" :key="index" class="invalid-feedback">
              <span v-if="item.$message">{{ item.$message }}</span>
            </div>
            <b-button
              @click="showPassword = !showPassword"
              variant="link" type="button" id="password-addon"
              class="position-absolute end-0 top-0 text-decoration-none text-muted"
              style="padding-top: 4px; padding-bottom: 4px"
            >
              <i class="mdi mdi-18px" :class="showPassword ? 'mdi-eye' : 'mdi-eye-off'"></i>
            </b-button>
          </div>
        </div>

        <!-- <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="auth-remember-check"
          />
          <label class="form-check-label" for="auth-remember-check">Remember me</label>
        </div> -->

        <div class="mt-4">
          <b-button variant="primary" class="w-100" type="submit" :loading="loading">
          {{ $t('log_In') }}
          </b-button>
        </div>

        <!-- <div class="mt-4 text-center">
          <div class="signin-other-title">
            <h5 class="fs-13 mb-4 title">Sign In with</h5>
          </div>

          <div>
            <b-button type="button" variant="primary" class="btn-icon"
              ><i class="ri-facebook-fill fs-16"></i
            ></b-button>
            <b-button type="button" variant="danger" class="btn-icon ms-1"
              ><i class="ri-google-fill fs-16"></i
            ></b-button>
            <b-button type="button" variant="dark" class="btn-icon ms-1"
              ><i class="ri-github-fill fs-16"></i
            ></b-button>
            <b-button type="button" variant="info" class="btn-icon ms-1"
              ><i class="ri-twitter-fill fs-16"></i
            ></b-button>
          </div>
        </div> -->
      </form>
    </div>

    <div class="mt-5 pt-5 text-center">
      <p class="mb-0">
        {{ $t('telInfo') }}
        <a href="tel:+998712307777" class="fw-semibold text-primary" style="margin-left: 5px">
          +998 71 230 77 77
        </a>
      </p>
    </div>
  </div>
</template>
