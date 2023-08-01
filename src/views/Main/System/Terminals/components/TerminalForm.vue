<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/i18n-validators'
import { useTerminalStore } from '@/stores/terminal'

const props = defineProps({
  form: Object,
  loading: Boolean
})

const groups = ref([])
const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const form: any = ref(props.form)
const terminalStore = useTerminalStore()

const systemStates = [
  { id: 1, name: 'GenesisGate' },
  { id: 2, name: 'HumoGate' },
  { id: 3, name: 'SvGate' }
]

const rules = computed(() => {
  return {
    groupId: { required },
    merchantId: { required },
    terminalId: { required },
    integrationSystemId: { required }
  }
})

const $v = useVuelidate(rules, form.value)

const submit = () => {
  $v.value.$touch()
  if ($v.value.$invalid) return
}
</script>

<template>
  <b-card no-body>
    <b-card-header>
      <h5 class="card-title text-primary mb-0">{{ $t('menus.terminals') }}</h5>
    </b-card-header>
    <b-card-body>
      <b-form @submit.prevent="submit" class="my-2">
        <b-row class="g-4">
          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="form-integration" class="form-label text-muted">
                {{ $t('system') }} <span class="text-danger">*</span>
              </label>
              <b-form-select
                v-model="$v.integrationSystemId.$model"
                :options="systemStates"
                id="form-integration"
                value-field="id"
                text-field="name"
                :class="{
                  'is-invalid': $v.integrationSystemId.$error && $v.integrationSystemId.$dirty,
                  error: $v.integrationSystemId.$error
                }"
              ></b-form-select>
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="form-group" class="form-label text-muted">
                {{ $t('sysUsers.group') }} <span class="text-danger">*</span>
              </label>
              <b-form-select
                v-model="$v.groupId.$model"
                :options="groups"
                id="form-group"
                value-field="id"
                text-field="name"
                :class="{
                  'is-invalid': $v.groupId.$error && $v.groupId.$dirty,
                  error: $v.groupId.$error
                }"
              ></b-form-select>
            </div>
          </b-col>
        </b-row>

        <b-row class="g-4 mt-0">
          <b-col xl="3" lg="4" md="6">
            <div>
              <label class="form-label text-muted">{{ $t('processing') }}</label>
              <div class="input-group" data-input-flag data-option-countrycode="false">
                <button class="btn btn-light border" type="button">
                  <img
                    :src="form.integrationSystemId === 2
                      ? '/images/cardLogos/logo_humo.png' : '/images/cardLogos/uzcard-blue.svg'"
                    height="20" width="30" class="country-flagimg"
                  />
                </button>
                <input 
                  class="form-control rounded-end flag-input" readonly
                  :value="form.integrationSystemId === 2 ? 'Humo' : 'UzCard'" 
                />
              </div>
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="form-merchantId" class="form-label text-muted">
                {{ $t('filters.merchantId') }} <span class="text-danger">*</span>
              </label>
              <input
                v-model="$v.merchantId.$model"
                type="text" class="form-control" id="form-merchantId"
                :class="{
                  'is-invalid': $v.merchantId.$error && $v.merchantId.$dirty,
                  error: $v.merchantId.$error
                }"
              />
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="form-terminalId" class="form-label text-muted">
                {{ $t('filters.terminalId') }} <span class="text-danger">*</span>
              </label>
              <input
                v-model="$v.terminalId.$model"
                type="text" class="form-control" id="form-terminalId"
                :class="{
                  'is-invalid': $v.terminalId.$error && $v.terminalId.$dirty,
                  error: $v.terminalId.$error
                }"
              />
            </div>
          </b-col>
        </b-row>

        <Transition>
          <b-row v-if="form.integrationSystemId === 1" class="g-4 mt-0">
            <b-col xl="3" lg="4" md="6">
              <div>
                <label class="form-label text-muted">{{ $t('processing') }}</label>
                <div class="input-group" data-input-flag data-option-countrycode="false">
                  <button class="btn btn-light border" type="button">
                    <img src="/images/cardLogos/logo_humo.png" height="20" width="30" class="country-flagimg" />
                  </button>
                  <input class="form-control rounded-end flag-input" value="Humo" readonly/>
                </div>
              </div>
            </b-col>

            <b-col xl="3" lg="4" md="6">
              <div>
                <label for="humo-merchantId" class="form-label text-muted">{{ $t('filters.merchantId') }}</label>
                <input v-model="form.humoMerchantId" type="text" class="form-control" id="humo-merchantId" />
              </div>
            </b-col>

            <b-col xl="3" lg="4" md="6">
              <div>
                <label for="humo-terminalId" class="form-label text-muted">{{ $t('filters.terminalId') }}</label>
                <input v-model="form.humoTerminalId" type="text" class="form-control" id="humo-terminalId" />
              </div>
            </b-col>
          </b-row>
        </Transition>

        <div class="hstack justify-content-center gap-2 mt-4">
          <b-button type="button" variant="warning" class="px-5" @click="$router.go(-1)">
            {{ $t('btn_text.cancel') }}
          </b-button>
          <b-button
            type="submit" variant="info"
            class="px-5" :loading="loading" loading-mode="fill"
          >
            {{ form.id ? $t('change') : $t('add') }}
          </b-button>
        </div>
      </b-form>
    </b-card-body>
  </b-card>
</template>
