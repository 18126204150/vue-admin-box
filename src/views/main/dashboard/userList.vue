<template>
  <div class="user-list-container">
    <el-card style="height: 100% !important">
      <el-input
        style="width: 180px"
        v-model="searchUsername"
        placeholder="请输入用户名"
        clearable
      ></el-input>
      &nbsp;&nbsp;&nbsp;
      <el-button
        type="primary"
        style="box-shadow: 2px 2px 10px #5984f5"
        @click="handleQuerys"
      >
        搜索
      </el-button>
      <el-button type="danger" @click="resetForm">重置</el-button>
      <el-button type="primary" @click="openCreateDialog">新增</el-button>
      <el-table :data="users" stripe>
        <el-table-column type="index" width="50" />
        <!-- <el-table-column prop="id" label="ID"></el-table-column> -->
        <el-table-column prop="username" label="用户名"></el-table-column>
        <!-- <el-table-column prop="password" label="密码"></el-table-column> -->
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          max-width="260"
          min-width="130"
        >
          <template #default="scope">
            <el-button type="warning" @click="openUpdateDialog(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除选中的数据吗？"
              @confirm="deleteUser(scope.row.id)"
            >
              <template #reference>
                <el-button type="danger"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 40, 50]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          v-model:total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 创建用户对话框 -->
    <el-dialog v-model="createDialogVisible" title="创建用户">
      <template #footer>
        <el-form :model="createForm" ref="createFormRef" label-width="80px">
          <el-form-item label="用户名">
            <el-input
              v-model="createForm.username"
              placeholder="请输入用户名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="createForm.password"
              type="password"
              show-password
              placeholder="英文大小写+特殊符号(@_#?)+数字"
              clearable
              @input="checkPasswordStrength"
            ></el-input>
            <div v-if="passwordStrength" :class="passwordStrengthClass">
              {{ passwordStrengthMessage }}
            </div>
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
            <el-input
              v-model="updateForm.username"
              placeholder="请输入用户名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="updateForm.password"
              type="password"
              show-password
              placeholder="英文大小写+特殊符号(@_#?)+数字"
              @input="checkPasswordStrength"
            ></el-input>
            <div v-if="passwordStrength" :class="passwordStrengthClass">
              {{ passwordStrengthMessage }}
            </div>
          </el-form-item>
        </el-form>
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpdateUser">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { refreshCurrentTab } from "@/utils/tab";
import { color } from "echarts";

const users: any = ref([]);
const createDialogVisible = ref(false);
const updateDialogVisible = ref(false);
const createForm = ref({
  username: "",
  password: "",
});
const updateForm = ref({
  id: null,
  username: "",
  password: "",
});

const searchUsername: any = ref(""); //名字搜索
const createFormRef = ref(null);
const updateFormRef = ref(null);
const currentPage = ref(1); //当前页码
const pageSize = ref(10); //每页显示的数量
const total = ref(); //总数量
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const handleSizeChange = (newSize: number) => {
  // 当每页记录数改变时触发
  pageSize.value = newSize;
  currentPage.value = 1; // 切换每页记录数后，重置页码为1
  fetchUsers(); // 重新获取数据
};
const handleCurrentChange = (newPage: number) => {
  // 当页码改变时触发
  currentPage.value = newPage;
  fetchUsers(); // 重新获取数据
};
// 搜索
const handleQuerys = () => {
  fetchUsers();
};
// 重置
const resetForm = () => {
  searchUsername.value = "";
  fetchUsers();
};
const fetchUsers = async () => {
  try {
    const response: any = await axios.get(
      `/api/users?page=${currentPage.value}&limit=${pageSize.value}&username=${searchUsername.value}`,
      {}
    );

    users.value = response.data.users;
    total.value = response.data.total;
  } catch (error) {
    console.error("获取用户列表失败:", error);
  }
};

// 创建用户
const openCreateDialog = () => {
  createDialogVisible.value = true;
};

