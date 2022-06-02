<template>
  <div class="home">
    <div>
      <el-container>
        <el-header class="header_css">
          <div class="header_div">
            <div class="div_title">地铁车载信息交互可视化终端系统</div>
            <div class="title_diss">
              <el-dropdown id="pull-down">
                <span class="title_span">
                  admin
                  <i class="el-icon-arrow-right span_icon"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="logOut"
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        <el-container>
          <!--  -->
          <el-aside class="aside_css">
            <el-menu class="menu_css" :default-active="activePath" router active-text-color="#044E9C">
              <el-menu-item-group>
                <el-menu-item
                  v-if="index"
                  index="/index"
                  class="el-menu-item-css"
                  @click="saveNavStatte('/index')"
                >
                  <div>
                    <div>
                      <i class="iconfont icon-ditie home_icon"></i>
                    </div>
                    <div class="home_title">首页</div>
                  </div>
                </el-menu-item>
                <el-menu-item
                  v-if="emergency_command"
                  class="el-menu-item-css"
                  index="/vehicleList"
                  @click="saveNavStatte('/vehicleList')"
                >
                  <div>
                    <div>
                      <i class="iconfont icon-shandian-copy home_icon"></i>
                    </div>
                    <div class="home_title1">应急指挥</div>
                  </div>
                </el-menu-item>
                <el-menu-item
                  v-if="driving_og"
                  class="el-menu-item-css"
                  index="/journal"
                  @click="saveNavStatte('/journal')"
                >
                  <div>
                    <div>
                      <i class="iconfont icon-rizhi home_icon"></i>
                    </div>
                    <div class="home_title1">行车日志</div>
                  </div>
                </el-menu-item>
                <el-menu-item
                  v-if="assisted_driving"
                  class="el-menu-item-css"
                  index="/drive"
                  @click="saveNavStatte('/drive')"
                >
                  <div>
                    <div>
                      <i class="el-icon-coordinate home_icon"></i>
                    </div>
                    <div class="home_title1">辅助驾驶</div>
                  </div>
                </el-menu-item>
                <el-menu-item
                  v-if="system"
                  class="el-menu-item-css"
                  index="/system"
                  @click="saveNavStatte('/system')"
                >
                  <div>
                    <div>
                      <i class="el-icon-s-tools home_icon"></i>
                    </div>
                    <div class="home_title1">系统管理</div>
                  </div>
                </el-menu-item>
              </el-menu-item-group>
            </el-menu>
          </el-aside>
          <el-main> <router-view></router-view></el-main>
        </el-container>
      </el-container>
    </div>
     <div class="vehicleList_dialog">
      <el-dialog
        :title="`${roleInfo.name ? roleInfo.name : ''}邀请你视频通话`"
        :visible.sync="dialogVisible"
        width="30%"
        center
      >
        <div class="dialog_middle">
          <img v-if="roleInfo.avatar" :src="roleInfo.avatar" alt="" />
          <img v-else src="@/assets/index/head1.png" alt="">
        </div>
        <div class="roleInfo">
          <!-- <div class="title">CP2391283</div> -->
          <!-- <div class="box">
            <div class="info">
              <img src="../assets/user.png" alt="">
              <span>角色：司机</span>
            </div>
            <div class="info">
              <img src="../assets/path.png" alt="">
              <span>车辆段：司机</span>
            </div>
          </div> -->
        </div>
        <span slot="footer" class="dialog-footer">
          <div class="div_img">
            <div @click="answerMobile">
              <img
                class="img_left"
                src="../assets/emergency_video/dh.png"
                alt=""
                srcset=""
              />
              <div class="img_text">接听</div>
            </div>
            <div  @click="closeMobile">
              <img
                class="img_right"
                src="../assets/emergency_video/hangUp2.png"
                alt=""
                srcset=""
              />
              <div class="img_text1">挂断</div>
            </div>
          </div>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { startRecording } from "@/views/utils/api";
