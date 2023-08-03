<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, reactive, computed, onMounted } from 'vue'
import { useIntegrationSystemStore } from '@/stores/integrationSystem'

import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const { t } = useI18n()
const integrationSystemStore = useIntegrationSystemStore()

const rows = ref([])
const loading = ref(true)
const numerationIndex = ref(1)

const filterData: any = reactive({
  pagination: {
    page: 1,
    rowsNumber: 1,
    totalCount: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 10
  }
})

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'integrationSystemName', label: t('system') },
  { key: 'username', label: t('login'), class: 'text-center' },
  { key: 'password', label: t('password'), class: 'text-center' },
  { key: 'isActivate', label: t('status'), class: 'text-center' },
  { key: 'actions', label: t('edit'), class: 'text-center' }
])

async function getList() {
  try {
    loading.value = true

    const data = await integrationSystemStore.getIntegrationSystems({
      CurrentPage: filterData.pagination.page,
      PerPage: filterData.pagination.rowsPerPage
    })

    rows.value = data
    filterData.pagination.rowsNumber = integrationSystemStore.totalPages
    filterData.pagination.totalCount = data.length // integrationSystemStore.totalCount

    numerationIndex.value = (filterData.pagination.page - 1) * filterData.pagination.rowsPerPage
    signIndex()
  } finally {
    loading.value = false
  }
}

const signIndex = () => {
  if (rows.value?.length) {
    rows.value.forEach((row: any, index) => {
      if (filterData.pagination.page === 1) row.index = index + 1
      else row.index = numerationIndex.value + index + 1
    })
  }
}

onMounted(async () => {
  await getList()
})
</script>

<template>
  <b-row class="table-list mb-3">
    <b-col>
      <b-card no-body class="card-box-shadow">
        <b-card-header class="align-items-center d-flex justify-content-between">
          <TablePerPage :pagination="filterData.pagination" @emit:update="getList" />
        </b-card-header>

        <div class="table-responsive mb-0">
          <b-table :items="rows" :fields="fields" :busy="loading" :show-empty="!loading" hover>
            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle mr-2"></b-spinner>
                <strong>{{ $t('loading') }}...</strong>
              </div>
            </template>

            <template #empty="scope">
              <h6 class="text-center text-muted py-2 mb-0">{{ $t('error.noData') }}</h6>
            </template>

            <template #cell(isActivate)="{ item }">
              <div class="d-flex justify-content-center">
                <b-form-checkbox v-model="item.isActivate" readonly/>
              </div>
            </template>

            <template v-slot:cell(actions)="{ item }">
              <i
                class="mdi mdi-pencil-outline text-info cup h3"
                @click="
                  $router.push({
                    name: 'MainSettingsIntegrationEdit',
                    params: { id: item.integrationSystemId }
                  })
                "
              ></i>
            </template>
          </b-table>
        </div>
      </b-card>

      <TablePagination :pagination="filterData?.pagination" @emit:change="getList" />
    </b-col>
  </b-row>
</template>
