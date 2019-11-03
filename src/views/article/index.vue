<template>
  <div class="container-artical">
    <el-card>
      <div slot="header">
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>-->
        <my-bread>内容管理</my-bread>
      </div>
      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <!-- 根据接口文档，status值不传时是全部 -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <!-- <el-select v-model="reqParams.channel_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select> -->
          <!-- v-model本质：绑定value属性 绑定了input事件 -->
            <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期：">
          <!-- v-model 绑定的数组  [起始时间,结束时间] -->
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>根据筛选条件共查询到 {{total}} 条结果</span>
      </div>
      <template>
        <el-table style="width: 100%" :data="articles">
          <el-table-column label="封面">
            <template slot-scope="scope">
              <!-- 第一张封面图 -->
              <el-image
                :src="scope.row.cover.images[0]"
                fit="fill"
                style="width:150px;height:100px"
              >
                <div slot="error">
                  <img src="../../assets/error.gif" width="150" height="100" />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status===0">草稿</el-tag>
              <el-tag v-if="scope.row.status===1">待审核</el-tag>
              <el-tag type="success" v-if="scope.row.status===2">审核通过</el-tag>
              <el-tag type="warning" v-if="scope.row.status===3">审核失败</el-tag>
              <el-tag type="danger" v-if="scope.row.status===4">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" prop="pubdate"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary" icon="el-icon-edit" plain circle @click="toEdit(scope.row.id)"></el-button>
                <el-button type="danger" icon="el-icon-delete" plain circle @click="toDelete(scope.row.id)"></el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- current-page 动态激活当前的页码对应的按钮 -->
      <!-- current-change 事件：当页码改变（点击页码按钮，上一页，下一页）就执行  参数当前改变后的页码-->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        :total="total"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 筛选参数
      // 使用axios提交数据时候  如果数据的值为null是不会提交该字段
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        // 当前页数
        page: 1,
        // 每页显示的文章条数
        per_page: 10
      },
      // 频道选项数据
      channelOptions: [
        // { value: 1, label: 'java' },
        // { value: 2, label: '前端' }
      ],
      // 日期数组
      dateArr: [],
      // 文章列表
      articles: [],
      // 文章总条数
      total: 0
    }
  },
  // 在组件初始化时
  created () {
    // this.getChannelOptions()
    this.getArticles()
  },
  methods: {
    // 获取频道选项数据
    // async getChannelOptions () {
    //   const {
    //     data: { data }
    //   } = await this.$http.get('channels')
    //   // console.log(data.channels)
    //   // 赋值频道下拉选项依赖数据
    //   this.channelOptions = data.channels
    // },
    // 获取文章列表信息
    async getArticles () {
      // 第一种： axios.get(url?key=value&key1=vaule1&...) get传参
      // 第二种： axios.get(url, {params:参数对象})
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      // 赋值文章列表依赖数据
      this.articles = data.results
      // 赋值文章总条数依赖数据
      this.total = data.total_count
    },
    // 分页功能
    pager (newPage) {
      // 根据新的页码和当前的筛选条件 重新查询数据即可
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 筛选
    search () {
      this.reqParams.page = 1
      this.getArticles()
      // 如果频道的值 '' 时候 修改为 null
      // if (this.reqParams.channel_id === '') this.reqParams.channel_id = null
    },
    // 选择日期触发的事件
    changeDate (dateArr) {
      // dateArr 的数据格式：[date,date] 后端需要的是字符串格式   dateArr 的数据格式：[string,string]
      if (dateArr) {
        // console.log(dateArr)
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        //  注意：清除选择的日期后  dateArr的值 null
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 编辑
    toEdit (id) {
      // this.$router.push('/publish?id='+id)
      this.$router.push({ path: '/publish', query: { id } })
    },
    // 删除
    async toDelete (id) {
      // 请求
      await this.$http.delete(`articles/${id}`)
      // 提示
      this.$message.success('删除文章成功')
      // 更新列表
      this.getArticles()
    }
  }
}
</script>

<style scoped lang='less'></style>
