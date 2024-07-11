<template>
  <el-dropdown
    placement="bottom-end"
    style="cursor: pointer"
    @command="onCommand"
  >
    <ele-text
      type="placeholder"
      :icon="MoreFilled"
      style="transform: rotate(90deg); outline: none"
    />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="edit" :icon="EditPen">
          编辑
        </el-dropdown-item>
        <el-dropdown-item command="remove" :icon="Delete">
          删除
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
  import { MoreFilled, EditPen, Delete } from '@element-plus/icons-vue';

  const emit = defineEmits(['command']);

  const onCommand = (command) => {
    emit('command', command);
  };
</script>
