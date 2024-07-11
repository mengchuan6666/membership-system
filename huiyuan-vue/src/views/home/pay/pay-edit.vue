<!-- 角色编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="900"
    :model-value="modelValue"
    :title="isUpdate ? '修改缴费' : '添加缴费'"
    @update:modelValue="updateModelValue"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="78px">
      <el-form-item label="缴费名称" prop="payTitle">
        <el-input
          clearable
          v-model="form.payTitle"
          placeholder="请输入缴费名称"
        />
      </el-form-item>
      <el-form-item label="金额" prop="jine">
        <el-input-number
		  :min="1" 
		  :max="100"
          clearable
          v-model="form.jine"
          placeholder="请输入缴费金额"
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
  import { addPay, updatePay } from '@/api/neirong/pay';

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
    payId: void 0,
    payTitle: '',
    jine: void 0
  });

  // 表单验证缴费
  const rules = reactive({
    payTitle: [
      {
        required: true,
        message: '请输入缴费名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    jine: [
      {
        required: true,
        message: '请输入缴费金额',
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
      const saveOrUpdate = isUpdate.value ? updatePay : addPay;
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
