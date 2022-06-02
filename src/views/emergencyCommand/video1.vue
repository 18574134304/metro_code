<template>
  <div class="box">
    <div class="videos">
      <div class="videos_card">
        <el-card class="card_border">
          <div class="card_time">00.10</div>
          <div class="card_headPortrait">
            <div class="headPortrait_img">
              <img src="../../assets/emergency_video/headPortrait.png" alt="" />
            </div>
          </div>
          <div class="card_exhibition"></div>
          <div class="card_operation">
            <div class="operation">
              <div class="operation_item">
                <div class="operation_item_div">
                  <img
                    src="../../assets/emergency_video/audio1.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="operation_item-text">打开音频</div>
              </div>

              <div class="operation_item">
                <div class="operation_item_video">
                  <img
                    src="../../assets/emergency_video/video1.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="operation_item-text">打开视频</div>
              </div>
              <div class="operation_item">
                <div class="operation_item_video">
                  <img
                    src="../../assets/emergency_video/share2.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="operation_item-text">共享屏幕</div>
              </div>
              <div class="operation_item">
                <div class="operation_item_video">
                  <img
                    src="../../assets/emergency_video/putAway1.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="operation_item-text text-putAway">收起</div>
              </div>
              <div class="operation_item">
                <div class="operation_item_hangUp">
                  <img
                    src="../../assets/emergency_video/hangUp1.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="operation_item-text text-hangUp">挂断</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="arrow" v-if="!open">
        <i
          class="el-icon-d-arrow-left arrow_icon"
          @click="rightSidebarOpen"
        ></i>
      </div>
      <!-- 右侧弹框 -->
      <div v-if="open" class="drawer_box">
        <el-drawer
          class="drawer_box_drawer"
          title="房间用户"
          :visible.sync="drawer"
          size="90%"
          :modal="false"
          :before-close="manualClose"
        >
          <!--  -->
          <div class="drawer_box_drawer_card">
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

            <div class="drawer_box_drawer_card">
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
            <div class="drawer_box_drawer_card">
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
            <div class="drawer_box_drawer_card">
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

          <!--  -->
          <div class="el_drawer_right">
            <i class="el-icon-d-arrow-right" @click="rightSidebarClose">
            </i>
          </div>
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false, //抽屉
      open: false, //展开
      close: false, //关闭
    };
  },
  methods: {
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
  },
};
</script>

<style lang="less">
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
        text-align: center;
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
        padding: 0 100px;
        .operation {
          display: flex;
          justify-content: space-around;
          .operation_item {
            width: 100px;
            height: 100px;
            font-size: 18px;
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
</style>