<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCoreStore } from '@/stores/core'
import { onMounted, ref, computed } from 'vue'
import { useClientStore } from '@/stores/client'

import filters from '@/filters'
import ExportBtn from '@/components/Common/ExportBtn.vue'
import PrintCard from '@/components/Dialogs/PrintCard.vue'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const props: any = defineProps({
  filterData: Object
})

const { t } = useI18n()
const coreStore = useCoreStore()
const clientStore = useClientStore()

const rows: any = ref([])
const loading = ref(true)
const loadBtn = ref(false)
const numerationIndex = ref(1)
const exportRef: any = ref(null)
const universities: any = ref([])
const universityList: any = ref([])
const statuses = ref([{ id: null, name: 'Статус студента', disabled: true }])

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'pinfl', label: t('filters.pinfl') },
  { key: 'firstname', label: t('filters.fio') },
  { key: 'university_name', label: 'Название Вуза', class: 'text-center' },
  { key: 'serial_number', label: t('userInfo.numberSeries'), class: 'text-center',
    formatter: (value: any) => value ? value?.substring(0, 2) + ' ' + value?.slice(2) : '' },
  { key: 'hemis_id', label: 'ID студента', class: 'text-center' },
  { key: 'card_number', label: 'Номер карты', class: 'text-center' },
  { key: 'contract', label: 'Контракт СКС', class: 'text-center' },
  { key: 'phone_number', label: 'Номер телефона', class: 'text-center',
    formatter: (value: any) => value.length === 12 ? filters.filterFullPhoneNumber(value) : value},
  { key: 'status', label: 'Статус', class: 'text-center' },
  { key: 'actions', label: t('filters.action'), class: 'text-center' }
])

async function getUniversities() {
  const data = await coreStore.getUniversities()

  universityList.value = JSON.parse(JSON.stringify(data))
  universityList.value.unshift({ hemis_code: null, name: 'Выберите ВУЗа', disabled: true })

  universities.value = data
  universities.value.unshift({ hemis_code: null, name: 'Все ВУЗы' })
}

async function getClients() {
  try {
    loading.value = true

    const data: any = await clientStore.getClients({
      full_name: props.filterData?.fio,
      pinfl: props.filterData?.pinfl || null,
      university_code: props.filterData?.university,
      serial_number: props.filterData?.passportInfo ? props.filterData.passportInfo.toUpperCase()?.replace(/\s/g, "") : null,
      count: props.filterData?.pagination.page,
      page_size: props.filterData?.pagination.rowsPerPage
    })

    rows.value = data?.results
    props.filterData.pagination.rowsNumber = Math.ceil(data?.total / data?.page_size)
    props.filterData.pagination.totalCount = data?.total

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

    const data = await clientStore.downloadPayers({
      Fio: props.filterData?.fio,
      Pinfl: props.filterData?.pinfl || null,
      ContractLoanId: props.filterData?.contractLoanId,
      OrganizationBranchId: props.filterData?.organizationBranchId,
      PassportInfo: props.filterData?.passportInfo?.replace(/\s/g, "") || null,
    })

    exportRef.value.download(data)
  } finally {
    loadBtn.value = false
  }
}

onMounted(async () => {
  await getUniversities()
  await getClients()
})
</script>

<template src="./template.html"></template>
