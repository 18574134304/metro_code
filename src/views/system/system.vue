<template>
  <!-- 司机账号管理 -->
  <div id="settings">
    <div class="box">
      <div class="head_system">
        <el-card class="head_system_card">
          <el-tabs
            @tab-click="handleClick"
            class="head_system_tabs"
            v-model="activeName"
          >
            <el-tab-pane label="司机账号管理" name="driver">
              <div class="system_tabs_nr">
                <div>
                  <el-button class="system_btn" @click="systemAdd"
                    >添加账号</el-button
                  >
                </div>
                <div class="nr_input">
                  <el-input
                    class="system_input"
                    size="small"
                    placeholder="搜索"
                    prefix-icon="el-icon-search icons"
                    v-model="keyword"
                    @input="searchBtn"
                  >
                  </el-input>
                </div>
              </div>
              <!--  -->
              <div class="system_table">
                <el-card>
                  <div>
                    <el-table
                      height="500"
                      stripe
                      :data="tableData.data"
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="nickname"
                        label="姓名"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="gender"
                        label="性别"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span>{{
                            scope.row.gender == "1" ? "男" : "女"
                          }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="age" label="年龄" align="center">
                      </el-table-column>
                      <el-table-column
                        prop="number"
                        label="工号"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="updatetime"
                        label="更新时间"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span>{{ scope.row.updatetime | dateFormat }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="remark"
                        label="备注"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column label="操作" align="center" width="220">
                        <template slot-scope="scope">
                          <el-button
                            v-if="scope.row.status == 'normal'"
                            size="mini"
                            @click="deactivate(scope.$index, scope.row)"
                            >停用</el-button
                          >
                          <el-button
                            v-else
                            size="mini"
                            @click="Enable(scope.$index, scope.row)"
                            >启用</el-button
                          >
                          <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                            >编辑</el-button
                          >
                          <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="system_footer">
                    <div></div>
                    <div class="system_Pagination">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        background
                        layout="prev, pager, next,jumper"
                        :total="tableData.total"
                        size="medium"
                      >
                      </el-pagination>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="地面端账号管理" name="groundEnd"> </el-tab-pane>
            <el-tab-pane label="排班管理" name="typesetting"> </el-tab-pane>
            <el-tab-pane label="电子手册" name="electronics"> </el-tab-pane>
            <el-tab-pane label="公告" name="notice"> </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
    <!-- 弹框 -->
    <div class="system_dialog">
      <el-dialog
        @close="addDialog"
        :title="titleDialog"
        :visible.sync="centerDialogVisible"
      >
        <div class="dialog_div">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="dialog_ruleForm"
          >
            <el-form-item label="姓名" prop="nickname">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-input
                    placeholder="请输入"
                    v-model="ruleForm.nickname"
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
            <el-form-item label="性别" prop="gender">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-select v-model="ruleForm.gender" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
            <el-form-item label="年龄" prop="age">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-input
                  type="number"
                    placeholder="请输入"
                    v-model="ruleForm.age"
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
            <el-form-item label="驾龄" prop="driving_age">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-input
                  type="number"
                    placeholder="请输入"
                    v-model="ruleForm.driving_age"
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
            <el-form-item label="工号" prop="number">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-input
                    placeholder="请输入"
                    v-model="ruleForm.number"
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
            <el-form-item label="密码"  :required="titleDialog == '添加账号' ? true : false">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-input
                    placeholder="请输入"
                    v-model="ruleForm.password"
                    type="password"
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
            <el-form-item label="权限信息" prop="d_id" label-width="120px">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-select v-model="ruleForm.d_id" placeholder="请选择">
                    <el-option
                      v-for="item in d_idLinst"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
            <el-form-item label="备注" prop="remark">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-input
                    placeholder="请输入"
                    v-model="ruleForm.remark"
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
          </el-form>
        </div>
        <span slot="footer">
          <div class="dialog_div_button">
            <el-button
              type="primary"
              v-if="titleDialog == '添加账号'"
              class="dialog_but"
              @click="submit"
              >绑定NFC</el-button
            >
            <el-button
              v-if="titleDialog == '编辑账号'"
              type="primary"
              class="dialog_but"
              @click="editSubmit"
              >修改NFC</el-button
            >
            <el-button class="dialog_but1" @click="centerDialogVisible = false"
              >取消</el-button
            >
          </div>
        </span>
      </el-dialog>
    </div>
    <!-- 提示 -->
    <div class="tips_dialog">
      <el-dialog
        class="tips"
        title="系统提醒"
        :visible.sync="dialogTips"
        width="15%"
        center
        top="16%"
      >
        <div class="tips_nr">已有绑定的NFC</div>
        <span slot="footer">
          <div class="tips_div">
            <el-button class="div_but" @click="Rebind">重新绑定</el-button>
            <el-button
              class="div_but1"
              type="primary"
              @click="dialogTips = false"
              >确 定</el-button
            >
          </div>
        </span>
      </el-dialog>
    </div>
    <!-- 停用 -->
    <div class="tips_dialog">
      <el-dialog
        class="tips"
        title="系统提醒"
        :visible.sync="dialogDeactivate"
        width="15%"
        center
        top="16%"
      >
        <div class="tips_nr">{{ itpsTitle }}</div>
        <span slot="footer">
          <div class="tips_div">
            <el-button class="div_but" @click="dialogDeactivate = false"
              >取消</el-button
            >
            <el-button class="div_but1" type="primary" @click="qdDeactivate"
              >确 定</el-button
            >
          </div>
        </span>
      </el-dialog>
    </div>
    <!-- 删除 -->
    <div class="tips_dialog">
      <el-dialog
        class="tips"
        title="系统提醒"
        :visible.sync="dialogDetele"
        width="15%"
        center
        top="16%"
      >
        <div class="tips_nr">确定要删除该账号吗？</div>
        <span slot="footer">
          <div class="tips_div">
            <el-button class="div_but" @click="dialogDetele = false"
              >取消</el-button
            >
            <el-button class="div_but1" type="primary" @click="deteleClick"
              >确 定</el-button
            >
          </div>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getListAccount,
  addAccount,
  getDetailsAccount,
  editAccount,
  stopAccount,
  delAccount,
} from "@/views/utils/api/form-data";
let timers = null;
export default {
  data() {
    return {
      dialogTips: false,
      centerDialogVisible: false, //
      dialogDeactivate: false,
      dialogDetele: false,
      ruleForm: {
        nickname: "",
        gender: "",
        age: "",
        driving_age: "",
        number: "",
        password: "",
        remark: "",
        role: "ground",
        d_id: "",
      },
      rules: {
        nickname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        driving_age: [
          { required: true, message: "请输入驾龄", trigger: "blur" },
        ],
        number: [{ required: true, message: "请输入工号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        d_id: [{ required: true, message: "请选择性别", trigger: "change" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
      },
      d_idLinst: [
        {
          value: "1",
          label: "首页",
        },
        {
          value: "2",
          label: "应急指挥",
        },
        {
          value: "3",
          label: "行车日志",
        },
        {
          value: "4",
          label: "辅助驾驶",
        },
        {
          value: "5",
          label: "系统管理",
        },
      ],
      activeName: "driver",
      input2: "",
      tableData: [],
      options: [
        {
          value: "1",
          label: "男",
        },
        {
          value: "2",
          label: "女",
        },
      ],
      value: "",
      keyword: "",
      page: 1,
      titleDialog: "添加账号",
      rowID: "",
      deactivates: {},
      itpsTitle: "确定要停用该账号吗？",
      editData: {},
    };
  },
  created() {
    this.init();
  },
  mounted() {
    document.getElementsByClassName(
      "el-pagination__jump"
    )[0].childNodes[0].nodeValue = "跳至";
  },
  methods: {
    // 弹框关闭
    addDialog() {
      this.dialogTips = false;
    },
    searchBtn() {
      if (this.keyword) {
        clearTimeout(timers);
        timers = setTimeout(() => {
          this.init(); //需要防抖的函数
        }, 800);
      } else {
        this.init(); //需要防抖的函数
      }
    },
    async init() {
      let res = await getListAccount({
        keyword: this.keyword,
        role: 'ground',
        page: this.page,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.tableData = res.data.data;
        } else {
          this.tableData = {};
        }
      } else {
        // this.$message.error("登录失败");
      }
    },
    handleClick(tab, event) {
      if (tab.name == "groundEnd") {
        this.$router.push({ path: "/groundEnd" });
      } else if (tab.name == "typesetting") {
        this.$router.push({ path: "/typesetting" });
      } else if (tab.name == "electronics") {
        this.$router.push({ path: "/electronics" });
      } else if (tab.name == "notice") {
        this.$router.push({ path: "/notice" });
      } else if (tab.name == "driver") {
        this.$router.push({ path: "/system" });
      }
    },

    // 绑定NFC
    submit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
            if(this.ruleForm.password.length < 6 || this.ruleForm.password.length > 30) {
                this.$message.warning('密码长度不符合要求 6,30')
                return
            }
          let res = await addAccount({
            nickname: this.ruleForm.nickname,
            gender: this.ruleForm.gender,
            age: this.ruleForm.age,
            driving_age: this.ruleForm.driving_age,
            number: this.ruleForm.number,
            password: this.ruleForm.password,
            remark: this.ruleForm.remark,
            role: 'ground',
            d_id: this.ruleForm.d_id,
          });
          if (res.data.code == 1) {
            this.centerDialogVisible = false;
            this.$message.success("添加成功");
            this.init();
          } else {
            this.$message.error(res.data.msg);
          }
        }
      });
    },

    // 添加
    systemAdd() {
      this.titleDialog = "添加账号";
      this.centerDialogVisible = true;
    //   this.$refs.ruleForm.resetFields();
      this.ruleForm = {};
    },
    // 编辑
    handleEdit(index, row) {
      this.dialogTips = true;
      this.editData = row;
    },
    // 重新绑定NFC
    async Rebind() {
      this.titleDialog = "编辑账号";
      this.centerDialogVisible = true;
      let res = await getDetailsAccount({ id: this.editData.id });
      if (res.data.code == 1) {
        this.ruleForm = res.data.data;
        this.ruleForm.d_id = this.ruleForm.d_id + ''
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 修改NFC
    editSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await editAccount({
            nickname: this.ruleForm.nickname,
            gender: this.ruleForm.gender,
            age: this.ruleForm.age,
            driving_age: this.ruleForm.driving_age,
            number: this.ruleForm.number,
            password: this.ruleForm.password,
            remark: this.ruleForm.remark,
            role: this.ruleForm.role,
            d_id: this.ruleForm.d_id,
            id: this.ruleForm.id,
          });
          if (res.data.code == 1) {
            this.centerDialogVisible = false;
            this.dialogTips = false;
            this.$message.success("修改成功");
            this.init();
          } else {
            this.$message.error(res.data.msg.password);
          }
        }
      });
    },
    // 停用
    deactivate(index, row) {
      this.itpsTitle = "确定要停用该账号吗？";
      this.dialogDeactivate = true;
      this.deactivates = row;
    },
    //停用确定
    async qdDeactivate() {
      if (this.itpsTitle == "确定要停用该账号吗？") {
        let res = await stopAccount({
          id: this.deactivates.id,
          status: "hidden",
        });
        if (res.data.code == 1) {
          this.dialogDeactivate = false;
          this.$message.success("账号已停用");
          this.init();
        } else {
          this.$message.error(res.data.msg);
        }
      } else {
        let res = await stopAccount({
          id: this.deactivates.id,
          status: "normal",
        });
        if (res.data.code == 1) {
          this.dialogDeactivate = false;
          this.$message.success("账号已启用");
          this.init();
        } else {
          this.$message.error(res.data.msg);
        }
      }
    },
    // 启用
    Enable(index, row) {
      this.itpsTitle = "确定要启用该账号吗？";
      this.dialogDeactivate = true;
      this.deactivates = row;
    },
    // 删除
    handleDelete(index, row) {
      this.dialogDetele = true;
      this.deletes = row;
    },
    // 删除确定
    async deteleClick() {
      let res = await delAccount({
        id: this.deletes.id,
      });
      if (res.data.code == 1) {
        this.dialogDetele = false;
        this.$message.success("账号已删除");
        this.init();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // page
      this.page = val;
      this.init();
    },
  },
};
</script>

