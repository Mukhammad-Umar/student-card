<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted, watch } from 'vue'
import { useAutopaymentStore } from '@/stores/autopayment'
import filters from '@/filters'

const props = defineProps({
  client: Object,
  clientId: String,
  onlyActives: Boolean
})

const route = useRoute()
const autopaymentStore = useAutopaymentStore()

const rows: any = ref([])
const loading = ref(false)

const filterData = reactive({
  isFinishedAutoPayments: false,
  organizationDebtorId: '',
  pagination: {
    page: 1,
    rowsPerPage: 50,
    rowsNumber: 1,
    totalCount: 1
  }
})

watch(() => filterData.isFinishedAutoPayments, () => getList())

const mathPercent = (amount: number, payedAmount: number) => {
  let difference = ((payedAmount * 100) / amount).toFixed(2)
  return Number(difference)
}

const statusColor = (amount: number, payedAmount: number) => {
  const diff = (payedAmount * 100) / amount
  if (diff > 60) return 'success'
  else if (diff > 20) return 'warning'
  else return 'danger'
}

async function getList() {
  try {
    loading.value = true

    const data = await autopaymentStore.getAutopaymentsByContract({
      organizationDebtorId: props.clientId || route.params.id,
      isFinishedAutoPayments: filterData.isFinishedAutoPayments,
      CurrentPage: filterData.pagination.page,
      PerPage: filterData.pagination.rowsPerPage
    })

    rows.value = data.data?.result || []
    filterData.pagination.rowsNumber = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalPages
      : 1
    filterData.pagination.totalCount = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalCount
      : 1
  } finally {
    if (rows.value?.length) emit('emit:show', 1)
    else emit('emit:show', 0)
    setTimeout(() => (loading.value = false), 0)
  }
}

onMounted(() => getList())

const emit = defineEmits(['emit:show'])
</script>

<template>
  <b-card no-body class="card-box-shadow">
    <b-card-header class="d-flex justify-content-between align-items-center">
      <h5 class="card-title mb-0 d-flex align-items-center">{{ $t('clientsTab.autopayments') }}</h5>
      <b-button
        variant="info" v-can="['autopayment_add']"
        @click="$router.push({
          name: 'MainOperationsAutopaymentsAdd',
          query: { debtorId: $route.params.id, branchId: client?.organizationBranchId }
        })"
      >
        {{ $t('add') }} <i class="mdi mdi-plus"></i>
      </b-button>
    </b-card-header>
    <b-card-body class="pt-0">
      <div>
        <ul class="nav nav-tabs nav-tabs-custom nav-info mb-3" role="tablist">
          <li class="nav-item">
            <b-link
              role="tab"
              data-bs-toggle="tab"
              class="nav-link All py-3"
              :class="{ active: !filterData.isFinishedAutoPayments }"
              @click="filterData.isFinishedAutoPayments = false"
              aria-selected="true"
            >
              {{ $t('active') }}
            </b-link>
          </li>
          <li v-if="!onlyActives" class="nav-item">
            <b-link
              role="tab"
              data-bs-toggle="tab"
              class="nav-link py-3 Complited"
              :class="{ active: filterData.isFinishedAutoPayments }"
              @click="filterData.isFinishedAutoPayments = true"
              aria-selected="false"
            >
              {{ $t('completed') }}
            </b-link>
          </li>
        </ul>

        <div class="table-responsive table-card mb-1">
          <table class="table table-nowrap align-middle" id="orderTable">
            <thead class="text-muted table-light">
              <tr>
                <th class="sort text-center" data-sort="contract">
                  {{ $t('filters.contractId') }}
                </th>
                <th class="sort text-center" data-sort="amount">{{ $t('amount') }}</th>
                <th class="sort text-center" data-sort="statusName">{{ $t('status') }}</th>
                <th class="sort text-center" data-sort="payedAmount">{{ $t('progress') }}</th>
                <th class="sort text-center" data-sort="payedAmount">{{ $t('paid') }}</th>
                <th class="sort text-center" data-sort="createDate">{{ $t('regDate') }}</th>
                <th
                  class="sort text-center"
                  data-sort="finishedDate"
                  v-if="filterData.isFinishedAutoPayments"
                >
                  {{ $t('compDate') }}
                </th>
                <th class="sort text-center" data-sort="goTo">{{ $t('goToPage') }}</th>
              </tr>
            </thead>

            <tbody v-if="loading">
              <tr>
                <td colspan="8" class="text-center">
                  <b-spinner variant="info" key="info" type="grow"></b-spinner>
                </td>
              </tr>
            </tbody>

            <template v-else>
              <tbody
                v-if="rows?.length"
                class="list form-check-all"
                v-for="(row, index) of rows"
                :key="index"
              >
                <tr>
                  <td class="contract text-center">
                    <span v-if="$route.name === 'MainClientsContractsView'">{{ row.organizationContractInfo }}</span>
                    <router-link v-else :to="{name: 'MainClientsContractsView', params: { id: row.organizationDebtorId}}">
                      {{ row.organizationContractInfo }}
                    </router-link>
                  </td>
                  <td class="amount text-center">{{ filters.filterMoney(row.amount / 100) }}</td>
                  <td class="statusName text-center">
                    <span
                      class="badge text-uppercase"
                      :class="row.status === 0 || row.status === 20 
                        ? 'badge-soft-success' : row.status === 2
                        ? 'badge-soft-danger' : 'badge-soft-warning'
                      "
                    >{{ row.statusName }}</span>
                  </td>
                  <td class="payedAmount text-center text-muted">
                    {{ mathPercent(row.amount, row.payedAmount) + '%' }}
                    <b-progress
                      height="6px"
                      :value="mathPercent(row.amount, row.payedAmount)"
                      :max="100"
                      :variant="statusColor(row.amount, row.payedAmount)"
                    ></b-progress>
                  </td>
                  <td class="payedAmount text-center">{{ filters.filterMoney(row.payedAmount / 100) }}</td>
                  <td class="createDate text-center">{{ row.updateDate }}</td>
                  <td class="finishedDate text-center" v-if="filterData.isFinishedAutoPayments">{{ row.finishedDate }}</td>
                  <td class="goTo text-center">
                    <i
                      class="mdi mdi-arrow-right-circle-outline text-info cup h3"
                      @click="$router.push({name: 'MainOperationsAutopaymentsView', params: { id: row.id }})"
                    ></i>
                  </td>
                </tr>
              </tbody>

              <tbody v-else>
                <tr>
                  <td colspan="8" class="text-center text-muted">{{ $t('noData') }}</td>
                </tr>
              </tbody>
            </template>
          </table>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>
