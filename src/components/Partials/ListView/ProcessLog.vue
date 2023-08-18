<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCoreStore } from '@/stores/core'
import { ref, reactive, onMounted } from 'vue'
import SimpleLoader from '@/components/Common/SimpleLoader.vue'

const processLogs = ref([])
const route: any = useRoute()
const coreStore = useCoreStore()

const cardLoaders = reactive({
  applicationLoad: true,
  cardPrintLoad: true,
})

async function getList() {
  try {
    const data = await coreStore.getProcessLogs(route.params.id)
    processLogs.value = data
  } finally {
    cardLoaders.applicationLoad = false
    cardLoaders.cardPrintLoad = false
  }
}

onMounted(() => getList())
</script>

<template>
  <b-card no-body class="card-box-shadow">
    <b-card-header class="d-flex justify-content-between">
      <h5 class="card-title mb-0 flex-center">Журнал</h5>
    </b-card-header>
    <b-card-body class="pt-2">
      <b-tabs content-class="mt-1" fill class="view-tab">
        <b-tab :title="'Заявка'" active>
          <b-card-body class="scrollbar mh-300 pt-4 px-0">
            <SimpleLoader v-if="cardLoaders.applicationLoad" />

            <template v-else>
              <div class="timeline">
                <div class="timeline-line"></div>
                <div v-for="(processLog, index) in (processLogs as any)" class="timeline-box d-flex align-items-center">
                  <div
                    class="timeline-box-number z-index-1 flex-center"
                    :class="processLog.current_status === 'ERROR' || processLog.current_status ===  'REJECTED' ? 'bg-text-danger' 
                    : processLog.current_status === 'PENDING_FOR_PRINT' ? 'bg-text-success' : 'bg-text-primary'" 
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="timeline-box-text">
                    <h6>{{ processLog.status_name }}</h6>
                    <p class="mb-0 text-inactive">{{ processLog.description }}</p>
                  </div>
                </div>
              </div>

              <!-- <div v-else class="pt-2 flex-center">
                <span class="text-inactive">{{ $t('viewBox.noCards') }}</span>
              </div> -->
            </template>
          </b-card-body>
        </b-tab>
        <b-tab :title="'Печать карты'">
          <b-card-body class="scrollbar mh-300">
            <SimpleLoader v-if="cardLoaders.cardPrintLoad" />

            <template v-else>
              <div>
                <h6>Content</h6>
              </div>

              <!-- <div v-else class="pt-2 flex-center">
                <span class="text-inactive">{{ $t('viewBox.noCards') }}</span>
              </div> -->
            </template>
          </b-card-body>
        </b-tab>
      </b-tabs>
    </b-card-body>
  </b-card>
</template>
