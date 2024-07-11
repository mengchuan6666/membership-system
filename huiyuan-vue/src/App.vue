<template>
  <el-config-provider :locale="zh_CN">
    <ele-config-provider :map-key="MAP_KEY" :license="LICENSE_CODE">
      <ele-app>
        <router-view />
      </ele-app>
    </ele-config-provider>
  </el-config-provider>
</template>

<script setup>
  import { useThemeStore } from '@/store/modules/theme';
  import { MAP_KEY, LICENSE_CODE } from '@/config/setting';
  import zh_CN from 'element-plus/lib/locale/lang/zh-cn';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';
  dayjs.locale('zh-cn');

  // 恢复主题
  const themeStore = useThemeStore();
  themeStore.recoverTheme();
</script>
