<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import {useAdminStore} from "@/stores/admin";
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/i18n-validators'

const { form }: any = defineProps<{form: Object}>()

const show = ref(false)
const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const loading = ref(false)
const adminStore = useAdminStore();

const rules = computed(() => {
  return {
    userName: { required },
    password:{ required }
  }
})

const editRules = computed(() => {
  return { userName: { required } }
})

const $v = useVuelidate(form.userId ? editRules : rules, form)

async function submit() {
  $v.value.$touch()
  if ($v.value.$invalid) return

  try {
    loading.value = true

    form.phone = form.phone ? '998' + form.phone.replace(/[^0-9]/g, '') : ''

    const data = form.userId
      ? await adminStore.editAdmin(form)
      : await adminStore.addAdmin(form)

    if (data.result) {
      toast.success(t('success.added'))
      router.push({ name: 'MainUsersList' })
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <b-card no-body>
    <b-card-header>
      <h5 class="card-title text-primary mb-0">{{ $t('menus.users') }}</h5>
    </b-card-header>
    <b-card-body>
      <b-form @submit.prevent="submit" class="my-2">
        <b-row class="g-4">
          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="form-userName" class="form-label text-muted">
                {{ $t('login') }} <span class="text-danger">*</span>
              </label>
              <input
                type="text" class="form-control"
                v-model="$v.userName.$model" id="form-userName"
                :class="{
                  'is-invalid': $v.userName.$error && $v.userName.$dirty,
                  error: $v.userName.$error
                }"
              />
            </div>
          </b-col>

          <b-col v-if="!form?.userId" xl="3" lg="4" md="6">
            <div>
              <label for="form-user-password" class="form-label text-muted">
                {{ $t('password') }} <span class="text-danger">*</span>
              </label>
              <div class="position-relative auth-pass-inputgroup">
                <input
                  v-model="$v.password.$model"
                  id="form-user-password" autocomplete="new-password"
                  :type="show ? 'text' : 'password'" class="form-control pe-5"
                  :class="{
                    'is-invalid': $v.password.$error && $v.password.$dirty,
                    error: $v.password.$error
                  }"
                />

                <b-button
                  @click="show = !show"
                  variant="link"
                  class="position-absolute end-0 top-0 text-decoration-none text-muted"
                  style="padding-top: 4px; padding-bottom: 4px"
                  type="button"
                >
                  <i class="mdi mdi-18px" :class="show ? 'mdi-eye' : 'mdi-eye-off'"></i>
                </b-button>
              </div>
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="form-firstName" class="form-label text-muted">{{ $t('userInfo.name') }}</label>
              <input
                type="text" class="form-control"
                v-model="form.firstName" id="form-firstName"
              />
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="form-lastName" class="form-label text-muted">{{ $t('userInfo.lastName') }}</label>
              <input type="text" class="form-control" id="form-lastName" v-model="form.lastName" />
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="form-phone" class="form-label text-muted">
                {{ $t('userInfo.phoneNumber') }}
              </label>
              <div class="input-group">
                <span class="input-group-text" id="basic-addon1">+998</span>
                <input
                  type="text" class="form-control" id="form-phone"
                  v-model="form.phone" v-maska data-maska="## ###-##-##"
                />
              </div>
            </div>
          </b-col>

          <b-col lg="12" class="active-checkbox d-flex justify-content-center text-muted">
            <b-form-checkbox v-model="form.isActivate">
              {{ $t('userInfo.isActivate') }}
            </b-form-checkbox>

            <b-form-checkbox v-if="form.userId" v-model="form.isBlocked" class="ml-2">
              {{ $t('userInfo.isBlocked') }}
            </b-form-checkbox>
          </b-col>

          <b-col lg="12">
            <div class="hstack justify-content-center gap-2 flex-wrap">
              <b-button type="button" variant="warning" class="px-5" @click="$router.go(-1)">
                {{ $t('btn_text.cancel') }}
              </b-button>
              <b-button
                type="submit" variant="primary" class="px-5"
                :loading="loading" loading-mode="fill"
              >
                {{ form.userId ? $t('change') : $t('add') }}
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-form>
    </b-card-body>
  </b-card>
</template>
