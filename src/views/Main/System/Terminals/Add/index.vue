<script setup lang="ts">
import { ref } from 'vue'
import GroupForm from '../components/GroupForm.vue'
import TerminalForm from '../components/TerminalForm.vue'

const groupForm = ref({
  groupName: '',
  organizationBranchId: 0
})

const terminalForm = ref({
  groupId: null,
  merchantId: '',
  terminalId: '',
  integrationSystemId: 1
})
</script>

<template>
  <GroupForm :form="groupForm" />
  <TerminalForm :form="terminalForm" />
</template>
