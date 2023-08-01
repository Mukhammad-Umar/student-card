<script setup lang="ts">
import { ref, onMounted } from 'vue'

import PageHeader from '@/components/Common/PageHeader.vue'
import ClientData from '@/components/Partials/ListView/ClientData.vue'
import ContractsTable from '@/components/Partials/ListView/ContractsTable.vue'
import AutopaymentsTable from '@/components/Partials/ListView/AutopaymentsTable.vue'
import TransactionsTable from '@/components/Partials/ListView/TransactionsTable.vue'

import AddCard from '@/components/Dialogs/AddCard.vue'
import AutopaymentCards from '@/components/Partials/Card/AutopaymentCards.vue'
import HumoGateCard from '@/components/Partials/Card/HumoGateCard.vue'
import SvGateCards from '@/components/Partials/Card/SvGateCards.vue'

const gotData = ref(false)
const cardsRefresh = ref(1)
const client: any = ref({})

onMounted(() => {
  setTimeout(() => gotData.value = true, 100)
})
</script>

<template>
  <b-row>
    <div class="">
      <PageHeader
        :title="$t('breadcrumbs.clientView')"
        :route="'MainClientsContractsList'"
        :text1="$t('breadcrumbs.clients')"
        :text2="$t('breadcrumbs.view')"
      />
    </div>

    <b-col lg="8">
      <ClientData @emit:client="client = $event" />
      <ContractsTable :clientPinfl="client.pinfl" />
      <AutopaymentsTable :client="client" />
      <TransactionsTable />
    </b-col>

    <b-col lg="4">
      <div class="d-flex flex-wrap align-items-start gap-2 mb-3">
        <AddCard @emit:success="cardsRefresh++"/>
      </div>

      <template v-if="gotData">
        <AutopaymentCards :client="client" :cardsRefresh="cardsRefresh" :integrationSystemId="1"/>

        <HumoGateCard :client="client" :cardsRefresh="cardsRefresh" :integrationSystemId="2"/>

        <SvGateCards :client="client" :cardsRefresh="cardsRefresh" :integrationSystemId="3"/>
      </template>
    </b-col>
  </b-row>
</template>
