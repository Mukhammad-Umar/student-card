<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAutopayFileStore } from '@/stores/autopayFile'

import FileBox from '../components/FileBox.vue'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const { filterData }: any = defineProps<{ filterData: Object }>()

const files = ref([])
const loading = ref(true)
const autopayFile = useAutopayFileStore()

async function getList() {
  try {
    loading.value = true

    const data = await autopayFile.getArchiveFiles({
      OrganizationId: filterData.organizationId,
      StartDate: filterData.startDate,
      EndDate: filterData.endDate,
      CurrentPage: filterData.pagination.page,
      PerPage: filterData.pagination.rowsPerPage,
    })

    files.value = data?.list
    filterData.pagination.rowsNumber = data?.totalPages
    filterData.pagination.totalCount = data?.totalCount
  } finally {
    loading.value = false
  }
}

onMounted(() => getList())
</script>

<template>
  <b-row class="table-list mb-3">
    <b-col>
      <TableFilters :filterData="filterData" @emit:search="getList" />

      <b-card no-body class="card-box-shadow">
        <b-card-header class="pb-2">
          <TablePerPage
            :pagination="filterData.pagination"
            @emit:update="getList"
          />
        </b-card-header>

        <b-card-body>
          <template v-if="files?.length" v-for="file in (files as any)" :key="file.id">
            <FileBox :file="file" @emit:update="getList"/>
          </template>

          <h6 v-else class="text-center text-muted py-2 mb-0">{{ $t('error.noData') }}</h6>
        </b-card-body>
      </b-card>

      <TablePagination
        :pagination="filterData?.pagination"
        @emit:change="getList"
      />
    </b-col>
  </b-row>
</template>
