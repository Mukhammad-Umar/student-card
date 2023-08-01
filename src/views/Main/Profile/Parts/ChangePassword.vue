<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/user'
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@/utils/i18n-validators'

const { t } = useI18n()
const toast = useToast()
const userStore = useUserStore()

const loading = ref(false)
const isCurrentPassword = ref(false)
const isNewPassword = ref(false)
const isConfirmPassword = ref(false)

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = computed(() => {
  return {
    currentPassword: { required, minLength: minLength(5) },
    newPassword: { required, minLength: minLength(5) },
    confirmPassword: { required }
  }
})

const $v = useVuelidate(rules, form)

async function changePass() {
  $v.value.$touch()
  if ($v.value.$invalid) return

  if (form.newPassword !== form.confirmPassword) {
    toast.error(t('matchPassword'))
    return
  }

  try {
    loading.value = true

    const data = await userStore.changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    })

    if (data) {
      toast.success(t('success.passwordSuccess'))
      form.currentPassword = ''
      form.newPassword = ''
      form.confirmPassword = ''
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="changePass">
    <b-row class="g-2">
      <b-col xl="4" lg="6">
        <div>
          <label for="oldpasswordInput" class="form-label text-muted">
            {{ $t('currentPassword') }}
          </label>

          <div class="position-relative auth-pass-inputgroup mb-3">
            <input
              v-model="$v.currentPassword.$model"
              :type="isCurrentPassword ? 'text' : 'password'"
              class="form-control"
              id="oldpasswordInput"
              :class="{
                'is-invalid': $v.currentPassword.$error && $v.currentPassword.$dirty,
                error: $v.currentPassword.$error
              }"
            />

            <div
              v-for="(item, index) in $v.currentPassword.$errors"
              :key="index"
              class="invalid-feedback"
            >
              <span v-if="item.$message">{{ item.$message }}</span>
            </div>

            <b-button
              @click="isCurrentPassword = !isCurrentPassword"
              variant="link"
              class="position-absolute end-0 top-0 text-decoration-none text-muted"
              style="padding-top: 4px; padding-bottom: 4px"
            >
              <i class="mdi mdi-18px" :class="isCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"></i>
            </b-button>
          </div>
        </div>
      </b-col>

      <b-col xl="4" lg="6">
        <div>
          <label for="newpasswordInput" class="form-label text-muted">{{
            $t('newPassword')
          }}</label>
          <div class="position-relative auth-pass-inputgroup mb-3">
            <input
              v-model="$v.newPassword.$model"
              :type="isNewPassword ? 'text' : 'password'"
              class="form-control"
              id="newpasswordInput"
              :class="{
                'is-invalid': $v.newPassword.$error && $v.newPassword.$dirty,
                error: $v.newPassword.$error
              }"
            />

            <div
              v-for="(item, index) in $v.newPassword.$errors"
              :key="index"
              class="invalid-feedback"
            >
              <span v-if="item.$message">{{ item.$message }}</span>
            </div>

            <b-button
              @click="isNewPassword = !isNewPassword"
              variant="link"
              class="position-absolute end-0 top-0 text-decoration-none text-muted"
              style="padding-top: 4px; padding-bottom: 4px"
            >
              <i class="mdi mdi-18px" :class="isNewPassword ? 'mdi-eye' : 'mdi-eye-off'"></i>
            </b-button>
          </div>
        </div>
      </b-col>

      <b-col xl="4" lg="6">
        <div>
          <label for="confirmpasswordInput" class="form-label text-muted">{{
            $t('confirmPassword')
          }}</label>
          <div class="position-relative auth-pass-inputgroup mb-3">
            <input
              v-model="$v.confirmPassword.$model"
              :type="isConfirmPassword ? 'text' : 'password'"
              class="form-control"
              id="confirmpasswordInput"
              :class="{
                'is-invalid': $v.confirmPassword.$error && $v.confirmPassword.$dirty,
                error: $v.confirmPassword.$error
              }"
            />

            <div
              v-for="(item, index) in $v.confirmPassword.$errors"
              :key="index"
              class="invalid-feedback"
            >
              <span v-if="item.$message">{{ item.$message }}</span>
            </div>

            <b-button
              @click="isConfirmPassword = !isConfirmPassword"
              variant="link"
              class="position-absolute end-0 top-0 text-decoration-none text-muted"
              style="padding-top: 4px; padding-bottom: 4px"
            >
              <i class="mdi mdi-18px" :class="isConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"></i>
            </b-button>
          </div>
        </div>
      </b-col>

      <b-col lg="12" class="mt-3">
        <div class="text-end">
          <b-button type="submit" variant="success" :loading="loading" :loading-mode="'fill'">
            {{ $t('changePassword') }}
          </b-button>
        </div>
      </b-col>
    </b-row>
  </form>
</template>
