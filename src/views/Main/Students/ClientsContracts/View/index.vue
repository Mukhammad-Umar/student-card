<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'

import filters from '@/filters'
import PageHeader from '@/components/Common/PageHeader.vue'
import ApplicationInfo from '@/components/Partials/ListView/ApplicationInfo.vue'
import StatusInfo from '@/components/Partials/ListView/StatusInfo.vue'
import AbsInfo from '@/components/Partials/ListView/AbsInfo.vue'
import HemisInfo from '@/components/Partials/ListView/HemisInfo.vue'
import DpmInfo from '@/components/Partials/ListView/DpmInfo.vue'
import ProcessLog from '@/components/Partials/ListView/ProcessLog.vue'
import GeneretedCard from '@/components/Partials/ListView/GeneretedCard.vue'

const allData = ref({})
const route = useRoute()
const loading = ref(true)
const clientStore = useClientStore()

async function getData() {
  try{
    loading.value = true
    const data = await clientStore.getById(route.params.id)

    data.issue_date = filters.filterMonthDate(data.issue_date)
    data.birthday = filters.filterMonthDate(data.birthday?.split('T')[0])
    data.serial_number = data.serial_number?.substring(0, 2) + ' ' + data.serial_number?.slice(2)

    allData.value = data
  } finally {
    loading.value = false
  }
}

onMounted(() => getData())
</script>

<template>
  <b-row>
    <div class="">
      <PageHeader
        :title="$t('breadcrumbs.clientView')"
        :route="'MainStudentsContractsList'"
        :text1="$t('breadcrumbs.clients')"
        :text2="$t('breadcrumbs.view')"
      />
    </div>

    <b-col lg="8">
      <ApplicationInfo :info="allData" />

      <StatusInfo :info="allData" />

      <AbsInfo :info="allData" />

      <HemisInfo :info="allData" />
      
      <DpmInfo :info="allData" />
    </b-col>

    <b-col lg="4">
      <ProcessLog />

      <GeneretedCard />
    </b-col>
  </b-row>
</template>
