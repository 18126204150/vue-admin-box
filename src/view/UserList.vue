<template>
  <div class="user-list-container">
    <el-card>
      <template #header>
        <h3>用户列表</h3>
      </template>
      <el-button type="primary" @click="openCreateDialog">创建用户</el-button>
      <el-table :data="users" stripe>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="warning" @click="openUpdateDialog(scope.row)">更新</el-button>
            <el-button type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 创建用户对话框 -->
    <el-dialog v-model="createDialogVisible" title="创建用户">
      <template #footer>
        <el-form :model="createForm" ref="createFormRef" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="createForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="createForm.password" type="password"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreateUser">提交</el-button>
      </template>
    </el-dialog>
    <!-- 更新用户对话框 -->
    <el-dialog v-model="updateDialogVisible" title="更新用户">
      <template #footer>
        <el-form :model="updateForm" ref="updateFormRef" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="updateForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="updateForm.password" type="password"></el-input>
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
  username: '',
  password: ''
})
const updateForm = ref({
  id: null,
  username: '',
  password: ''
})
const createFormRef = ref(null)
const updateFormRef = ref(null)

const fetchUsers = async () => {
  try {
    const response:any = await axios.get("/api/users",{
     
    })
    users.value = response.data
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 创建用户
const openCreateDialog = () => {
  createDialogVisible.value = true
}

//创建用户提交
const submitCreateUser = async () => {
  try {
    const response = await axios.post('api/users/create', createForm.value)
    users.value.push(response.data)
    createDialogVisible.value = false
    createForm.value = {
      username: '',
      password: ''
    }
  } catch (error) {
    console.error('创建用户失败:', error)
  }
}

const openUpdateDialog = (user:any) => {
  updateForm.value = { ...user }
  updateDialogVisible.value = true
}

// 更新用户
const submitUpdateUser = async () => {
  try {
    const response = await axios.put('/api/users/update', updateForm.value)
    const index = users.value.findIndex((u:any) => u.id === updateForm.value.id)
    if (index !== -1) {
      users.value[index] = response.data
    }
    updateDialogVisible.value = false
  } catch (error) {
    console.error('更新用户失败:', error)
  }
}

const deleteUser = async (id:any) => {
  try {
    await axios.delete(`/api/users/delete?id=${id}`)
    users.value = users.value.filter((u:any) => u.id !== id)
  } catch (error) {
    console.error('删除用户失败:', error)
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