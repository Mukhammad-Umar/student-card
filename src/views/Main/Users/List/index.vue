<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAdminStore } from '@/stores/admin'
import { ref, reactive, computed, onMounted } from 'vue'

import filters from '@/filters'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'
import ResetPassword from '@/components/Partials/Users/ResetPassword.vue'

const rows = ref([])
const { t } = useI18n()
const numerationIndex = ref(1)
const adminStore = useAdminStore()

const loading = ref(true)

const filterData: any = reactive({
  search: null,
  pagination: {
    page: 1,
    rowsNumber: 1,
    totalCount: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 10,
  },
})

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'userName', label: t('login') },
  { key: 'firstName', label: t('viewBox.user'), class: 'text-center' },
  { key: 'phone', label: t('userInfo.phoneNumber'), class: 'text-center' },
  { key: 'isActivate', label: t('filters.status'), class: 'text-center' },
  { key: 'isBlocked', label: t('userInfo.isBlocked'), class: 'text-center' },
  { key: 'actions', label: t('filters.action'), class: 'text-center' },
])

async function getList() {
  try {
    loading.value = true

    const data = await adminStore.getAdmins({
      CurrentPage: filterData.pagination.page,
      PerPage: filterData.pagination.rowsPerPage,
    })

    rows.value = data
    filterData.pagination.rowsNumber = adminStore.totalPages
    filterData.pagination.totalCount = adminStore.totalCount

    numerationIndex.value =
      (filterData?.pagination.page - 1) * filterData?.pagination.rowsPerPage
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
      <TableFilters :filterData="filterData" @emit:search="getList" />

      <b-card no-body class="card-box-shadow">
        <b-card-header
          class="align-items-center d-flex justify-content-between"
        >
          <TablePerPage
            :pagination="filterData.pagination"
            @emit:update="getList"
          />

          <b-button variant="info" :to="{ name: 'MainSettingsAdminAdd' }">
            {{ $t('add') }} <i class="mdi mdi-plus"></i>
          </b-button>
        </b-card-header>

        <div class="table-responsive mb-0">
          <b-table
            :items="rows"
            :fields="fields"
            :busy="loading"
            :show-empty="!loading"
            hover
          >
            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle mr-2"></b-spinner>
                <strong>{{ $t('loading') }}...</strong>
              </div>
            </template>

            <template #empty="scope">
              <h6 class="text-center text-muted py-2 mb-0">
                {{ $t('error.noData') }}
              </h6>
            </template>

            <template #cell(firstName)="{ item }">{{
              item.lastName + ' ' + item.firstName
            }}</template>

            <template #cell(phone)="{ item }">
              {{ filters.filterFullPhoneNumber(item.phone) }}
            </template>

            <template #cell(isActivate)="{ item }">
              <div class="d-flex justify-content-center">
                <b-form-checkbox v-model="item.isActivate" readonly />
              </div>
            </template>

            <template #cell(isBlocked)="{ item }">
              <div class="d-flex justify-content-center">
                <b-form-checkbox v-model="item.isBlocked" readonly />
              </div>
            </template>

            <template v-slot:cell(actions)="{ item }">
              <div class="d-flex justify-content-center">
                <ResetPassword :userId="item.userId" :isAdmin="true"/>

                <i
                  class="mdi mdi-pencil-outline text-info cup h3 ml-1"
                  @click="
                    $router.push({
                      name: 'MainSettingsAdminEdit',
                      params: { id: item.userId },
                    })
                  "
                ></i>
              </div>
            </template>
          </b-table>
        </div>
      </b-card>

      <TablePagination
        :pagination="filterData?.pagination"
        @emit:change="getList"
      />
    </b-col>
  </b-row>
</template>
