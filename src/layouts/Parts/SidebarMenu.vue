<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router';

const { t } = useI18n()
const route: any = useRoute()

const menus = computed(() => {
  return [
    {
      separate: true, text: t('sysUsers.menu'), 
      permission: ['main_menu', 'client_menu', 'autopayment_menu', 'import_menu', 'report_menu', 'operation_menu'] 
    },
    { url: 'MainDashboard', text: t('main'), icon: 'mdi-home-outline', permission: ['main_menu'] },
    { url: 'MainClients', text: t('menus.clients'), icon: 'mdi-account-group-outline', permission: ['client_menu'],
      children: [
        { url: 'MainClientsContracts', text: t('menus.payersContracts'), permission: ['client_contract_view'] },
        { url: 'MainClientsAdd', text: t('menus.addPayCont'), permission: ['client_contract_add'] },
        { url: 'MainClientsCoborrowers', text: t('menus.coborrowersGuarantors'), permission: ['wclient_contract_view'] },
        { url: 'MainClientsWhite', text: t('menus.whiteList'), permission: ['client_white_list_view'] }
      ]
    },
    { url: 'MainOperations', text: t('menus.operations'), icon: 'mdi-bank-transfer', permission: ['autopayment_menu', 'report_menu', 'reverse_transaction_action'],
      children: [
        { url: 'MainOperationsAutopayments', text: t('autopayments'), permission: ['autopayment_menu'] },
        { url: 'MainOperationsTransactions', text: t('menus.transactions'), permission: ['report_menu'] },
        { url: 'MainOperationsOverdrafts', text: t('menus.overdraft'), permission: ['overdraft_menu'],
          children: [
            { url: 'MainOperationsOverdraftsAutopayments',  text: t('autopayments'),  permission: ['overdraft_autopayment_view'] },
            { url: 'MainOperationsOverdraftsTransactions', text: t('menus.transactions'), permission: ['overdraft_transaction_view'] }
          ]
        },
        { url: 'MainOperationsReversal', text: t('menus.refund'), permission: ['reverse_transaction_action'] }
      ]
    },
    { url: 'MainImport', text: t('menus.import'), icon: 'mdi-tray-arrow-down', permission: ['import_menu'],
      children: [
        { url: 'MainImportData', text: t('menus.importAll'), permission: ['import_files_add'] },
        { url: 'MainImportedFiles', text: t('menus.importedFiles'), permission: ['import_files_view'] }
      ]
    },
    { separate: true, text: t('menus.system'), permission: ['org_user_system_menu'] },
    { url: 'MainOrgs', text: t('menus.organisations'), icon: 'mdi-office-building-outline', permission: ['org_user_system_menu', 'organization_user_role_view', 'org_user_system_menu'],
      children: [
        // { url: 'MainOrgsTerminals', text: t('menus.terminals'), permission: ['org_user_system_menu'] },
        { url: 'MainOrgsRoles', text: t('roles'), permission: ['organization_user_role_view'] },
        { url: 'MainOrgsUsers', text: t('menus.users'), permission: ['org_user_system_menu'] }
      ]
    }
  ]
})
</script>

<template>
  <b-container fluid class="h-100 scrollbar">
    <div id="two-column-menu">
      <ul class="navbar-nav h-100" id="navbar-nav">
        <template v-for="(menu, index) in menus">
          <li v-if="menu.separate" v-can="menu.permission" class="menu-title">
            <span data-key="t-menu"> {{ menu.text }}</span>
          </li>

          <template v-else>
            <li v-if="!menu.children" v-can="menu.permission" class="nav-item">
              <router-link class="nav-link menu-link" :to="{ name: menu.url }">
                <i class="mdi" :class="menu.icon"></i>
                <span data-key="t-widgets">{{ menu.text }}</span>
              </router-link>
            </li>

            <li v-else class="nav-item" v-can="menu.permission">
              <b-link
                class="nav-link menu-link"
                :href="'#sidebarMenu' + index"
                data-bs-toggle="collapse"
                role="button"
                :aria-expanded="route.name?.includes(menu.url)"
                :aria-controls="'sidebarMenu' + index"
              >
                <i class="mdi" :class="menu.icon"></i>
                <span data-key="t-dashboards"> {{ menu.text }}</span>
              </b-link>

              <div
                class="collapse menu-dropdown"
                :class="{ show: route.name?.includes(menu.url) }"
                :id="'sidebarMenu' + index"
              >
                <ul class="nav nav-sm flex-column">
                  <template v-for="(child, indx) in menu.children">
                    <li v-if="!child.children" v-can="child.permission" class="nav-item">
                      <router-link
                        :to="{ name: child.url }"
                        class="nav-link"
                        data-key="inner-menu"
                        >{{ child.text }}</router-link
                      >
                    </li>

                    <li v-else class="nav-item" v-can="child.permission">
                      <b-link
                        :href="'#sidebarMenuInner' + indx"
                        class="nav-link"
                        data-bs-toggle="collapse"
                        role="button"
                        :aria-expanded="route.name?.includes(child.url)"
                        :aria-controls="'sidebarMenuInner' + indx"
                        :data-key="child.text"
                        >{{ child.text }}
                      </b-link>

                      <div
                        class="collapse menu-dropdown"
                        :class="{ show: route.name?.includes(child.url) }"
                        :id="'sidebarMenuInner' + indx"
                      >
                        <ul class="nav nav-sm flex-column">
                          <template v-for="innerChild in child.children">
                            <li class="nav-item" v-can="innerChild.permission">
                              <router-link
                                :to="{ name: innerChild.url }"
                                class="nav-link"
                                :data-key="innerChild.text"
                                >{{ innerChild.text }}</router-link
                              >
                            </li>
                          </template>
                        </ul>
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </li>
          </template>
        </template>
      </ul>
    </div>
  </b-container>
</template>
