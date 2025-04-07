<template>
  <div class="box">
    <!-- <Card /> -->
    <!-- <Charts /> -->
    <div class="content">
      <h1 class="title">系统需求</h1>
      <div class="requirements">
        <div class="requirement-item">
          <span class="number">1</span>
          <span class="text">开发一套静态页面网站，提供产品版本查阅下载功能，支持产品手册、操作视频浏览和下载功能；</span>
        </div>
        <div class="requirement-item">
          <span class="number">2</span>
          <span class="text">需要支持后台运维，上传和编辑功能；</span>
        </div>
        <div class="requirement-item">
          <span class="number">3</span>
          <span class="text">支持用户管理，可以使用用户名及密码登录，支持密码修改及重置功能。</span>
        </div>
        <div class="requirement-item">
          <span class="number">4</span>
          <span class="text">展示页面需要适应多种屏幕显示尺寸，电脑浏览器，手机访问，折叠屏访问。</span>
        </div>
        <div class="requirement-item">
          <span class="number">5</span>
          <span class="text">支持二维码访问具体客户页面。</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from './components/card/index.vue'
import Charts from './components/charts/index.vue'

export default defineComponent({
  components: {
    Card,
    Charts,
  },
  mounted() {
    console.log('Dashboard 页面加载成功'); // 添加日志
  },
})
</script>

<style lang="scss" scoped>
.box {
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  max-width: 800px;
  width: 100%;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.requirements {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.requirement-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
  }
}

.number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border-radius: 50%;
  flex-shrink: 0;
}

.text {
  font-size: 16px;
  color: #555;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 20px;
  }

  .title {
    font-size: 20px;
  }

  .requirement-item {
    padding: 10px;
  }

  .number {
    width: 20px;
    height: 20px;
    font-size: 14px;
  }

  .text {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 15px;
  }

  .title {
    font-size: 18px;
  }

  .requirement-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .number {
    margin-bottom: 10px;
  }
}
</style>