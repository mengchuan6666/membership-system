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
								<el-col :span="24"><div class="grid-content ep-bg-purple" />
								<el-card>
									<template #header>
									  <div class="card-header">
										<span style="color: #39f;font-size: 18px;font-weight: bold;">我的资格认定</span>
									  </div>
									</template>
									<ele-pro-table
									  ref="tableRef"
									  row-key="renzhengId"
									  :columns="columns"
									  :datasource="datasource"
									>
									  <template #toolbar>
									    <el-space>
									      <el-button
									        type="primary"
									        class="ele-btn-icon"
									        :icon="Plus"
									        @click="openEdit()"
									      >
									        申请资格认证
									      </el-button>
									    </el-space>
									  </template>
									  <template #status="{ row }">
									    <el-tag v-if="row.status === '0'" size="small" > 未审核 </el-tag>
									    <el-tag v-if="row.status === '1'" size="small" > 审核通过 </el-tag>
									    <el-tag v-if="row.status === '2'" size="small" > 审核不通过 </el-tag>
									  </template>
									  <template #action="{ row }">
									    <el-space>
									      <el-link v-if="row.zhengshu" type="primary" :underline="false" @click="chakan(row)">
									        查看证书
									      </el-link>
									      <el-divider v-if="row.zhengshu" direction="vertical" style="margin: 0" />
										  <el-popconfirm
									        :width="190"
									        placement="top-end"
									        title="确定要删除此数据吗？"
									        @confirm="remove(row)"
											v-if="row.status === '0'"
									      >
									        <template #reference>
									          <el-link type="danger" :underline="false">删除</el-link>
									        </template>
									      </el-popconfirm>
									    </el-space>
									  </template>
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
	<RenZhengEdit v-model="showEdit" :data="current" @done="reload" />
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
	import Header from './header.vue';
	import { pageRenZhengs,removeRenZheng } from '@/api/neirong/renzheng';
	import { Plus } from '@element-plus/icons-vue';
	import {
		useUserStore
	} from '@/store/modules/user';
	import { EleMessage } from 'ele-admin-plus/es';
	import RenZhengEdit from './renzheng/renzheng-edit.vue';
	
	// 获取用户存储
	const userStore = useUserStore();
	// 当前用户信息
	const loginUser = computed(() => userStore.info ?? {});
	
	const neirong = ref();

	const route = useRoute();
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
	    prop: 'renzhengTitle',
	    label: '认证名称',
	    sortable: 'custom',
	    showOverflowTooltip: true
	  },
		{
		  prop: 'zhengshu',
		  label: '证书',
		  sortable: 'custom',
		  showOverflowTooltip: true
		},
		{
		  prop: 'status',
		  label: '状态',
		  sortable: 'custom',
		  showOverflowTooltip: true,
		  columnKey: 'status',
		  slot: 'status'
		},
	  {
	    prop: 'createTime',
	    label: '申请时间',
	    sortable: 'custom',
	    showOverflowTooltip: true
	  },
	  {
	    prop: 'cname',
	    label: '申请人',
	    sortable: 'custom',
	    showOverflowTooltip: true
	  },
	  {
	    columnKey: 'action',
	    label: '操作',
	    width: 200,
	    align: 'center',
	    resizable: false,
	    slot: 'action'
	  }
	]);

    // 表格数据源
    const datasource = ({ page, limit, where, orders }) => {
		where.createUser = loginUser.value.userId;
        return pageRenZhengs({ ...where, ...orders, page, limit });
    };
	
	/* 搜索 */
	const reload = (where) => {
	  tableRef?.value?.reload({ page: 1, where });
	};
	
	/* 打开编辑弹窗 */
	const openEdit = (row) => {
	  current.value = row ?? null;
	  showEdit.value = true;
	};
	
	/* 删除单个 */
	const remove = (row) => {
	  const loading = EleMessage.loading('请求中..');
	  removeRenZheng(row.renzhengId)
	    .then((msg) => {
	      loading.close();
	      EleMessage.success(msg);
	      reload({});
	    })
	    .catch((e) => {
	      loading.close();
	      EleMessage.error(e.message);
	    });
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