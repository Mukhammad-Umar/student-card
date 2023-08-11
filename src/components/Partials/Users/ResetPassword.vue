<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useOrgUserStore } from '@/stores/orgUsers'

import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@/utils/i18n-validators'

const props = defineProps({
  userId: Number
})

const { t } = useI18n()
const toast = useToast()
const orgUserStore = useOrgUserStore()

const show1 = ref(false)
const show2 = ref(false)
const resetDialog = ref(false)
const resetLoading = ref(false)

const form = reactive({
  newPassword: '',
  confirmPassword: ''
})

const rules = computed(() => {
  return {
    newPassword: { required, minLength: minLength(5) },
    confirmPassword: { required }
  }
})

const $v = useVuelidate(rules, form)

async function changePassword() {
  $v.value.$touch()
  if ($v.value.$invalid) return

  if (form.newPassword !== form.confirmPassword) {
    toast.error(t('matchPassword'))
    return
  }

  try {
    resetLoading.value = true

    const data = await orgUserStore.changePassword({
      userId: props.userId,
      newPassword: form?.newPassword
    })

    if (data?.result) {
      form.newPassword = ''
      form.confirmPassword = ''
      resetDialog.value = false
      toast.success(t('success.updated'))
    }
  } finally {
    resetLoading.value = false
  }
}
</script>

<template>
  <div>
    <i class="mdi mdi-lock-reset text-success cup h3" @click="resetDialog = true"></i>

    <!-- add cutomer modal  -->
    <b-modal
      v-model="resetDialog"
      id="showModal"
      hide-footer
      :title="$t('edit')"
      header-class="p-3 bg-light"
      class="v-modal-custom"
      centered
      no-close-on-backdrop
    >
      <b-form @submit.prevent="changePassword" id="addform" class="tablelist-form" autocomplete="off">
        <div class="w-100 px-2 mb-3">
          <div class="row">
            <b-col lg="12" class="input-with-info px-2 mb-3">
              <label class="form-label" for="newPassword-input">
                {{ $t('newPassword')}} <span class="text-danger">*</span>
              </label>
              
              <div class="position-relative auth-pass-inputgroup">
                <input
                  v-model="$v.newPassword.$model"
                  :type="show1 ? 'text' : 'password'"
                  class="form-control pe-5"
                  :class="{
                    'is-invalid': $v.newPassword.$error && $v.newPassword.$dirty,
                    error: $v.newPassword.$error
                  }"
                  id="newPassword-input"
                />

                <div v-for="(item, index) in $v.newPassword.$errors" :key="index" class="invalid-feedback">
                  <span v-if="item.$message">{{ item.$message }}</span>
                </div>

                <b-button
                  @click="show1 = !show1"
                  variant="link"
                  class="position-absolute end-0 top-0 text-decoration-none text-muted"
                  style="padding-top: 4px; padding-bottom: 4px"
                  type="button"
                >
                  <i class="mdi mdi-18px" :class="show1 ? 'mdi-eye' : 'mdi-eye-off'"></i>
                </b-button>
              </div>
            </b-col>

            <b-col lg="12" class="input-with-info px-2">
              <label class="form-label" for="confirmPassword-input">
                {{ $t('confirmPassword')}} <span class="text-danger">*</span>
              </label>

              <div class="position-relative auth-pass-inputgroup mb-3">
                <input
                  v-model="$v.confirmPassword.$model"
                  :type="show2 ? 'text' : 'password'"
                  class="form-control pe-5"
                  :class="{
                    'is-invalid': $v.confirmPassword.$error && $v.confirmPassword.$dirty,
                    error: $v.confirmPassword.$error
                  }"
                  id="confirmPassword-input"
                />

                <div v-for="(item, index) in $v.confirmPassword.$errors" :key="index" class="invalid-feedback">
                  <span v-if="item.$message">{{ item.$message }}</span>
                </div>

                <b-button
                  @click="show2 = !show2"
                  variant="link"
                  class="position-absolute end-0 top-0 text-decoration-none text-muted"
                  style="padding-top: 4px; padding-bottom: 4px"
                  type="button"
                >
                  <i class="mdi mdi-18px" :class="show2 ? 'mdi-eye' : 'mdi-eye-off'"></i>
                </b-button>
              </div>
            </b-col>
          </div>
        </div>

        <div class="hstack gap-2 justify-content-center">
          <b-button type="button" id="closemodal" variant="light" @click="resetDialog = false">
            {{ $t('btn_text.close') }}
          </b-button>
          <b-button type="submit" variant="primary" :loading="resetLoading" :loading-mode="'fill'">{{
            $t('save')
          }}</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>
