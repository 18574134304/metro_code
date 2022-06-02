<template>
  <div class="box">
    <!-- <div class="host-name">测试房间名字 </div> -->
    <div class="videos">
      <div class="videos_card">
        <el-card class="card_border">
          <div class="video-content">
            <div class="video-screen">
            </div>
            <div class="video-list" ref="videoList">
              <div v-for="item in rtc.remoteUser" :key="item.uid" :class="'u'+item.uid">
                <div class="close-video-user">
                  <template v-if="config.uid == item.uid">
                      <img :src="users.avatar || defaultAvatar" />
                      <span>{{users.nickname || ''}}</span>
                  <!-- <span v-if="config.uid == item.uid">(自己)</span> -->
                  </template>
                  <template v-else>
                    <img :src="sendRoleInfo.avatar || defaultAvatar" />
                    <span>{{sendRoleInfo.name || ''}}</span>
                  </template>
                  
                </div>
                <div
                  v-if="item._videoTrack"
                  class="user-video"
                  :class="'user-video-' + item.uid"
                >
                  <!-- <i class="el-icon-full-screen open-full-screen" @click="aa(item)"></i> -->
                </div>
              </div>
            </div>
          </div>
          <div class="card_operation">
            <div class="operation">
              <div class="operation_item" @click="openAudio">
                <div class="operation_item_div">
                  <img
                    src="../../assets/emergency_video/audio1.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="operation_item-text">
                  {{
                    userInfo && userInfo._AudioTrack ? "关闭音频" : "打开音频"
                  }}
                </div>
              </div>

              <div class="operation_item" @click="openVideo">
                <div class="operation_item_video">
                  <img
                    src="../../assets/emergency_video/video1.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="operation_item-text">
                  {{
                    userInfo && userInfo._videoTrack ? "关闭视频" : "打开视频"
                  }}
                </div>
              </div>
              <div class="operation_item" @click="openScreen">
                <div class="operation_item_video">
                  <img
                    src="../../assets/emergency_video/share2.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="operation_item-text">共享屏幕</div>
              </div>
              <!-- <div class="operation_item">
                <div class="operation_item_video">
                  <img
                    src="../../assets/emergency_video/putAway1.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="operation_item-text text-putAway">收起</div>
              </div> -->
              <div class="operation_item" @click="exit">
                <div class="operation_item_hangUp">
                  <img
                    src="../../assets/emergency_video/hangUp1.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div
                  style="margin-top: 2px"
                  class="operation_item-text text-hangUp"
                >
                  挂断
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <!-- <div class="arrow" v-if="!open">
        <i
          class="el-icon-d-arrow-left arrow_icon"
          @click="rightSidebarOpen"
        ></i>
      </div>
      <div v-if="open" class="drawer_box">
        <el-drawer
          class="drawer_box_drawer"
          title="房间用户"
          :visible.sync="drawer"
          size="90%"
          :modal="false"
          :before-close="manualClose"
        >
          <div class="drawer_box_drawer_card" v-for="item in 3" :key="item">
            <el-card class="drawer_box_drawer_card_item">
              <div style="display: flex">
                <div class="drawer_box_drawer_card_item_head">
                  <img
                    src="../../assets/emergency_video/headPortrait.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="drawer_box_drawer_card_item_name">
                  <div>王五</div>
                  <div>2022:05 07</div>
                </div>
              </div>
            </el-card>
          </div>
          <div class="el_drawer_right">
            <i class="el-icon-d-arrow-right" @click="rightSidebarClose"> </i>
          </div>
        </el-drawer>
      </div> -->
    </div>
    <div class="full-screen" v-if="fullScreen">
      <i class="el-icon-circle-close close-icon" @click="fullScreen=false"></i>
    </div>
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk-ng";
import { endRecording } from "@/views/utils/api";

