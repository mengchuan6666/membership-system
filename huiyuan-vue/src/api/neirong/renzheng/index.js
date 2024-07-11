import request from '@/utils/request';

/**
 * 分页查询用户
 */
export async function pageRenZhengs(params) {
  const res = await request.get('/system/renzheng/page', { params });
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询用户列表
 */
export async function listRenZhengs(params) {
  const res = await request.get('/system/renzheng', {
    params
  });
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据id查询用户
 */
export async function getRenZheng(id) {
  const res = await request.get('/system/renzheng/' + id);
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加用户
 */
export async function addRenZheng(data) {
  const res = await request.post('/system/renzheng', data);
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改用户
 */
export async function updateRenZheng(data) {
  const res = await request.put('/system/renzheng', data);
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除用户
 */
export async function removeRenZheng(id) {
  const res = await request.delete('/system/renzheng/' + id);
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}