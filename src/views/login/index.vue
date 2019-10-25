// 创建组件
<template>
  <div class="container">
    <el-card class="box-card">
      <img src="../../assets/logo_index.png" width="200px" alt />
      <!-- 表单容器  ref="form" 操作dom|组件
      :model="form" 绑定表单数据对象
      label-width="80px" 表单输入框前的文字的宽度-->
      <el-form ref="form" :model="loginForm">
        <!-- 表单选项-->
        <el-form-item>
          <!-- 表单元素 -->
          <el-input placeholder="请输入手机号码" v-model="loginForm.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 表单元素 -->
          <el-input placeholder="请输入验证码" style="width:235px;margin-right:10px" v-model="loginForm.code"></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%">立即登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单数据初始化
      loginForm: {
        mobile: '',
        code: ''
      }
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  //组合写法 background:    / 背景尺寸(width,height) 简写 cover 铺面整个容器多余看不见  contain 等比例缩放完整的显示在容器内容
  background: url("./../../assets/login_bg.jpg") no-repeat center/cover;
  //饿了么组件 el-card 组件名称  解析成HTML  后组件根元素上默认生成一个类和组件的名称一致
  .el-card {
    width: 400px;
    height: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    //图片居中
    img {
      display: block;
      margin: 0 auto 30px;
    }
  }
}
</style>
