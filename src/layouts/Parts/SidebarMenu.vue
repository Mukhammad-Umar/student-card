<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router';

const { t } = useI18n()
const route: any = useRoute()

const menus = computed(() => {
  return [
    { separate: true, text: t('sysUsers.menu'), permission: ['all'] },
    { url: 'MainDashboard', text: t('main'), icon: 'mdi-home-outline', permission: ['hide'] },
    { url: 'MainStudents', text: 'Заявки', icon: 'mdi-account-multiple-outline', permission: ['all'],
      children: [
        { url: 'MainStudentsContracts', text: 'Студенты и контракты', permission: ['all'] },
        { url: 'MainStudentsAdd', text: 'Добавить студента', permission: ['hide'] }
      ]
    },
    { url: 'MainCards', text: 'Выпущенные карты', icon: 'mdi-view-grid-outline', permission: ['hide'] },
    { url: 'MainImport', text: 'Реестры', icon: 'mdi-tray-arrow-down', permission: ['all'],
      children: [
        { url: 'MainImportData', text: 'Выпуск карт', permission: ['all'] },
      ]
    },
    { separate: true, text: t('menus.system'), permission: ['all'] },
    { url: 'MainUsers', text: 'Пользователи', icon: 'mdi-account-multiple-outline', permission: ['all'] }
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
                  <template v-for="(child, indx) in (menu.children as any)">
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
