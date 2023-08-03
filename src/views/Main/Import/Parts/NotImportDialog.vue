<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  data: Array
})

const dialog = ref(false)
const data: any = ref(props.data)
</script>

<template>
  <div class="mb-1 mr-2">
    <b-button variant="warning" @click="dialog = true">{{ $t('notImporting') }}</b-button>

    <b-modal
      v-model="dialog"
      id="showModal"
      hide-footer
      :title="$t('dialog.missingData')"
      header-class="p-3 bg-light"
      class="v-modal-custom"
      centered
    >
      <div class="table-responsive scrollbar" style="max-height: 600px;">
        <table class="table mb-0 table-borderless">
          <tbody v-for="(row, index) in data">
            <tr>
              <th><span class="fw-medium">{{ index + 1 + ') ' + $t('userInfo.pinfl') }}</span></th>
              <td :class="{'text-danger': row.pnfl?.length !== 14}">{{ row.pnfl }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="hstack gap-2 justify-content-center">
        <b-button
          type="button"
          id="closemodal"
          class="px-4"
          variant="warning"
          @click="dialog = false"
        >
          {{ $t('btn_text.close') }}
        </b-button>
      </div>
    </b-modal>
  </div>
</template>
