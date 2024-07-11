<!-- 角色编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="900"
    :model-value="modelValue"
    :title="isUpdate ? '修改规则' : '添加规则'"
    @update:modelValue="updateModelValue"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="78px">
      <el-form-item label="规则名称" prop="ruleTitle">
        <el-input
          clearable
          v-model="form.ruleTitle"
          placeholder="请输入规则名称"
        />
      </el-form-item>
      <el-form-item label="积分" prop="jifen">
        <el-input-number
		  :min="1" 
		  :max="100"
          clearable
          v-model="form.jifen"
          placeholder="请输入可获取积分"
        />
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
  import { addRule, updateRule } from '@/api/neirong/rule';

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
    ruleId: void 0,
    ruleTitle: '',
    jifen: ''
  });

  // 表单验证规则
  const rules = reactive({
    ruleTitle: [
      {
        required: true,
        message: '请输入规则名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    jifen: [
      {
        required: true,
        message: '请输入可获取积分',
        type: 'number',
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
      const saveOrUpdate = isUpdate.value ? updateRule : addRule;
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
