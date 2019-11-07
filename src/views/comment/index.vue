<template>
  <div class="container-comment">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data="comments">
        <el-table-column label="标题" width="350px" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.comment_status" type="danger" @click="toggleStatus(scope.row.id,false)" size="small">关闭评论</el-button>
            <el-button v-else type="success" size="small" @click="toggleStatus(scope.row.id,true)">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 评论列表
      comments: [],
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 10
      },
      total: 0
    }
  },
  created () {
    this.getComments()
  },
  methods: {
    async getComments () {
      // 注意：文章列表但是需要包含  评论相关信息
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      // 渲染
      this.comments = data.results
      // 总条数
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getComments()
    },
    // 切换 打开 与 关闭（需传入参数id 、待切换的状态：status）//使用ElementUI-弹框-确认信息组件
    toggleStatus (id, status) {
      const text = status ? '您确认要打开评论吗?' : '您确认关闭评论吗?如果关闭用户将无法对该文章进行评论。'
      this.$confirm(text, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确认时候
        const { data: { data } } = await this.$http.put(`comments/status?article_id=${id}`, {
          allow_comment: status
        })
        // 提示
        this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
        // 更新当前列表
        this.getComments()
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang='less'>
</style>
