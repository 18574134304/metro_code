<template>
  <div>
    <div class="head">
      <el-card class="head_card">
        <div class="head_div_nr">
          <div class="head_div_select_box">
            <div class="head_div_select">
              <el-select class="head_div_select_item" placeholder="全部车号" v-model="car_number" clearable
                @change="numberChange">
                <el-option v-for="item in trainList" :key="item.id" :label="item.number" :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="head_div_select">
              <div class="head_div_select select_left">
                <el-date-picker class="headPicker" v-model="dateTime" type="date" placeholder="选择日期" @change="getData">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div>
            <el-input class="typesetting_input" size="small" placeholder="请输入内容" prefix-icon="el-icon-search icons"
              v-model="keyword" @input="searchBtn"></el-input>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 中间 -->
    <div class="middle_nr">
      <div class="middle" v-for="(arrtiem, index) in tableData.data" :key="index" @click="tiemClick(index)">
        <div :class="
          clickindex == index ? 'div_border middle_card' : 'middle_card'
        ">
          <el-card class="card_item">
            <div>
              <div class="item_head">
                <span>
                  <i :class="
                    clickindex == index
                      ? ' iconfont icon-ditie-copy head_icon2'
                      : ' iconfont icon-ditie-copy head_icon'
                  "></i>
                </span>
                <span :class="
                  clickindex == index
                    ? 'click_item_tetle item_tetle'
                    : 'item_tetle'
                ">{{ arrtiem.bout_number }}</span>
              </div>
              <div></div>
            </div>
            <div class="item_timeline" v-for="(item, indexarr) in arrtiem.trips" :key="indexarr">
              <div class="timeline_div">
                <div class="div_left">
                  <div>
                    <div :class="
                      item.color == 1 ? 'left_circular2' : 
                       item.color == 3 ? 'left_circular3':
                      'left_circular'
                    "></div>
                    <div :class="
                      indexarr == arrtiem.trips.length - 1 ? '' : 'left_line'
                    "></div>
                  </div>
                  <div class="left_size">{{ item.id }}</div>
                </div>
                <div class="div_right">{{ item.time | dateFormat }}</div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <!--底部  -->
    <div class="footer">
      <div class="drive_Pagination">
        <div class="Pagination_div" v-for="(item, index) in bottomList" :key="index">
          <div :class="index == indexs ? 'click_item' : 'div_item'" @click="itemClick(item, index)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTableListBout,
  getTrainListBout,
  trainGetTrainList,
} from "@/views/utils/api/form-data";
let timers = null;
export default {
  data() {
    return {
      clickindex: null,
      car_number: "",
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
      value: "",
      value1: "",
      input: "",
      bottomList: {},
      dateTime: "",
      trainList: [],
      keyword: "",
      timedrive: "",
      indexs: null,
      tableData: [],
      currentTime: "",
    };
  },
  created() {
    this.init();
    this.getvehicleSecond();
    this.defaultSelected();
    this.currentTime = new Date().valueOf();
  },
  mounted() { },
  methods: {
    // 默认选中
    async defaultSelected() {
      this.indexs = 0;
      // 获取辅助驾驶列表
      let res = await getTrainListBout({
        type: "all",
        time: this.timedrive,
        bout_number: "",
        table_id: 1,
        keyword: this.keyword,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.tableData = res.data.data;

        //   let cuntiem = Date.parse(new Date()) / 1000;
        //   this.tableData.data.forEach((item) => {
        //     item.idList = [];
        //     item.trips.forEach((item2, index) => {
        //       console.log(item2.time)
        //       if (item2.time.isNaN()) {
        //         if (cuntiem > item2.time) {
        //         this.$set(item2, "color", 1);
        //       } else {
        //         item.idList.push(item2.id);
        //         this.$set(item2, "color", 2);
        //         console.log(item.dis);
        //       }
        //       }
              
        //     });
        //   });
        //   this.tableData.data.forEach((item) => {
        //     item.dis = Math.min(...item.idList);
        //     item.trips.forEach((item1) => {
        //       if (item1.id == item.dis) {
        //         this.$set(item1, "color", 3);
        //       } else {
        //       }
        //     });
        //   });
        //  console.log( this.tableData.data);
        } else {
          this.tableData = {};
        }
      } else {
        this.$message.error(res.data.msg.time);
      }
    },

    // 获取车次数据
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
    // 输入框
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
    // 时间选择
    getData(val) {
      if (this.dateTime) {
        this.timedrive = Math.round(new Date(this.dateTime) / 1000);
      } else {
        this.timedrive = "";
      }
      this.init();
    },
    // 选择车号
    numberChange(vue) {
      if (vue) {
        this.car_number = vue;
      } else {
        this.car_number = "";
      }
      this.init();
    },
    // 获取底部分类数据
    async init() {
      let res = await getTableListBout({
        type: "all",
        time: this.timedrive,
        car_number: this.car_number,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.bottomList = res.data.data;
          console.log(res);
  
        } else {
          this.bottomList = {};
        }
      } else {
        this.$message.error(res.data.msg.time);
      }
    },
    // 点击底部分类项
    async itemClick(item, index) {
      this.indexs = index;
      // 获取辅助驾驶列表
      let res = await getTrainListBout({
        type: "all",
        time: this.timedrive,
        bout_number: this.car_number,
        table_id: item.id,
        keyword: this.keyword,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.tableData = res.data.data;
          // this.arrList.forEach((item) => {
          //   item.arrs = [];
          //   item.forEach((item2) => {
          //     item.arrs.push(item2.name);
          //   });
          // });
          // this.arrList.forEach((to) => {
          //   to.min = Math.min(...to.arrs);
          // });
          // this.arrList.forEach((last) => {
          //   last.forEach((last2) => {
          //     if (last.min == last2.name) {
          //       last2.color = "成了";
          //     }
          //   });
          // });
        } else {
          this.tableData = {};
        }
      } else {
        this.$message.error(res.data.msg.time);
      }
    },

    //
    // 点击加颜色
    tiemClick(index) {
      this.clickindex = index;
    },
    unixTimeToDateTime(unixtime) {
      var now = new Date(unixtime * 1000); // 依情况进行更改 * 1
      y = now.getFullYear();
      m = now.getMonth() + 1;
      d = now.getDate();
      return (
        y +
        "-" +
        (m < 10 ? "0" + m : m) +
        "-" +
        (d < 10 ? "0" + d : d) +
        " " +
        now.toTimeString().substr(0, 8)
      );
    },
  },
};
</script>

