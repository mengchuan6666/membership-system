<template>
  <ele-page>
    <!-- 搜索表单 -->
    <Consult-search @search="reload" />
    <ele-card :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="consultId"
        :columns="columns"
        :datasource="datasource"
        v-model:selections="selections"
      >
        <template #action="{ row }">
          <el-space>
            <el-link type="primary" :underline="false" @click="openEdit(row)">
              回复
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
    <!-- 编辑弹窗 -->
    <consult-edit v-model="showEdit" :data="current" @done="reload" />
  </ele-page>
</template>

<script setup>
  import { ref } from 'vue';
  import { Plus, Delete } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus';
  import { EleMessage } from 'ele-admin-plus/es';
  import ConsultSearch from './components/consult-search.vue';
  import ConsultEdit from './components/consult-edit.vue';
  import { pageConsults, removeConsult } from '@/api/neirong/consult';

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

  // 表格数据源
  const datasource = ({ page, limit, where, orders }) => {
    return pageConsults({ ...where, ...orders, page, limit });
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

  /* 删除单个 */
  const remove = (row) => {
    const loading = EleMessage.loading('请求中..');
    removeConsult(row.consultId)
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
    name: 'SystemConsult'
  };
</script>
