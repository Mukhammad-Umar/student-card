<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useAutopaymentStore } from '@/stores/autopayment'
import { useTransactionStore } from '@/stores/transaction'

import TheLoader from '@/components/Common/TheLoader.vue'
import PageHeader from '@/components/Common/PageHeader.vue'
import ClientData from '@/components/Partials/ListView/ClientData.vue'
import TransactionParams from '@/components/Partials/ListView/TransactionParams.vue'
import AutopayViewTable from '@/components/Partials/ListView/AutopayViewTable.vue'
import TransactionsTable from '@/components/Partials/ListView/TransactionsTable.vue'

const route = useRoute()
const autopaymentStore = useAutopaymentStore()
const transactionStore = useTransactionStore()

const autopay = ref({})
const loading = ref(true)
const form: any = ref({})

async function getById() {
  loading.value = true

  const data = await transactionStore.getTransactionById(route.params.id)
  form.value = data.result

  getAutopayById(data.result.autopaymentId)
}

async function getAutopayById(autopaymentId: string) {
  const data = await autopaymentStore.getById(autopaymentId)
  autopay.value = data?.result
  setTimeout(() => (loading.value = false), 0)
}

onMounted(() => getById())
</script>

<template>
  <b-row>
    <div class="">
      <PageHeader
        :title="$t('breadcrumbs.transactionView')"
        :route="'MainOperationsTransactionsList'"
        :text1="$t('breadcrumbs.transactions')"
        :text2="$t('breadcrumbs.view')"
      />
    </div>

    <TheLoader v-if="loading" :loading="loading" />

    <template v-else>
      <ClientData :clientId="form.organizationDebtorId" />

      <TransactionParams :text="$t('menus.transaction')" :form="form" />

      <AutopayViewTable :form="autopay" @emit:refresh="getAutopayById" />

      <TransactionsTable v-if="!loading" :autopaymentId="form.autopaymentId" :text="$t('clientsTab.autopaysByTran')"/>
    </template>
  </b-row>
</template>
