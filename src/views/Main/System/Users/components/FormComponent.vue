<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useVuelidate } from '@vuelidate/core'
import { useOrgUserStore } from '@/stores/orgUsers'
import { ref, computed, watch } from 'vue'
import RoleSelect from '@/components/UI/RoleSelect.vue'
import BranchSelect from '@/components/UI/BranchSelect.vue'
import { required, minLength } from '@/utils/i18n-validators'

const { form }: any = defineProps<{form: Object}>()

const show = ref(false)
const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const loading = ref(false)
const orgUserStore = useOrgUserStore()

const rules = computed(() => {
  return {
    userName: { required },
    password: form.userId ? true : { required, minLength: minLength(5) },
    organizationBranchId: { required }
  }
})

const $v = useVuelidate(rules, form)

watch(() => form.isActivate, val => {
  if(val) form.isBlocked = false
})

watch(() => form.isBlocked, val => {
  if(val) form.isActivate = false
})

async function submit() {
  $v.value.$touch()
  if ($v.value.$invalid) return

  try {
    loading.value = true

    const formData = JSON.parse(JSON.stringify(form))
    formData.phone = form.phone ? '998' + form.phone.replace(/[^0-9]/g, '') : ''

    const data = form.userId
      ? await orgUserStore.edit(formData)
      : await orgUserStore.create(formData)

    if (data.result) {
      toast.success(t('success.added'))
      router.push({ name: 'MainOrgsUsersList' })
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
          <b-col xl="3" lg="4" md="6" sm="6">
            <div>
              <label class="form-label text-muted"
                >{{ $t('branch') }} <span class="text-danger">*</span>
              </label>
              <BranchSelect :params="form" />
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6" sm="6">
            <div>
              <label for="form-user" class="form-label text-muted">
                {{ $t('login') }} <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                id="form-user"
                v-model="$v.userName.$model"
                :class="{
                  'is-invalid': $v.userName.$error && $v.userName.$dirty,
                  error: $v.userName.$error
                }"
              />
            </div>
          </b-col>

          <b-col v-if="!form.userId" xl="3" lg="4" md="6" sm="6">
            <div>
              <label for="form-user-password" class="form-label text-muted"
                >{{ $t('password') }} <span class="text-danger">*</span>
              </label>
              <div class="position-relative auth-pass-inputgroup">
                <input
                  v-model="$v.password.$model"
                  :type="show ? 'text' : 'password'"
                  class="form-control pe-5"
                  :class="{
                    'is-invalid': $v.password.$error && $v.password.$dirty,
                    error: $v.password.$error
                  }"
                  id="form-user-password"
                  autocomplete="new-password"
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

          <b-col xl="3" lg="4" md="6" sm="6">
            <div>
              <label for="form-firstName" class="form-label text-muted"
                >{{ $t('userInfo.name') }}
              </label>
              <input
                type="text"
                class="form-control"
                id="form-firstName"
                v-model="form.firstName"
              />
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6" sm="6">
            <div>
              <label for="form-lastName" class="form-label text-muted"
                >{{ $t('userInfo.lastName') }}
              </label>
              <input type="text" class="form-control" id="form-lastName" v-model="form.lastName" />
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6" sm="6">
            <div>
              <label for="form-phone" class="form-label text-muted"
                >{{ $t('userInfo.phoneNumber') }}
              </label>
              <div class="input-group">
                <span class="input-group-text" id="basic-addon1">+998</span>
                <input
                  type="text"
                  class="form-control"
                  id="form-phone"
                  v-maska
                  data-maska="## ###-##-##"
                  v-model="form.phone"
                />
              </div>
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6" sm="6">
            <div>
              <label class="form-label text-muted">{{ $t('role') }} </label>
              <RoleSelect :params="form" />
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
                type="submit"
                variant="info"
                class="px-5"
                :loading="loading"
                loading-mode="fill"
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
