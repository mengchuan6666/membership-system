<!-- 角色编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="900"
    :model-value="modelValue"
    :title="isUpdate ? '修改活动' : '添加活动'"
    @update:modelValue="updateModelValue"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="78px">
      <el-form-item label="活动名称" prop="activityTitle">
        <el-input
          clearable
          v-model="form.activityTitle"
          placeholder="请输入活动名称"
        />
      </el-form-item>
      <el-form-item label="活动内容" prop="activityDetails">
        <!-- 编辑器 -->
        <tinymce-editor v-model="form.activityDetails" :init="{ height: 425 }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="updateModelValue(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useFormData } from '@/utils/use-form-data';
  import { addActivity, updateActivity } from '@/api/neirong/activity';
  import TinymceEditor from '@/components/TinymceEditor/index.vue';

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    // 修改回显的数据
    data: Object
  });

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单实例
  const formRef = ref(null);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData({
    activityId: void 0,
    activityTitle: '',
    activityDetails: ''
  });

  // 表单验证规则
  const rules = reactive({
    activityTitle: [
      {
        required: true,
        message: '请输入活动名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    activityDetails: [
      {
        required: true,
        message: '请输入活动内容',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  /* 保存编辑 */
  const save = () => {
    formRef.value?.validate((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateActivity : addActivity;
      saveOrUpdate(form)
        .then((msg) => {
          loading.value = false;
          EleMessage.success(msg);
          updateModelValue(false);
          emit('done');
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e.message);
        });
    });
  };

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue) {
        if (props.data) {
          assignFields(props.data);
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate();
      }
    }
  );
</script>
