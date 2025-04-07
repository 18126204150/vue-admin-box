<template>
    <div class="user-list-container">
      <el-card>
        <template #header>
          <h3>文档列表</h3>
        </template>
        <el-button type="primary" @click="openCreateDialog">新增</el-button>
        <el-table :data="users" stripe>
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="picture" label="图片"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="createtime" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="warning" @click="openUpdateDialog(scope.row)">更新</el-button>
              <el-button type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 创建对话框 -->
      <el-dialog v-model="createDialogVisible" title="新增">
        <template #footer>
          <el-form :model="createForm" ref="createFormRef" label-width="80px">
            <el-form-item label="名称">
              <el-input v-model="createForm.name"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="createForm.remark" type="password"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCreateUser">提交</el-button>
        </template>
      </el-dialog>
      <!-- 更新对话框 -->
      <el-dialog v-model="updateDialogVisible" title="更新用户">
        <template #footer>
          <el-form :model="updateForm" ref="updateFormRef" label-width="80px">
            <el-form-item label="名称">
              <el-input v-model="updateForm.name"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="updateForm.remark"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpdateUser">提交</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const users:any = ref([])
  const createDialogVisible = ref(false)
  const updateDialogVisible = ref(false)
  const createForm = ref({
    name: '',
    remark: ''
  })
  const updateForm = ref({
    id: null,
    name: '',
    remark: ''
  })
  const createFormRef = ref(null)
  const updateFormRef = ref(null)
  
  const fetchUsers = async () => {
    try {
      const response:any = await axios.get("/api/documents",{
       
      })
      users.value = response.data
    } catch (error) {
      console.error('获取文档列表失败:', error)
    }
  }
  
  // 创建
  const openCreateDialog = () => {
    createDialogVisible.value = true
  }
  
  //创建提交
  const submitCreateUser = async () => {
    try {
      const response = await axios.post('api/documents/create', createForm.value)
      users.value.push(response.data)
      createDialogVisible.value = false
      createForm.value = {
        name: '',
        remark: ''
      }
    } catch (error) {
      console.error('创建失败:', error)
    }
  }
  
  const openUpdateDialog = (user:any) => {
    updateForm.value = { ...user }
    updateDialogVisible.value = true
  }
  
  // 更新用户
  const submitUpdateUser = async () => {
    try {
      const response = await axios.put('/api/documents/update', updateForm.value)
      const index = users.value.findIndex((u:any) => u.id === updateForm.value.id)
      if (index !== -1) {
        users.value[index] = response.data
      }
      updateDialogVisible.value = false
    } catch (error) {
      console.error('更新失败:', error)
    }
  }
  
  const deleteUser = async (id:any) => {
    try {
      await axios.delete(`/api/documents/delete?id=${id}`)
      users.value = users.value.filter((u:any) => u.id !== id)
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
  
  onMounted(() => {
    fetchUsers()
  })
  </script>
  
  <style scoped>
  .user-list-container {
    width: 100vh;
    height: 80vh;
    padding: 20px;
  }
  </style>