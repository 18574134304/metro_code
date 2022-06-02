<template>
  <!-- 公告 -->
  <div>
    <div class="box">
      <div class="head_notice">
        <el-card class="head_notice_card">
          <el-tabs
            @tab-click="handleClick"
            class="head_notice_tabs"
            v-model="activeName"
          >
            <el-tab-pane label="司机账号管理" name="driver"> </el-tab-pane>
            <el-tab-pane label="地面端账号管理" name="groundEnd"> </el-tab-pane>
            <el-tab-pane label="排班管理" name="typesetting"> </el-tab-pane>
            <el-tab-pane label="电子手册" name="electronics"> </el-tab-pane>
            <el-tab-pane label="公告" name="notice">
              <div class="notice_tabs_nr">
                <div>
                  <el-button class="notice_btn" @click="noticeAdd"
                    >添加公告</el-button
                  >
                </div>
                <div class="nr_input">
                  <el-input
                    class="notice_input"
                    size="small"
                    placeholder="请输入内容"
                    prefix-icon="el-icon-search icons"
                    v-model="keyword"
                    @input="searchBtn"
                  >
                  </el-input>
                </div>
              </div>
              <!--  -->
              <div class="notice_table">
                <el-card>
                  <div>
                    <el-table
                      height="500"
                      stripe
                      :data="tableData.data"
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="title"
                        label="公告标题"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="updatetime"
                        label="更新时间"
                        align="center"
                      >
                        <template slot-scope="scope">
                          {{ scope.row.updatetime | dateFormat }}
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" align="center" width="320">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            @click="record(scope.$index, scope.row)"
                            >下发记录</el-button
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
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.last_page"
                        :page-size="page.per_page"
                        layout="total, prev, pager, next"
                        :total="page.total">
                    </el-pagination>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
    <!-- 新增弹框 -->
    <div class="notice_dialog">
      <el-dialog :title="titleNoitce" :visible.sync="centerDialogVisible">
        <div class="dialog_div">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="dialog_ruleForm"
          >
            <el-form-item label="公告标题" prop="title">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-input
                    placeholder="请输入"
                    v-model="ruleForm.title"
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
            <el-form-item label="公告内容" prop="content"> </el-form-item>
            <div>
              <editor
                :contentText="contentText"
                v-if="editornr"
                @transfer="getUser"
              ></editor>
            </div>
            <div class="dialog_div_line"></div>
          </el-form>
        </div>
        <span slot="footer">
          <div class="dialog_div_button">
            <el-button
              type="primary"
              v-if="titleNoitce == '添加公告'"
              class="dialog_but"
              @click="submit"
              >确认下发</el-button
            >
            <el-button
              v-else
              type="primary"
              class="dialog_but"
              @click="editSubmit"
              >确认修改</el-button
            >
            <el-button class="dialog_but1" @click="centerDialogVisible = false"
              >取消</el-button
            >
          </div>
        </span>
      </el-dialog>
    </div>
    <!-- 删除提示 -->
    <div class="tips_dialog">
      <el-dialog
        title="系统提醒"
        :visible.sync="dialogTips"
        width="15%"
        center
        top="16%"
      >
        <div class="tips_nr">确定要删除该排班记录吗？</div>
        <span slot="footer">
          <div class="tips_div">
            <el-button class="div_but" @click="dialogTips = false"
              >取消</el-button
            >
            <el-button class="div_but1" type="primary" @click="deteleids"
              >确 定</el-button
            >
          </div>
        </span>
      </el-dialog>
    </div>
    
    <!-- 下发记录 -->
    <div class="notice_dialog">
      <el-dialog :title="recorData.length > 0 ? '下发记录' : '下发公告'" :visible.sync="editdialog">
        <div v-if="recorData.length > 0">
          <el-table stripe :data="recorData" style="width: 100%">
            <el-table-column prop="date" label="车辆" width="180">
            </el-table-column>
            <el-table-column prop="name" label="下发结果" width="180">
            </el-table-column>
            <el-table-column prop="address" label="下发时间"> </el-table-column>
          </el-table>
        </div>

        <div class="notice_dialog" v-if="recorData.length <= 0">
          <div class="dialog_gongg">公告标题：临时排班调整</div>
          <div class="dialog_div">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="dialog_ruleForm"
            >
              <el-form-item label="下发车辆" prop="train_id">
                <div class="div_input">
                  <div></div>
                  <div class="content_input">
                    <el-select
                      @change="trainChange($event)"
                      multiple
                      v-model="ruleForm.train_id"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in trainList"
                        :key="item.id"
                        :label="item.number"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </el-form-item>

              <div class="dialog_div_line"></div>
            </el-form>
          </div>
          <span slot="footer">
            <div class="dialog_div_button">
              <el-button type="primary" class="dialog_but" @click="andConfirm"
                >确认下发</el-button
              >
              <el-button class="dialog_but1" @click="editdialog = false"
                >取消</el-button
              >
            </div>
          </span>
      </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addBulletin,
  editBulletin,
  delBulletin,
  getlistBulletin,
  getDetailsBulletin,
  issuedBulletin,
  getIssuedListBulletin,
  trainGetTrainList,
} from "@/views/utils/api/form-data";
let timers = null;
import editor from "./editor.vue";
export default {
  data() {
    return {
      titleNoitce: "添加公告",
      recorData: [], // 下发记录列表
      editornr: true,
      recorddialog: false,
      editdialog: false,
      dialogTips: false,
      centerDialogVisible: false, //
      editData: {},
      deteleData: {},
      contentText: "",
      ruleForm: {
        title: "",
        content: "",
        train_id: [],
      },
      rules: {
        title: [{ required: true, message: "请输入公告标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入公告内容", trigger: "blur" },
        ],
        train_id: [
          { required: true, message: "请选择下发车辆", trigger: "blur" },
        ],
      },
      activeName: "notice",
      input2: "",
      tableData: [],
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      keyword: "",
      titleNoitce: "添加公告",
      trainList: [],
      rowId: null,
      page: {
          last_page: 1,
          per_page: 15
      }
    };
  },
  components: {
    editor,
  },
  created() {
    this.init();
    this.gettrain();
  },
  mounted() {
    document.getElementsByClassName(
      "el-pagination__jump"
    )[0].childNodes[0].nodeValue = "跳至";
  },
  methods: {
    // 获取车辆数据
    async gettrain() {
      let res = await trainGetTrainList({
        keyword: this.keyword
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.trainList = res.data.data;
        } else {
          this.trainList = [];
        }
      } else {
        // this.$message.error("登录失败");
      }
    },
    handleCurrentChange(evl) {
        this.page.last_page = evl
        this.init()
    },
    handleSizeChange(evl) {
        this.page.per_page = evl
        this.init()
    },
    // 选择车辆
    trainChange(val) {
      console.log(val);
    },
    searchBtn() {
      if (this.keyword) {
        clearTimeout(timers);
        timers = setTimeout(() => {
            this.page.last_page = 1,
            this.page.per_page = 15
          this.init(); //需要防抖的函数
        }, 800);
      } else {
        this.init(); //需要防抖的函数
      }
    },
    async init() {
      let res = await getlistBulletin({
        keyword: this.keyword,
        last_page: this.page.last_page,
        per_page: this.page.per_page
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
    //
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
    // 富文本
    getUser(val) {
      this.ruleForm.content = val;
    },
    // 添加
    noticeAdd() {
      this.editornr = false;
      this.$nextTick(() => {
        this.editornr = true;
      });
      this.titleNoitce = "添加公告";
      this.contentText = "";
      this.centerDialogVisible = true;
      this.$refs.ruleForm.resetFields();
    },
    // 添加确定
    submit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
            if(this.ruleForm.title.length < 5 || this.ruleForm.title.length > 100) {
                this.$message.warning('title长度不符合要求 5,100')
                return
            }
          let res = await addBulletin({
            title: this.ruleForm.title,
            content: this.ruleForm.content,
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
    // 编辑
    async handleEdit(index, row) {
      this.titleNoitce = "编辑公告";
      this.editData = row;
      this.centerDialogVisible = true;
      let res = await getDetailsBulletin({
        id: row.id,
      });
      if (res.data.code == 1) {
        this.ruleForm = res.data.data;
        this.editornr = false;
        this.$nextTick(() => {
          this.editornr = true;
        });
        this.contentText = res.data.data.content;
        this.init();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 编辑确定
    editSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await editBulletin({
            title: this.ruleForm.title,
            content: this.ruleForm.content,
            id: this.editData.id,
          });
          if (res.data.code == 1) {
            this.centerDialogVisible = false;
            this.$message.success("修改成功");
            this.init();
          } else {
            this.$message.error(res.data.msg);
          }
        }
      });
    },
    // 下发记录
    record(index, row) {
    //   this.andConfirm(row.id)
      this.rowId = row.id
      this.editdialog = true;
    },
    // 下发记录
    async andConfirm(bulletin_id) {
      let res = await getIssuedListBulletin({
        bulletin_id: this.rowId,
        train_ids: this.ruleForm.train_id.join(',')
      });
      if (res.data.code == 1) {
        this.recorData = res.data.data
        this.editdialog = false
        this.$message.success('下发成功')
      } else {
        this.$message.error('下发失败');
        this.editdialog = false
      }
    },
    // 删除
    handleDelete(index, row) {
      this.dialogTips = true;
      this.deteleData = row;
    },
    // 删除确定
    async deteleids() {
      let res = await delBulletin({
        id: this.deteleData.id,
      });
      if (res.data.code == 1) {
        this.dialogTips = false;
        this.$message.success("删除成功");
        this.init();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
};
</script>

<style lang="less" >
.head_notice {
  .head_notice_card {
     .el-card__body {
      padding: 0;
    }
    .head_notice_tabs {
      font-size: 18px;
      .notice_tabs_nr {
        display: flex;
        justify-content: space-between;
        .notice_btn {
          font-size: 18px;
          background-color: #004da1;
          color: #fff;
          margin-top: 10px;
        }
        .nr_input {
          margin-top: 13px;
          .notice_input {
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
        left: 1%;
        height: 3.5px;
        font-weight: 600;
        background-color: #004DA1;
        z-index: 1;
      }
    }
  }
  //
  .notice_table {
    margin-top: 20px;
    background-color: #f9f9fbff;
    padding: 20px;
  }
  .notice_footer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .notice_Pagination {
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
.notice_dialog {
  border-radius: 15px;
  .el-dialog {
    width: 1000px;
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
          width: 120px;
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
    height: 45px !important;
  }
  .dialog_but1 {
    background-color: #fff;
  }
}
//
.tips_dialog {
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
      width: 50%;
      background-color: #004da1ff;
      border-radius: 30px;
    }
    .div_but {
      background-color: #fff;
    }
  }
}
.dialog_gongg {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}
.system_tabs_nr ,.groundEnd_tabs_nr , .typesetting_tabs_nr, .electronics_tabs_nr ,.notice_tabs_nr{
  padding: 0 30px!important;
}
.el-tabs__header{
  margin-top: 28px;
  margin-left: 30px;
}
</style>