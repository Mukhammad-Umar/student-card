<script setup lang="ts">
import filters from '@/filters'
import { useI18n } from 'vue-i18n'
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAutopaymentStore } from '@/stores/autopayment'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const props = defineProps({
  form: Object
})

const { t } = useI18n()
const toast = useToast()
const route: any = useRoute()
const autopaymentStore = useAutopaymentStore()

const statusId = ref(0)
const modalText = ref('')
const modalLoading = ref(false)
const modals = reactive({ modal: false })

const mathPercent = (amount: number, payedAmount: number) => {
  let difference = ((payedAmount * 100) / amount).toFixed(2)
  return Number(difference)
}

const statusColor = (amount: number, payedAmount: number) => {
  const diff = (payedAmount * 100) / amount
  if (diff > 60) return 'success'
  else if (diff > 20) return 'warning'
  else return 'danger'
}

const preAction = (key: number) => {
  statusId.value = key

  if (key === 0) modalText.value = t('dialog.resumeCurrent')
  else if (key === 1) modalText.value = t('dialog.stopCurrent')
  else modalText.value = t('dialog.finishCurrent')

  modals.modal = true
}

async function completeAutopay() {
  try {
    modalLoading.value = true

    const data = await autopaymentStore.changeStatusBySelect({
      statusId: statusId.value,
      organizationBranchId: 0,
      autopaymentIds: [props.form?.id],
      organizationId: props.form?.organizationId
    })

    if (data?.result) {
      toast.success('Успешно')
      modals.modal = false
      emit('emit:refresh')
    }
  } finally {
    modalLoading.value = false
  }
}

const emit = defineEmits(['emit:refresh'])
</script>

<template>
  <b-card no-body class="card-box-shadow">
    <b-card-header>
      <h5 class="card-title mb-0">{{ $t('autopayment') }}</h5>
    </b-card-header>
    <b-card-body class="row g-4">
      <div>
        <div class="table-responsive table-card mb-0">
          <table class="table table-nowrap align-middle" id="orderTable">
            <thead class="text-muted table-light">
              <tr>
                <th class="sort text-center" data-sort="contract">{{ $t('filters.contractId') }}</th>
                <th class="sort text-center" data-sort="amount">{{ $t('amount') }}</th>
                <th class="sort text-center" data-sort="statusName">{{ $t('status') }}</th>
                <th class="sort text-center" data-sort="payedAmount">{{ $t('progress') }}</th>
                <th class="sort text-center" data-sort="payedAmount">{{ $t('paid') }}</th>
                <th class="sort text-center" data-sort="createDate">{{ $t('regDate') }}</th>
                <th v-if="form?.status === 2" class="sort text-center" data-sort="finishedDate">{{ $t('compDate') }}</th>
                <th 
                  v-if="form?.status !== 2 || !route.name?.includes('AutopaymentsView')" 
                  class="sort text-center" data-sort="actions"
                >{{ $t('dialog.action') }}</th>
              </tr>
            </thead>

            <tbody class="list form-check-all">
              <tr>
                <td class="contract text-center">
                  <router-link :to="{ name: 'MainClientsContractsView',params: { id: form?.organizationDebtorId } }">
                    {{ form?.organizationContractInfo }}
                  </router-link>
                </td>

                <td class="amount text-center">{{ filters.filterMoney(form?.amount / 100) }}</td>

                <td class="statusName text-center">
                  <span
                    class="badge text-uppercase"
                    :class="form?.status === 0 || form?.status === 20
                      ? 'badge-soft-success' : form?.status === 2
                      ? 'badge-soft-danger' : 'badge-soft-warning'
                    "
                  >{{ form?.statusName }}</span>
                </td>

                <td class="payedAmount text-center text-muted">
                  {{ mathPercent(form?.amount, form?.payedAmount) + '%' }}
                  <b-progress
                    height="6px" :max="100"
                    :value="mathPercent(form?.amount, form?.payedAmount)"
                    :variant="statusColor(form?.amount, form?.payedAmount)"
                  ></b-progress>
                </td>
                <td class="payedAmount text-center">{{ filters.filterMoney(form?.payedAmount / 100) }}</td>
                <td class="createDate text-center">{{ form?.updateDate }}</td>
                <td v-if="form?.status === 2" class="finishedDate text-center">{{ form?.finishedDate }}</td>
                <td v-if="form?.status !== 2 || !route.name?.includes('AutopaymentsView')" class="actions text-center">
                  <i
                    v-if="form?.status !== 2" class="mdi cup h3"
                    v-can="[form?.status === 0 ? 'autopayment_pause' : 'autopayment_resume']"
                    :class="form?.status === 0 ? 'mdi-pause-circle-outline text-warning' : 'mdi-play-circle-outline text-success'"
                    v-tooltip="form?.status === 0 ? $t('btn_text.stop') : $t('btn_text.resume')"
                    @click="preAction(form?.status === 0 ? 1 : 0)"
                  ></i>

                  <i
                    v-if="form?.status !== 2" v-can="['autopayment_finish']"
                    class="mdi cup h3 mdi-stop-circle-outline text-danger ml-2"
                    v-tooltip="$t('btn_text.finish')" @click="preAction(2)"
                  ></i>

                  <i
                    v-if="!route.name?.includes('AutopaymentsView')" v-can="['autopayment_view']"
                    class="mdi mdi-arrow-right-circle-outline text-info cup h3 ml-2"
                    @click="$router.push({ name: 'MainOperationsAutopaymentsView', params: { id: form?.id } })"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </b-card-body>

    <MakeSureDialog
      :modals="modals"
      :loading="modalLoading"
      @emit:close="modals.modal = false"
      @emit:success="completeAutopay"
      >{{ modalText }}
    </MakeSureDialog>
  </b-card>
</template>
