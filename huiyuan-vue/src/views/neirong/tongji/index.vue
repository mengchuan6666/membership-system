<template>
	<ele-page :multi-card="false" style="padding: 20px;">
		<el-row :gutter="16">
		  <el-col
			:lg="12"
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
			  <v-chart
				  ref="saleChartRef"
				  :option="saleChartOption"
				  style="height: 320px"
				/>
			</ele-card>
		  </el-col>
		  <el-col
		  			:lg="12"
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
		  			  <v-chart
		  				  ref="saleChartRef"
		  				  :option="saleChartOption"
		  				  style="height: 320px"
		  				/>
		  			</ele-card>
		  </el-col>
		  <el-col
		  			:lg="12"
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
		  			  <!-- 表格 -->
		  			  <ele-pro-table
		  			    ref="tableRef"
		  			    row-key="id"
		  			    :columns="columns"
		  			    :datasource="datasource"
		  			    :where="defaultWhere"
		  			  >
		  			    <template #loginType="{ row }">
		  			      <el-tag
		  			        v-if="row.loginType === 0"
		  			        size="small"
		  			        type="success"
		  			        :disable-transitions="true"
		  			      >
		  			        登录成功
		  			      </el-tag>
		  			      <el-tag
		  			        v-else-if="row.loginType === 1"
		  			        size="small"
		  			        type="danger"
		  			        :disable-transitions="true"
		  			      >
		  			        登录失败
		  			      </el-tag>
		  			      <el-tag
		  			        v-else-if="row.loginType === 2"
		  			        size="small"
		  			        type="info"
		  			        :disable-transitions="true"
		  			      >
		  			        退出登录
		  			      </el-tag>
		  			      
		  			    </template>
		  			  </ele-pro-table>
		  			</ele-card>
		  </el-col>
		</el-row>
	</ele-page>
	
</template>

<script setup>
import { ref, reactive,onMounted } from 'vue';
import { EleMessage } from 'ele-admin-plus';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { getLoginRecord } from '@/api/system/operation-record';
import { useEcharts } from '@/utils/use-echarts';
  import {
    pageLoginRecords,
    listLoginRecords
  } from '@/api/system/login-record';

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);

const saleChartRef = ref(null);

useEcharts([saleChartRef]);
    const xData = ref();
	const yData = ref();
// 销售额柱状图配置
const saleChartOption = reactive({});
	onMounted(()=>{
		getLoginRecord()
		  .then((res) => {
				  xData.value = res.riqi;
				  yData.value = res.count;
		    Object.assign(saleChartOption, {
		    	tooltip: {
		    	  trigger: 'axis'
		    	},
		    	xAxis: [
		    	  {
		    		type: 'category',
		    		data: xData.value
		    	  }
		    	],
		    	yAxis: [
		    	  {
		    		type: 'value'
		    	  }
		    	],
		    	series: [
		    	  {
		    		type: 'bar',
		    		data: yData.value
		    	  }
		    	]
		    });
		  })
		  .catch((e) => {
		    EleMessage.error(e.message);
		  });
	})

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
      prop: 'username',
      label: '账号',
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'nickname',
      label: '用户名',
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'device',
      label: '设备型号',
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'os',
      label: '操作系统',
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'browser',
      label: '浏览器',
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'createTime',
      label: '登录时间',
      sortable: 'custom',
      showOverflowTooltip: true
    }
  ]);

  // 表格数据源
  const datasource = ({ page, limit, where, orders, filters }) => {
	  where.createTime = '2024-04-05'
    return pageLoginRecords({
      ...where,
      ...orders,
      ...filters,
      page,
      limit
    });
  };

  /* 刷新表格 */
  const reload = (where) => {
    tableRef?.value?.reload({ page: 1, where });
  };

</script>

<style>
</style>