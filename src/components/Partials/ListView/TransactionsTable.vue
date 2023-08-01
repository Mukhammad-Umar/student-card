<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'
import { ref, onMounted, reactive, watch } from 'vue'
import { useCoborrowerStore } from '@/stores/coborrower'
import { useTransactionStore } from '@/stores/transaction'
import filters from '@/filters'

const props = defineProps({
  text: String,
  autopaymentId: String
})

const route: any = useRoute()
const clientStore = useClientStore()
const coborrowerStore = useCoborrowerStore()
const transactionStore = useTransactionStore()

const rows = ref([])
const expand = ref(false)
const expandId = ref(null)
const pages: any = ref([])
const loading = ref(false)

const filterData = reactive({
  organizationDebtorId: '',
  pagination: {
    page: 1,
    rowsPerPage: 5,
    rowsNumber: 1,
    totalCount: 1
  }
})

watch(filterData, () => {
  if (!loading.value) getList()
})

const eposUpd = (epos: string) => {
  if (epos.includes(';')) return epos.split(';')[0] + ' ' + epos.split(';')[1]
  else return epos
}

const setPages = () => {
  let numberOfPages = Math.ceil(filterData.pagination.totalCount / filterData.pagination.rowsPerPage)
  pages.value = []
  for (let index = 1; index <= numberOfPages; index++) pages.value.push(index)
}

async function getList() {
  try {
    loading.value = true
    let data
    if (props.autopaymentId) {
      data = await transactionStore.getTransactionsByAutopaymentId({
        autopaymentId: props.autopaymentId || route.params.id,
        CurrentPage: filterData.pagination.page,
        PerPage: filterData.pagination.rowsPerPage
      })
    } else {
      data = route.query?.type
        ? await coborrowerStore.getTransactions({
          organizationDebtorId: route.params.id,
          CurrentPage: filterData.pagination.page,
          PerPage: filterData.pagination.rowsPerPage
        })
        : await clientStore.getTransactions({
          organizationDebtorId: route.params.id,
          CurrentPage: filterData.pagination.page,
          PerPage: filterData.pagination.rowsPerPage
        })
    }

    rows.value = data.data?.result || []
    filterData.pagination.rowsNumber = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalPages
      : 1
    filterData.pagination.totalCount = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalCount
      : 1

    setPages()
  } finally {
    setTimeout(() => (loading.value = false), 0)
  }
}

onMounted(() => getList())
</script>

<template>
  <b-card no-body class="card-box-shadow">
    <b-card-header>
      <h5 class="card-title mb-0">{{ text || $t('clientsTab.transactions') }}</h5>
    </b-card-header>
    <b-card-body>
      <div class="table-responsive table-card mb-1">
        <table class="table table-nowrap align-middle" id="orderTable">
          <thead class="text-muted table-light">
            <tr>
              <th class="sort" data-sort="expand"></th>
              <th class="sort text-center" data-sort="refNum">{{ $t('filters.refNum') }}</th>
              <th class="sort text-center" data-sort="fio">{{ $t('filters.fio') }}</th>
              <th class="sort text-center" data-sort="organizationContractInfo">{{ $t('filters.contractId') }}</th>
              <th class="sort text-center" data-sort="amount">{{ $t('amount') }}</th>
              <th class="sort text-center" data-sort="pan">{{ $t('filters.cardNumber') }}</th>
              <th class="sort text-center" data-sort="wclientTypeName">{{ $t('filters.clientType') }}</th>
              <th class="sort text-center" data-sort="transactionDate">{{ $t('regDate') }}</th>
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
              v-for="(row, index) of (rows as any)" :key="index"
            >
              <tr :class="{ 'invalid-2px': row.transactionState === 2 }">
                <td class="expand text-center">
                  <i class="mdi cup h4" 
                    :class="expand ? 'mdi-chevron-up' : 'mdi-chevron-down'" 
                    @click="expand = !expand; expandId = row.transactionId"
                  ></i>
                </td>
                <td class="refNum text-center">
                  <span v-if="route.name?.includes('TransactionsView')">{{ row.refNum }}</span>
                  <router-link v-else
                    :to="row.wclientType === 0
                      ? { name: 'MainOperationsTransactionsView', params: { id: row.transactionId } }
                      : { name: 'MainOperationsTransactionsView', params: { id: row.transactionId }, query: { type: 2 } }
                    "
                  >{{ row.refNum }}</router-link>
                </td>
                <td class="fio text-center">
                  <span v-if="route.params.id === row.organizationDebtorId">{{ row.fio }}</span>
                  <router-link
                    v-else-if="row.wclientType === 0" class="text-primary"
                    :to="{ name: 'MainClientsContractsView', params: { id: row.organizationDebtorId } }"
                  >{{ row.fio }}</router-link>
                  <router-link
                    v-else class="text-primary"
                    :to="{ name: 'MainClientsCoborrowersView', params: { id: row.organizationDebtorId }, query: { type: 2 } }"
                  >{{ row.fio }}</router-link>
                </td>
                <td class="organizationContractInfo text-center">{{ row.organizationContractInfo }}</td>
                <td class="amount text-center">{{ filters.filterMoney(row.amount / 100) }}</td>
                <td class="pan text-center">{{ filters.filterCard(row.pan) }}</td>
                <td class="wclientTypeName text-center">{{ row.wclientTypeName }}</td>
                <td class="transactionDate text-center">{{ row.transactionDate }}</td>
              </tr>
              <tr v-if="expand && expandId === row.transactionId">
                <td colspan="10">
                  <div class="d-flex justify-content-center">
                    <span>{{ $t('epos') }}: <b class="ml-1">{{ eposUpd(row.terminalGroupName) }}</b></span>
                    <span class="ml-2">{{ $t('system') }}: <b class="ml-1">{{ row.integrateSystemName }}</b></span>
                    <span class="ml-2">{{ $t('canceledDate') }}: <b class="ml-1">{{ row.transactionReverseDate }}</b></span>
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr><td colspan="8" class="text-center text-muted">{{ $t('noData') }}</td></tr>
            </tbody>
          </template>
        </table>
      </div>

      <div
        v-if="filterData.pagination.totalCount > filterData.pagination.rowsPerPage"
        class="d-flex justify-content-end"
      >
        <div class="pagination-wrap hstack gap-2" style="display: flex">
          <span
            v-if="filterData.pagination.page != 1"
            class="page-item pagination-prev cup"
            :class="{ disabled: filterData.pagination.page == 1 }"
            @click="filterData.pagination.page--"
            >{{ $t('btn_text.previous') }}</span
          >
          <ul class="pagination listjs-pagination mb-0">
            <li
              :class="{active: pageNumber == filterData.pagination.page,disabled: pageNumber == '...'}"
              v-for="(pageNumber, index) in pages" :key="index"
              @click="filterData.pagination.page = pageNumber"
            >
              <span class="page cup" data-i="1" data-page="8">{{ pageNumber }}</span>
            </li>
          </ul>
          <span
            v-if="filterData.pagination.page < pages.length"
            class="page-item pagination-next cup"
            @click="filterData.pagination.page++"
            >{{ $t('btn_text.ahead') }}
          </span>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<style lang="scss">
@media (max-width: 450px){
  .pagination-wrap{
    ul li span,
    .page-item{
     font-size: 10px; 
    }
  }
}
</style>