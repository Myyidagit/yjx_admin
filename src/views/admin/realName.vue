<template>
  <section>
  <!--顶部搜索工具条 start-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.phone" placeholder="搜索条件"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
   <!--顶部搜索工具条 end-->
   <!-- 审核提示框 -->
    <el-dialog title="实名信息" :visible.sync="realnameVisible" size="small"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p>姓名</p>
            <el-input v-model="realnameInfo.names" :readonly="true"></el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p>身份</p>
            <el-input v-model="realnameInfo.role" :readonly="true"></el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p>性别</p>
            <el-input v-model="realnameInfo.sex" :readonly="true"></el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p>出生日期</p>
            <el-input v-model="realnameInfo.birthday" :readonly="true"></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <p>所在学校</p>
            <el-input v-model="realnameInfo.school" :readonly="true" :label-width="formLabelWidth"></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <p>专业</p>
            <el-input v-model="realnameInfo.speciality" :readonly="true" :label-width="formLabelWidth"></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <p>学校地址</p>
            <el-input v-model="realnameInfo.address" :readonly="true" :label-width="formLabelWidth"></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <p>手持身份证正面照片</p>
            <img @click="openBigImg(realnameInfo.id_card_positive)" :src="realnameInfo.id_card_positive" style="width: 100%;height: 200px"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <p>手持身份证反面照片</p>
            <img @click="openBigImg(realnameInfo.id_card_inverse)" :src="realnameInfo.id_card_inverse" style="width: 100%;height: 200px;"/>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <p>教师证/学生证</p>
            <img @click="openBigImg(realnameInfo.role_credentials)" :src="realnameInfo.role_credentials" style="width: 48.5%;height: 200px;"/>
          </div>
        </el-col>
      </el-row>
      <span v-if="this.realnameStatus == 0" slot="footer" class="dialog-footer">
        <el-button type="success" @click="verifyRealname(2)">通过</el-button>
        <el-button type="danger" @click="showVerifyDialog(3)">不通过</el-button>
      </span>
    </el-dialog>

    <!--审核不通过弹出窗-->
    <el-dialog title="审核" :visible.sync="verifyVisible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form>
        <el-form-item label="拒绝原因">
          <el-input type="textarea" v-model="verifier_desc" size="small" placeholder="请填写不通过的原因" :autosize="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="verifyRealname(2)">提交</el-button>
      </span>
    </el-dialog>
   <!-- 审核提示框end -->  
  <!--用户列表  开始-->
     <el-table :data="entryList" stripe highlight-current-row v-loading="listLoading" empty-text="暂无数据" style="width: 100%;">
        <el-table-column label="序号"  width="80" type="index" align="center" header-align="center">
        </el-table-column> 
        <el-table-column label="邮箱" width="100" :show-overflow-tooltip="true" align="center" header-align="center">
            <template scope="scope">
              {{ scope.row.email }}
            </template>
        </el-table-column>
        <el-table-column label="电话" :show-overflow-tooltip="true" align="center" header-align="center">
             <template scope="scope">
               {{ scope.row.phone }}
            </template>
        </el-table-column>
        <el-table-column label="注册时间" :show-overflow-tooltip="true"  align="center" header-align="center">
             <template scope="scope">
               {{ scope.row.registryTime }}
            </template>
        </el-table-column>
        <el-table-column label="注册IP" :show-overflow-tooltip="true"  align="center" header-align="center">
             <template scope="scope">
               {{ scope.row.registryIp }}
            </template>
        </el-table-column>
        <el-table-column label="标识" :show-overflow-tooltip="true"  align="center" header-align="center">
             <template scope="scope">
               {{ scope.row.imeiId }}
            </template>
        </el-table-column>
        <el-table-column label="最后登陆时间" :show-overflow-tooltip="true"  align="center" header-align="center">
             <template scope="scope">
               {{ scope.row.lastTime }}
            </template>
        </el-table-column>
        <el-table-column label="状态" width="150" :show-overflow-tooltip="true"  align="status " header-align="center">
             <template scope="scope">
                <el-button v-if="scope.row.status==1" size="small" type="primary" @click="handleEdit(scope.row.userId)">待审核</el-button>
                <el-button v-if="scope.row.status==2"  size="small" >已审核</el-button>
                <el-button v-if="scope.row.status==3"  size="small" >未通过</el-button>
            </template>
        </el-table-column>
    </el-table>
  <!--用户列表  结束-->

   <!--底部分页工具条 start-->
   <el-col :span="24" class="toolbar">
     <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                     :page-count="total" style="float:right;">
      </el-pagination>
    </el-col>
   <!--底部 分页工具条 end-->
  </section>
</template>

<script>
import { realName,realDetail } from "../../api/api";
export default {
  data() {
    return {
      //搜索条件
      filters: {
        phone: ""
      },
      //分页参数
      total: 0,
      page: 1,
      pageSize: 10,
      formLabelWidth: '120px',//表格的宽度
      //加载动态是否显示
      listLoading: false,
      //实名信息状态
      realnameStatus: 0,
      //审核弹窗窗显示状态
      verifyVisible: false,
      entryList: [],
      //点击待审核弹出框
      realnameVisible: false,
      verifier_desc: '',
      realnameInfo:{}//实名认证信息
    };
  },
  methods: {
    //上一页/下一页
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    getData() {
      var params = new URLSearchParams();
      params.append("page", this.page);
      params.append("rows", this.pageSize);
      realName(params).then(res => {
        console.log(res.data);
        this.entryList = res.data.list;
        this.total = res.data.totalCount;
      });
    },
    handleEdit(user_id) {
      console.log(user_id);
      this.realnameVisible = !this.realnameVisible
    },
    //点击不通过弹出框
    showVerifyDialog () {
        this.verifyVisible = true
    },
    //查询实名信息详细资料
      queryRealname (user_id) {
        var params = new URLSearchParams()
        params.append('user_id', user_id)
        queryRealnameInfo(params).then((res) =>{
          console.log(res)
          this.realnameInfo = res.data
        })
      },
  },
  mounted() {
    //   this.getFeedbackList()
  },
  created() {
    this.getData();
  }
};
</script>


<style scoped>

</style>
