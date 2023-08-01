<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import filters from '@/filters'

const props = defineProps({
  form: Object,
  text: String
})

const { t } = useI18n()

const inputs = computed(() => {
  return [
    { name: t('filters.refNum'), key: props.form?.refNum },
    { name: t('filters.contractId'), key: props.form?.organizationContractInfo },
    { name: t('filters.holderFio'), key: props.form?.fio },
    { name: t('filters.cardNumber'), key: filters.filterCard(props.form?.pan) },
    { name: t('amount'), key: filters.filterMoney(props.form?.amount / 100) },
    { name: t('filters.tranExt'), key: props.form?.ext },
    { name: t('epos'), key: props.form?.terminalGroupName },
    { name: t('filters.cardType'), key: props.form?.gateTypeName },
    { name: t('filters.clientType'), key: props.form?.wclientTypeName },
    { name: t('filters.gateway'), key: props.form?.integrateSystemName },
    { 
      name: t('filters.status'), key: props.form?.transactionStateName, 
      class: props.form?.transactionState === 1 ? 'text-success' : 'text-danger' 
    },
    { name: t('filters.payedDate'), key: props.form?.transactionDate }
  ]
})
</script>

<template>
  <b-card no-body class="card-box-shadow reversal-box" :class="form?.transactionState === 2 ? 'red-animate' : 'green-animate'">
    <b-card-header>
      <h5 class="card-title mb-0">{{ text }}</h5>
    </b-card-header>
    <b-card-body class="row g-4">
      <b-col lg="4" md="6" v-for="(input, index) in inputs" :key="index">
        <div>
          <label class="form-label">{{ input.name + ' ' }}</label>
          <input type="text" class="form-control" :class="input.class" :value="input.key" readonly />
        </div>
      </b-col>

      <b-col v-if="form?.transactionState === 2" lg="4" md="6">
        <div>
          <label class="form-label">{{ $t('filters.canceled') }}</label>
          <input type="text" class="form-control" :value="form?.canceledBy" readonly />
        </div>
      </b-col>

      <b-col v-if="form?.transactionState === 2" lg="4" md="6">
        <div>
          <label class="form-label">{{ $t('filters.reverseDate') }}</label>
          <input type="text" class="form-control" :value="form?.transactionReverseDate" readonly />
        </div>
      </b-col>

      <div class="row g-4 mt-0 justify-content-center" v-if="form?.transactionState !== 2 && $route.name === 'MainOperationsReversal'">
        <b-col xl="3" lg="4" md="6">
          <b-button
            variant="warning"
            class="w-100 waves-effect waves-light"
            @click="$emit('emit:clear')"
          >
            {{ $t('clear') }}
          </b-button>
        </b-col>

        <b-col xl="3" lg="4" md="6">
          <b-button
            v-if="$route.name === 'MainOperationsReversal'"
            v-can="['reverse_transaction_action']" variant="primary"
            class="w-100 waves-effect waves-light"
            @click="$emit('emit:reversal')"
          >
            {{ $t('filters.cancelTransaction') }}
          </b-button>
        </b-col>
      </div>

      <b-col v-if="form?.transactionState !== 2 && form?.refNum && $route.name !== 'MainOperationsReversal'" lg="4" md="6" class="d-flex align-items-end">
        <b-button
          v-can="['reverse_transaction_action']"
          variant="primary" class="w-100 btn-label waves-effect right waves-light" 
          @click="$router.push({ name: 'MainOperationsReversal', query: { refNum: form?.refNum } })"
        >
          {{ $t('filters.cancelTransaction') }}
          <i class="mdi mdi-cancel label-icon align-middle fs-16 ms-2"></i>
        </b-button>
      </b-col>
    </b-card-body>
  </b-card>
</template>

<style lang="scss">
.reversal-box
{
  padding: 2px;
  background-repeat: no-repeat;
  background-size: 0 2px, 0 100%, 0% 2px;
  background-position: top center, top center, bottom center;
  -webkit-animation: drawBorderFromCenter 4s;

  .card-body{
    margin: 0;
    background-color: var(--vz-card-cap-bg);
  }
}

.red-animate{
  background-color: rgba(var(--vz-danger-rgb), 1) !important; /* red */
  /* Single pixel data uri image http://jsfiddle.net/LPxrT/ 
  /* background-image: gold, gold, white */
  background-image: url('data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8kOrxHwAGiAKe0A2TIQAAAABJRU5ErkJggg=='),  url('data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8kOrxHwAGiAKe0A2TIQAAAABJRU5ErkJggg=='),
  url('data:image/gif;base64,R0lGODlhAQABAPAAAP///////yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==');
}

.green-animate{
  background-color: rgba(var(--vz-success-rgb), 1) !important; /* green */
  /* background-image: green, green, white */
  background-image: url('data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk2jznPwAEggJaV49DCQAAAABJRU5ErkJggg=='),  url('data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk2jznPwAEggJaV49DCQAAAABJRU5ErkJggg=='),
  url('data:image/gif;base64,R0lGODlhAQABAPAAAP///////yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==');
}

/* Chrome, Safari, Opera */
@-webkit-keyframes drawBorderFromCenter {
  0% {
    background-size: 0 2px, 0 0, 100% 100%;
  }
  20% {
    background-size: 100% 2px, 100% 0, 100% 100%;
  }
  66%
  {
    background-size: 100% 2px, 100% 98%, 100% 100%;
  }
  99%
  {
    background-size: 100% 2px, 100% 98%, 0 2px;
  }
}
</style>