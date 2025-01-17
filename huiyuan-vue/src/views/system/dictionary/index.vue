<template>
  <ele-page flex-table :multi-card="false" style="min-height: 420px">
    <ele-card
      flex-table
      :body-style="{ padding: '0 0 0 16px', overflow: 'hidden' }"
    >
      <ele-split-panel
        flex-table
        size="266px"
        allow-collapse
        :custom-style="{ borderWidth: '0 1px 0 0', padding: '16px 0' }"
        :body-style="{ padding: '16px 16px 16px 0', overflow: 'hidden' }"
        :style="{ height: '100%', overflow: 'visible' }"
      >
        <el-space style="display: flex; margin-bottom: 12px">
          <el-button
            type="primary"
            class="ele-btn-icon"
            :icon="Plus"
            @click="openEdit()"
          >
            新建
          </el-button>
          <el-button
            type="warning"
            :disabled="!current"
            class="ele-btn-icon"
            :icon="EditPen"
            @click="openEdit(current)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            :disabled="!current"
            class="ele-btn-icon"
            :icon="Delete"
            @click="remove"
          >
            删除
          </el-button>
        </el-space>
        <div class="ele-scrollbar-hover ele-scrollbar-mini dict-tree">
          <el-tree
            ref="treeRef"
            :data="data"
            highlight-current
            node-key="dictId"
            :props="{ label: 'dictName' }"
            :expand-on-click-node="false"
            :default-expand-all="true"
            @node-click="onNodeClick"
          />
        </div>
        <template #body>
          <dict-data
            v-if="current && current.dictId"
            :dict-id="current.dictId"
          />
        </template>
      </ele-split-panel>
    </ele-card>
    <!-- 编辑弹窗 -->
    <dict-edit v-model="showEdit" :data="editData" @done="query" />
  </ele-page>
</template>

<script setup>
  import { ref, nextTick } from 'vue';
  import { Plus, Delete, EditPen } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus';
  import { EleMessage } from 'ele-admin-plus/es';
  import DictData from './components/dict-data.vue';
  import DictEdit from './components/dict-edit.vue';
  import { listDictionaries, removeDictionary } from '@/api/system/dictionary';

  // 树组件
  const treeRef = ref(null);

  // 加载状态
  const loading = ref(true);

  // 树形数据
  const data = ref([]);

  // 选中数据
  const current = ref(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 编辑回显数据
  const editData = ref(null);

  /* 查询 */
  const query = () => {
    loading.value = true;
    listDictionaries()
      .then((list) => {
        loading.value = false;
        data.value = list ?? [];
        nextTick(() => {
          onNodeClick(data.value[0]);
        });
      })
      .catch((e) => {
        loading.value = false;
        EleMessage.error(e.message);
      });
  };

  /* 选择数据 */
  const onNodeClick = (row) => {
    if (row && row.dictId) {
      current.value = row;
      treeRef.value?.setCurrentKey(row.dictId);
    } else {
      current.value = null;
    }
  };

  /* 打开编辑弹窗 */
  const openEdit = (row) => {
    editData.value = row ?? null;
    showEdit.value = true;
  };

  /* 删除 */
  const remove = () => {
    ElMessageBox.confirm('确定要删除选中的字典吗?', '提示', {
      type: 'warning',
      draggable: true
    })
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeDictionary(current.value?.dictId)
          .then((msg) => {
            loading.close();
            EleMessage.success(msg);
            query();
          })
          .catch((e) => {
            loading.close();
            EleMessage.error(e.message);
          });
      })
      .catch(() => {});
  };

  query();
</script>

<script>
  export default {
    name: 'SystemDictionary'
  };
</script>

<style lang="scss" scoped>
  .dict-tree {
    flex: 1;
    padding-right: 16px;

    :deep(.el-tree-node__content) {
      height: 38px;
      border-radius: 6px;

      & > .el-tree-node__expand-icon {
        padding: 2px;
      }
    }
  }
</style>
