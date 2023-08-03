<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useClientStore } from '@/stores/client'
import { useToast } from 'vue-toastification'

const props: any = defineProps({
  text: String,
  payers: Object,
  isBorrower: Boolean
})

const { t } = useI18n()
const toast = useToast()
const clientStore = useClientStore()
const permissions = JSON.parse(JSON.stringify(localStorage.getItem('Permission')))

async function updateAllows(wclientId: string, state: boolean) {
  const data = await clientStore.updateWClientState({
    wclientId: wclientId,
    state: state,
  })

  if (data.result) toast.success(t('success.updated'))
}
</script>

<template>
  <div>
    <b-card-header class="d-flex justify-content-center py-3">
      <h5 class="card-title text-primary mb-0">{{ text }}</h5>
    </b-card-header>

    <b-card-body class="py-0">
      <div
        v-if="payers?.length"
        class="py-3 border-bottom"
        v-for="payer in (payers as any)"
        :key="payer.wclientId"
      >
        <div class="d-flex align-items-center mb-2">
          <div class="flex-shrink-0">
            <p class="text-muted mb-0">{{ $t('filters.fio') }} :</p>
          </div>
          <div class="flex-grow-1 ms-2">
            <router-link class="float-end text-right"
              :to="{ name: 'MainStudentsContractsView', params: { id: payer.organizationDebtorId } }"
            >
              {{ payer.fio }}
            </router-link>
          </div>
        </div>
        <div class="d-flex align-items-center mb-2">
          <div class="flex-shrink-0">
            <p class="text-muted mb-0">{{ $t('filters.pinfl') }} :</p>
          </div>
          <div class="flex-grow-1 ms-2">
            <h6 class="mb-0 text-right">{{ payer.pinfl }}</h6>
          </div>
        </div>
        <div v-if="isBorrower" class="d-flex align-items-center mb-2">
          <div class="flex-shrink-0">
            <p class="text-muted mb-0">{{ $t('filters.contractId') }} :</p>
          </div>
          <div class="flex-grow-1 ms-2">
            <h6 class="mb-0 text-right">{{ payer.loanId }}</h6>
          </div>
        </div>
        <div v-if="!isBorrower" class="d-flex align-items-center">
          <div class="flex-shrink-0">
            <p class="text-muted mb-0">{{ $t('allowWriteOff') }} :</p>
          </div>
          <div class="form-check form-switch form-switch-success flex-grow-1 ms-2 mb-0">
            <input
              v-if="permissions?.includes('wclient_contract_state_edit')"
              v-model="payer.state"
              type="checkbox" class="form-check-input float-end"
              @change="updateAllows(payer.wclientId, payer.state)"
            />
            <input
              v-else
              v-model="payer.state" readonly
              type="checkbox" class="form-check-input float-end"
              @change="updateAllows(payer.wclientId, payer.state)"
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="d-flex flex-column align-items-center gap-2 py-2 border-bottom"
      >
        <span class="text-muted">{{ $t('noData') }}</span>
      </div>
    </b-card-body>
  </div>
</template>
