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
								<el-col :span="8"><div class="grid-content ep-bg-purple" />
								<el-card>
									<template #header>
									  <div class="card-header">
										<span style="color: #39f;font-size: 18px;font-weight: bold;">我要咨询</span>
									  </div>
									</template>
									<el-form ref="formRef" :model="form" :rules="rules" label-width="78px">
									    <el-form-item label="咨询内容" prop="consultDetails">
									      <el-input
									        clearable
											type="textarea"
											:rows="8"
									        v-model="form.consultDetails"
									        placeholder="请输入回复内容"
									      />
									    </el-form-item>
									</el-form>
									<el-button type="primary" style="margin-top: 20px;" @click="zixun()">咨询</el-button>
								  </el-card></el-col>
								<el-col :span="16"><div class="grid-content ep-bg-purple" />
								<el-card>
									<template #header>
									  <div class="card-header">
										<span style="color: #39f;font-size: 18px;font-weight: bold;">我的咨询</span>
									  </div>
									</template>
									<ele-pro-table
									  ref="tableRef"
									  row-key="consultId"
									  :toolbar="false"
									  :columns="columns"
									  :datasource="datasource"
									>
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
	<activity-look v-model="showEdit" :data="current" />
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
	import { pageConsults,addConsult } from '@/api/neirong/consult';
	import {
		useUserStore
	} from '@/store/modules/user';
	import { EleMessage } from 'ele-admin-plus/es';
	import { useFormData } from '@/utils/use-form-data';
	
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
	    prop: 'consultDetails',
	    label: '咨询内容',
	    sortable: 'custom',
	    showOverflowTooltip: true
	  },
	  {
	    prop: 'createTime',
	    label: '咨询时间',
	    sortable: 'custom',
	    showOverflowTooltip: true
	  },
	  {
	    prop: 'cname',
	    label: '咨询人',
	    sortable: 'custom',
	    showOverflowTooltip: true
	  },
		{
		  prop: 'replayDetails',
		  label: '回复内容',
		  sortable: 'custom',
		  showOverflowTooltip: true
		},
		{
		  prop: 'replayTime',
		  label: '回复时间',
		  sortable: 'custom',
		  showOverflowTooltip: true
		},
		{
		  prop: 'vname',
		  label: '回复人',
		  sortable: 'custom',
		  showOverflowTooltip: true
		}
	]);

    // 表格数据源
    const datasource = ({ page, limit, where, orders }) => {
		where.consultUser = loginUser.value.userId;
        return pageConsults({ ...where, ...orders, page, limit });
    };
	
	/* 搜索 */
	const reload = (where) => {
	  tableRef?.value?.reload({ page: 1, where });
	};
	
	// 表单实例
	const formRef = ref(null);
	
	// 表单数据
	const { form, resetFields } = useFormData({
	  consultId: void 0,
	  consultDetails: ''
	});
	
	// 表单验证规则
	const rules = reactive({
	  consultDetails: [
	    {
	      required: true,
	      message: '请输入咨询内容',
	      type: 'string',
	      trigger: 'blur'
	    }
	  ]
	});
	
	const zixun = () =>{
		formRef.value?.validate((valid) => {
		  if (!valid) {
		    return;
		  }
		  addConsult(form)
		    .then((msg) => {
		      EleMessage.success(msg);
			  resetFields();
			  formRef.value?.clearValidate();
              reload({});
		    })
		    .catch((e) => {
		      EleMessage.error(e.message);
		    });
		});
	}
	
</script>

<script lang="ts">
	import {
		defineComponent
	} from 'vue';

	export default defineComponent({
		name: 'ActivityIndex'
	});
</script>