<template>
  <div style="background-color: F9F9FB;">
    <div class="vehicle">
      <div class="vehicle-header">
        <div class="vehicle_text">车辆列表</div>
        <div class="vehicle_head">
          <div>
            <!-- <el-button size="small" class="vehicle_btn" @click="addVehicle"
              >添加车辆</el-button
            > -->
          </div>
          <div>
            <el-input
              class="vehicle_index"
              size="small"
              placeholder="搜索"
              prefix-icon="el-icon-search icons"
              v-model="keyword"
              @input="searchBtn"
            >
            </el-input>
          </div>
        </div>
      </div>
      <div class="vehicle_list" v-if="this.vehicleData.data && this.vehicleData.data.length">
        <div
          class="vehicle_list_item"
          @click="dialSend(item)"
          v-for="(item, index) in this.vehicleData.data"
          :key="index"
        >
          <el-card class="vehicle_list_item_card">
            <div class="vehicle_list_item_img">
              <img
                src="../../assets/vhicleList/vehicleList.png"
                alt=""
                srcset=""
              />
            </div>
            <div class="vehicle_list_item_title">{{ item.number }}</div>
            <div class="vehicle_list_item_role">
              <span class="item_role_img"
                ><img src="../../assets/vhicleList/1.png" alt=""
              /></span>
              <span class="vehicle_list_item_role_text">角色：</span>
              <span class="vehicle_list_item_role_text">{{
                item.driver.nickname
              }}</span>
            </div>
            <div class="vehicle_list_item_role">
              <span class="item_role_img"
                ><img src="../../assets/vhicleList/2.png" alt=""
              /></span>
              <span class="vehicle_list_item_role_text">车次：</span>
              <span class="vehicle_list_item_role_text">1002</span>
              <span class="vehicle_list_item_role_text text_spot">...</span>
            </div>
          </el-card>
        </div>
      </div>
      <!--  -->
      <!--底部  -->
      <div class="footer">
        <div class="vehicle_Pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            layout="prev, pager, next"
            :total="this.vehicleData.total"
            size="medium"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="vehicleList_dialog">
      <el-dialog
        class="dialog"
        title="邀请你视频通话"
        :visible.sync="dialogVisible"
        center
      >
        <div class="dialog_middle">
          <img src="../../assets/emergency_video/headPortrait.png" alt="" />
        </div>
        <span slot="footer" class="dialog-footer">
          <div class="div_img">
            <div>
              <img
                class="img_left"
                src="../../assets/emergency_video/dh.png"
                alt=""
                srcset=""
              />
              <div class="img_text">接听</div>
            </div>
            <div>
              <img
                class="img_right"
                src="../../assets/emergency_video/hangUp2.png"
                alt=""
                srcset=""
              />
              <div class="img_text1">挂断</div>
            </div>
          </div>
        </span>
      </el-dialog>
    </div>
    <!--  -->
    <div class="vehicleList_dialog">
      <el-dialog
        class="dialog1"
        title="添加账号"
        :visible.sync="addDialog"
        center
      >
        <div class="dialog_div">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="80px"
            class="dialog_ruleForm"
          >
            <el-form-item label="车辆名称" prop="number">
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
            <el-form-item label="上传图片" prop="name">
              <div class="vehicel_upload">
                <div class="public-upload-image">
                  <el-upload
                    action=""
                    list-type="picture-card"
                    multiple
                    :limit="1"
                    ref="upload_img"
                    accept=".jpg, .jpeg, .png"
                    :on-preview="handlePictureCardPreview"
                    :http-request="handleTestSuccess"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </div>
              </div>
            </el-form-item>
            <div class="dialog_div_line"></div>
          </el-form>
        </div>
        <span slot="footer">
          <div class="dialog_div_button">
            <el-button type="primary" class="dialog_but" @click="submit"
              >添加车辆</el-button
            >
            <el-button class="dialog_but1" @click="addDialog = false"
              >取消</el-button
            >
          </div>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getChannel } from "@/views/utils/api";
