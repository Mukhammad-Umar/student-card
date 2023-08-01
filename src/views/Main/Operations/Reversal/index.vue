<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { onMounted, ref, reactive } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useAutopaymentStore } from "@/stores/autopayment"
import TransactionParams from '@/components/Partials/ListView/TransactionParams.vue'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const route = useRoute()
const toast = useToast()
const transactionStore = useTransactionStore()
const autopaymentStore = useAutopaymentStore()

const form: any = ref({})
const refNum: any = ref('')
const searchLoad = ref(false)
const modalLoading = ref(false)
const modals = reactive({ modal: false })

async function search() {
  if (refNum.value?.length < 10 || /^\d+$/.test(refNum.value) === false) {
    toast.error('Неверный ID Платежа')
    return
  }

  try {
    searchLoad.value = true
    const data = await transactionStore.getTransactionByRefNum(refNum.value)
    if(data?.result) form.value = data?.result
    else toast.error('Транзакция не найдена')
  } finally {
    searchLoad.value = false
  }
}

async function makeReversal() {
  try {
    modalLoading.value = true
    const data = await transactionStore.reversalTransaction(refNum.value)
    if (data.result) {
      toast.success('Транзакция успешно отменена')
      autopaymentStore.changeRecomendedAmount(form.value.autopaymentId)
      form.value = {}
      modals.modal = false
      search()
    }
  } finally {
    modalLoading.value = false
  }
}

const clearForm = () => {
  form.value = {}
  refNum.value = ''
}

onMounted(() => {
  if (route.query.refNum) {
    refNum.value = route.query.refNum
    search()
  }
})
</script>

<template>
  <b-row id="contactList">
    <b-col xl="10">
      <b-card no-body class="card-box-shadow">
        <b-card-header class="d-flex align-items-center border-0">
          <h5 class="card-title mb-0 flex-grow-1">{{ $t('search') }}</h5>
          <i class="mdi mdi-magnify label-icon align-middle text-muted fs-24"></i>
        </b-card-header>
        <b-card-body class="border border-dashed border-end-0 border-start-0">
          <b-row class="g-2">
            <b-col xl="4" lg="6" md="8">
              <div class="search-box">
                <input
                  type="search"
                  class="form-control search"
                  :placeholder="$t('filters.refNum')"
                  @keypress.enter="search"
                  v-model="refNum"
                />
                <i class="ri-search-line search-icon"></i>
              </div>
            </b-col>
            <b-col xl="3" lg="5" md="4">
              <b-button variant="primary" class="w-100" @click="search">
                {{ $t('search') }}
              </b-button>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <TransactionParams
        v-if="Object.keys(form).length"
        :form="form"
        class="mb-2"
        :text="$t('menus.transaction')"
        @emit:clear="clearForm"
        @emit:reversal="modals.modal = true"
      />
    </b-col>

    <MakeSureDialog
      :modals="modals"
      :loading="modalLoading"
      @emit:close="modals.modal = false"
      @emit:success="makeReversal"
      >{{ $t('filters.cancelTransaction') + '?' }}
    </MakeSureDialog>
  </b-row>
</template>
