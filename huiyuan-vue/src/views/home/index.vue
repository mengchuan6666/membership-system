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
							<el-tabs
							    v-model="activeName"
							    type="border-card"
							    class="demo-tabs"
							>
							<el-tab-pane label="活动培训" name="first">
								<ele-page :multi-card="false" style="padding: 0;">
									<el-row :gutter="16">
									  <el-col
										v-for="item in dataList"
										:key="item.id"
										:lg="8"
										:md="8"
										:sm="12"
										:xs="24"
									  >
										<ele-card
										  shadow="always"
										  :body-style="{ padding: 0 }"
										  style="margin-top: 16px"
										  @click="chakan(item)"
										>
										  <div style="padding: 14px 14px 14px 14px">
											<ele-ellipsis
												:max-line="1"
												type="placeholder"
												style="margin: 8px 0 8px 0;font-size: 16px;font-weight: bold;color: black;"
											  >
												{{ item.activityTitle}}
											</ele-ellipsis>
											<ele-ellipsis
											  :max-line="4"
											  type="placeholder"
											  style="margin: 8px 0 16px 0"
											>
											  {{ item.activityDetails.replace(/(<([^>]+)>)/ig, '') }}
											</ele-ellipsis>
											<el-space>
												<el-tag type="primary">发布时间：{{ item.createTime }}</el-tag>
												<el-tag type="primary">发布人：{{ item.cname }}</el-tag>
											</el-space>
										  </div>
										</ele-card>
									  </el-col>
									</el-row>
								</ele-page>
							</el-tab-pane>
							</el-tabs>
						</div>
						<router-layout />
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
	} from 'vue';
	import Header from './header.vue';
	import {
		pageActivitys
	} from '@/api/neirong/activity';
	import ActivityLook from './activity/activity-look.vue';
	
	const activeName = ref('first')

    const showEdit = ref(false);
    // 当前编辑数据
    const current = ref(null);
    
    const chakan = (row) => {
    	current.value = row ?? null;
    	showEdit.value = true;
    }

	// 查询参数
	const queryParam = ref({
		'page': 1,
		'limit': 8,
		'activityTitle': '',
	});
	
	const reload = (where) => {
	  queryParam.value.activityTitle = where;
	  queryActivityPage(queryParam.value);
	};
	
	const dataList = ref([]);
	
	onMounted(() => {
		queryActivityPage(queryParam.value);
	})
	
	const queryActivityPage = (queryParam) => {
		pageActivitys(queryParam).then((res) => {
			dataList.value = res.list
		})
	}
</script>

<script lang="ts">
	import {
		defineComponent
	} from 'vue';

	export default defineComponent({
		name: 'HomeIndex'
	});
</script>
