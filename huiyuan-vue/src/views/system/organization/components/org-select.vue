<!-- 机构选择下拉框 -->
<template>
  <el-tree-select
    clearable
    :data="data"
    check-strictly
    default-expand-all
    node-key="organizationId"
    :props="{ label: 'organizationName' }"
    :model-value="modelValue || void 0"
    :placeholder="placeholder"
    class="ele-fluid"
    @update:modelValue="updateValue"
  />
</template>

<script setup>
  const emit = defineEmits(['update:modelValue']);

  defineProps({
    // 选中的数据(v-modal)
    modelValue: Number,
    // 提示信息
    placeholder: {
      type: String,
      default: '请选择机构'
    },
    // 机构数据
    data: Array
  });

  /* 更新选中数据 */
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };
</script>