import { addTrain, getTrainList } from "@/views/utils/api/form-data";
let timers = null;
export default {
  data() {
    return {
      dialogVisible: false,
      addDialog: false,
      keyword: "",
      //
      ruleForm: {
        name: "",
      },
      rules: {
        account: [
          { required: true, message: "请输入车辆名称", trigger: "blur" },
        ],
      },
      vehicleData: {},
      imgarr: [],
    };
  },
  created() {
    this.$http.defaults.headers.common["token"] =  JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).token : '' 
    this.init();
  },
  methods: {
     // 呼叫
    async dialSend(item) {
      let res = await getChannel("Record/getChannel");
      if (res && res.status == 200) {
        if(!res.data.data.sn) {
          this.$message.error('房间号获取失败')
          return
        }
        localStorage.setItem('sn',res.data.data.sn)
        // let user = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : {};
        // // if(this.num <= 1) {
        //   await this.client.login({ token: null, uid: user.id.toString() });
        // }
        this.num++
        // 发送消息 text：发送内容 ，对方uid
        let obj = JSON.stringify({
          avatar: item.image,
          id: item.id,
          messageId: 1,
          name: item.number,
          role: '地面端',
          channelId: res.data.data.sn
        })
        let memberId = '1'
        localStorage.setItem('memberId',memberId)
        this.client.sendMessageToPeer({ text: obj }, "1");
        
        this.$router.push({
          path: 'emergency_video',
          query: {
            sn: res.data.data.sn
          }
        })
      } else {
        this.$message.error("sn获取失败请重试");
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
    // 获取车辆列表
    async init() {
      let res = await getTrainList({ keyword: this.keyword,line:'' });
      if (res.data.code == 1) {
        this.vehicleData = res.data.data;
      } else {
        // this.$message.error("登录失败");
      }
    },
    onchangeSer(e) {},
    //
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 添加车辆
    addVehicle() {
      this.addDialog = true;
      this.ruleForm.number = "";
    },
    handleTestSuccess(file) {
      // 验证图片格式
      if (file.file.type.indexOf("image") == -1) {
        // 文件格式
        this.$message.error("请上传图片类型的文件");
        //删除上传失败的图片，不然会占位
        this.$refs.upload_img.uploadFiles =
          this.$refs.upload_img.uploadFiles.filter((item) => {
            return file.file.name != item.name;
          });
        return;
      }
      //构建一个formData对象，因为这里要求表单类型的数据
      this.imgarr = file;
    },
    handlePictureCardPreview(file) {
      console.log(file);
    },
    // 确定添加车辆
    async submit() {
      if (!this.ruleForm.number) {
        return this.$message({
          message: "请填写车辆名称",
          type: "warning",
        });
      }
      if (!this.imgarr) {
        return this.$message({
          message: "请选择车辆照片",
          type: "warning",
        });
      }
      let res = await addTrain({
        number: this.ruleForm.number,
        image: this.imgarr.file,
      });
      if (res.data.code == 1) {
        this.addDialog = false;
        this.$refs.upload_img.uploadFiles =
          this.$refs.upload_img.uploadFiles.filter((item) => {
            return file.file.name != item.name;
          });
      } else {
        this.$message.error(res.data.msg);
        this.$refs.upload_img.uploadFiles =
          this.$refs.upload_img.uploadFiles.filter((item) => {
            return file.file.name != item.name;
          });
      }
    },
    //跳转
    // jumpVideo(item) {
    //   this.$router.push("emergency_video");
    // },
  },
};
</script>

<style lang="less">
.vehicle {
  height: 100%;
  .vehicle-header{
    padding: 40px 31px 32px 30px;
    height: 80px;
    background: #fff;
  }
  .vehicle_text {
    width: 128px;
    height: 45px;
    font-size: 21px;
    font-weight: 600;
    display: flex;
    margin-left: 5px;
  }
  .vehicle_head {
    display: flex;
    justify-content: space-between;
    .vehicle_index {
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
    .vehicle_btn {
      font-size: 24px;
      background-color: #004da1;
      color: #fff;
    }
  }
  .vehicle_list {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    margin: 20px;
    .vehicle_list_item {
      width: 220px;
      margin-right: 20px;
      margin-bottom: 20px;
      cursor: pointer;
      .vehicle_list_item_card {
        border-radius: 5%;
        text-align: left;
        .vehicle_list_item_img {
          width: 180px;
          height: 180px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .vehicle_list_item_title {
          margin-top: 15px;
          font-size: 22px;
        }
        .vehicle_list_item_role {
          margin-top: 15px;
          .item_role_img {
            width: 20px;
            height: 20px;
            margin-right: 5px;
            display: inline-block;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .vehicle_list_item_role_icon {
            font-size: 26px;
            margin-right: 15px;
          }
          .vehicle_list_item_role_text {
            font-size: 18px;
            margin-left: 5px;
          }
          .vehicle_list_item_role_text1 {
            font-size: 18px;
            margin-left: 5px;
          }
        }
      }
    }
  }
  .el-pager li {
    display: block;
    width: 40px;
    height: 40px;
  }
  .vehicle_Pagination {
    .el-pager li {
      display: inline-block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      border-radius: 8px !important;
    }
    .el-pagination .btn-next .el-icon,
    .el-pagination .btn-prev .el-icon {
      //   border: 0 !important;//////
      font-size: 40px;
      line-height: 60px;
      width: 60px;
      height: 60px;
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
  }
}
.footer {
  width: 91.1%;
  height: 80px;
  margin-left: -20px;
  background: #ffffffff;
  line-height: 80px;
  text-align: center;
  /* 方法一 */
  position: fixed;
  bottom: 0;
  padding: 0 20px;
  .vehicle_Pagination {
    margin-top: 20px;
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
  }
}
//
.vehicleList_dialog {
  .dialog {
    border-radius: 15px;
    width: 1000px;
    margin-left: 25%;
    margin-top: 100px;
    .dialog_middle {
      width: 150px;
      height: 150px;
      img {
        width: 150px;
        height: 150px;
        margin-left: 100%;
      }
    }
    .div_img {
      display: flex;
      justify-content: space-between;
    }
    .img_left {
      cursor: pointer;
      margin-left: 90px;
      width: 50px;
      height: 50px;
    }
    .img_right {
      cursor: pointer;
      width: 50px;
      height: 50px;
      margin-right: 90px;
    }
    .img_text {
      margin-top: 10px;
      margin-left: 80px;
      font-size: 16px;
    }
    .img_text1 {
      font-size: 16px;
      margin-top: 10px;
      margin-right: 80px;
    }
  }
  .dialog1 {
    width: 1200px;
    margin-left: 25%;
    margin-top: 10px;
  }
}
//

.vehicleList_dialog {
  border-radius: 15px;
  .el-dialog {
    border-radius: 10px !important;
    .el-dialog__headerbtn .el-dialog__close {
      background-color: #adadadff;
      border-radius: 50%;
      color: #ffffffff;
      padding: 2px;
    }
    .el-dialog__title {
      // margin-left: 42%;
      font-weight: 600;
    }
    .dialog_div {
      height: 300px;
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
    height: 60px !important;
  }
  .dialog_but1 {
    background-color: #fff;
  }
}
//
.vehicel_upload {
  .el-upload-list {
    width: 100px !important;
    height: 100px !important;
  }
  .upload_icon {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px solid #eee;
  }
}
.text_spot {
  font-weight: 600;
}
</style>