<template>
	<Header />
	<div class="ele-admin-main" style="background-color: #f1f1f1;min-height: 100vh;">
		<div class="ele-admin-body">
			<div class="ele-admin-content">
				<div class="ele-admin-content-view">
					<div class="ele-body" style="margin-left: 300px;margin-right: 300px;padding-top:20px;">
						<!-- 首页轮播图 -->
						<el-carousel autoplay>
							<div><img style="width: 100%;height: 400px;" src="../../assets/image/00001.png"></div>
						</el-carousel>
						<div style="margin-top: 20px;">
							<el-row :gutter="20">
								<el-col :span="8">
									<div class="grid-content ep-bg-purple" />
									<el-card>
										<template #header>
											<div class="card-header">
												<span style="color: #39f;font-size: 18px;font-weight: bold;">我的信息</span>
											</div>
										</template>
										<p>昵称：{{loginUser.nickname}}</p>
										<p>会员级别：{{loginUser.jibie}}</p>
										<p>积分：{{loginUser.jifen}}</p>
									</el-card>
								</el-col>
								<el-col :span="16">
									<div class="grid-content ep-bg-purple" />
									<el-card>
										<template #header>
											<div class="card-header">
												<span style="color: #39f;font-size: 18px;font-weight: bold;">积分规则</span>
											</div>
										</template>
										<ele-pro-table ref="tableRef" row-key="payId"
											:columns="columns" :datasource="datasource">
											
										</ele-pro-table>
									</el-card>
								</el-col>
							</el-row>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 编辑弹窗 -->
	<pay-edit v-model="showEdit" :data="current" @done="reload" />
</template>

<script lang="ts" setup>
	import {
		onMounted,
		ref,
		watch,
		reactive,
		computed
	} from 'vue';
	import {
		useRoute
	} from "vue-router";
	import { Plus } from '@element-plus/icons-vue';
	import Header from './header.vue';
	import { pageRules } from '@/api/neirong/rule';
	import {
		useUserStore
	} from '@/store/modules/user';

	// 获取用户存储
	const userStore = useUserStore();
	// 当前用户信息
	const loginUser = computed(() => userStore.info ?? {});
	
	const showEdit = ref(false);
	// 当前编辑数据
	const current = ref(null);

	// 表格实例
	const tableRef = ref(null);

	// 表格列配置
	const columns = ref([
	  {
	    type: 'index',
	    columnKey: 'index',
	    width: 48,
	    align: 'center',
	    showOverflowTooltip: true,
	    fixed: 'left'
	  },
	  {
	    prop: 'ruleTitle',
	    label: '规则名称',
	    sortable: 'custom',
	    showOverflowTooltip: true
	  },
	  {
	    prop: 'jifen',
	    label: '积分',
	    sortable: 'custom',
	    showOverflowTooltip: true
	  },
	  {
	    prop: 'createTime',
	    label: '创建时间',
	    sortable: 'custom',
	    showOverflowTooltip: true
	  },
	  {
	    prop: 'cname',
	    label: '创建人',
	    sortable: 'custom',
	    showOverflowTooltip: true
	  }
	]);

	// 表格数据源
	const datasource = ({ page, limit, where, orders }) => {
		where.createUser = loginUser.value.userId;
		return pageRules({ ...where, ...orders, page, limit });
	};
	
	const reload = (where) => {
	  tableRef?.value?.reload({ page: 1, where });
	};
	

</script>

<script lang="ts">
	import {
		defineComponent
	} from 'vue';

	export default defineComponent({
		name: 'ActivityIndex'
	});
</script>