<template>
  <el-container>
    <el-aside width="400px" style="margin-right: 20px">
      <el-card class="box-card">
        <div slot="header">
          <span>部门结构</span>
          <!--<el-button style="float: right; padding: 3px 0" type="text">添加部门</el-button>-->
        </div>
        <div>
          <el-tree :data="division_list" :props="defaultProps" show-checkbox default-expand-all :expand-on-click-node="false" node-key="id" @node-click="clickTree" :render-content="renderContent"></el-tree>
        </div>
        <div class="bottom">
          <el-button type="text" class="button">添加部门</el-button>
        </div>
      </el-card>
    </el-aside>
    <el-main>
      <el-card class="box-card">
        <div slot="header">
          <span>部门信息</span>
          <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
        </div>
        <div>1</div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
  let id = 1000
  export default {
    name: 'Division',
    data () {
      return {
        division_list: [
          {
            id: 1,
            label: '艺教星',
            children: [{
              id: 4,
              label: '技术部',
              children: [{
                id: 9,
                label: 'H5'
              }, {
                id: 10,
                label: 'Android'
              }]
            }]
          },
          {
            id: 1,
            label: '双创平台',
            children: [{
              id: 4,
              label: '市场部'
            }]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      // 渲染按钮
      renderContent (h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.append(data) }>Append</el-button>
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
            </span>
          </span>
        )
      },
      // 节点点击事件
      clickTree (data) {
        console.log(data.id)
      },
      append (data) {
        const newChild = { id: id++, label: 'testtest', children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      },
      remove (node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      }
    }
  }
</script>

<style lang="scss">
  @import "../../assets/css/base.css";

  .el-card__header {
    background-color: #D8DCE5;
  }
  .el-card__body {
    padding: 20px 20px 0px 20px;
  }
  .bottom {
    padding-left: 300px;
  }
</style>
