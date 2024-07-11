<template>
  <ele-pro-layout
    :menus="menus"
    :tabs="tabs"
    :collapse="collapse"
    :compact="compact"
    :maximized="maximized"
    :tab-bar="tabBar"
    :breadcrumb="layout === 'side'"
    :layout="layout"
    :sidebar-layout="sidebarLayout"
    :header-style="headerStyle"
    :sidebar-style="sidebarStyle"
    :tab-style="tabStyle"
    :fixed-header="fixedHeader"
    :fixed-sidebar="fixedSidebar"
    :fixed-body="fixedBody"
    :fluid="fluid"
    :logo-in-header="logoInHeader"
    :colorful-icon="colorfulIcon"
    :fixed-home="true"
    :home-path="HOME_PATH"
    :redirectPath="REDIRECT_PATH"
    :tab-context-menu="true"
    :tab-sortable="true"
    :keep-alive="TAB_KEEP_ALIVE"
    :transition-name="transitionName"
    :responsive="false"
    @update:collapse="updateCollapse"
    @update:maximized="updateMaximized"
    @tabAdd="addPageTab"
    @tabClick="onTabClick"
    @tabRemove="removePageTab"
    @tabContextMenu="onTabContextMenu"
    @tabSortChange="setPageTabs"
    @bodySizeChange="onBodySizeChange"
  >
    <router-layout />
    <!-- logo -->
    <template #logo>
      <img
        src="/src/assets/logo.svg"
        style="width: 30px; height: 30px; transform: translateY(-1px)"
      />
      <h1 style="font-size: 18px; font-family: 'AliPuHui'">
        会员中心后台管理系统
      </h1>
    </template>
    <!-- 顶栏左侧按钮 -->
    <template #left>
      <!-- 折叠侧栏 -->
      <header-tool @click="updateCollapse(!collapse)">
        <el-icon style="transform: scale(1.15)">
          <menu-unfold-outlined v-if="collapse" />
          <menu-fold-outlined v-else />
        </el-icon>
      </header-tool>
      <!-- 刷新 -->
      <header-tool @click="reloadPageTab()">
        <el-icon style="transform: scale(1.25)">
          <refresh-right />
        </el-icon>
      </header-tool>
    </template>
    <!-- 顶栏右侧按钮 -->
    <template #right>
      <!-- 全屏切换 -->
      <header-tool @click="toggleFullscreen">
        <el-icon style="transform: scale(1.02)">
          <compress-outlined v-if="isFullscreen" />
          <expand-outlined v-else />
        </el-icon>
      </header-tool>
      <!-- 用户信息 -->
      <header-tool>
        <header-user />
      </header-tool>
      <div style="padding: 0 12px; line-height: 1">
        <ele-segmented
          :model-value="Number(darkMode)"
          @update:modelValue="updateDarkMode"
          :items="[{ value: 0 }, { value: 1 }]"
          :style="{
            '--ele-segmented-bg': 'rgba(255, 255, 255, .3)',
            '--ele-segmented-item-padding': '5px',
            '--ele-segmented-height': '22px'
          }"
        >
          <template #label="{ item }">
            <el-icon v-if="item.value" :color="darkMode ? '#fff' : '#333'">
              <moon-filled style="transform: scale(1.2)" />
            </el-icon>
            <el-icon v-else :color="darkMode ? '#eaeaea' : '#faad14'">
              <sun-filled style="transform: scale(1.2)" />
            </el-icon>
          </template>
        </ele-segmented>
      </div>
    </template>
    <!-- 页签右键菜单 -->
    <template #tabContext>
      <el-dropdown-item command="reload" :icon="RefreshRight">
        刷新当前
      </el-dropdown-item>
      <el-dropdown-item command="close" :icon="Close">
        关闭当前
      </el-dropdown-item>
      <el-dropdown-item command="left" :icon="Back">
        关闭左侧
      </el-dropdown-item>
      <el-dropdown-item command="right" :icon="Right">
        关闭右侧
      </el-dropdown-item>
      <el-dropdown-item command="other" :icon="Remove">
        关闭其它
      </el-dropdown-item>
      <el-dropdown-item command="all" :icon="CircleClose">
        关闭全部
      </el-dropdown-item>
    </template>
    <!-- 页签栏右侧下拉菜单 -->
    <template #tabExtra="{ active }">
      <tab-dropdown @menuClick="(key) => onTabDropdownMenu(key, active)">
        <el-dropdown-item command="fullscreen">
          <el-icon style="transform: scale(0.81)">
            <compress-outlined v-if="maximized" />
            <expand-outlined v-else />
          </el-icon>
          <span v-if="maximized">退出全屏</span>
          <span v-else>内容全屏</span>
        </el-dropdown-item>
        <el-dropdown-item command="reload" :icon="RefreshRight">
          刷新当前
        </el-dropdown-item>
        <el-dropdown-item command="close" :icon="Close">
          关闭当前
        </el-dropdown-item>
        <el-dropdown-item command="left" :icon="Back">
          关闭左侧
        </el-dropdown-item>
        <el-dropdown-item command="right" :icon="Right">
          关闭右侧
        </el-dropdown-item>
        <el-dropdown-item command="other" :icon="Remove">
          关闭其它
        </el-dropdown-item>
        <el-dropdown-item command="all" :icon="CircleClose">
          关闭全部
        </el-dropdown-item>
      </tab-dropdown>
    </template>
    <!-- 菜单图标 -->
    <template #icon="{ icon, item }">
      <el-icon v-if="icon" v-bind="item.meta?.props?.iconProps || {}">
        <component :is="icon" :style="item.meta?.props?.iconStyle" />
      </el-icon>
    </template>
  </ele-pro-layout>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import {
    HeaderTool,
    TabDropdown,
    requestFullscreen,
    exitFullscreen,
    checkFullscreen,
    EleMessage
  } from 'ele-admin-plus/es';
  import {
    RefreshRight,
    Close,
    Back,
    Right,
    Remove,
    CircleClose
  } from '@element-plus/icons-vue';
  import {
    CompressOutlined,
    ExpandOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SunFilled,
    MoonFilled
  } from '@/components/icons';
  import { HOME_PATH, REDIRECT_PATH, TAB_KEEP_ALIVE } from '@/config/setting';
  import { useUserStore } from '@/store/modules/user';
  import { useThemeStore } from '@/store/modules/theme';
  import { usePageTab } from '@/utils/use-page-tab';
  import RouterLayout from '@/components/RouterLayout/index.vue';
  import HeaderUser from './components/header-user.vue';

  const { push } = useRouter();
  const {
    addPageTab,
    removePageTab,
    removeAllPageTab,
    removeLeftPageTab,
    removeRightPageTab,
    removeOtherPageTab,
    reloadPageTab,
    setPageTabs
  } = usePageTab();
  const userStore = useUserStore();
  const themeStore = useThemeStore();

  // 菜单数据
  const { menus } = storeToRefs(userStore);

  // 布局风格
  const {
    tabs,
    collapse,
    compact,
    maximized,
    tabBar,
    layout,
    sidebarLayout,
    headerStyle,
    sidebarStyle,
    tabStyle,
    fixedHeader,
    fixedSidebar,
    fixedBody,
    fluid,
    logoInHeader,
    colorfulIcon,
    transitionName,
    darkMode
  } = storeToRefs(themeStore);

  // 是否全屏
  const isFullscreen = ref(false);

  /* 侧栏折叠切换 */
  const updateCollapse = (value) => {
    themeStore.setCollapse(value);
  };

  /* 内容区全屏切换 */
  const updateMaximized = (value) => {
    themeStore.setMaximized(value);
  };

  /* 页签点击事件 */
  const onTabClick = (option) => {
    const { key, active, item } = option;
    const path = item?.fullPath || key;
    if (key !== active && path) {
      push(path);
    }
  };

  /* 内容区尺寸改变事件 */
  const onBodySizeChange = ({ width }) => {
    themeStore.setContentWidth(width ?? null);
    isFullscreen.value = checkFullscreen();
  };

  /* 全屏切换 */
  const toggleFullscreen = () => {
    if (isFullscreen.value) {
      exitFullscreen();
      isFullscreen.value = false;
      return;
    }
    try {
      requestFullscreen();
      isFullscreen.value = true;
    } catch (e) {
      console.error(e);
      EleMessage.error('您的浏览器不支持全屏模式');
    }
  };

  /* 页签右键菜单点击事件 */
  const onTabContextMenu = (option) => {
    const { command, key, item, active } = option;
    if (command === 'reload') {
      reloadPageTab({ fullPath: item?.fullPath || key });
    } else if (command === 'close') {
      removePageTab({ key, active });
    } else if (command === 'left') {
      removeLeftPageTab({ key, active });
    } else if (command === 'right') {
      removeRightPageTab({ key, active });
    } else if (command === 'other') {
      removeOtherPageTab({ key, active });
    } else if (command === 'all') {
      removeAllPageTab({ key, active });
    }
  };

  /* 页签栏右侧下拉菜单点击事件 */
  const onTabDropdownMenu = (command, active) => {
    if (command === 'reload') {
      reloadPageTab();
    } else if (command === 'fullscreen') {
      updateMaximized(!maximized.value);
    } else {
      onTabContextMenu({ command, key: active, active });
    }
  };

  /* 切换暗黑模式 */
  const updateDarkMode = (value) => {
    themeStore.setDarkMode(!!value);
  };
</script>

<script>
  import * as MenuIcons from './menu-icons';

  export default {
    name: 'Layout',
    components: MenuIcons
  };
</script>
