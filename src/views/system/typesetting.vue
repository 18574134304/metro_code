<template>
  <!-- 排班管理 -->
  <div>
    <div class="box">
      <div class="head_typesetting">
        <el-card class="head_typesetting_card">
          <el-tabs
            @tab-click="handleClick"
            class="head_typesetting_tabs"
            v-model="activeName"
          >
            <el-tab-pane label="司机账号管理" name="driver"> </el-tab-pane>
            <el-tab-pane label="地面端账号管理" name="groundEnd"> </el-tab-pane>
            <el-tab-pane label="排班管理" name="typesetting">
              <div class="typesetting_tabs_nr">
                <div>
                  <el-button class="typesetting_btn" @click="typesettingAdd"
                    >添加排班</el-button
                  >
                  <!-- <el-button class="typesetting_btn" @click="Import"
                    >导入</el-button
                  > -->
                </div>
                <div class="nr_input">
                  <el-input
                    class="typesetting_input"
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
              <div class="typesetting_table">
                <el-card>
                  <div>
                    <el-table
                      height="500"
                      stripe
                      :data="tableData.data"
                      style="width: 100%"
                    >
                      <el-table-column prop="date" label="司机" align="center">
                        <template slot-scope="scope">
                          {{
                            scope.row.driver != null && scope.row.driver != ""
                              ? scope.row.driver.nickname
                              : ""
                          }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="date" label="车次" align="center">
                        <template slot-scope="scope">
                          {{
                            scope.row.train != null && scope.row.train != ""
                              ? scope.row.train.number
                              : ""
                          }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="date"
                        label="排班时间"
                        align="center"
                        class-name=""
                      >
                        <template slot-scope="scope">
                          {{ scope.row.createtime | dateFormat }}
                        </template>
                      </el-table-column>

                      <el-table-column
                        prop="date"
                        label="更新时间"
                        align="center"
                      >
                        <template slot-scope="scope">
                          {{ scope.row.updatetime | dateFormat }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="remark"
                        label="备注"
                        align="center"
                      >
                      </el-table-column>

                      <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
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
            <el-tab-pane label="电子手册" name="electronics"> </el-tab-pane>
            <el-tab-pane label="公告" name="notice"> </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
    <!--底部  -->
    <!-- 弹框 -->
    <div class="typesetting_dialog">
      <el-dialog :title="titleDialog" :visible.sync="centerDialogVisible">
        <div class="dialog_div">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="dialog_ruleForm"
          >
            <el-form-item label="司机" prop="driver_id">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-select v-model="ruleForm.driver_id" placeholder="请选择">
                    <el-option
                      v-for="item in driverList"
                      :key="item.id"
                      :label="item.nickname"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
            <el-form-item label="车辆" prop="train_id">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-select v-model="ruleForm.train_id" placeholder="请选择">
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
            <el-form-item label="车次" prop="table_bout_id">
              <div class="div_input">
                <div></div>
                <div class="content_input">
                  <el-select
                    v-model="ruleForm.table_bout_id"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in TrainNumberList"
                      :key="item.id"
                      :label="item.bout_number"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
            <el-form-item label="排班日期" prop="datetriem">
              <div class="div_input">
                <div></div>
                <div class="content_input_date">
                  <el-date-picker
                    v-model="ruleForm.datetriem"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="pickerDate"
                  >
                  </el-date-picker>
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
              v-if="titleDialog != '编辑排班'"
              class="dialog_but"
              @click="submit"
              >保存</el-button
            >
            <el-button
              v-else
              type="primary"
              class="dialog_but"
              @click="editClick"
              >修改</el-button
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
        <div class="tips_nr">确定要删除该排班记录吗？</div>
        <span slot="footer">
          <div class="tips_div">
            <el-button class="div_but" @click="dialogTips = false">取消</el-button>
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
  trainAdd,
  trainEdit,
  trainDel,
  trainGetList,
  trainGetDetails,
  trainGetDriverList, //获取司机列表
  trainGetTrainList, //获取车列表
  getBoutListByTable, //获取车次列表
  getTableListBout, //获取表的列表
} from "@/views/utils/api/form-data";
let timers = null;
export default {
  data() {
    return {
      value1: "",
      dialogTips: false,
      centerDialogVisible: false, //
      ruleForm: {
        driver_id: "",
        train_id: "",
        start_time: "",
        end_time: "",
        datetriem: [],
      },
      date: [],
      rules: {
        driver_id: [
          { required: true, message: "请选择司机", trigger: "change" },
        ],
        train_id: [
          { required: true, message: "请选择车辆", trigger: "change" },
        ],
        table_bout_id: [
          { required: true, message: "请选择车次", trigger: "change" },
        ],
        datetriem: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        end_time: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        remark: [
          { required: true, message: "请填写备注", trigger: "blur" },
        ],
      },

      activeName: "typesetting",
      input2: "",
      tableData: [],
      value: "",
      driverList: [],
      trainList: [],
      keyword: "",
      titleDialog: "编辑排班",
      deteledata: {},
      bottomList: [],
      indexs: "",
      TrainNumberList: [],
      tableId:1,
      page: {
          last_page: 1,
          per_page: 15
      }
    };
  },
  created() {
    this.init();
    this.getdriver();
    this.getvehicleSecond();
    this.getTrainNumber();
    this.getbottomList();
  },
  mounted() {},
  methods: {
    //  获取底部分类数据
    async getbottomList() {
      let res = await getTableListBout({
        type: "all",
        time: "",
        car_number: "",
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.bottomList = res.data.data;
        } else {
          this.bottomList = [];
        }
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 底部换颜色
    itemClick(item, index) {
      this.indexs = index;
      this.tableId=item.id
      this.init()
    },
    // 获取司机数据
    async getdriver() {
      let res = await trainGetDriverList({
        keyword: this.keyword,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.driverList = res.data.data;
        } else {
          this.driverList = [];
        }
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 获取车列表
    async getvehicleSecond() {
      let res = await trainGetTrainList({
        keyword: this.keyword,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.trainList = res.data.data;
        } else {
          this.trainList = [];
        }
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 获取车次列表
    async getTrainNumber() {
      let res = await getBoutListByTable({
        table_id: this.tableId,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.TrainNumberList = res.data.data;
        } else {
          this.TrainNumberList = [];
        }
      } else {
        this.$message.error(res.data.msg);
      }
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
      let user = JSON.parse(localStorage.getItem("user"));
      console.log(this.page,'aaa')
      let res = await trainGetList({
        keyword: this.keyword,
        last_page: this.page.last_page,
        per_page: this.page.per_page
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.tableData = res.data.data;
          this.page.last_page = res.data.data.last_page
          this.page.per_page = res.data.data.per_page
          this.page.total = res.data.data.total
        } else {
          this.tableData = {};
        }
      } else {
        this.$message.error(res.data.msg);
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
    // 选择时间
    pickerDate(val) {
      this.ruleForm.start_time = Math.round(new Date(val[0]) / 1000);
      this.ruleForm.end_time = Math.round(new Date(val[1]) / 1000);
    },
    // 导入
    async Import() {
      // let res = await traingGetGroundList({
      //   keyword: this.keyword,
      // });
      // if (res.data.code == 1) {
      //   console.log(res);
      //   this.init();
      // } else {
      //   this.$message.error(res.data.msg);
      // }
    },
    // 添加
    typesettingAdd() {
      this.titleDialog = "添加排班";
      this.centerDialogVisible = true;
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {};
    },
    // 保存
    submit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await trainAdd({
            driver_id: this.ruleForm.driver_id,
            train_id: this.ruleForm.train_id,
            start_time: this.ruleForm.start_time,
            end_time: this.ruleForm.end_time,
            table_id:1,
            table_bout_id:this.tableId,
            remark:this.ruleForm.remark,
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
      this.titleDialog = "编辑排班";
      this.centerDialogVisible = true;
      let res = await trainGetDetails({
        id: row.id,
      });
      if (res.data.code == 1) {
        this.ruleForm = res.data.data;
        this.ruleForm.datetriem = [];
        this.ruleForm.datetriem.push(res.data.data.start_time * 1000);
        this.ruleForm.datetriem.push(res.data.data.end_time * 1000);
        this.init();
      } else {
        this.$message.error(res.data.msg);
      }
      console.log(index, row);
    },
    // 修改
    editClick() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await trainEdit({
            driver_id: this.ruleForm.driver_id,
            train_id: this.ruleForm.train_id,
            start_time: this.ruleForm.start_time,
            end_time: this.ruleForm.end_time,
            remark: this.ruleForm.remark,
            id: this.ruleForm.id,
             table_id:1,
            table_bout_id:this.tableId,
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
    // 删除
    handleDelete(index, row) {
      this.dialogTips = true;
      this.deteledata = row;
    },
    //删除确定
    async deteleClick() {
      let res = await trainDel({
        id: this.deteledata.id,
      });
      if (res.data.code == 1) {
        this.dialogTips = false;
        this.$message.success("删除成功");
        this.init();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    handleCurrentChange(evl) {
        this.page.last_page = evl
        this.init()
    },
    handleSizeChange(evl) {
        this.page.per_page = evl
        this.init()
    }
  },
};
</script>

<style lang="less">
.head_typesetting {
    /deep/ .el-pagination{
        text-align: center;
    }
  .head_typesetting_card {
    .el-card__body {
      padding: 0;
    }
    .head_typesetting_tabs {
      font-size: 18px;
      .typesetting_tabs_nr {
        display: flex;
        justify-content: space-between;
        .typesetting_btn {
          font-size: 18px;
          background-color: #004da1;
          color: #fff;
          margin-top: 10px;
        }
        .nr_input {
          margin-top: 13px;
          .typesetting_input {
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
        left: 5%;
        height: 3.5px;
        font-weight: 600;
        background-color: #004DA1;
        z-index: 1;
      }
    }
  }
  //
  .typesetting_table {
    margin-top: 20px;
    background-color: #f9f9fbff;
    padding: 20px;
  }
  .typesetting_footer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .typesetting_Pagination {
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
.typesetting_dialog {
  border-radius: 15px;
  .el-dialog {
    width: 650px;
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
          margin-right: 10px;
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
        width: 50%;
        background-color: #004da1ff;
        border-radius: 30px;
      }
      .div_but {
        background-color: #fff;
      }
    }
  }
}
.content_input_date input {
  border: none;
  width: 120px;
  margin-top: -20px;
  padding: 0;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
}
.footer {
//   width: 91.1%;
  height: 80px;
  background: #ffffffff;
  line-height: 80px;
  text-align: center;
  /* 方法一 */
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 20px;
  text-align: center;
  .vehicle_Pagination {
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    align-items: center;
    
    .Pagination_div {
    //   display: flex;
    //   justify-content: center;
      .div_item,
      .click_item {
        cursor: pointer;
        background-color: #fff;
        border: 1px solid #eee;
        // width: 40px;
        padding: 5px 10px;
        height: 20px;
        line-height: 20px;
        border-radius: 8px !important;
      }
      .click_item {
        background-color: #004da1;
        color: #fff;
      }
    }
  }
}
.system_tabs_nr ,.groundEnd_tabs_nr , .typesetting_tabs_nr, .electronics_tabs_nr ,.notice_tabs_nr{
  padding: 0 30px!important;
}
.el-tabs__header{
  margin-top: 28px;
  margin-left: 30px;
}
</style>