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

const route = useRoute()
const humoCards = ref([])
const deletedCards = ref([])
const cardStore = useCardStore()

const cardLoaders = reactive({
  humoLoad: false,
  humoBalance: false,
  deletedLoad: false
})

async function getHumo() {
  try {
    humoCards.value = []
    cardLoaders.humoLoad = true
    const data = 
      await cardStore.getCards({
        organizationDebtorId: route.params.id,
        integrationSystemId: props.integrationSystemId,
        cardGateType: 1
      })
    humoCards.value = data.result
    cardLoaders.humoLoad = false
  } catch (err) {}
}

async function getDeletedCards() {
  try {
    deletedCards.value = []
    cardLoaders.deletedLoad = true
    const data = await cardStore.getBlockedCards({
      organizationDebtorId: route.params.id,
      integrationSystemId: props.integrationSystemId
    })
    deletedCards.value = data.result
  } finally {
    cardLoaders.deletedLoad = false
  }
}

onMounted(async () => {
  await getHumo()
  await getDeletedCards()
})
</script>

<template>
  <b-card no-body class="card-box-shadow">
    <b-card-header class="d-flex justify-content-between">
      <h5 class="card-title mb-0 flex-center">HumoGate</h5>
      <i class="mdi mdi-update h3 mb-0 text-info cup" v-tooltip="$t('btn_text.refreshCards')" @click="getHumo"></i>
    </b-card-header>
    <b-card-body>
      <b-tabs content-class="mt-1" fill>
        <b-tab :title="'Humo (' + humoCards.length + ')'">
          <b-card-body class="scrollbar mh-300">
            <SimpleLoader v-if="cardLoaders.humoLoad" />

            <template v-else>
              <div v-if="humoCards?.length">
                <template v-for="card in humoCards" :key="card.id">
                  <TheCard
                    :card="card"
                    :balanceLoad="cardLoaders.humoBalance"
                    :integrationSystemId="integrationSystemId"
                    @emit:cards="getHumo" @emit:action="getHumo(); getDeletedCards();"
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
                    @emit:action="getHumo(); getDeletedCards();"
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