export default {
  data() {
    return {
      drawer: false, //抽屉
      open: false, //展开
      close: false, //关闭
      rtc: {
        remoteUser: [],
        screenClient: null, //屏幕共享实例
        client: null, // AgoraRTC实例
        localAudioTrack: null, // 本地音频
        localVideoTrack: null, //本地视频
        localScreenTrack: null, //屏幕共享
      },
      avatar: require("../../assets/emergency_video/headPortrait.png"),
      // 屏幕共享id
      screenUid: 999999998,
      config: {
        appId: "36bfd34ea5ac412d98fd7a4e173ee27a",
        token: null,
        channel: "",
        uid: "",
      },
      // 全屏
      fullScreen: false,
      fullScreenData: null,
      sendRoleInfo: {},
      users:  {},
      defaultAvatar: require('@/assets/index/head1.png')
    };
  },
  mounted() {
    let user = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : {};
    this.users = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : {};
    this.sendRoleInfo = JSON.parse(sessionStorage.getItem("sendRoleInfo")) ? JSON.parse(sessionStorage.getItem("sendRoleInfo")) : {};
    this.config.uid = user.id
    console.log(this.$route,'aaa')
    // if(this.$route.query.sn) {
      this.config.channel = this.$route.query.sn
      // 生成六位密码
      // for (let i = 0; i < 6; i++) {
      //   this.config.uid += Math.floor(Math.random() * 10);
      // }
      this.$nextTick(async (_) => {
        AgoraRTC.getMicrophones().then(res=>{
          this.init();
        }).catch(e=>{
          this.$alert('请检查是否打开麦克风权限', '提示',{
            confirmButtonText: '确定',
            type: 'error',
            callback: action => {
              this.$router.back()
            }
          });
        })
      });
      this.channel = this.client.createChannel("demoChannel");

      this.client.on("MessageFromPeer", (message, memberId) => {
      this.getChannelMessage(message, memberId);
    });
    // }
    
  },
  methods: {
    aa(data){
      this.fullScreen = true
      this.fullScreenData = data
      this.$nextTick(_=>{
        let videoElement = document.querySelector('.full-screen')
        let currentVideoTrack = data.videoTrack
        currentVideoTrack.play(videoElement)
      })
      
    },
    // 右侧边栏展开
    rightSidebarOpen() {
      this.$nextTick(() => {
        this.drawer = true;
        this.open = true;
      });
    },
    // 右侧边栏关闭
    rightSidebarClose() {
      this.$nextTick(() => {
        this.drawer = false;
        this.open = false;
      });
    },
    // 右侧边栏手动关闭
    manualClose() {
      this.$nextTick(() => {
        this.drawer = false;
        this.open = false;
      });
    },
    // 打开音频
    async openAudio() {
      let res = this.rtc.remoteUser.find(
        (item) => item.uid === this.config.uid
      );
      if (!res._AudioTrack) {
        res._AudioTrack = true;
        this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await this.rtc.client.publish(this.rtc.localAudioTrack);
      } else {
        this.rtc.localAudioTrack.stop();
        this.rtc.localAudioTrack.close();
        this.rtc.client.unpublish(this.rtc.localAudioTrack);
        res._AudioTrack = false;
      }
    },
    // 打开视频
    async openVideo() {
      let res = this.rtc.remoteUser.find(
        (item) => item.uid === this.config.uid
      );
      if (!res._videoTrack) {
        res._videoTrack = true;
        this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        await this.rtc.client.publish(this.rtc.localVideoTrack);
        this.$nextTick((_) => {
          let videoTrack = document.querySelector(
            `.user-video-${this.config.uid}`
          );
          this.rtc.localVideoTrack.play(videoTrack);
        });
      } else {
        this.rtc.localVideoTrack.close();
        this.rtc.client.unpublish(this.rtc.localVideoTrack);
        res._videoTrack = false;
      }
    },
    // 打开屏幕共享
    async openScreen() {
      console.log(this.rtc)
      if(this.rtc.localScreenTrack) return
      if(!this.rtc.screenClient) await this.initScreen()
      this.rtc.localScreenTrack = await AgoraRTC.createScreenVideoTrack(
        {
          encoderConfig: {
            framerate: 15,
            height: 720,
            width: 1280,
          },
        },
        "auto"
      );
      await this.rtc.screenClient.publish(this.rtc.localScreenTrack);
      this.$nextTick((_) => {
          let screenTrack = document.querySelector('.video-screen');
          screenTrack.innerHTML = ''
          this.rtc.localScreenTrack.play(screenTrack);
          let remoteUser = this.rtc.client.remoteUsers.find(item=> item.uid!=this.screenUid && item.uid!=this.config.uid)
          console.log('哈哈哈',remoteUser,this.rtc.client.remoteUsers,this.rtc.remoteUser)
          if(remoteUser && remoteUser._videoTrack){
            console.log(remoteUser,this.rtc.client)
            const remotePlayerContainer = document.createElement("div");
            const remoteVideoTrack = remoteUser.videoTrack;
            let videoTrack = document.querySelector(`.user-video-${remoteUser.uid}`);
            console.log(videoTrack, 222222);
            let _this = this
            let iconElement = document.createElement('i')
            iconElement.classList = 'el-icon-full-screen open-full-screen'
            iconElement.style.position = 'absolute'
            iconElement.style.bottom = '2px'
            iconElement.style.right = '2px'
            iconElement.style.color = '#fff'
            iconElement.style.fontSize = '36px'
              iconElement.style.width = '100%'
              iconElement.style.textAlign = 'right'
              iconElement.style.backgroundColor = 'rgba(0,0,0,0.2)'
            iconElement.onclick = _this.aa.bind(_this,remoteUser)
            console.log(iconElement);
            remotePlayerContainer.style.width = "200px";
            remotePlayerContainer.style.height = "150px";
            videoTrack.innerHTML = "";
            videoTrack.append(remotePlayerContainer);
            videoTrack.appendChild(iconElement)
            remoteVideoTrack.play(remotePlayerContainer);
          }
        });
      this.rtc.localScreenTrack.on('track-ended',async ()=>{
        this.rtc.localScreenTrack.close()
        this.rtc.localScreenTrack.stop()
        this.rtc.screenClient.leave()
        this.fullScreen = false
        this.rtc.localScreenTrack = undefined
        this.rtc.screenClient = undefined
        await this.initScreen()
        let screenTrack = document.querySelector(".video-screen");
        screenTrack.innerHTML = ''
        let remoteUser = this.rtc.client.remoteUsers.find(item=>item.uid!=this.config.uid)
        if(remoteUser && remoteUser._videoTrack){
          let videoBox = document.querySelector(`.user-video-${remoteUser.uid}`);
          let videoTrack = document.querySelector(`.video-screen`);
          const remotePlayerContainer = document.createElement("div");
          const remoteVideoTrack = remoteUser.videoTrack;
          // videoBox.style.width = "0px";
          // videoBox.style.height = "0px";
          videoBox.innerHTML = ''
          remotePlayerContainer.style.width = "100%";
          remotePlayerContainer.style.height = "100%";
          videoTrack.append(remotePlayerContainer);
          remoteVideoTrack.play(remotePlayerContainer);
        }
      })
    },
    // 创建音频用户
    createAudio() {},

    // 挂掉
    async exit() {
      // console.log()
      //  return
      this.rtc.localAudioTrack && this.rtc.localAudioTrack.close();
      this.rtc.localVideoTrack && this.rtc.localVideoTrack.close();
      this.rtc.localScreenTrack && this.rtc.localScreenTrack.close();
      await this.rtc.client.leave();
      await this.rtc.screenClient.leave();
      // this.$router.replace('/vehicleList')
      // window.location.href = window.location.origin + '/#/vehicleList' 
      let formData = new FormData();
      formData.append("cname", this.config.channel);
      let obj = JSON.stringify({
        messageId: 4,
        channelId: this.config.channel
      })
      await endRecording('Record/stop',formData)
      let params = JSON.stringify({
          messageId: 4,
          channelId: this.config.channel
        })
      let memberId = localStorage.getItem('memberId')
      await this.client.sendMessageToPeer({ text: params }, memberId);
      window.location.replace(window.location.origin + '/#/vehicleList')
    },
    getIser() {
      console.log(this.rtc.remoteUser);
      console.log(this.rtc.client,this.rtc.client.remoteUsers);
    },
    // 初始化
    async init() {
      // 创建实例
      this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      let user = {
        uid: this.config.uid,
        // 未开视频
        _videoTrack: undefined,
        // 未开屏幕共享
        _screenTrack: undefined,
        _AudioTrack: true
      };
      this.rtc.remoteUser = [...this.rtc.client.remoteUsers, user];
      // 监听远端用户订阅 视频 音频
      this.rtc.client.on("user-published", async (user, mediaType) => {
        console.log("来了", 111, user, mediaType);
        if(user.uid==this.screenUid) return
        console.log("触发订阅", 111, user, mediaType);
        // 订阅远端用户音视频流
        await this.rtc.client.subscribe(user, mediaType);
        
        let result = this.rtc.remoteUser.find(item=>item.uid==user.uid)
        if(result!==-1){
          let newUser = {
            uid: user.uid.toString(),
            // 未开视频
            _videoTrack: undefined,
            _screenTrack: undefined,
            _AudioTrack: true,
            videoTrack: undefined
          };
          this.rtc.remoteUser.push(newUser);
        }
        
        const remotePlayerContainer = document.createElement("div");
        // 如果是视频流， 添加到视频列表 ， 并播放
        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack;
          let res = this.rtc.remoteUser.find((item) => item.uid == user.uid);
          console.log(res,user,this.rtc.remoteUser,'1111')
          res._videoTrack = true;
          res.videoTrack = user.videoTrack;
          this.$nextTick((_) => {
            let videoTrack = document.querySelector(`.video-screen`);
            console.log(videoTrack, 222222);
            remotePlayerContainer.style.width = "100%";
            remotePlayerContainer.style.height = "100%";
            videoTrack.innerHTML = "";
            videoTrack.append(remotePlayerContainer);
            remoteVideoTrack.play(remotePlayerContainer);
          });
        }
        // 如果是音频流， 添加用户头像昵称 ， 并播放
        if (mediaType === "audio") {
          user.audioTrack.play();
          let res = this.rtc.remoteUser.find((item) => item.uid == user.uid);
          res._AudioTrack = true;
          // console.log('音频； ',newUser,user,this.rtc.remoteUser);
        }
      });
      // 监听远端用户离开音视频频道
      this.rtc.client.on("user-unpublished", async (user, mediaType) => {
        if(user.uid==this.screenUid) return
        console.log("触发了退出", 111, user, mediaType);
        await this.rtc.client.unsubscribe(user, mediaType);
        let index = this.rtc.remoteUser.findIndex(
          (item) => item.uid == user.uid
        );
        let unUser = this.rtc.remoteUser[index];
        if(unUser) {
          if (mediaType === "video") {
            unUser._videoTrack = false;
          }
          if (mediaType === "audio") {
            unUser._AudioTrack = false;
          }
          let channelUser = this.rtc.client.remoteUsers.find(item=>item.uid==unUser.uid)
          if (!channelUser) {
            this.rtc.remoteUser.splice(index, 1);
          }
        }
        console.log(user,this.rtc.remoteUser,unUser,this.rtc.client.remoteUsers)
      });

      
      await this.rtc.client.join(
        this.config.appId,
        this.config.channel,
        this.config.token,
        this.config.uid
      );
      // 默认进来创建音频通道
      this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await this.rtc.client.publish([this.rtc.localAudioTrack]);

      // 创建 || 连接频道
      // await this.rtc.client.join(
      //   this.config.appId,
      //   this.config.channel,
      //   this.config.token,
      //   this.config.uid
      // );
      // // 默认进来创建音频通道
      // this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // await this.rtc.client.publish([this.rtc.localAudioTrack]);
      // let user = {
      //   uid: this.config.uid,
      //   // 未开视频
      //   _videoTrack: undefined,
      //   // 未开屏幕共享
      //   _screenTrack: undefined,
      //   _AudioTrack: true,
      // };
      // this.rtc.remoteUser = [...this.rtc.client.remoteUsers, user];
      console.log("用户列表", this.rtc.remoteUser, 111);

      this.initScreen()
      
    },
    async initScreen(){
      // 创建屏幕共享
      this.rtc.screenClient = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });
      await this.rtc.screenClient.join(
        this.config.appId,
        this.config.channel,
        this.config.token,
        this.screenUid
      );
      // 监听远端用户订阅 屏幕共享
      this.rtc.screenClient.on("user-published", async (user, mediaType) => {
        console.log('触发了屏幕共享',user,mediaType);
        if(user.uid!=this.screenUid) return
        // 订阅远端用户音视频流
        await this.rtc.screenClient.subscribe(user, mediaType);
        const remotePlayerContainer = document.createElement("div");
        if (mediaType === "video") {
          const remoteScreenTrack = user.videoTrack;
          let res = this.rtc.remoteUser.find((item) => item.uid === user.uid);
          console.log("触发订阅", user);
          if(res) res._screenTrack = true;
          this.$nextTick((_) => {
            let screenTrack = document.querySelector(".video-screen");
            remotePlayerContainer.style.width = "100%";
            remotePlayerContainer.style.height = "100%";
            screenTrack.innerHTML = "";
            screenTrack.append(remotePlayerContainer);
            remoteScreenTrack.play(remotePlayerContainer);
          });
        }
      });

      this.rtc.screenClient.on("user-unpublished", async (user, mediaType) => {
        if(user.uid!=this.screenUid) return
        let screenTrack = document.querySelector(".video-screen");
        screenTrack.innerHTML = ''
        this.rtc.screenClient.unsubscribe(user);
      });

      // 终止屏幕共享
    },

    // 监听挂断电话
    getChannelMessage(message, memberId) {
      // 1: 呼叫 2: 拒接 3: 接听 4: 挂断
    //   console.log(message, memberId,'asdasd')
      let roleInfo = JSON.parse(message.text)
      if(roleInfo.messageId == 4) {
        this.exit()
      }
      
    },
  },
  // async beforeDestroy(){
  //   await this.exit()
  // },
  // beforeRouteLeave(to,form,next){
  //   this.exit()
  //   next()
  // },
  watch: {
    "rtc.remoteUser": {
      handler() {
        console.log("触发用户数组更新", 111);
        this.$forceUpdate();
      },
      deep: true,
    },
    fullScreen(newVal){
      if(!newVal) {
        this.$nextTick((_) => {
          let remoteUser = this.rtc.client.remoteUsers.find(item=> item.uid==this.fullScreenData.uid)
          console.log(this.fullScreenData,remoteUser,this.rtc.client.remoteUsers);
          if(remoteUser){
            if(remoteUser._videoTrack){
              const remotePlayerContainer = document.createElement("div");
              const remoteVideoTrack = this.fullScreenData.videoTrack;
              let videoTrack = document.querySelector(`.user-video-${remoteUser.uid}`);
              let _this = this
              let iconElement = document.createElement('i')
              iconElement.classList = 'el-icon-full-screen open-full-screen'
              iconElement.style.position = 'absolute'
              iconElement.style.bottom = '2px'
              iconElement.style.right = '2px'
              iconElement.style.color = '#fff'
              iconElement.style.fontSize = '36px'
              iconElement.style.width = '100%'
              iconElement.style.textAlign = 'right'
              iconElement.style.backgroundColor = 'rgba(0,0,0,0.2)'
              iconElement.onclick = _this.aa.bind(_this,remoteUser)
              remotePlayerContainer.style.width = "200px";
              remotePlayerContainer.style.height = "150px";
              videoTrack.innerHTML = "";
              videoTrack.append(remotePlayerContainer);
              videoTrack.appendChild(iconElement)
              remoteVideoTrack.play(remotePlayerContainer);
            }
          }
          
        });
      }
    }
  },
  computed: {
    userInfo() {
      let res = null;
      if (this.rtc.remoteUser && this.rtc.remoteUser.length) {
        res = this.rtc.remoteUser.find((item) => item.uid === this.config.uid);
      }
      return res;
    },
  },
};
</script>

