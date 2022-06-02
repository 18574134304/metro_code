<template>
  <div>
    <div class="box">
      <div class="box_title">HI，欢迎使用地铁车载信息交互可视化终端系统</div>
      <div>
        <el-card class="box_card index-card">
          <div class="box_card_item">
            <div class="box_card_item_left1">
              <div class="box_card_item_img">
                <img
                  :src="
                    (indexData.avatar&&indexData.avatar) || defaultAvatar
                  "
                  alt=""
                  srcset=""
                />
              </div>
              <div class="box_card_item_left2">
                <div class="box_card_item_left2_name">
                  {{ indexData.nickname }}
                </div>
                <div class="box_card_item_left2_content">
                  NO.{{ indexData.number }}
                </div>
              </div>
            </div>
            <div class="box_card_item_2"></div>
            <div class="box_card_item_3">
              <div class="box_card_item_3_name">
                <div class="box_card_item_3_letf">
                  <span class="box_card_item_3_letf_img">
                    <img src="../assets/index/left1.png" alt="" srcset="" />
                  </span>
                  <span>性别：{{ indexData.gender == 1 ? "男" : "女" }}</span>
                </div>
                <div class="box_card_item_3_right">
                  <span class="box_card_item_3_letf_img">
                    <img
                      src="../assets/index/left1.png"
                      alt=""
                      srcset=""
                    /> </span
                  ><span>年龄：{{ indexData.driving_age }}</span>
                </div>
              </div>

              <div class="box_card_item_3_department">
                <div class="box_card_item_3_letf">
                  <span class="box_card_item_3_letf_img">
                    <img
                      src="../assets/index/left1.png"
                      alt=""
                      srcset=""
                    /> </span
                  ><span> 部门：地勤</span>
                </div>
                <div class="box_card_item_3_right">
                  <span class="box_card_item_3_letf_img">
                    <img
                      src="../assets/index/left1.png"
                      alt=""
                      srcset=""
                    /> </span
                  ><span>备注：{{ indexData.remark }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="box_img">
        <div class="box_img_1">
          <img src="../assets/index/1.png" alt="" />
        </div>
        <div class="box_img_2">
          <img src="../assets/index/2.png" alt="" />
        </div>
        <div class="box_img_2">
          <img src="../assets/index/3.png" alt="" />
        </div>
        <div class="box_img_2">
          <img src="../assets/index/4.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserDetails } from "@/views/utils/api/form-data";
export default {
  data() {
    return {
      defaultAvatar: require('@/assets/index/head1.png'),
      indexData: {},
    };
  },
  created() {
    this.getUserDetail();
  },
  methods: {
    async getUserDetail() {
      let res = await getUserDetails({});
      if (res.data.code == 1) {
        // 存储自己uid
        localStorage.setItem("routerRole", JSON.stringify(res.data.data));
        this.indexData = res.data.data;
      } else {
        // this.$message.error("登录失败");
      }
    },
  },
};
</script>

<style lang="less">
.box {
  background-color: #eee;
  .box_title {
    font-size: 21px;
    color: #333;
    font-weight: 600;
  }
  .box_card {
    margin-top: 20px;
    border-radius: 15px !important;
    padding: 30px;
    .box_card_item {
      display: flex;
      align-items: center;
       font-size: 26px;
      font-weight: 500;
      .box_card_item_left1 {
        display: flex;
        align-items: center;
        .box_card_item_img {
          width: 150px;
          height:150px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .box_card_item_left2 {
          display: flex;
          flex-direction: column;
          margin-left: 24px;
          font-size: #333;
          height:150px;
          justify-content: space-around;
          // .box_card_item_left2_name {
          //   margin-top: 10px;
          // }
          // .box_card_item_left2_content {
          //   margin-top: 50px;
          // }
        }
      }

      .box_card_item_2 {
        margin-left: 150px;
        margin-right: 120px;
        height: 100px;
        width: 2px;
        background-color: #f4f4f4;
      }
      .box_card_item_3 {
        padding: 50px 0;
        .box_card_item_3_name,
        .box_card_item_3_department {
          display: flex;
          align-items: center;
          font-size: 16px;
          .box_card_item_3_letf {
            width: 150px;
            .box_card_item_3_letf_img {
              margin-right: 4px;
              display: inline-block;
              width: 14px !important;
              height: 14px !important;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .box_card_item_3_right {
            width: 150px;
            margin-left: 80px;
            .box_card_item_3_letf_img {
              margin-right: 4px;
              display: inline-block;
              width: 14px !important;
              height: 14px !important;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .box_card_item_3_department {
          margin-top: 30px;
        }
      }
    }
  }

  .box_img {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    div{
      width: 23%;
        height: 164px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    // .box_img_1,
    // .box_img_2 {
    //   //   width: 25%;
    //   width: 400px;
    //   height: 164px;
    //   img {
    //     width: 100%;
    //     height: 100%;
    //   }
    // }
  }
}
</style>