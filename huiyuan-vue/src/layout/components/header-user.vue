<!-- 用户信息 -->
<template>
  <el-dropdown @command="onUserDropClick">
    <div class="header-avatar">
      <el-avatar
        :size="28"
        :src="loginUser.avatar"
        :icon="loginUser.avatar ? void 0 : User"
      />
      <span style="margin-left: 4px">
        {{ loginUser.nickname }}
      </span>
      <el-icon :size="12" style="margin-left: 2px">
        <arrow-down />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="password" :icon="Key">
          修改密码
        </el-dropdown-item>
        <el-dropdown-item command="logout" :icon="SwitchButton" divided>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- 修改密码弹窗 -->
  <password-modal v-model="passwordVisible" />
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessageBox } from 'element-plus';
  import { User, ArrowDown, Key, SwitchButton } from '@element-plus/icons-vue';
  import { useUserStore } from '@/store/modules/user';
  import { logout } from '@/utils/use-page-tab';
  import PasswordModal from './password-modal.vue';

  const { push } = useRouter();
  const userStore = useUserStore();

  // 是否显示修改密码弹窗
  const passwordVisible = ref(false);

  // 当前用户信息
  const loginUser = computed(() => userStore.info ?? {});

  /* 用户信息下拉点击 */
  const onUserDropClick = (command) => {
    if (command === 'password') {
      passwordVisible.value = true;
    } else if (command === 'logout') {
      // 退出登录
      ElMessageBox.confirm('确定要退出登录吗?', '提示', {
        type: 'warning',
        draggable: true
      })
        .then(() => {
          logout(void 0, void 0, push);
        })
        .catch(() => {});
    }
  };
</script>

<style lang="scss" scoped>
  .header-avatar {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;
    outline: none;
  }
</style>
