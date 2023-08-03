<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useVuelidate } from '@vuelidate/core'
import { onMounted, ref, watch, computed } from 'vue'
import { required, minLength } from '@/utils/i18n-validators'
import { useIntegrationSystemStore } from '@/stores/integrationSystem'

const { form }: any = defineProps<{form: Object}>()

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const integrationSystemStore = useIntegrationSystemStore()

const systems = ref([])
const loading = ref(false)
const checking = ref(false)
const inactiveBtn = ref(false)
const showPassword = ref(false)

const rules = computed(() => {
  return {
    username: { required },
    integrationSystem: { required },
    password: { required, minLength: minLength(5) }
  }
})

const $v = useVuelidate(rules, form)

async function getIntegrationSystemTypes() {
  const data = await integrationSystemStore.getIntegrationSystemTypes()
  systems.value = data?.result
}

watch(() => form.username, () => (inactiveBtn.value = true))
watch(() => form.password, () => (inactiveBtn.value = true))
watch(() => form.integrationSystem, () => (inactiveBtn.value = true))

async function checkLoginPassword() {
  try {
    checking.value = true

    const data = await integrationSystemStore.checkLoginPassword({
      url: form.domenUrl,
      username: form.username,
      password: form.password,
      integrationSystem: form.integrationSystem
    })

    if (data?.result?.success) {
      toast.success('Успешно проверено')
      inactiveBtn.value = false
    } else {
      toast.error(data?.error?.message || 'Ошибка')
    }
  } catch (e) {
    inactiveBtn.value = true
  } finally {
    checking.value = false
  }
}

async function submit() {
  $v.value.$touch()
  if ($v.value.$invalid) return

  try {
    loading.value = true

    const data = await integrationSystemStore.editIntegrationSystems(form)

    if (data?.result) {
      toast.success(t('success.updated'))
      await router.push({ name: 'MainSettingsIntegrationList' })
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => getIntegrationSystemTypes())
</script>

<template>
  <b-row>
    <b-col xl="8" lg="10">
      <b-card no-body>
        <b-form @submit.prevent="submit">
          <b-card-header>
            <h5 class="card-title text-primary mb-0">{{ form.id ? $t('change') : $t('add') }}</h5>
          </b-card-header>
          <b-card-body>
            <b-row class="g-4">
              <b-col lg="6">
                <div>
                  <label class="form-label">{{ $t('system') }}</label>
                  <input
                    v-model="form.integrationSystemName"
                    class="form-control" type="text" readonly
                  />
                </div>
              </b-col>

              <b-col lg="6" md="0"> </b-col>

              <b-col lg="6">
                <div>
                  <label for="integration-username" class="form-label">
                    {{ $t('login') }} <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text" class="form-control"
                    v-model="$v.username.$model" id="integration-username"
                    :class="{
                      'is-invalid': $v.username.$error && $v.username.$dirty,
                      error: $v.username.$error
                    }"
                  />
                </div>
              </b-col>

              <b-col lg="6">
                <div>
                  <label for="integration-password" class="form-label">
                    {{ $t('password') }} <span class="text-danger">*</span>
                  </label>
                  <input
                    id="integration-password" class="form-control"
                    v-model="$v.password.$model"
                    autocomplete="new-password"
                    :type="showPassword ? 'text' : 'password'"
                    :class="{
                      'is-invalid': $v.password.$error && $v.password.$dirty,
                      error: $v.password.$error
                    }"
                  />
                  <i
                    class="mdi text-muted cup mdi-18px inner-icon"
                    :class="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="showPassword = !showPassword"
                  ></i>
                </div>
              </b-col>

              <template v-if="form.integrationSystem === 2">
                <b-col v-if="form.integrationSystem === 2" lg="12">
                  <div>
                    <label for="integration-bearerToken" class="form-label">Bearer token</label>
                    <input type="text" class="form-control" id="integration-bearerToken" v-model="form.bearerToken" />
                  </div>
                </b-col>

                <b-col lg="12">
                  <div>
                    <label for="integration-url" class="form-label">URL (Middleware)</label>
                    <input type="text" class="form-control" id="integration-url" v-model="form.domenUrl" />
                  </div>
                </b-col>

                <b-col lg="12">
                  <div>
                    <label for="integration-soap" class="form-label">URL (SOAP)</label>
                    <input type="text" class="form-control" id="integration-soap" v-model="form.soapUrl" />
                  </div>
                </b-col>

                <b-col lg="12">
                  <div>
                    <label for="integration-dms" class="form-label">URL (SOAP DMS)</label>
                    <input type="text" class="form-control" id="integration-dms" v-model="form.soapDmsUrl" />
                  </div>
                </b-col>
              </template>

              <b-col v-else lg="12">
                <div>
                  <label for="integration-url" class="form-label">URL</label>
                  <input type="text" class="form-control" id="integration-url" v-model="form.domenUrl" />
                </div>
              </b-col>

              <b-col lg="12" class="d-flex justify-content-center">
                <b-form-checkbox v-model="form.isActivate">{{ $t('userInfo.isActivate') }}</b-form-checkbox>
              </b-col>

              <b-col
                lg="12" class="d-flex justify-content-center"
                v-if="form.integrationSystem === 1 && inactiveBtn"
              >
                <b-button
                  type="button"
                  class="px-3"
                  variant="info"
                  :loading="checking"
                  @click="checkLoginPassword"
                >
                  {{ $t('btn_text.checkData') }}
                </b-button>
              </b-col>

              <b-col lg="12">
                <div class="hstack justify-content-center gap-2 mb-2 flex-wrap">
                  <b-button type="button" class="px-5" variant="warning" @click="$router.go(-1)">
                    {{ $t('btn_text.cancel') }}
                  </b-button>
                  <b-button
                    type="submit"
                    class="px-5"
                    variant="info"
                    :loading="loading"
                    :disabled="form.integrationSystem === 1 && inactiveBtn"
                  >
                    {{ form.integrationSystemId ? $t('change') : $t('add') }}
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<style>
.inner-icon {
  position: absolute;
  top: 32px;
  right: 1.5rem;
}
</style>