<style lang="less" scoped>
.host-name {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  width: calc(100% - 200px)
}
.videos {
  width: 99%;
  display: flex;
  .arrow {
    width: 0%;
    margin-top: 45vh;
    cursor: pointer;
    .arrow_icon {
      font-size: 25px;
    }
  }
  .videos_card {
    flex: 1;
    .card_border {
      border-radius: 15px !important;
      .card_time {
        height: 5%;
      }
      .card_headPortrait {
        display: flex;
        justify-content: flex-end;
        margin-right: 30px;
        .headPortrait_img {
          width: 115px;
          height: 115px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
        }
      }
      .card_exhibition {
        width: 100%;
        height: 50vh;
      }

      .card_operation {
        padding: 10px 200px 0 100px;
        .operation {
          display: flex;
          justify-content: space-around;
          align-items: center;
          .operation_item {
            width: 100px;
            height: 100px;
            font-size: 18px;
            text-align: center;
            .operation_item_div,
            .operation_item_video,
            .operation_item_hangUp {
              cursor: pointer;
              margin-left: 35px;
              width: 26px;
              height: 35px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .operation_item_video {
              width: 37px;
              height: 35px;
            }
            .operation_item_hangUp {
              width: 46px;
              height: 46px;
            }
          }
          .operation_item-text {
            margin-top: 10px;
          }
          .text-putAway {
            margin-left: 5px;
          }
          .text-hangUp {
            margin-left: 15px;
          }
        }
      }
    }
  }
  .drawer_box {
    width: 30%;
    position: relative;
    overflow: hidden;
    .drawer_box_drawer {
      position: absolute;
    }
    .drawer_box_drawer_card {
      width: 100%;
      margin-top: 5px;
    }
    .drawer_box_drawer_card_item {
      border-radius: 15px;
      margin-left: 28px;
      .drawer_box_drawer_card_item_head {
        width: 50px;
        height: 50px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .drawer_box_drawer_card_item_name {
        font-size: 18px;
        text-align: left;
        margin-left: 20px;
      }
    }
    .el_drawer_right {
      cursor: pointer;
      z-index: 99999;
      font-size: 25px;
      margin-left: -10px;
      position: absolute;
      top: 55%;
      left: 8%;
      transform: translate(-50%, -50%);
    }
  }
}

.video-content {
  display: flex;
  .video-screen {
    position: relative;
    flex: 1;
    background-color: #fff;
  }
  .video-list {
    margin-left: 10px;
    width: 200px;
    height: calc(100vh - 260px);
    overflow: hidden auto;
    .close-video-user {
      text-align: left;
      margin: 5px 0;
      img {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
      }
      span {
        color: #666;
      }
    }
    .user-video {
      position: relative;
      width: 200px;
      height: 150px;
      margin-bottom: 10px;
      // .open-full-screen{
      //   position: absolute;
      //   bottom: 2px;
      //   right: 2px;
      //   color: red;
      //   font-size: 32px;
      // }
    }
    .user-video:last-child {
      margin-bottom: 0;
    }
  }
}
.full-screen{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 36px;
    color: #fff;
    z-index: 1000;
  }
}
</style>