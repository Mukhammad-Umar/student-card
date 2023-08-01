<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAutopaymentStore } from '@/stores/autopayment'

import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

const props = defineProps({
  form: Object
})

const route = useRoute()
const autopaymentStore = useAutopaymentStore()

const clientsList = ref([])
const clientLoading = ref(false)
const form: any = ref(props.form)
const clientTimerId: any = ref(null)

watch(() => props.form?.organizationBranchId, val => {
  form.value.debtorId = null
  if (val) getClients(null)
})

const searchClient = (pinfl: any) => {
  clearTimeout(clientTimerId.value)
  clientTimerId.value = setTimeout(() => getClients(pinfl), 500)
}

async function getClients(pinfl: any) {
  try {
    clientLoading.value = true
    const data = await autopaymentStore.getClients({
      organizationBranchId: props.form?.organizationBranchId,
      pinfl: pinfl || route.query.pinfl || null,
      currentPage: 1,
      perPage: 100
    })
    clientsList.value = data?.data.result

    if (route.query.pinfl) {
      form.value.debtorId = clientsList.value.filter((client: any) => client.name.includes(route.query.pinfl))[0]
    }
  } finally {
    clientLoading.value = false
  }
}
</script>

<template>
  <Multiselect
    v-model="form.debtorId"
    :options="clientsList"
    label="name"
    value-prop="id"
    :loading="clientLoading"
    :searchable="true"
    :create-option="true"
    :canClear="true"
    :canDeselect="true"
    :noOptionsText="$t('error.noData')"
    :noResultsText="$t('error.noData')"
    :placeholder="$t('client')"
    @search-change="searchClient"
  />
</template>
