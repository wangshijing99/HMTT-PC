<template>
<!-- 图片上传组件的封装 -->
  <div class="my-image">
    <!-- 按钮 -->
    <div class="btn_box" @click="open">
      <img :src="value||btnImage" alt />
    </div>
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <el-radio-group v-model="reqParams.collect" size="small" @change="toggleList">
            <!-- 按钮单选框 label就是值 加上“:”绑定的就是布尔值 -->
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 列表 -->
          <div class="img_list">
            <!-- 为选中的图片添加类样式 -->
            <div
              class="img_item"
              @click="selectedImage(item.url)"
              :class="{selected:selectedImageUrl === item.url}"
              v-for="item in images"
              :key="item.id"
            >
              <img :src="item.url" />
            </div>
          </div>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="pager"
            style="text-align:center"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleSuccess"
            name="image"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmImage" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
import defaultImage from '../assets/default.png'
export default {
  // 封面图片地址
  props: ['value'],
  data () {
    return {
      // 对话框显示隐藏
      dialogVisible: false,
      // 当前激活的选项卡name的值
      activeName: 'image',
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      total: 0,
      // 记录选中的图片地址
      selectedImageUrl: null,
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 上传的图片地址
      uploadImageUrl: null,
      // 按钮图片
      btnImage: defaultImage
    }
  },
  methods: {
    // 打开对话框
    open () {
      this.dialogVisible = true
      this.getImages()
    },
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 当选中该图片时，将该图片的url记录一下，作为唯一标识，将来使用它预览封面图
    selectedImage (url) {
      this.selectedImageUrl = url
    },
    // 上传图片成功
    handleSuccess (res) {
      // res 就是响应主体  获取图片地址 res.data.url  给 imageUrl 赋值进行预览
      this.uploadImageUrl = res.data.url
      this.$message.success('上传成功')
    },
    // 确认图片
    confirmImage () {
      if (this.activeName === 'image') {
        // 表示选择的是素材库
        if (!this.selectedImageUrl) {
          return this.$message.warning('请选择一张图片')
        }
        // 素材库选中图片预览
        // this.btnImage = this.selectedImageUrl
        // 提交父组件
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else {
        // 选中的是上传图片
        if (!this.uploadImageUrl) {
          return this.$message.warning('请上传一张图片')
        }
        // 图片预览
        // this.btnImage = this.uploadImageUrl
        this.$emit('input', this.uploadImageUrl)
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style scoped lang='less'>
.my-image {
  display: inline-block;
  margin-right: 20px;
}
.btn_box {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  text-align: center;
  width: 100%;
  display: block;
}
.img_list {
  padding-top: 18px;
  .img_item {
    width: 120px;
    height: 100px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 10px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    &.selected::after {
      content: "";
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat
        center / 50px 50px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
