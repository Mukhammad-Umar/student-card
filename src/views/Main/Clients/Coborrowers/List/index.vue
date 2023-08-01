<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref, computed } from 'vue'
import { useCoborrowerStore } from '@/stores/coborrower'

import filters from '@/filters'
import ExportBtn from '@/components/Common/ExportBtn.vue'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const props: any = defineProps({
  filterData: Object
})

const { t } = useI18n()
const coborrowerStore = useCoborrowerStore()

const rows = ref([])
const loading = ref(true)
const loadBtn = ref(false)
const exportRef: any = ref(null)
const numerationIndex = ref(1)

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'pinfl', label: t('filters.pinfl') },
  { key: 'fio', label: t('filters.fio') },
  { key: 'organizationContractInfo', label: t('filters.contractNumber'), class: 'text-center' },
  { key: 'passportInfo', label: t('userInfo.numberSeries'), class: 'text-center',
    formatter: (value: any) => value?.substring(0, 2) + ' ' + value?.slice(2) },
  { key: 'wclientTypeName', label: t('filters.clientType'), class: 'text-center' },
  { key: 'organizationBranchName', label: t('filters.branch'), class: 'text-center' },
  { key: 'actions', label: t('goToPage'), class: 'text-center' }
])

async function getClients() {
  try {
    loading.value = true

    const data = await coborrowerStore.getClients({
      Fio: props.filterData?.fio,
      Pinfl: props.filterData?.pinfl || null,
      OrganizationId: 0,
      PassportInfo: props.filterData?.passportInfo?.replace(/\s/g, '') || null,
      ContractLoanId: props.filterData?.contractLoanId,
      CurrentPage: props.filterData?.pagination.page,
      PerPage: props.filterData?.pagination.rowsPerPage
    })

    rows.value = data
    props.filterData.pagination.rowsNumber = coborrowerStore.totalPages
    props.filterData.pagination.totalCount = coborrowerStore.totalCount

    numerationIndex.value = (props.filterData?.pagination.page - 1) * props.filterData?.pagination.rowsPerPage
    signIndex()
  } finally {
    setTimeout(() => (loading.value = false))
  }
}

const signIndex = () => {
  if (rows.value?.length) {
    rows.value.forEach((row: any, index: any) => {
      if (props.filterData?.pagination.page === 1) row.index = index + 1
      else row.index = numerationIndex.value + index + 1
    })
  }
}

async function downloadExcel() {
  try {
    loadBtn.value = true

    const data = await coborrowerStore.downloadPayers({
      Fio: props.filterData?.fio,
      Pinfl: props.filterData?.pinfl || null,
      OrganizationId: 0,
      PassportInfo: props.filterData?.passportInfo?.replace(/\s/g, "") || null,
      ContractLoanId: props.filterData?.contractLoanId,
    })

    exportRef.value.download(data)
  } finally {
    loadBtn.value = false
  }
}

onMounted(() => getClients())
</script>

<template src="./template.html"></template>
