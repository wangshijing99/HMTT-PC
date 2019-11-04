<template>
  <div class="container-images">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div>
        <el-radio-group v-model="reqParams.collect" size="small" @change="toggleList">
          <!-- 按钮单选框 label就是值 加上“:”绑定的就是布尔值 -->
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button type="success" style="float:right" size="small" @click="open">添加素材</el-button>
      </div>
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" />
          <div class="footer" v-if="!reqParams.collect">
            <span
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
              @click="toggleStatus(item)"
            ></span>
            <span class="el-icon-delete" @click="deleteImage(item.id)"></span>
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
      </div>
    </el-card>
    <!-- 上传组件 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <!-- action上传图片的接口地址，需完整书写（简写地址是axios提供的） -->
      <!-- name 上传文件的字段名 -->
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :show-file-list="false"
        :headers="headers"
        :on-success="handleSuccess"
        name="image"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      reqParams: {
        // false 全部  true 收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      total: 0,
      // 对话框显示隐藏
      dialogVisible: false,
      // 上传成功后的图片地址
      imageUrl: null,
      // 上传的头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 打开对话框的时候，重置上传组件预览图为null
    open () {
      this.dialogVisible = true
      this.imageUrl = null
    },
    // 上传图片成功
    handleSuccess (res) {
      // res 就是响应主体  获取图片地址 res.data.url  给 imageUrl 赋值进行预览
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // 关闭对话框  更新列表
        this.dialogVisible = false
        this.getImages()
      }, 2000)
    },
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('/user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    // 分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换列表
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 添加收藏与取消收藏
    async toggleStatus (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 成功后  修改样式
      item.is_collected = data.collect
      // 提示
      this.$message.success((data.collect ? '添加收藏' : '取消收藏') + '成功')
    },
    // 删除素材
    deleteImage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击了确认
          await this.$http.delete(`user/images/${id}`)
          // 删除成功
          this.$message.success('删除成功')
          // 更新列表
          this.getImages()
        })
        .catch(() => {
          // 点击了取消 不做任何操作
        })
    }
  }
}
</script>

<style scoped lang='less'>
.img_list {
  padding-top: 20px;
  .img_item {
    width: 160px;
    height: 160px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 35px;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      width: 100%;
      text-align: center;
      color: #fff;
      span {
        width: 50%;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
