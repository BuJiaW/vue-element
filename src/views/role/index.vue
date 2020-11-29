<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline" :model="search">
      <el-form-item label="角色名称:" size="mini">
        <el-input v-model="search.title"></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="primary" @click="find" icon="el-icon-search">查询</el-button>
        <el-button @click="search={}">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="open">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 渲染表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="180"></el-table-column>
      <el-table-column prop="name" align="center" label="角色名称"></el-table-column>
      <el-table-column prop="remark" align="center" label="备注"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini">分配权限</el-button>
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @size-change="changeSize"
      @current-change="changePage"
      :current-page="page.current"
      :page-sizes="[10, 20, 30]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>

    <edit :visible="edit.visible" :title="edit.title" :formData="edit.formData" :close="close" />
  </div>
</template>

<script>
import edit from './roles'
import { roleList, deleteList,updateList } from "../../api/role";
export default {
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {edit},
  // 组件状态值
  data() {
    return {
      search: {},
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 20
      },
      edit:{
          visible:false,
          title:"",
          formData:{}
      },
      multipleSelection: []
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   渲染列表
    async getList() {
      let res = await roleList(this.search, this.page);
      console.log(res);
      this.tableData = res.data.records;
      this.page.total = res.data.total;
    },
    //   查询
    find() {
      this.getList();
      this.$message.success("查询成功");
    },
    //   添加
    addRole() {},
    // 编辑
    async handleEdit(id) {
        this.edit.visible = true
        this.edit.title = '编辑'
        let res = await updateList(id)
        this.edit.formData = res.data
    },
    // 新增
    open(){
        this.edit.title = '新增'
        this.edit.visible = true
    },
    // 关闭弹窗
    close(){
        this.edit.visible = false
        this.getList()
    },

    // 删除
    handleDelete(id) {
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let result = await deleteList(id);
        if (result.code == 20000) {
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    // 分页
    changeSize(val) {
      this.page.size = val;
      this.getList();
    },
    changePage(val) {
      this.page.current = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  // 以下是生命周期钩子 注：没用到的钩子请自行删除
  /**
   * 在实例初始化之后，组件属性计算之前，如data属性等
   */
  beforeCreate() {},
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {},
  /**
   * 在挂载开始之前被调用：相关的 render 函数首次被调用。
   */
  beforeMount() {},
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted() {
    this.getList();
  },
  /**
   * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
   * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
   */
  beforeUpdate() {},
  /**
   * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
   * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
   */
  updated() {},
  /**
   * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
   */
  activated() {},
  /**
   * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
   */
  deactivated() {},
  /**
   * 实例销毁之前调用。在这一步，实例仍然完全可用。
   */
  beforeDestroy() {},
  /**
   * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
   * 所有的事件监听器会被移除，所有的子实例也会被销毁。
   */
  destroyed() {}
};
</script> 

<style scoped>
.app-container {
  padding:0 20px;
}
</style>
