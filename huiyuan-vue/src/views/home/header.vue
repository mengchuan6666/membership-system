<template>
	<div class="ele-admin-header" style="height: 50px;">
			<div class="ele-admin-logo" style="max-width: 300px;margin-left: 100px;box-shadow:none;height: 50px;">
				<img
				  src="/src/assets/logo.svg"
				  style="width: 30px; height: 30px; transform: translateY(-1px)"
				/>
				<h1 style="font-size: 18px; font-family: 'AliPuHui'">会员中心用户系统 </h1>
			</div>
			<div class="ele-admin-menus" style="max-width: 800px;height: 50px;margin-left: 100px;">
			<el-menu
			    :default-active="activeIndex"
			    mode="horizontal"
				@select="handleSelect"
				:route = "true"
				style="width: 700px;"
			  >
			    <el-menu-item index="/home/index">首页</el-menu-item>
			    <el-menu-item index="/home/activity">活动培训</el-menu-item>
			    <el-menu-item index="/home/pay">在线缴费</el-menu-item>
				<el-menu-item index="/home/jifen">会员积分</el-menu-item>
				<el-menu-item index="/home/consult">用户咨询</el-menu-item>
				<el-menu-item index="/home/renzheng">资格认定</el-menu-item>
			</el-menu>
			</div>
			<div class="ele-admin-tools" style="align-self: center;">
				<el-space>
					<el-button v-if="!loginMark" size="small" type="primary" @click="doLogin">登录</el-button>
					<el-button v-if="!loginMark" size="small" type="primary" @click="doRegiter">注册</el-button>
					<header-user v-if="loginMark" />
				</el-space>
			</div>
	</div>
</template>

<script lang="ts" setup>
	import { onMounted, ref, computed,createVNode } from 'vue';
	import { useRoute, useRouter } from "vue-router";
	import {
		useUserStore
	} from '@/store/modules/user';
	import HeaderUser from './header-user.vue';
	import { removeToken } from '@/utils/token-util';

	const route = useRoute();
	const router = useRouter();
	// 获取用户存储
	const userStore = useUserStore();
	// 当前用户信息
	const loginUser = computed(() => userStore.info ?? {});
	const loginMark = ref(false);
	
	onMounted(()=>{
		if(userStore.info){
			loginMark.value = true;
		}else{
			loginMark.value = false;
		}
	})
	
	//点击导航
	const activeIndex = computed(() => {
		return route.path;
	});

	//点击导航跳转对应页面
	const handleSelect = (key) => {
		router.push({
			path: key
		})
	};
	
	const doLogin = () => {
		router.push({
			path: '/login'
		})
	}
	
	const doRegiter = () => {
		router.push({
			path: '/regiter'
		})
	}
	
	const logout = () => {
		// 退出登录
		Modal.confirm({
		  title: '退出登录',
		  content: '确定要退出登录吗?',
		  icon: createVNode(ExclamationCircleOutlined),
		  maskClosable: true,
		  onOk: () => {
		    removeToken();
		    location.replace('/index'); 
		  }
		});
	}
</script>

<script lang="ts">
	import { defineComponent } from 'vue';

	export default defineComponent({
		name: 'HeaderIndex'
	});
</script>