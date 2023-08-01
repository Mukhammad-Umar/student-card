<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoleStore } from '@/stores/role'
import { staticMenus, staticFunctionals } from '@/utils/data'

const { form }: any = defineProps<{ form: Object }>()

const roleStore = useRoleStore()

const menus = ref([])
const menuList = staticMenus
const menuSelected: any = ref([])
const allMenuSelected = ref(false)
const menuIndeterminate = ref(false)

const functionals = ref([])
const functionalsList = staticFunctionals
const functionalSelected: any = ref([])
const allFunctionalSelected = ref(false)
const functionalIndeterminate = ref(false)

// Menus Part
watch(() => menuSelected.value, val => {
  if (val.length === 0) {
    menuIndeterminate.value = false
    allMenuSelected.value = false
  } else if (val.length === menus.value.length) {
    menuIndeterminate.value = false
    allMenuSelected.value = true
  } else {
    menuIndeterminate.value = true
    allMenuSelected.value = false
  }

  getFunctionals(val)
})

async function getMenus() {
  if (form.roleId) {
    const data = await roleStore.getRoleMenus(form.roleId);
    menus.value = data?.result;
    toggleMenuAll(true, true)
  } else {
    const data = await roleStore.getMenus();
    menus.value = data?.result;
    toggleMenuAll(true)
  }

  menus.value.forEach((menu: any) => {
    menuList.forEach((list) => {
      if (menu.name === list.key) menu.text = list.title
    })
  })
}

const toggleMenuAll = (checked: Boolean, isGetById?: boolean) => {
  menuSelected.value = []
  if(isGetById) {
    menus.value
      .filter((menu: any) => menu.isChecked)
      .forEach((menu: any) => menuSelected.value.push(menu.id))
  } else if (checked) {
    menus.value.forEach((menu: any) => menuSelected.value.push(menu.id))
  }
}

// Functional Part
watch(() => functionalSelected.value, val => {
  if (val.length === 0) {
    functionalIndeterminate.value = false
    allFunctionalSelected.value = false
  } else if (val.length === functionals.value.length) {
    functionalIndeterminate.value = false
    allFunctionalSelected.value = true
  } else {
    functionalIndeterminate.value = true
    allFunctionalSelected.value = false
  }
 
  assignToForm(menuSelected.value, val)
})

async function getFunctionals(menus: any) {
  if (form.roleId) {
    const data = await roleStore.getRoleFunctionals({
      roleId: form.roleId,
      menuIds: menus
    })
    functionals.value = data?.result
    toggleFuncAll(true, true)
  } else {
    const data = await roleStore.getFunctionals({ menuIds: menus });
    functionals.value = data?.result
    toggleFuncAll(true)
  }

  functionals.value.forEach((functional: any) => {
    functionalsList.forEach((list) => {
      if (functional.name === list.key) functional.text = list.value
    })
  })
}

const toggleFuncAll = (checked: Boolean, isGetById?: boolean) => {
  functionalSelected.value = []

  if(isGetById) {
    functionals.value
      .filter((functional: any) => functional.isChecked)
      .forEach((functional: any) => functionalSelected.value.push(functional.id))
  } else if (checked) {
    functionals.value.forEach((functional: any) => functionalSelected.value.push(functional.id))
  }
}

const assignToForm = (assignedMenus: number[], assignedFunctionals: number[]) => {
  form.permissions = assignedMenus.concat(assignedFunctionals)
}

onMounted(() => getMenus())
</script>

<template>
    <b-row class="g-4 mt-2">
      <b-col lg="3">
        <div>
          <label for="menu-roleName" class="form-label text-muted fs-14">
            {{ $t('sysUsers.menuAccesses') }}
          </label>
  
          <b-form-group class="checkbox-form-group text-primary" id="menu-roleName">
            <template #label>
              <b-form-checkbox
                v-model="allMenuSelected"
                aria-describedby="flavours" aria-controls="flavours"
                button-variant="primary" :indeterminate="menuIndeterminate"
                @change="toggleMenuAll"
              >
                {{ allMenuSelected ? $t('btn_text.unselectAll') : $t('btn_text.selectAll') }}
              </b-form-checkbox>
            </template>
  
            <template v-slot="{ ariaDescribedby }">
              <b-form-checkbox-group
                v-model="menuSelected"
                id="flavors" :options="menus"
                :aria-describedby="ariaDescribedby"
                name="flavors" value-field="id"
                text-field="text" class="text-muted ml-4"
                aria-label="Individual flavours" stacked
              ></b-form-checkbox-group>
            </template>
          </b-form-group>
        </div>
      </b-col>
  
      <b-col lg="9">
        <div>
          <label for="menu-roleName" class="form-label text-muted fs-14">{{ $t('sysUsers.functional') }}</label>
  
          <b-form-group v-if="functionals?.length" class="checkbox-form-group text-primary" id="menu-roleName">
            <template #label>
              <b-form-checkbox
                v-model="allFunctionalSelected"
                :indeterminate="functionalIndeterminate"
                button-variant="primary" aria-describedby="roleFounc"
                aria-controls="roleFounc" @change="toggleFuncAll"
              >
                {{ allFunctionalSelected ? $t('btn_text.unselectAll') : $t('btn_text.selectAll') }}
              </b-form-checkbox>
            </template>
  
            <template v-slot="{ ariaDescribedby }">
              <b-form-checkbox-group
                v-model="functionalSelected"
                id="roleFunc" :options="functionals"
                :aria-describedby="ariaDescribedby"
                name="roleFunc" value-field="id"
                text-field="text" class="text-muted ml-4"
                aria-label="Individual roleFounc" stacked
              ></b-form-checkbox-group>
            </template>
          </b-form-group>
  
          <h6 v-else class="text-center text-muted py-2 mb-0">{{ $t('error.noFunctionals') }}</h6>
        </div>
      </b-col>
    </b-row>
</template>
