<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useBranchStore } from '@/stores/branch'
import { useAutopaymentStore } from '@/stores/autopayment'

import filters from '@/filters'
import ExportBtn from '@/components/Common/ExportBtn.vue'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const props: any = defineProps({
  filterData: Object
})

const { t } = useI18n()
const toast = useToast()
const branchStore = useBranchStore()
const autopaymentStore = useAutopaymentStore()

const branches = ref([])
const rows: any = ref([])
const loading = ref(true)
const loadBtn = ref(false)
const exportRef: any = ref(null)
const numerationIndex = ref(1)

const statusId = ref(0)
const modalText = ref('')
const selected: any = ref([])
const allSelected = ref(false)
const indeterminate = ref(false)
const modalLoading = ref(false)
const modals = reactive({ modal: false })

const fields = computed(() => [
  { key: props.filterData?.isFinishedAutoPayments ? '' : 'selected', label: '' },
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'updateDate', label: t('addedDate'), class: 'text-center' },
  { key: 'fio', label: t('filters.fio') }, // sortable: true
  { key: 'organizationContractInfo', label: t('filters.contractId'), class: 'text-center' },
  { key: 'amount', label: t('autoPayAmount'), class: 'text-center', formatter: (val: any) => filters.filterMoney(val / 100) },
  { key: 'payedAmount', label: t('payedAmount'), class: 'text-center', formatter: (val: any) => filters.filterMoney(val / 100) },
  { key: 'recommendedAmount', label: t('leftAmount'), class: 'text-center', formatter: (val: any) => filters.filterMoney(val / 100) },
  { key: 'period', label: props.filterData?.isFinishedAutoPayments ? t('endDate') : t('startDate'), class: 'text-center' },
  { key: 'organizationBranchName', label: t('filters.branch'), class: 'text-center' },
  { key: 'statusName', label: t('filters.status'), class: 'text-center' },
  { key: 'actions', label: t('filters.action'), class: 'text-center' }
])

watch(() => props.filterData?.isFinishedAutoPayments, () => getList())

async function getBranches() {
  props.filterData.organizationBranchId = 0
  const data = await branchStore.getBranches()
  if(data[0].name === 'Все') data[0].name = 'Все филиалы'
  branches.value = data
}

async function getList() {
  try {
    loading.value = true
    selected.value = []
    indeterminate.value = false

    const data = await autopaymentStore.getAutopayments({
      ContractLoanId: props.filterData?.contractLoanId,
      AutoPaymentDate: props.filterData?.autoPaymentDate || null,
      OrganizationBranchId: props.filterData?.organizationBranchId,
      isFinishedAutoPayments: props.filterData?.isFinishedAutoPayments,
      CurrentPage: props.filterData?.pagination.page,
      PerPage: props.filterData?.pagination.rowsPerPage
      // SortPropertyId: sortId,
      // FilterPropertyId: filterId
    })

    rows.value = data
    props.filterData.countInfo = autopaymentStore.countInfo
    props.filterData.pagination.rowsNumber = autopaymentStore.totalPages
    props.filterData.pagination.totalCount = autopaymentStore.totalCount

    numerationIndex.value = (props.filterData?.pagination.page - 1) * props.filterData?.pagination.rowsPerPage

    signIndex()
  } finally {
    loading.value = false
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

const toggleAll = (checked: any) => {
  selected.value = []
  indeterminate.value = false
  rows.value.forEach((item: any) => {
    item.isSelected = checked
    if (checked) selected.value.push(item.id)
  })
}

const toggleOne = (checked: any, id: string) => {
  checked ? selected.value.push(id) : (selected.value = selected.value.filter((val: any) => val !== id))

  if (selected.value?.length !== rows.value?.length && selected.value?.length !== 0) indeterminate.value = true
  else indeterminate.value = false
}

const actionBtn = (key: number) => {
  if (key === 0) {
    statusId.value = key
    modalText.value = selected.value?.length ? t('dialog.resumeSelecteds') : t('dialog.resumeAll')
  } else if (key === 1) {
    statusId.value = key
    modalText.value = selected.value?.length ? t('dialog.stopSelecteds') : t('dialog.stopAll')
  } else {
    statusId.value = key
    modalText.value = selected.value?.length ? t('dialog.finishSelecteds') : t('dialog.finishAll')
  }
  modals.modal = true
}

async function changeStatusBySelect() {
  try {
    modalLoading.value = true

    const data = selected.value?.length
      ? await autopaymentStore.changeStatusBySelect({
          statusId: statusId.value,
          organizationBranchId: props.filterData?.organizationBranchId,
          autopaymentIds: selected.value
        })
      : await autopaymentStore.changeStatusAllAutoPayments({
          statusId: statusId.value,
          organizationBranchId: props.filterData?.organizationBranchId
        })

    if (data?.result) {
      selected.value = []
      modals.modal = false
      allSelected.value = false
      toast.success(statusId.value === 0 ? t('success.resumed') : statusId.value === 1 ? t('success.stopped') : t('success.finished'))
      await getList()
    }
  } finally {
    modalLoading.value = false
  }
}

async function downloadExcel() {
  try {
    loadBtn.value = true

    const data = await autopaymentStore.downloadAutopayments({
      ContractLoanId: props.filterData?.contractLoanId,
      isFinishedAutoPayments: props.filterData?.isFinishedAutoPayments,
      AutoPaymentDate: props.filterData?.autoPaymentDate?.split("-").reverse().join("-") || null,
    })

    exportRef.value.download(data)
  } finally {
    loadBtn.value = false
  }
}

onMounted(async () => {
  await getBranches()
  await getList()
})
</script>

<template src="./template.html"></template>