<style lang="less">
.head {
  .head_div_nr {
    display: flex;
    justify-content: space-between;

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

  .head_card {
    width: 102.1%;
    margin-top: -20px;
    margin-left: -20px;
    border-radius: 0 0 15px 15px;

    .head_div_select_box {
      display: flex;

      .head_div_select {
        width: 120px;

        .head_div_select_item {
          .el-input__inner {
            background-color: #edededff !important;
          }
        }
      }

      .select_left {
        margin-left: 20px;

        // .input__inner {
        //   background-color: #edededff !important;
        // }
        .headPicker {
          width: 140px !important;
        }
      }
    }
  }
}

.middle_nr {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;
}

.middle {
  margin-top: 20px;
  width: 555px;
  margin-left: 20px;

  .middle_card {
    .card_item {
      border-radius: 15px;

      .el-card__body {
        padding: 0 !important;
        padding-bottom: 20px;
      }

      .item_head {
        padding: 20px;

        .head_icon {
          font-size: 22px;
          color: #bcbcbe;
        }

        .head_icon2 {
          font-size: 22px;
          color: #004da1ff;
        }
      }

      .item_icon {
        background-color: #004da1ff;
      }

      .item_tetle {
        margin-left: 20px;
        font-size: 20px;
        font-weight: 600;
      }

      .item_timeline {
        margin-top: 2px;

        .timeline_div,
        .timeline_div_bgc {
          height: 50px;
          display: flex;
          justify-content: space-between;
          background-color: #f9fafbff;
          padding: 0 20px;

          .div_left {
            margin-top: 10px;
            display: flex;

            .left_circular {
              margin-top: 8px;
              width: 15px;
              height: 15px;
              border-radius: 50%;
              background-color: #bcbcbeff;
            }

            .left_line {
              width: 2px;
              height: 40px;
              background-color: #c4defeff;
              margin-left: 7px;
            }

            .left_size {
              line-height: 35px;
              font-size: 18px;
              margin-left: 20px;
              // margin-top: 3px;
              font-weight: 500;
            }
          }

          .div_right {
            line-height: 25px;
            font-size: 18px;
            font-weight: 600;
            margin-top: 15px;
          }
        }
      }
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

  .drive_Pagination {
    margin-top: 25px !important;
    display: flex;
    align-items: center;
    justify-content: center;

    .Pagination_div {
      display: flex;
      justify-content: center;

      .div_item,
      .click_item {
        cursor: pointer;
        width: 48px;
        height: 48px;
        line-height: 48px;
        background: #FFFFFF;
        border: 1px solid #D9D9D9;
        border-radius: 8px;
        margin-right: 12px;
      }

      .click_item {
        background-color: #004da1;
        color: #fff;
      }
    }
  }
}

.timeline_div_bgc {
  background-color: #fff !important;
}

//
.div_border {
  border: 2px solid #144ddfff;
  border-radius: 15px;
}

//
.div_bgc {
  background-color: #fdfeffff;
}

//
.div_click_bgc {
  background-color: #e0f0ffff;
}

.div_bottom {
  width: 100%;
  height: 20px;
}

.click_item_tetle {
  color: #004da1ff;
}

.left_circular2 {
  margin-top: 8px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #52c41a;
}

.left_circular3 {
  margin-top: 8px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: red;
}
</style>