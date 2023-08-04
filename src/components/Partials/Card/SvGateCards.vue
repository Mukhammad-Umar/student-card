<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCardStore } from '@/stores/card'
import { onMounted, reactive, ref, watch } from 'vue'

import TheCard from './TheCard.vue'
import SimpleLoader from '@/components/Common/SimpleLoader.vue'

const props = defineProps({
  client: Object,
  integrationSystemId: Number
})

const uzCards = ref([])
const route = useRoute()
const deletedCards = ref([])
const cardStore = useCardStore()

const cardLoaders = reactive({
  uzCardLoad: true,
  uzCardBalance: true,
  deletedLoad: true
})

async function getUzCards() {
  try {
    uzCards.value = []
    cardLoaders.uzCardLoad = true
    const data = 
      await cardStore.getCards({
        organizationDebtorId: route.params.id,
        integrationSystemId: props.integrationSystemId,
        cardGateType: 0
      })
    uzCards.value = data.result
    cardLoaders.uzCardLoad = false
  } catch (err) {}
}

async function getDeletedCards() {
  try {
    deletedCards.value = []
    cardLoaders.deletedLoad = true
    const data = 
    await cardStore.getBlockedCards({
      organizationDebtorId: route.params.id,
      integrationSystemId: props.integrationSystemId
    })
    deletedCards.value = data.result
  } finally {
    cardLoaders.deletedLoad = false
  }
}

onMounted(async () => {
  await getUzCards()
  await getDeletedCards()
})
</script>

<template>
  <b-card no-body class="card-box-shadow">
    <b-card-header class="d-flex justify-content-between">
      <h5 class="card-title mb-0 flex-center">SvGate</h5>
      <i class="mdi mdi-update h3 mb-0 text-info cup" v-tooltip="$t('btn_text.refreshCards')" @click="getUzCards"></i>
    </b-card-header>
    <b-card-body>
      <b-tabs content-class="mt-1" fill>
        <b-tab :title="'UzCard (' + uzCards.length + ')'" active>
          <b-card-body class="scrollbar mh-300">
            <SimpleLoader v-if="cardLoaders.uzCardLoad" />

            <template v-else>
              <div v-if="uzCards?.length">
                <template v-for="card in uzCards" :key="card.id">
                  <TheCard 
                    :card="card" 
                    :balanceLoad="cardLoaders.uzCardBalance" 
                    :integrationSystemId="integrationSystemId" 
                    @emit:cards="getUzCards" @emit:action="getUzCards(); getDeletedCards();"
                  />
                </template>
              </div>

              <div v-else class="pt-2 flex-center">
                <span class="text-primary">{{ $t('viewBox.noCards') }}</span>
              </div>
            </template>
          </b-card-body>
        </b-tab>
        <b-tab :title="$t('rejectedCards') + ' (' + deletedCards.length + ')'">
          <b-card-body class="scrollbar mh-300">
            <SimpleLoader v-if="cardLoaders.deletedLoad" />

            <template v-else>
              <div v-if="deletedCards?.length">
                <template v-for="card in deletedCards" :key="card.id">
                  <TheCard 
                    :card="card" 
                    :removes="true"
                    :balanceLoad="false"
                    :integrationSystemId="integrationSystemId" 
                    @emit:action="getUzCards(); getDeletedCards();" 
                  />
                </template>
              </div>

              <div v-else class="pt-2 flex-center">
                <span class="text-primary">{{ $t('viewBox.noCards') }}</span>
              </div>
            </template>
          </b-card-body>
        </b-tab>
      </b-tabs>
    </b-card-body>
  </b-card>
</template>
