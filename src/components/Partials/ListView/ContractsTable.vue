<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'
import { useCoborrowerStore } from '@/stores/coborrower'
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'

import filters from '@/filters'
import EditContractPayers from '@/components/Dialogs/EditContractPayers.vue'

const props = defineProps({
  clientPinfl: String
})

const route = useRoute()
const clientStore = useClientStore()
const coborrowerStore = useCoborrowerStore()

const rows: any = ref([])
const borrowers = ref([])
const loading = ref(false)
const guarantors = ref([])
const coborrowers = ref([])
const editModal = ref(false)
const collabsibles: any = ref(null)

const filterData = reactive({
  pagination: {
    page: 1,
    rowsNumber: 1,
    totalCount: 1,
    rowsPerPage: 50
  }
})

watch(filterData, () => {
  if (!loading.value) getList()
})

async function getList() {
  try {
    loading.value = true

    const data = route.query?.type
    ? await coborrowerStore.getContracts({
      organizationDebtorId: route.params.id,
      CurrentPage: filterData.pagination.page,
      PerPage: filterData.pagination.rowsPerPage
    })
    : await clientStore.getContracts({
      organizationDebtorId: route.params.id,
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
    setTimeout(() => (loading.value = false), 0)
  }
}

async function editContract(contractId: string){
  const data = route.query?.type 
    ? await coborrowerStore.getWClients(contractId)
    : await clientStore.getWClients(contractId)

  borrowers.value = data.result.filter((res: any) => res.wclientType === 0)
  coborrowers.value = data.result.filter((res: any) => res.wclientType === 1)
  guarantors.value = data.result.filter((res: any) => res.wclientType === 2)
  editModal.value = true
}

const onClickOutside = (event: any) => {
  if (event.target.classList?.contains('modal-bg')) editModal.value = false
}

onMounted(() => {
  getList()
  document.addEventListener("click", onClickOutside);
})

onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
})
</script>

<template>
  <b-card no-body class="card-box-shadow">
    <b-card-header class="d-flex justify-content-between align-itmes-center">
      <h5 class="card-title mb-0 d-flex align-items-center">{{ $t('clientsTab.contracts') }}</h5>
      <b-button
        variant="info" v-can="['client_contract_add']"
        @click="$router.push({ name: 'MainClientsAdd', query: { page: 'list', pinfl: clientPinfl } })"
      >
        {{ $t('add') }} <i class="mdi mdi-plus"></i>
      </b-button>
    </b-card-header>
    <b-card-body>
      <div class="table-responsive table-card mb-1">
        <table class="table table-nowrap align-middle" id="orderTable">
          <thead class="text-muted table-light">
            <tr>
              <th class="sort text-center" data-sort="contract">{{ $t('filters.contractId') }}</th>
              <th class="sort text-center" data-sort="amount">{{ $t('amount') }}</th>
              <th class="sort text-center" data-sort="epos">{{ $t('epos') }}</th>
              <th class="sort text-center" data-sort="branch">{{ $t('addedBy') }}</th>
              <th class="sort text-center" data-sort="createDate">{{ $t('regDate') }}</th>
              <th class="sort text-center" data-sort="goTo">{{ $t('edit') }}</th>
            </tr>
          </thead>

          <tbody v-if="loading">
            <tr>
              <td colspan="5" class="text-center">
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
                <td class="contract text-center">{{ row.organizationContractInfo }}</td>
                <td class="amount text-center">{{ filters.filterMoney(row.contractPayedAmount / 100) }}</td>
                <td class="epos text-center text-wrap">{{ row.organizationTerminalGroupName }}</td>
                <td class="branch text-center">{{ row.organizationBranchName }}</td>
                <td class="createDate text-center">{{ row.createDate }}</td>
                <td class="goTo text-center" ref="collabsibles">
                  <i class="mdi mdi-pencil-outline text-info cup h3" @click="editContract(row.organizationContractId)"></i>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr><td colspan="5" class="text-center text-muted">{{ $t('noData') }}</td></tr>
            </tbody>
          </template>
        </table>
      </div>
    </b-card-body>

    <!-- Modal -->
    <div class="modal right fade" :class="{'in': editModal}" id="myModal2" tabindex="-1" aria-labelledby="myModalLabel2">
      <b-card no-body class="modal-dialog card-box-shadow">
        <div class="modal-content">
          <div class="custom-modal-header">
            <h4 class="modal-title" id="myModalLabel2">{{ $t('filters.contract') }}</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="editModal = false">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <EditContractPayers :text="$t('menus.clients')" :payers="borrowers" :isBorrower="true"/>

          <EditContractPayers :text="$t('menus.coborrowers')" :payers="coborrowers" />

          <EditContractPayers :text="$t('menus.guarantors')" :payers="guarantors" />
        </div>
      </b-card>
      <div class="modal-bg"></div>
    </div>
  </b-card>
</template>

<style lang="scss">
.modal.right .modal-dialog {
  position: fixed;
  margin: auto;
  width: 350px;
  height: 100%;
  -webkit-transform: translate3d(0%, 0, 0);
  -ms-transform: translate3d(0%, 0, 0);
  -o-transform: translate3d(0%, 0, 0);
  transform: translate3d(0%, 0, 0);
}

.modal.right .modal-content {
  height: 100%;
  overflow-y: auto;
}

/*Right*/
.modal.right.fade{
  z-index: -1;
}

.modal.right.fade .modal-dialog {
  right: -350px;
  -webkit-transition: opacity 0.3s linear, right 0.3s ease-out;
  -moz-transition: opacity 0.3s linear, right 0.3s ease-out;
  -o-transition: opacity 0.3s linear, right 0.3s ease-out;
  transition: opacity 0.3s linear, right 0.3s ease-out;
}

.modal.right.fade.in {
  opacity: 1;
  z-index: 1005;

  .modal-bg {
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    position: absolute;
  }
}

.modal.right.fade.in .modal-dialog {
  z-index: 1;
  right: 0;
}

/* ----- MODAL STYLE ----- */
.modal-content {
  border-radius: 0;
  border: none;
}

.custom-modal-header {
  display: flex;
  padding: 15px;
  background-color: var(--vz-body-bg);
  justify-content: space-between;
  border-bottom-color: #eeeeee;
  border-bottom: 1px solid #e5e5e5;
  
  button.close {
    -webkit-appearance: none;
    padding: 0;
    cursor: pointer;
    background: 0 0;
    border: 0;
  }

  .close {
    float: right;
    font-size: 21px;
    font-weight: 700;
    line-height: 1;
    color: var(--vz-heading-color);
    text-shadow: 0 1px 0 #fff;
    filter: alpha(opacity=20);
    opacity: .6;
  }
}
</style>