//创建密码验证正则表达式
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_#?])[A-Za-z\d@_#?]{8,}$/;
const passwordStrength = ref("");
const passwordStrengthMessage = ref("");
const passwordStrengthClass = ref("");
const checkPasswordStrength = (password: any) => {
  if (passwordRegex.test(password)) {
    passwordStrength.value = "strong";
    passwordStrengthMessage.value = "密码强度：强";
    passwordStrengthClass.value = "password-strong";
  } else if (password.length >= 8) {
    passwordStrength.value = "medium";
    passwordStrengthMessage.value = "密码强度：中";
    passwordStrengthClass.value = "password-medium";
  } else {
    passwordStrength.value = "weak";
    passwordStrengthMessage.value = "密码强度：弱";
    passwordStrengthClass.value = "password-weak";
  }
};

//创建用户提交
const submitCreateUser = async () => {
  if (!passwordRegex.test(createForm.value.password)) {
    ElMessage.error(
      "密码必须包含大小写字母、数字和特殊字符(@_#?)，且长度至少为8位"
    );
    return;
  }
  try {
    const response = await axios.post("api/users/create", createForm.value);
    users.value.push(response.data);
    createDialogVisible.value = false;
    createForm.value = {
      username: "",
      password: "",
    };
  } catch (error) {
    // console.error("创建用户失败:", error);
    ElMessage.error("用户名已存在");
  }
  //   refreshCurrentTab();
};

const openUpdateDialog = (user: any) => {
  updateForm.value = { ...user };
  updateDialogVisible.value = true;
};

// 更新用户
const submitUpdateUser = async () => {
  if (!passwordRegex.test(updateForm.value.password)) {
    ElMessage.error(
      "密码必须包含大小写字母、数字和特殊字符(@_#?)，且长度至少为8位"
    );
    return;
  }
  try {
    const response = await axios.put("/api/users/update", updateForm.value);
    const index = users.value.findIndex(
      (u: any) => u.id === updateForm.value.id
    );
    if (index !== -1) {
      users.value[index] = response.data;
    }
    updateDialogVisible.value = false;
  } catch (error) {
    // console.error("更新用户失败:", error);
    ElMessage.error("用户名已存在");
    // refreshCurrentTab();
  }
};

const deleteUser = async (id: any) => {
  try {
    await axios.delete(`/api/users/delete?id=${id}`);
    users.value = users.value.filter((u: any) => u.id !== id);
  } catch (error) {
    console.error("删除用户失败:", error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-list-container {
  height: 95% !important;
  padding: 20px;
}
.el-upload {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-upload-list__item .el-upload-list__item-info {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pagination-container {
  position: fixed;
  bottom: 40px;
  background-color: white; /* 如果需要，可以设置背景颜色 */
  padding: 10px;
  box-sizing: border-box;
  z-index: 100; /* 如果有其他元素可能覆盖分页组件，可以设置合适的 z-index */
}
/* 设置密码强度颜色 */
.password-strong {
  color: green;
  font-size: 14px;
  margin-top: 5px;
}

.password-medium {
  color: orange;
  font-size: 14px;
  margin-top: 5px;
}

.password-weak {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
/* 当屏幕宽度小于 600px 时 */
@media (max-width: 600px) {
  .pagination-container {
    flex-wrap: wrap; /* 使子元素换行 */
    justify-content: space-around; /* 调整子元素之间的间距 */
  }
}

/* 当屏幕宽度在 601px 到 900px 之间时 */
@media (min-width: 601px) and (max-width: 900px) {
  .pagination-container {
    padding: 15px; /* 增加内边距 */
  }
}

/* 当屏幕宽度大于 900px 时 */
@media (min-width: 901px) {
  .pagination-container {
    padding: 20px; /* 进一步增加内边距 */
    justify-content: space-between; /* 使子元素两端对齐 */
  }
}
</style>
