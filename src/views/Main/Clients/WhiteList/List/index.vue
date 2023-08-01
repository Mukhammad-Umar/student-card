<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useWhiteListStore } from '@/stores/whiteList'
import { ref, reactive, computed, onMounted } from 'vue'

import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const props: any = defineProps({
  filterData: Object
})

const { t } = useI18n()
const toast = useToast()
const whiteListStore = useWhiteListStore()

const rows = ref([])
const loading = ref(true)
const excludeId = ref(0)
const numerationIndex = ref(1)
const modalLoading = ref(false)
const modals = reactive({ modal: false })

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'pinfl', label: t('filters.pinfl') },
  { key: 'fio', label: t('filters.fio') },
  { key: 'passportInfo', label: t('filters.contractNumber'), class: 'text-center',
    formatter: (value: any) => value?.substring(0, 2) + ' ' + value?.slice(2) },
  { key: 'organizationBranchName', label: t('filters.branch'), class: 'text-center' },
  { key: 'actions', label: '', class: 'text-center' }
])

async function getList() {
  try {
    loading.value = true

    const data = await whiteListStore.getList({
      Fio: props.filterData?.fio,
      Pinfl: props.filterData?.pinfl || null,
      OrganizationId: props.filterData?.organizationId,
      PassportInfo: props.filterData?.passportInfo?.replace(/\s/g, '') || null,
      // PhoneNumber: props.filterData?.phoneNumber ? '998' + props.filterData?.phoneNumber?.replace(/[^0-9]/g, '') : null,
      CurrentPage: props.filterData?.pagination.page,
      PerPage: props.filterData?.pagination.rowsPerPage
    })

    rows.value = data
    props.filterData.pagination.rowsNumber = whiteListStore.totalPages
    props.filterData.pagination.totalCount = whiteListStore.totalCount

    numerationIndex.value =
      (props.filterData?.pagination.page - 1) * props.filterData?.pagination.rowsPerPage
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

async function removePayer() {
  try {
    modalLoading.value = true
    const data = await whiteListStore.removePayer(excludeId.value)

    if (data?.result) {
      excludeId.value = 0
      modals.modal = false
      toast.success(t('success.deleted'))
      await getList()
    }
  } finally {
    modalLoading.value = false
  }
}

onMounted(async () => {
  await getList()
})
</script>

<template src="./template.html"></template>
