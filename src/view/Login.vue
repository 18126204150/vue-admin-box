<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h3>用户登录</h3>
      </template>
      <el-form :model="loginForm" ref="formRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    const formRef = ref(null);
    const loginForm = ref({
      username: "admin",
      password: "123456",
    });
    const router = useRouter();
    console.log("路由实例:", router); // 打印路由实例
    const handleLogin = async () => {
      try {
        const response = await axios.post("/api/login", {
          username: loginForm.value.username,
          password: loginForm.value.password,
        });
        if (response.data.success) {
          localStorage.setItem("user_id", response.data.user_id);
          router
            .push("/UserList")
            .then(() => {
             
            })
            .catch((err) => {
              console.error("跳转失败:", err);
            });
            ElMessage.success({
                message: '登录成功',
                type: 'success',
                duration: 1000

              })
        } else {
          // alert(response.data.message);
          ElMessage.info({
                message: response.data.message,
                type: 'success',
                duration: 1000

              })
        }
      } catch (error) {
        console.error("登录失败:", error);
        alert("登录失败，请稍后重试");
      }
    };
    return {
      loginForm,
      formRef,
      router,
      handleLogin,
    };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 100%;
}
</style>
