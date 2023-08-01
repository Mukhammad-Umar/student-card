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

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const form: any = ref(props.form)
const terminalStore = useTerminalStore()

const rules = computed(() => {
  return { groupName: { required } }
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
      <h5 class="card-title text-primary mb-0">{{ $t('sysUsers.terminalGroups') }}</h5>
    </b-card-header>

    <b-card-body>
      <b-form @submit.prevent="submit" class="my-2">
        <b-row class="g-4">
          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="form-groupName" class="form-label text-muted">
                {{ $t('sysUsers.groupName') }}
              </label>
              <input
                type="text"
                class="form-control"
                id="form-groupName"
                v-model="$v.groupName.$model"
                :class="{
                  'is-invalid': $v.groupName.$error && $v.groupName.$dirty,
                  error: $v.groupName.$error
                }"
              />
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6" class="d-flex align-items-end">
            <b-button
              type="submit"
              variant="info"
              class="w-100"
              :loading="loading"
              loading-mode="fill"
            >
              {{ form.id ? $t('change') : $t('add') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-card-body>
  </b-card>
</template>
