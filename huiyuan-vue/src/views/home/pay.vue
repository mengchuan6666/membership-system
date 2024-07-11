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
												<span style="color: #39f;font-size: 18px;font-weight: bold;">会费标准</span>
											</div>
										</template>
										<p>专业会员/高级会员/杰出会员/会士：360元/年</p>
										<p>学生会员：50元/年</p>
										<p>会员资格以自然年度计算，</p>
										<p>即从每年1月1日至12月31日</p>
										<el-divider style="margin: 12px 0;" />
										<p>电话：010-62648654(工作日8:30-11:3013:30-17:30)</p>
										<p>邮箱：membership@ccf.org.cn(工作日48小时回复)</p>
									</el-card>
								</el-col>
								<el-col :span="16">
									<div class="grid-content ep-bg-purple" />
									<el-card>
										<template #header>
											<div class="card-header">
												<span style="color: #39f;font-size: 18px;font-weight: bold;">我的缴费</span>
											</div>
										</template>
										<ele-pro-table ref="tableRef" row-key="payId"
											:columns="columns" :datasource="datasource">
											<template #toolbar>
												<el-space>
													<el-button type="primary" class="ele-btn-icon" :icon="Plus"
														@click="openEdit()">
														缴费
													</el-button>
												</el-space>
											</template>
										</ele-pro-table>
									</el-card>
								</el-col>
								<el-col :span="8">
									<div class="grid-content ep-bg-purple" />
									<el-card>
										<template #header>
											<div class="card-header">
												<span style="color: #39f;font-size: 18px;font-weight: bold;">我的催缴</span>
											</div>
										</template>
										<ele-pro-table ref="tableRef1" row-key="callId" :toolbar="false"
											:columns="columns1" :datasource="datasource1">
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
	import { pagePays } from '@/api/neirong/pay';
	import { pageCalls } from '@/api/neirong/call';
	import PayEdit from './pay/pay-edit.vue';
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
			prop: 'payTitle',
			label: '缴费名称',
			sortable: 'custom',
			showOverflowTooltip: true
		},
		{
			prop: 'jine',
			label: '缴费金额',
			sortable: 'custom',
			showOverflowTooltip: true
		},
		{
			prop: 'createTime',
			label: '缴费时间',
			sortable: 'custom',
			showOverflowTooltip: true
		}
	]);

	// 表格数据源
	const datasource = ({ page, limit, where, orders }) => {
		where.createUser = loginUser.value.userId;
		return pagePays({ ...where, ...orders, page, limit });
	};
	
	const reload = (where) => {
	  tableRef?.value?.reload({ page: 1, where });
	};
	
	const openEdit = (row) =>{
		current.value = row ?? null;
		showEdit.value = true;
	}

	// 表格实例
	const tableRef1 = ref(null);

	// 表格列配置
	const columns1 = ref([
		{
			type: 'index',
			columnKey: 'index',
			width: 48,
			align: 'center',
			showOverflowTooltip: true,
			fixed: 'left'
		},
		{
			prop: 'callTitle',
			label: '催缴内容',
			sortable: 'custom',
			showOverflowTooltip: true
		},
		{
			prop: 'createTime',
			label: '催缴时间',
			sortable: 'custom',
			showOverflowTooltip: true
		}
	]);

	// 表格数据源
	const datasource1 = ({ page, limit, where, orders }) => {
		where.userId = loginUser.value.userId;
		return pageCalls({ ...where, ...orders, page, limit });
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