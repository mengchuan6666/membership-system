<template>
  <ele-page>
    <!-- 搜索表单 -->
    <RenZhengSearch @search="reload" />
    <ele-card :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="renzhengId"
        :columns="columns"
        :datasource="datasource"
        v-model:selections="selections"
      >
	    <template #status="{ row }">
	      <el-tag v-if="row.status === '0'" size="small" > 未审核 </el-tag>
		  <el-tag v-if="row.status === '1'" size="small" > 审核通过 </el-tag>
		  <el-tag v-if="row.status === '2'" size="small" > 审核不通过 </el-tag>
	    </template>
        <template #action="{ row }">
          <el-space>
			<el-link type="primary" :underline="false" @click="openEdit(row)">
			  审核
			</el-link>
			<el-divider v-if="row.status === '1'" direction="vertical" style="margin: 0" />
			<el-link v-if="row.status === '1'" type="primary" :underline="false" @click="upload(row)">
			  上传证书
			</el-link>
			<el-divider direction="vertical" style="margin: 0" />
            <el-popconfirm
              :width="190"
              placement="top-end"
              title="确定要删除此数据吗？"
              @confirm="remove(row)"
            >
              <template #reference>
                <el-link type="danger" :underline="false">删除</el-link>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </ele-pro-table>
    </ele-card>
	<RenZhengEdit v-model="showEdit" :data="current" @done="reload" />
	<RenZhengUpload v-model="showEdit1" :data="current" @done="reload" />
  </ele-page>
</template>

<script setup>
  import { ref } from 'vue';
  import { Plus, Delete } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus';
  import { EleMessage } from 'ele-admin-plus/es';
  import RenZhengSearch from './components/renzheng-search.vue';
  import { pageRenZhengs, removeRenZheng } from '@/api/neirong/renzheng';
  import RenZhengEdit from './components/renzheng-edit.vue';
  import RenZhengUpload from './components/renzheng-upload.vue';

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

  // 表格选中数据
  const selections = ref([]);

  // 当前编辑数据
  const current = ref(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);
  
  const showEdit1 = ref(false);

  // 表格数据源
  const datasource = ({ page, limit, where, orders }) => {
    return pageRenZhengs({ ...where, ...orders, page, limit });
  };

  /* 搜索 */
  const reload = (where) => {
    selections.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row) => {
    current.value = row ?? null;
    showEdit.value = true;
  };
  
  const upload = (row) => {
    current.value = row ?? null;
    showEdit1.value = true;
  };

  /* 删除单个 */
  const remove = (row) => {
    const loading = EleMessage.loading('请求中..');
    removeRenZheng(row.RenZhengId)
      .then((msg) => {
        loading.close();
        EleMessage.success(msg);
        reload();
      })
      .catch((e) => {
        loading.close();
        EleMessage.error(e.message);
      });
  };


</script>

<script>
  export default {
    name: 'SystemRenZheng'
  };
</script>
