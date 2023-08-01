<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAutopaymentStore } from '@/stores/autopayment'

import TheLoader from '@/components/Common/TheLoader.vue'
import PageHeader from '@/components/Common/PageHeader.vue'
import ClientData from '@/components/Partials/ListView/ClientData.vue'
import AutopayViewTable from '@/components/Partials/ListView/AutopayViewTable.vue'
import TransactionsTable from '@/components/Partials/ListView/TransactionsTable.vue'

const route: any = useRoute()
const autopaymentStore = useAutopaymentStore()

const form: any = ref({})
const loading = ref(true)

async function getById() {
  try {
    loading.value = true

    const data = await autopaymentStore.getById(route.params.id)
    form.value = data?.result
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getById()
  autopaymentStore.changeRecomendedAmount(route.params.id)
})
</script>

<template>
  <b-row>
    <div class="">
      <PageHeader
        :title="$t('breadcrumbs.autopayView')"
        :route="'MainOperationsAutopaymentsList'"
        :text1="$t('breadcrumbs.autopayments')"
        :text2="$t('breadcrumbs.view')"
      />
    </div>

    <TheLoader v-if="loading" :loading="loading" />

    <template v-else>
      <AutopayViewTable :form="form" @emit:refresh="getById" />
      <ClientData :clientId="form.organizationDebtorId" />
      <TransactionsTable :autopaymentId="form.id" />
    </template>
  </b-row>
</template>
