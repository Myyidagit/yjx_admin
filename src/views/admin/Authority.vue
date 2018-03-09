<template>
  <section>
    <!-- 操作按钮工具栏 -->
    <el-col :span="24" class="toolbar operation-toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="showForm()">新增</el-button>
      <el-button type="primary" icon="fa fa-filter" @click="filter_toolbar = !filter_toolbar"> 筛选</el-button>
    </el-col>

    <!-- 筛选添加工具栏 -->
    <el-col v-show="filter_toolbar" :span="24" class="toolbar filter-toolbar">
      <el-form :inline="true">
        <el-form-item label="权限名称">
          <el-input placeholder="权限名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 表格数据 -->
    <el-table :data="authority" stripe border highlight-current-row style="width: 100%" empty-text="暂无数据">
      <el-table-column fixed type="selection" width="50" align="center" header-align="center"></el-table-column>
      <el-table-column prop="name" width="140" label="权限名称" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column prop="icon" width="140" label="权限图标" align="center" header-align="center" sortable>
        <template scope="scope">
          <i v-if="scope.row.icon != null && scope.row.icon != undefined && scope.row.icon != ''"
             :class="scope.row.icon"></i>
          <span v-else>无图标</span>
        </template>
      </el-table-column>
      <el-table-column prop="link" width="140" label="权限链接" align="center" header-align="center" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="levelsName" width="255" label="层级" align="center" header-align="center" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="isMenu" width="140" label="类型" align="center" header-align="center" sortable>
        <template scope="scope">
          <el-tag v-if="scope.row.levels == 1">目录</el-tag>
          <el-tag v-if="scope.row.levels == 2" type="success">菜单</el-tag>
          <el-tag v-if="scope.row.levels == 3" type="warning">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" width="140" label="排序" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column prop="createTime" width="140" label="创建时间" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column prop="status" width="140" label="状态" align="center" header-align="center" sortable>
        <template scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status == 2" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" width="200" label="备注" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template scope="scope">
          <el-button v-if="scope.row.status == 1" @click="updateStatus(2, scope.row)" type="danger" size="small"
                     icon="fa fa-lock fa-fw">停用
          </el-button>
          <el-button v-if="scope.row.status == 2" @click="updateStatus(1, scope.row)" type="warning" size="small"
                     icon="fa fa-unlock fa-fw">启用
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="showForm(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具栏 -->
    <el-col :span="24" class="toolbar" style="background-color: #fff;padding-right: 20px">
      <el-pagination
        :page-size="page_size"
        :total="page_total"
        :page-sizes="page_sizes"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" style="float:right;">
      </el-pagination>
    </el-col>

    <!-- 新增/修改窗口 -->
    <el-dialog :title="form_title" width="30%" :visible.sync="show_form" @close="resetForm()"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form" label-width="80px" class="demo-ruleForm" :rules="rules" ref="verify">
        <el-form-item label="名称" prop="name" required>
          <el-input placeholder="请输入权限名称" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input placeholder="请输入图标" v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="目录" prop="isMenu">
          <el-radio-group v-model="form.isMenu">
            <el-radio label=1>是</el-radio>
            <el-radio label=2>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="层级" prop="levels" required>
          <el-radio-group v-model="form.levels" @change="clickLevels">
            <el-radio label=1>一级</el-radio>
            <el-radio label=2>二级</el-radio>
            <el-radio label=3>三级</el-radio>
            <el-radio label=4>四级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="链接" v-if="form.levels != 0 && form.levels != 1">
          <el-input placeholder="请输入链接地址" v-model="form.link"></el-input>
        </el-form-item>
        <el-form-item label="父元素" v-if="form.levels != 0 && form.levels != 1">
          <el-cascader :options="optionsWithDisabled" v-model="form.parentId"
                       :props="{value: 'authorityId',label: 'name',children: 'childTreeNodes' }"></el-cascader>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" label="序号"></el-input-number>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入描述" v-model="form.description">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideForm()">取 消</el-button>
        <el-button type="primary" @click.native="submitForms()">保 存</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import {
    upateAuthorityStatus,
    addAuthority,
    getAuthorityList,
    getAuthorityTree
  } from '../../api/api'

  export default {
    name: 'AdminUser',
    data () {
      return {
        filter_toolbar: false, // 筛选条件工具栏是否显示 false-不显示；true-显示
        page_total: 100,  // table数据的总条数
        currentPage: 1, // 当前页码
        page_size: 20,  // 每页显示多少条
        page_sizes: [10, 20, 30, 40, 50, 100], // 自定义每页显示多少条
        form_title: '', // form表单窗口标题
        show_form: false, // 显示form表单窗口 false-不显示；true-显示
        form: { // 添加权限的表单
          authorityId: 0,
          name: '',
          icon: '',
          link: '',
          levels: 0,
          isMenu: 0,
          parentId: [],
          sort: 1,
          description: ''
        },
        authority: [ // 表格数据
        ],
        optionsWithDisabled: [ // 父权限选择数据
        ],
        rules: {  // 校验表单参数
          name: [
            {required: true, message: '请输入权限名称', trigger: 'blur'}
          ],
          levels: [
            {required: true, message: '请选择层级', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 显示form表单
      showForm (data) {
        if (data !== null && data !== undefined) { // 修改
          let parentNode = data.row.parentNode
          this.form_title = '修改权限'
          this.show_form = true
          this.form.authorityId = data.row.authorityId
          this.form.name = data.row.name
          this.form.icon = data.row.icon
          this.form.link = data.row.link
          this.form.levels = data.row.levels + ''
          this.form.isMenu = data.row.isMenu + ''
          this.form.parentId = parentNode.splice(parentNode - 1, 1)
          this.form.sort = data.row.sort
          this.form.description = data.row.description
          this.clickLevels()
        } else { // 新增
          this.form_title = '新增权限'
          this.show_form = true
        }
      },
      // 隐藏form表单
      hideForm () {
        this.show_form = false
        this.resetForm()
      },
      // 提交添加权限表单
      submitForms () {
        this.$refs.verify.validate((valid) => {
          if (valid) { // 通过验证，提交表单
            var params = new URLSearchParams()
            params.append('authorityId', this.form.authorityId)
            params.append('name', this.form.name)
            params.append('icon', this.form.icon)
            params.append('link', this.form.link)
            params.append('levels', this.form.levels)
            params.append('isMenu', this.form.isMenu)
            params.append('sort', this.form.sort)
            params.append('description', this.form.description)
            if (this.form.parentId.length > 0) {
              let parentId = this.form.parentId[this.form.parentId.length - 1]
              params.append('parentId', parentId)
            }
            addAuthority(params).then(data => {
              if (data.status) {
                // 关闭添加窗口
                this.hideForm()
                // 更新数据
                this.getAuthorityList()
              } else {
                this.open_error(data.msg)
              }
            })
          } else { // 未通过验证，不提交表单
            return false
          }
        })
      },
      // 修改权限状态
      updateStatus (status, row) {
        var params = new URLSearchParams()
        params.append('authorityId', row.authorityId)
        params.append('status', status)
        upateAuthorityStatus(params).then(data => {
          if (data.status) {
            this.open_success(data.msg)
            row.status = status
          } else {
            this.open_error(data.msg)
          }
        })
      },
      // 重置添加form表单
      resetForm () {
        this.form.authorityId = 0
        this.form.name = ''
        this.form.icon = ''
        this.form.link = ''
        this.form.levels = 0
        this.form.isMenu = 0
        this.form.parentId = []
        this.form.sort = 1
        this.form.description = ''
      },
      // 选择层级事件
      clickLevels () {
        // 如果层级为2、3、4级，则调用API接口获取父级目录
        let levels = this.form.levels
        if (levels === '2' || levels === '3' || levels === '4') {
          var params = new URLSearchParams()
          params.append('levels', levels)
          getAuthorityTree(params).then(data => {
            this.optionsWithDisabled = data.data
          })
        }
      },
      // 分页获取目录列表
      getAuthorityList () {
        var params = new URLSearchParams()
        params.append('page', this.currentPage)
        params.append('rows', this.page_size)
        getAuthorityList(params).then(data => {
          this.page_total = data.data.totalCount
          this.authority = data.data.list
        })
      },
      // 翻页操作 上一页/下一页
      handleCurrentChange (val) {
        this.currentPage = val
        this.getAuthorityList()
      },
      // 错误提示
      open_error (message) {
        this.$notify.error({
          title: '错误提示',
          message: message,
          duration: 2000
        })
      },
      // 成功提示
      open_success (message) {
        this.$notify.success({
          title: '操作成功',
          message: message,
          duration: 2000
        })
      }
    },
    mounted () {
      this.getAuthorityList()
    }
  }
</script>

<style lang="scss">
  @import "../../assets/css/base.css";
</style>