import { logout } from "@/views/utils/api/form-data";
export default {
  name: "Home",
  data() {
    return {
      activePath: "/index",
      index: true, //"index"
      emergency_command: true, //emergency_command
      driving_og: true, //"driving_og"
      assisted_driving: true, //"assisted_driving"
      system: true, //"system"
      // activePath: "/emergency_video",
      dialogVisible: false,
      channel: null,
      roleInfo: {},
      memberId: null,
      num: 1,
      sn: "",
      msg: {},
      user: JSON.parse(localStorage.getItem("user"))
        ? JSON.parse(localStorage.getItem("user"))
        : {},
    };
  },
  components: {
    // HelloWorld
  },
  mounted() {
    console.log(this.$route);
    this.activePath = this.$route.path
    this.client.login({ token: null, uid: this.user.id.toString() });
    this.sn = localStorage.getItem("sn");
    this.channel = this.client.createChannel("demoChannel");

    this.client.on("MessageFromPeer", (message, memberId) => {
      this.getChannelMessage(message, memberId);
    });
    let routerRole = JSON.parse(localStorage.getItem("routerRole")) ? JSON.parse(localStorage.getItem("routerRole")) : {}
    let ruoter = routerRole.purview ? routerRole.purview.role : '';
    let ruoterList = [];
    for (let key in ruoter) {
      ruoterList.push(ruoter[key]);
    }
    ruoterList.forEach((item) => {
      console.log(item, this.$data);
      this.$data[item] = true;
    });
    // let item = ruoterList[key];
    
  },
  methods: {
    // 保存链接的激活状态
    // saveNavStatte(activePath) {
    //   window.sessionStorage.setItem("activePath", activePath);
    //   this.activePath = activePath;
    // },
    async logOut() {
      let res = await logout({});
      if (res.data.code == 1) {
        this.$message.success("退出成功");
        localStorage.removeItem("user");
        localStorage.removeItem("routerRole");
        this.$router.push({ path: "/Login" });
      } else {
      }
    },
    saveNavStatte(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }, // 接受消息
    getChannelMessage(message, memberId) {
      console.log(memberId, "asd"); // 1: 呼叫 2: 拒接 3: 接听 4: 挂断 //   console.log(message, memberId,'asdasd')
      this.roleInfo = JSON.parse(message.text);
      sessionStorage.setItem('sendRoleInfo',JSON.stringify(this.roleInfo))
      console.log(this.roleInfo, "aaa");
      this.memberId = memberId + "";
      localStorage.setItem("memberId", memberId + ""); //   this.msg = JSON.parse(message)
      if (this.roleInfo.messageId == 1) {
        this.dialogVisible = true;
      }
      if (this.roleInfo.messageId == 2) {
        this.$message.info("对方拒绝接听");
        this.dialogVisible = false;
      }
      if (this.roleInfo.messageId == 4) {
        this.dialogVisible = false;
      }
    }, // 挂断电话
    async closeMobile() {
      let obj = JSON.stringify({
        messageId: 2,
        channelId: this.sn,
      });
      this.client.sendMessageToPeer({ text: obj }, this.memberId);
      this.dialogVisible = false;
    }, // 接听电话
    async answerMobile() {
      let formData = new FormData();
      formData.append("cname", this.sn);
      let obj = JSON.stringify({
        messageId: 3,
        channelId: this.sn,
      });
      this.client.sendMessageToPeer({ text: obj }, this.memberId); // this.$router.push({ //   path: 'emergency_video' // })
      let res = await startRecording("Record/record", formData);
      if (this.roleInfo.channelId) {
        this.dialogVisible = false;
        this.$router.push({
          path: "emergency_video",
          query: {
            sn: this.roleInfo.channelId,
          },
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  // height: 100vh;
  .aside_css {
    width: 120px !important;
    .el-menu-item-group__title {
      padding-top: 0 !important;
    }
  }
  .home_title {
    margin-top: -20px;
    font-size: 18px;
  }
  .home_title1 {
    margin-top: -20px;
    font-size: 18px;
  }
  .home_icon {
    font-size: 30px;
  }
}
.el-aside[data-v-fae5bece] {
  background-color: #f9f9fb;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  height: 80px!important;
  line-height: 60px;
  padding: 0px;
}

.el-aside {
  overflow: hidden;
  color: #333;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #F3F2F9;
  color: #333;
  text-align: center;
  line-height: 200px;
  height: calc(100vh - 80px);
}
.el-aside .el-menu {
  background-color: #F3F2F9;
}
.el-aside .el-menu .is-active{
  background: #DDE0F0;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  padding: 0!important;
  height: calc(100vh - 80px);
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-menu-item-css {
  height: 85px !important;
}
.el-menu-item-group__title {
  padding: 0 !important;
}
.header_css {
  height: 80px;
  .header_div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #004da1;
    align-items: center;
    .div_title {
      color: #fff;
      font-size: 20px;
      margin-left: 22px;
      .title_span {
        color: #fff !important;
        line-height: 80px;
        margin-top: 20px;
        display: inline-block;
        .span_icon {
          margin-right: 35px;
          font-size: 21px;
          color: #fff;
          margin-top: 5px;
        }
      }
    }
  }
}
.el-dropdown {
  font-size: 18px!important;
}
.menu_css {
  // width: 120px;
  // background-color: "#F9F9FB";
}
.title_diss {
  margin-right: 20px;
  cursor: pointer;
}
.el-dropdown {
  color: #fff !important;
}

.vehicleList_dialog{
  /deep/ .el-dialog__body{
.dialog_middle{
  width: 90px;
  height: 90px;
  margin: 0 auto;
  // margin-top: 72px;
  img{
    width: 90px;
    height: 90px;
  }
  }
    .roleInfo{
      margin-top: 16px;
      .title{
        text-align: center;
        margin-bottom: 12px;
      }
      .box{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff !important;
        .info{
          display: flex;
          align-items: center;
          margin-right: 16px;
          img{
            width: 17px;
            height:18px;
            margin-right: 7px;
          }
          span{
            font-size: 14px;
            color: #333333;
          }
        }
      }
    }
  }
  /deep/ .el-dialog__footer{
    margin-top: 72px;
    padding-top: 0 !important;
    .dialog_middle{
      
    }
    
    .div_img{
      display: flex;
        align-items: center;
        justify-content: space-around;
      img{
        width: 50px;
        height: 50px;
        
      }
    }
      
    }
}







.Home_dialog {
  .dialogcss {
    width: 500px !important;
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
    .dialog_middle {
      height: 200px;
      text-align: center;
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
}
</style>
