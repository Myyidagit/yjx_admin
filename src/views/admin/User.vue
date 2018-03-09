<template>
  <section>
    <!-- 操作按钮工具栏 -->
    <el-col :span="24" class="toolbar operation-toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="add_form_visible = true">新增</el-button>
      <el-button type="primary" icon="el-icon-download">导出Excel</el-button>
      <el-button type="primary" icon="fa fa-filter" @click="filter_toolbar = !filter_toolbar"> 筛选</el-button>
    </el-col>

    <!-- 筛选添加工具栏 -->
    <el-col v-show="filter_toolbar" :span="24" class="toolbar filter-toolbar">
      <el-form :inline="true">
        <el-form-item label="姓名">
          <el-input placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 表格数据 -->
    <el-table :data="users" stripe border highlight-current-row style="width: 100%" empty-text="暂无数据">
      <el-table-column type="selection" width="50" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="account" label="账户" width="140" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column fixed prop="userName" label="姓名" width="100" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column fixed prop="phone" label="手机号" width="140" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column fixed prop="email" label="邮箱" width="200" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column fixed prop="createTime" label="创建时间" width="110" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column fixed prop="status" label="状态" width="80" align="center" header-align="center" sortable>
        <template scope="scope">
          <el-tag v-if="scope.row.status == 1" type="primary">待使用</el-tag>
          <el-tag v-if="scope.row.status == 2" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status == 3" type="danger">冻结</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed prop="loginTime" label="登录时间" width="110" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column fixed prop="loginIp" label="登录IP" width="110" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column fixed prop="lastLoginTime" label="上一次登录时间" width="150" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column fixed prop="lastLoginIp" label="上一次登录IP" width="130" align="center" header-align="center"
                       sortable></el-table-column>
      <el-table-column fixed label="操作" align="center" header-align="center">
        <template slot-scope="scope" scope="scope">
          <el-button v-if="scope.row.status == 2" type="danger" icon="fa fa-lock fa-fw"> 冻结</el-button>
          <el-button v-if="scope.row.status == 3" type="danger" icon="fa fa-unlock fa-fw"> 恢复</el-button>
          <el-button type="primary" icon="el-icon-edit-outline"> 编辑</el-button>
          <el-button type="danger" icon="fa fa-key fa-fw"> 设置密码</el-button>
          <el-button type="danger" icon="fa fa-shield fa-fw"> 授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具栏 -->
    <el-col :span="24" class="toolbar" style="background-color: #fff;padding-right: 20px">
      <el-pagination
        :page-size="page_size"
        :total="page_total"
        :page-sizes="page_sizes"
        layout="total, sizes, prev, pager, next, jumper" style="float:right;">
      </el-pagination>
    </el-col>

    <!-- 新增窗口 -->
    <el-dialog title="新增用户" :visible.sync="add_form_visible" width="30%"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="80px" class="demo-ruleForm">
        <el-form-item label="姓名">
          <el-input placeholder="请输入用户姓名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input placeholder="请输入用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input placeholder="请输入用户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="登录账户">
          <el-input placeholder="26个英文字母组成"></el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input placeholder="字母与数字组成的6-16位字符串"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_form_visible = false">取 消</el-button>
        <el-button type="primary" @click="add_form_visible = false">保 存</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'AdminUser',
    data () {
      return {
        filter_toolbar: false, // 筛选条件工具栏是否显示 false-不显示；true-显示
        page_total: 100,  // table数据的总条数
        page_size: 20,  // 每页显示多少条
        page_sizes: [10, 20, 30, 40, 50, 100], // 自定义每页显示多少条
        add_form_visible: false, // 添加管理员窗口是否显示 false-不显示；true-显示
        users: [
          {
            adminId: 123,
            account: 'admin',
            userName: '武尊',
            phone: '18090817621',
            email: '2508813327@qq.com',
            createTime: '2017-10-21',
            status: 2,
            loginTime: '2017-10-21',
            loginIp: '192.168.0.55',
            lastLoginTime: '2017-10-21',
            lastLoginIp: '192.168.0.55'
          },
          {
            adminId: 123,
            account: 'admin',
            userName: '武尊',
            phone: '18090817621',
            email: '2508813327@qq.com',
            createTime: '2017-10-21',
            status: 3,
            loginTime: '2017-10-21',
            loginIp: '192.168.0.55',
            lastLoginTime: '2017-10-21',
            lastLoginIp: '192.168.0.55'
          }
        ]
      }
    }
  }
</script>

<style lang="scss">
  @import "../../assets/css/base.css";
</style>
