<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoleStore } from '@/stores/role'
import { useToast } from 'vue-toastification'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/i18n-validators'
import MenuPermissions from './MenuPermissions.vue'
import BranchSelect from '@/components/UI/BranchSelect.vue'

const { form }: any = defineProps<{form: Object}>()

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const loading = ref(false)
const roleStore = useRoleStore()

const rules = computed(() => {
  return { roleName: { required } }
})

const $v = useVuelidate(rules, form)

async function submit(){
  $v.value.$touch()
  if ($v.value.$invalid) return

  try {
    loading.value = true

    const data = form.roleId 
      ? await roleStore.editRole(form) 
      : await roleStore.addRole(form)

    if (data.result) {
      toast.success(t(form.roleId ? 'success.updated' : 'success.added'))
      router.push({ name: 'MainOrgsRolesList' })
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <b-card no-body>
    <b-card-header>
      <h5 class="card-title text-primary mb-0">{{ $t('roles') }}</h5>
    </b-card-header>
    <b-card-body>
      <b-form @submit.prevent="submit" class="mt-2">
        <b-row class="g-4">
          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="func-roleName" class="form-label text-muted">
                {{ $t('sysUsers.createRoleName') }}
              </label>
              <input
                v-model="$v.roleName.$model"
                type="text" class="form-control" id="func-roleName"
                :class="{
                  'is-invalid': $v.roleName.$error && $v.roleName.$dirty,
                  error: $v.roleName.$error
                }"
              />
            </div>
          </b-col>

          <b-col xl="3" lg="4" md="6">
            <div>
              <label for="func-roleName" class="form-label text-muted">
                {{ $t('branch') }}
              </label>
              <BranchSelect :params="form" />
            </div>
          </b-col>

          <MenuPermissions :form="form"/>

          <b-col lg="12">
            <div class="hstack justify-content-center gap-2">
              <b-button type="button" variant="warning" class="px-5" @click="$router.go(-1)">
                {{ $t('btn_text.cancel') }}
              </b-button>
              <b-button type="submit" variant="info" class="px-5" :loading="loading" loading-mode="fill">
                {{ form.roleId ? $t('change') : $t('add') }}
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<style lang="scss">
.checkbox-form-group {
  .btn-group-vertical {
    display: flex;
    flex-wrap: wrap;
    max-height: 300px;
    overflow-x: scroll;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .form-check {
    font-size: 14px;
    margin-bottom: 5px;
  }
}
</style>
