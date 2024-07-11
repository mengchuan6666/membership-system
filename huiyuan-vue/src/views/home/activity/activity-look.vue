<!-- 角色编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="900"
    :model-value="modelValue"
    :title="isUpdate ? '查看活动' : '查看活动'"
    @update:modelValue="updateModelValue"
  >
    <div>
		<span style="margin-left: 40%;font-weight: bold;font-size: 18px;">{{ props.data.activityTitle }}</span>
		<div style="margin-top: 20px;" v-html="props.data.activityDetails"></div>
	</div>
    <template #footer>
      <el-button @click="updateModelValue(false)">关闭</el-button>
    </template>
  </ele-modal>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue';

  const emit = defineEmits(['update:modelValue']);

  const props = defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    // 修改回显的数据
    data: Object
  });

  // 是否是修改
  const isUpdate = ref(false);

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue) {
        if (props.data) {
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      }
    }
  );
</script>
