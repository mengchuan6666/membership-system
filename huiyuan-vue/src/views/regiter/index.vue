<template>
  <div class="login-wrapper">
    <ele-card shadow="always" class="login-card">
      <div class="login-cover">
        <h1 class="login-title">会员中心后台管理系统</h1>
      </div>
      <div class="login-body">
        <ele-text type="heading" style="font-size: 24px; margin-bottom: 18px">
          用户注册 <el-link href="/login"  type="primary">用户登录</el-link>
        </ele-text>
        <el-form
          ref="formRef"
          size="large"
          :model="form"
          :rules="rules"
        >
          <el-form-item prop="username">
            <el-input
              clearable
              v-model="form.username"
              placeholder="请输入登录账号"
              :prefix-icon="User"
            />
          </el-form-item>
		  <el-form-item prop="nickname">
		    <el-input
			  clearable
		      v-model="form.nickname"
		      placeholder="请输入昵称"
			  :prefix-icon="User"
		    />
		  </el-form-item>
          <el-form-item prop="password">
            <el-input
              show-password
              v-model="form.password"
              placeholder="请输入登录密码"
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item prop="passtwo">
            <el-input
              show-password
              v-model="form.passtwo"
              placeholder="请输入登录密码"
              :prefix-icon="Lock"
            />
          </el-form-item>
		  <el-form-item prop="type">
		    <el-radio-group v-model="form.type" >
		      <el-radio label="管理员">管理员</el-radio>
		      <el-radio label="会员用户">会员用户</el-radio>
		    </el-radio-group>
		  </el-form-item>
          <el-form-item>
            <el-button
              size="large"
              type="primary"
              :loading="loading"
              style="width: 100%"
              @click="submit"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </ele-card>
  </div>
</template>

<script setup>
  import { ref, reactive, unref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { EleMessage, uuid } from 'ele-admin-plus/es';
  import { User, Lock, RefreshRight } from '@element-plus/icons-vue';
  import { ProtectOutlined } from '@/components/icons';
  import { getToken } from '@/utils/token-util';
  import { usePageTab } from '@/utils/use-page-tab';
  import { regiter, getCaptcha } from '@/api/login';

  const { currentRoute } = useRouter();
  const { goHomeRoute, cleanPageTabs } = usePageTab();

  // 表单
  const formRef = ref();

  // 加载状态
  const loading = ref(false);

  // 表单数据
  const form = reactive({
    username: '',
    password: '',
	nickname: '',
    type: '',
    passtwo: ''
  });

  // 表单验证规则
  const rules = computed(() => {
    return {
      username: [
        {
          required: true,
          message: '请输入登录账号',
          type: 'string',
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: '请输入登录密码',
          type: 'string',
          trigger: 'blur'
        }
      ],
	  passtwo: [
	    {
	      required: true,
	      message: '请输入确认密码',
	      type: 'string',
	      trigger: 'blur'
	    }
	  ],
      nickname: [
        {
          required: true,
          message: '请输入昵称',
          type: 'string',
          trigger: 'blur'
        }
      ],
	  type: [
	    {
	      required: true,
	      message: '请选择用户类型',
	      type: 'string',
	      trigger: 'blur'
	    }
	  ]
    };
  });

  /* 提交 */
  const submit = () => {
    formRef.value?.validate((valid) => {
      if (!valid) {
        return false;
      }
      loading.value = true;
      regiter(form)
        .then((msg) => {
          EleMessage.success(msg);
          //goHome();
        })
        .catch((e) => {
          EleMessage.error(e.message);
          loading.value = false;
        });
    });
  };


  /* 跳转到首页 */
  const goHome = () => {
    const { query } = unref(currentRoute);
    goHomeRoute(query.from);
  };

</script>

<style lang="scss" scoped>
  .login-wrapper {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url('/src/assets/login-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .login-card {
    width: 920px;
    max-width: 100%;
    overflow: hidden;

    :deep(.el-card__body) {
      display: flex;
      padding: 0;
      height: 462px;
    }
  }

  .login-cover {
    flex: 1;
    padding: 36px 8px;
    box-sizing: border-box;
    background-color: #5e6afc;
    background-image: url('/src/assets/login-img.png');
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: contain;
    text-align: center;
  }

  .login-body {
    width: 400px;
    flex-shrink: 0;
    padding: 32px 48px 0 48px;
    box-sizing: border-box;

    :deep(.el-checkbox) {
      height: auto;

      .el-checkbox__label {
        color: inherit;
      }
    }

    :deep(.el-input__prefix-inner > .el-icon) {
      margin-right: 12px;
      transform: scale(1.26) translateY(-1px);
    }
  }

  // 验证码
  .login-captcha-group {
    width: 100%;
    display: flex;
    align-items: center;

    :deep(.el-input) {
      flex: 1;
    }

    .login-captcha {
      width: 108px;
      height: 40px;
      margin-left: 8px;
      border-radius: 4px;
      border: 1px solid hsla(0, 0%, 60%, 0.46);
      transition: border 0.2s;
      box-sizing: border-box;
      background: #fff;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      &:hover {
        border-color: hsla(0, 0%, 60%, 0.8);
      }
    }

    :deep(.el-input__prefix-inner > .el-icon) {
      transform: scale(1.16);
    }
  }

  // 标题
  .login-title {
    color: rgba(255, 255, 255, 0.98);
    font-size: 26px;
    margin: 0 0 6px 0;
    font-weight: normal;
    font-family: 'AliPuHui';
    letter-spacing: 1.2px;
  }

  .login-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    margin: 0;
    font-weight: normal;
    font-family: 'AliPuHui';
    letter-spacing: 4px;
  }

  // 二维码
  .login-qrcode-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
  }

  .login-qrcode {
    font-size: 0;
    display: inline-block;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
</style>

<style lang="scss">
  html.dark .login-wrapper {
    background: #000;
  }
</style>
