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
      <el-table :data="users" stripe style="width: 100%;">
        <el-table-column type="index" width="50" />
        <!-- <el-table-column prop="id" label="ID"></el-table-column> -->
        <el-table-column prop="name" label="软件名称" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="200"></el-table-column>
        <el-table-column prop="video_file" label="地址" align="center"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" align="center" width="200"></el-table-column>
        <el-table-column prop="updatetime" label="更新时间" align="center" width="200"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" max-width="260" min-width="130">
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
      :page-sizes="[10, 20, 30, 40,50]"
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
    <el-dialog v-model="createDialogVisible" title="新增">
      <template #footer>
        <el-form :model="createForm" ref="createFormRef" label-width="80px">
          <el-upload
            class="upload-demo"
            action="#"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            :accept="'.apk'"
            :file-list="fileList1"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
          <el-form-item label="名称">
            <el-input v-model="createForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="createForm.remark" clearable></el-input>
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
          <el-upload
            class="upload-demo"
            action="#"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            :accept="'.apk'"
            :file-list="fileList1"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
          <el-form-item label="名称">
            <el-input v-model="updateForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="updateForm.remark" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpdateUser">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { refreshCurrentTab } from "@/utils/tab";

export default defineComponent({
  setup() {
    const users: any = ref([]);
    let fileList1 = ref<any[]>([]);
    const createDialogVisible = ref(false);
    const updateDialogVisible = ref(false);
    const createForm = ref({
      name: "",
      remark: "",
      src: "apk",
      video_file: "",
    });
    const updateForm = ref({
      id: "",
      name: "",
      remark: "",
      video_file: "",
    });
    const createFormRef = ref(null);
    const updateFormRef = ref(null);

    const currentPage = ref(1)  //当前页码
const pageSize = ref(10)//每页显示的数量
const total=ref()//总数量
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const handleSizeChange = (newSize: number) => {
 // 当每页记录数改变时触发
 pageSize.value = newSize;
      currentPage.value = 1; // 切换每页记录数后，重置页码为1
      fetchUsers(); // 重新获取数据
}
const handleCurrentChange = (newPage: number) => {
  // 当页码改变时触发
  currentPage.value = newPage;
      fetchUsers(); // 重新获取数据
}
const searchUsername:any = ref('');  //名字搜索
// 搜索
const handleQuerys = () => {
  fetchUsers();
};
// 重置
const resetForm=()=>{
    searchUsername.value="";
    fetchUsers();
}
    const fetchUsers = async () => {
      try {
        const response: any = await axios.get(`/api/softwares?page=${currentPage.value}&limit=${pageSize.value}&name=${searchUsername.value}`, {
    });
        
        users.value = response.data.softwares;
        total.value=response.data.total
      } catch (error) {
        console.error("获取软件列表失败:", error);
      }
    };
    const handleFileChange = (file: any, fileLists: any) => {
      if (updateDialogVisible.value) {
        updateForm.value.video_file = file.raw; // 将文件保存到更新表单数据中
        updateForm.value.name = fileLists[0].name.replace(/\.[^.]*$/, ""); //版本号自动填入附件名称
        return file;
      } else {
        createForm.value.video_file = file.raw; // 将文件保存到创建表单数据中
        createForm.value.name = fileLists[0].name.replace(/\.[^.]*$/, ""); //版本号自动填入附件名称
        return file;
      }
    };

    // 创建
    const openCreateDialog = () => {
      createDialogVisible.value = true;
    };

    //创建提交
    const submitCreateUser = async () => {
      try {
        // 创建 FormData 对象
        const formData = new FormData();
        formData.append("name", createForm.value.name);
        formData.append("remark", createForm.value.remark);
        formData.append("src", createForm.value.src);
        if (createForm.value.video_file) {
          formData.append("video_file", createForm.value.video_file);
        }

        // 发送 POST 请求
        const response = await axios.post("/api/softwares/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // 设置请求头
          },
        });

        // 处理响应
        if (response.data) {
          users.value.push(response.data); // 将新视频添加到列表中
          ElMessage.success("视频创建成功");
          createDialogVisible.value = false; // 关闭对话框
          createForm.value = {
            name: "",
            remark: "",
            src: "",
            video_file: "",
          }; // 重置表单
        }
      } catch (error) {
        console.error("创建失败:", error);
        ElMessage.error("视频创建失败");
      }
      refreshCurrentTab();
    };

    const openUpdateDialog = (user: any) => {
      updateForm.value = { ...user };
      updateDialogVisible.value = true;
    };

    // 更新用户
    const submitUpdateUser = async () => {
      try {
        // 创建 FormData 对象
        const formData = new FormData();
        formData.append("id", updateForm.value.id);
        formData.append("name", updateForm.value.name);
        formData.append("remark", updateForm.value.remark);
        if (updateForm.value.video_file) {
          formData.append("video_file", updateForm.value.video_file);
        }

        // 发送 PUT 请求
        const response = await axios.put("/api/softwares/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // 设置请求头
          },
        });

        // 处理响应
        if (response.data) {
          const index = users.value.findIndex(
            (u: any) => u.id === updateForm.value.id
          );
          if (index !== -1) {
            users.value[index] = response.data; // 更新列表中的数据
          }
          ElMessage.success("视频更新成功");
          updateDialogVisible.value = false; // 关闭对话框
          updateForm.value = {
            id: "",
            name: "",
            remark: "",
            video_file: "",
          }; // 重置表单
        }
      } catch (error) {
        console.error("更新失败:", error);
        ElMessage.error("视频更新失败");
      }
      refreshCurrentTab();
    };
    const deleteUser = async (id: any) => {
      try {
        await axios.delete(`/api/softwares/delete?id=${id}`);
        users.value = users.value.filter((u: any) => u.id !== id);
      } catch (error) {
        console.error("删除失败:", error);
      }
    };

    onMounted(() => {
      fetchUsers();
    });
    return {
      users,
      fileList1,
      createDialogVisible,
      updateDialogVisible,
      createForm,
      updateForm,
      createFormRef,
      updateFormRef,
      currentPage,
      pageSize,      
      total,
      small,
      background,
      disabled,
      searchUsername,
      handleQuerys,
      resetForm,
      handleSizeChange,
      handleCurrentChange,
      handleFileChange,
      openCreateDialog,
      submitCreateUser,
      openUpdateDialog,
      submitUpdateUser,
      deleteUser,
    };
  },
  methods: {
    beforeUpload(file: any) {
      const isVideo =
        file.type === "video/mp4" ||
        file.type === "video/ogg" ||
        file.type === "video/webm";
      if (!isVideo) {
        ElMessage.error({
          message: "只能上传视频文件",
          type: "success",
        });
      }
      return isVideo;
    },
    handleSuccess(response: any, file: any) {
      ElMessage.success({
        message: "上传成功",
        type: "success",
      });
      console.log("File uploaded successfully:", response);
    },
    handleExceed(files: any, fileList: any) {
      ElMessage.warning({
        message: "超出上传数量限制",
        type: "success",
      });
    },
  },
});
</script>

<style scoped>
.user-list-container {
  height: 95% !important;
  padding: 20px;
}
</style>
<style>
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
</style>