<style scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
-webkit-appearance: none !important;
}
::v-deep input[type='number'] {
-moz-appearance: textfield !important;
}
</style>

<style lang="less">
#settings{
.head_system {
  .head_system_card {
    .el-card__body {
      padding: 0;
    }
    .head_system_tabs {
      font-size: 18px;
      .system_tabs_nr {
        display: flex;
        justify-content: space-between;
        .system_btn {
          font-size: 18px;
          background-color: #004da1;
          color: #fff;
          margin-top: 10px;
        }
        .nr_input {
          margin-top: 13px;
          .system_input {
            width: 250px;
            .el-input__inner {
              height: 40px;
              border-radius: 5px;
              padding-left: 45%;
            }
            .el-input__prefix {
              top: 1px;
              left: 80px;
            }
            .el-input__inner {
              border-radius: 5px;
              padding-left: 100px;
              .el-input__prefix {
                .el-input__icon {
                  margin-left: 50px !important;
                }
              }
            }
          }
        }
        //
      }
      .el-tabs__item {
        font-size: 20px !important;
        height: 45px;
        font-weight: 600;
        &:hover {
          color: #004DA1;
        }
      }
      .el-tabs__item.is-active {
        color: #004DA1  !important;
      }
      .el-tabs__active-bar {
        width: 30px !important;
        position: absolute;
        bottom: 0;
        left: 7% !important;
        height: 3.5px;
        font-weight: 600;
        background-color: #004DA1;
        z-index: 1;
      }
    }
  }
  //
  .system_table {
    margin-top: 20px;
    background-color: #f9f9fbff;
    padding: 20px;
  }
  .system_footer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .system_Pagination {
      margin-right: 20px;
      .el-pager li {
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        border-radius: 8px !important;
      }
      .el-pagination .btn-next .el-icon,
      .el-pagination .btn-prev .el-icon {
        //   border: 0 !important;//////
        font-size: 30px;
        line-height: 40px;
        width: 40px;
        height: 40px;
        background-color: #fff;
        border: 1px solid #eee;
        border-radius: 8px !important;
        margin-top: -2px;
      }
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #004da1;
        color: #fff !important;
      }
      .el-pager li:hover {
        color: #004da1 !important;
      }

      .white-list-tool.is-background .btn-next .el-icon-arrow-right {
        margin: 0 auto;
      }
      .white-list-tool.is-background .btn-prev .el-icon-arrow-left {
        margin: 0 auto;
      }
      .el-pagination.is-background .btn-next,
      .el-pagination.is-background .btn-prev,
      .el-pagination.is-background .el-pager li {
        background-color: #fff;
        border: 1px solid #eee;
      }
      .el-pagination__jump {
        font-size: 18px;
        // margin-top: 10px;
      }
      .el-input__inner {
        width: 40px;
        height: 40px;
        background-color: #fff;
        border: 1px solid #eee;
        border-radius: 8px !important;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
//
.system_dialog {
  border-radius: 15px;
  .el-dialog {
    width: 700px;
    margin-top: 5px;
    border-radius: 10px !important;
    .el-dialog__headerbtn .el-dialog__close {
      background-color: #adadadff;
      border-radius: 50%;
      color: #ffffffff;
      padding: 2px;
    }
    .el-dialog__title {
      margin-left: 42%;
      font-weight: 600;
    }
    .dialog_div {
      .dialog_ruleForm {
        .el-form-item__label {
          font-size: 18px;
          font-weight: 600;
        }
      }
      .div_input {
        display: flex;
        justify-content: space-between;
        .content_input input {
          border: none;
          width: 80px;
          margin-top: -20px;
          padding: 0;
          font-size: 18px;
        }
      }
      .dialog_div_line {
        width: 100%;
        height: 1px;
        margin: 10px 0;
        margin-top: 0;
        background-color: #d8d8d8ff;
      }
      .el-form-item__error {
        color: #f56c6c;
        font-size: 0.0625rem;
        line-height: 1;
        padding-top: 0.02083rem;
        position: absolute;
        top: 100%;
        left: 77%;
      }
    }
  }
}
.dialog_div_button {
  margin-top: -20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .dialog_but:hover,
  .dialog_but:focus {
    background-color: #004da1ff;
  }
  .dialog_but,
  .dialog_but1 {
    width: 50%;
    background-color: #004da1ff;
    height: 50px !important;
  }
  .dialog_but1 {
    background-color: #fff;
  }
}
//
.tips_dialog {
  border-radius: 15px !important;
  .tips {
    border-radius: 15px;
    .el-dialog__headerbtn .el-dialog__close {
      display: none;
    }
    .el-dialog__header {
      background-color: #eee;
      font-weight: 600;
    }
    .el-dialog__title {
      color: #004da1ff;
    }
    .tips_nr {
      text-align: center;
      font-weight: 600;
    }
    .tips_div {
      display: flex;
      justify-content: space-between;
      .div_but1:hover,
      .div_but1:focus {
        background-color: #004da1ff;
      }
      .div_but,
      .div_but1 {
        width: 48% !important;
        height: 40px !important;
        background-color: #004da1ff;
        border-radius: 30px;
      }
      .div_but {
        background-color: #fff;
      }
    }
  }
}
.system_tabs_nr ,.groundEnd_tabs_nr , .typesetting_tabs_nr, .electronics_tabs_nr ,.notice_tabs_nr{
  padding: 0 30px!important;
}
}
.el-tabs__header{
  margin-top: 28px;
  margin-left: 30px;
}
</style>
