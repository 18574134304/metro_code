<template>
  <div class="box">
    <div class="head">
      <el-card class="head_card">
        <el-tabs class="head_tabs" v-model="activeName">
          <el-tab-pane label="电子故障单" name="inspection">
            <div class="head_tabs_nr">
              <div class="head_tabs_select_box">
                <div class="head_tabs_select">
                  <el-select
                    class="head_tabs_select_item"
                    placeholder="全部车号"
                    v-model="train_id"
                    @change="headTabsChange"
                    clearable
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
                <div class="head_tabs_select head_tabs_select_left">
                  <el-select
                    class="head_tabs_select_item"
                    placeholder="全部司机"
                    v-model="driver_id"
                    @change="dreverIdChange"
                    clearable
                  >
                    <el-option
                      v-for="item in driverList"
                      :key="item.id"
                      :label="item.nickname"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="head_tabs_select head_tabs_select_left">
                  <el-select
                    class="head_tabs_select_item"
                    placeholder="全部类型"
                    v-model="type"
                    clearable
                    @change="typeChange"
                  >
                    <el-option
                      v-for="item in typeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="head_tabs_select head_tabs_select_left">
                  <el-date-picker
                    class="headPicker"
                    v-model="dateTime"
                    type="date"
                    placeholder="选择日期"
                    @change="getData"
                  >
                  </el-date-picker>
                </div>
              </div>
              <div>
                <el-input
                  class="journal_input"
                  size="small"
                  placeholder="搜索"
                  prefix-icon="el-icon-search icons"
                  v-model="keyword"
                  @input="searchBtn"
                ></el-input>
              </div>
            </div>
            <div class="head_tabs_middle">
              <div class="middle_card">
                <div
                  class="card_box"
                  v-for="(item, index) in dataList"
                  :key="index"
                >
                  <el-card class="box_item journal-card">
                    <div class="box_item">
                      <div class="box_item_1">
                        <div class="journal-tag">
                          <div class="tag"
                          :class="item.status == 'normal'
                                ? ''
                                : item.status == 'repair'
                                ? 'warning'
                                : item.status == 'repaired'
                                ? 'info'
                                : item.status == 'finish'
                                ? 'success'
                                : 'danger'"
                          >
                            {{
                              item.status == "normal"
                                ? "正常"
                                : item.status == "repair"
                                ? "待维修"
                                : item.status == "repaired"
                                ? "已维修"
                                : item.status == "finish"
                                ? "已完成"
                                : "未知"
                            }}
                          </div>
                        </div>
                          <el-checkbox
                            v-model="item.radio"
                            @change="selectedItem(item)"
                          ></el-checkbox>
                      </div>
                      <div class="box_item_2">
                        <div>{{ item.train.number }}</div>
                        <div class="box_item_2_div">
                          报修时间：{{ item.repair_time | dateFormat }}
                        </div>
                      </div>
                      <div class="box_item_2">
                        <div style="display:flex;align-items:center;">
                          <span class="item_2_img">
                            <img
                              src="../../assets/journal/1.png"
                              alt=""
                              srcset=""
                          /></span>
                          <span> 角色：司机 {{ item.driver.nickname }}</span>
                        </div>
                        <div class="box_item_2_div" style="display:flex;align-items:center;">
                          <span class="item_2_img">
                            <img
                              src="../../assets/journal/2.png"
                              alt=""
                              srcset=""
                          /></span>
                          <span
                            >车辆段：{{ item.car_segment | dateFormat }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </el-card>
                  <div class="box_item_bottom">
                    <div style="display: flex;">
                      <div v-if="item.recording" class="i-box">
                          <img
                            src="../../assets/journal/3.png"
                          />
                        <span class="item_2_text">语音</span></div
                      >
                      <div v-if="item.video" class="i-box">
                          <img
                            src="../../assets/journal/4.png"
                          />
                        <span class="item_2_text">视频</span></div
                      >
                    </div>
                    <div class="bottom_right" @click="detailInfoClick(item.id)">
                      详情 <i class="el-icon-arrow-right dialog_div_icon"></i>
                    </div>
                  </div>
                </div>
                <div class="box_item_middle"></div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!--底部  -->
    <div class="jour-footer">
      <div class="footer_box">
        <div>
          <el-checkbox @change="changeRadio" v-model="single" size="medium"
            >全选</el-checkbox
          >
        </div>
        <div>
          <div class="footer_box_but">
            <el-button class="box_but_css" @click="deleteBut">删除</el-button>
            <el-button class="box_but_css" @click="importBut" type="primary"
              >导入</el-button
            >
            <el-button class="box_but_css" @abort="exportBue" type="primary"
              >导出</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <div class="box_dialog">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="centerDialogVisible"
        center
      >
        <div>
          <div class="dialog_div">
            <div class="dialog_div_title">车号</div>
            <div class="dialog_div_content">
              <div class="content_input">
                <el-select
                  v-model="fromData.train_id"
                  class="select input_select"
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
              <div><i class="el-icon-arrow-right dialog_div_icon"></i></div>
            </div>
          </div>
          <div class="dialog_div_line"></div>
          <div class="dialog_div">
            <div class="dialog_div_title">操作车号</div>
            <div class="dialog_div_content">
              <div class="content_input">
                <el-input
                  v-model="fromData.number"
                  placeholder="请输入车号"
                ></el-input>
              </div>
              <div><i class="el-icon-arrow-right dialog_div_icon"></i></div>
            </div>
          </div>
          <div class="dialog_div_line"></div>
          <div class="dialog_div">
            <div class="dialog_div_title">司机</div>
            <div class="dialog_div_content">
              <div class="content_input">
                <el-select
                  class="select input_select"
                  v-model="fromData.driver_id"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in driverList"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <div><i class="el-icon-arrow-right dialog_div_icon"></i></div>
            </div>
          </div>
          <div class="dialog_div_line"></div>
          <div class="dialog_div">
            <div class="dialog_div_title">报修时间</div>
            <div class="dialog_div_content">
              <div class="content_time">
                <el-date-picker
                  v-model="fromData.repair_time"
                  type="datetime"
                  placeholder="选择日期时间"
                  prefix-icon="0"
                  :clearable="false"
                >
                </el-date-picker>
              </div>
              <div><i class="el-icon-arrow-right dialog_div_icon"></i></div>
            </div>
          </div>
          <div class="dialog_div_line"></div>
          <div class="dialog_div">
            <div class="dialog_div_title">报修部门</div>
            <div class="dialog_div_content">
              <div class="content_input">
                <el-select
                  class="select"
                  v-model="fromData.department_id"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in departmentLinst"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div><i class="el-icon-arrow-right dialog_div_icon"></i></div>
            </div>
          </div>
          <div class="dialog_div_line"></div>
          <div class="dialog_div_report">
            <div class="dialog_div_title">报修描述</div>
            <div class="report_textarea">
              <el-input
                placeholder="报修信息"
                class="textarea"
                type="textarea"
                v-model="fromData.describe"
                maxlength="50"
                @input="checkSize"
              ></el-input>
              <div class="textarea_num">{{ fromData.describe.length || 0 }}/50</div>
            </div>
          </div>
          <div class="dialog_div_line">
            <!-- recording -->
          </div>
          <div class="dialog_div playcss">
            <div class="dialog_div_title">语音</div>
            <div
              @click="playClick('语音')"
              class="dialog_div_content"
              v-if="dataList.recordingList"
            >
              <div
                class="content_input"
                v-for="(recording, indexrecording) in dataList.recordingList"
                :key="indexrecording"
              >
                <div class="input_voice">
                  <div class="voice_css">
                    <div class="css_img">
                      <img
                        src="../../assets/journal/huatong.png"
                        alt=""
                        srcset=""
                      />
                    </div>
                    <div class="css_font">28 s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog_div_line">
            <!-- video -->
          </div>
          <div class="dialog_div">
            <div class="dialog_div_title">视频</div>
            <div class="dialog_div_content" v-if="dataList.videoList">
              <div
                @click="playClick('视频')"
                class="content_input"
                v-for="(video, indexvideo) in dataList.videoList"
                :key="indexvideo"
              >
                <div class="input_voice">
                  <div class="voice_css">
                    <div class="css_img1">
                      <img
                        src="../../assets/journal/luxing.png"
                        alt=""
                        srcset=""
                      />
                    </div>
                    <div class="css_font">28 s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog_div_line">
            <!-- images -->
          </div>
          <div class="dialog_div">
            <div class="dialog_div_title">图片</div>
            <div class="dialog_div_content" v-if="dataList.imagesList">
              <div
                @click="playClick('图片')"
                class="content_input"
                v-for="(images, indeximages) in dataList.images"
                :key="indeximages"
              >
                <div class="input_voice">
                  <div class="voice_css">
                    <div class="css_img1">
                      <img
                        src="../../assets/journal/zhaoxing.png"
                        alt=""
                        srcset=""
                      />
                    </div>
                    <div class="css_font">28 s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog_div_line"></div>
          <div class="dialog_div">
            <div class="dialog_div_title">状态</div>
            <div class="dialog_div_content">
              <div class="content_input">
                <el-select
                  class="select input_select"
                  v-model="fromData.status"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div><i class="el-icon-arrow-right dialog_div_icon"></i></div>
            </div>
          </div>
          <div class="dialog_div_line"></div>
          <div class="dialog_div">
            <div class="dialog_div_title">完成时间</div>
            <div class="dialog_div_content">
              <div class="content_time">
                <el-date-picker
                  v-model="dateStr"
                  type="date"
                  placeholder="选择日期时间"
                  prefix-icon="0"
                  :clearable="false"
                >
                </el-date-picker>
              </div>
              <div><i class="el-icon-arrow-right dialog_div_icon"></i></div>
            </div>
          </div>
          <div class="dialog_div_line"></div>
          <div class="dialog_div">
            <div class="dialog_div_title">反馈结果</div>
            <div class="dialog_div_content">
              <div class="content_input">
                <el-select
                  class="select input_select"
                  v-model="fromData.result"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in resultList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div><i class="el-icon-arrow-right dialog_div_icon"></i></div>
            </div>
          </div>
          <div class="dialog_div_line"></div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" class="dialog_but" @click="submit"
            >提交</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        @close="closeDialog"
        title=""
        :visible.sync="playVisible"
        width="30%"
        center
      >
        <div class="play">
          <div v-if="switchplay == '语音'">
            <audio
              src="../../assets/1.mp3"
              autoplay="autoplay"
              controls="controls"
              ref="audio"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
          <div v-if="switchplay == '视频'">
            <video
              src="../../assets/dovue.mp4"
              :controls="videoOptions.controls"
              class="video-js vjs-big-play-centered vjs-fluid"
              webkit-playsinline="true"
              playsinline="true"
              x-webkit-airplay="allow"
              x5-playsinline
              style="width: 100%"
              @play="onPlayerPlay"
              @pause="onPlayerPause"
              autoplay="autoplay"
              ref="video"
            ></video>
          </div>
          <div class="imgList_css">
            <img src="" alt="" srcset="" />
          </div>
        </div>
        <span slot="footer" class="dialog-footer"> </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  rivingGetList,
  rivingRepair,
  rivingGetDetails,
  rivingDel,
  rivingEdit,
  trainGetDriverList, //获取司机列表
  trainGetTrainList, //获取车列表
} from "@/views/utils/api/form-data";
let timers = null;
export default {
  data() {
    return {
      dateStr:'',
      switchplay: "",
      playVisible: false,
      audios: "../../assets/1.mp3",
      videos: "../../assets/dovue.mp4",
      player: null,
      playTime: "",
      seekTime: "",
      current: "",
      videoOptions: {
        controls: true,
        src: "../../assets/software_img/lampBelt.mp4", // url地址
      },
      titleMaxLength: "0",
      activeName: "inspection",
      // 全部类型
      typeList: [
        {
          value: "out",
          label: "出库",
        },
        {
          value: "put",
          label: "入库",
        },
        {
          value: "ing",
          label: "进行中",
        },
      ],
      // 状态
      statusList: [
        {
          value: "normal",
          label: "正常",
        },
        {
          value: "repair",
          label: "报修",
        },
        {
          value: "repaired",
          label: "已维修",
        },
        {
          value: "finish",
          label: "已完成",
        },
      ],
      // 报修部门
      departmentLinst: [
        {
          value: "1",
          label: "地面中心",
        },
        {
          value: "2",
          label: "司机",
        },
        {
          value: "3",
          label: "试车",
        },
        {
          value: "4",
          label: "检修",
        },
      ],
      resultList: [
        {
          value: "0",
          label: "已修复",
        },
        {
          value: "1",
          label: "未修复",
        },
      ],
      type: "",
      value: "",
      input: "",
      radioSelect: false, //全选
      centerDialogVisible: false, //弹框
      dialogTitle: "报修单详情",
      value1: "",
      fromData: {
        train_id: "",
        number: "",
        driver_id: "",
        repair_time: "",
        department_id: "",
        describe: "",
        status: "",
        finish_time: new Date(),
        result: "",
      },
      describe: "",
      dataList: [],
      timedrive: "",
      dateTime: "",
      single: false,
      radio: "",
      driverList: [],
      trainList: [],
      idsList: [],
      driver_id: "", //全部车号
      train_id: "", //全部司机
      keyword: "",
      arrLinstss: [1, 2],
    };
  },
  created() {
    this.init();
    this.getdriver();
    this.getvehicleSecond();
    // console.log(this.$imgHttp);
    var timeArr = ['2017-07-10T07:00:00.00Z', '2017-08-15T07:00:00.00Z', '2017-07-12T07:00:00.00Z', '2017-07-15T07:00:00.00Z',       '2017-07-15T07:00:00.00Z', '2017-09-02T07:00:00.00Z'   ];
            var timestamp = Date.now();
            var min;
            var index = 0;
                timeArr.forEach(function(item, i) { 
                    var itemStamp = new Date(item).getTime();
                    var interVal = Math.abs(timestamp - itemStamp);
                    if (min == void 0) 
                    { min = interVal } 
                    else { 
                        if (min > interVal) {
                                min = interVal;
                                index = i;
                                }       
                                }   
                                })  
                console.log(index);
  },
  methods: {
    // 全部类型
    typeChange(val) {
      this.init();
    },
    // 全部类型
    headTabsChange(val) {
      this.init();
    },
    // 全部类型
    dreverIdChange(val) {
      this.init();
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
    // 时间选择
    getData(val) {
      if (this.dateTime) {
        this.timedrive = Math.round(new Date(this.dateTime) / 1000);
      } else {
        this.timedrive = "";
      }
      this.init();
    },
    // 点击播放音视频
    playClick(val) {
      this.switchplay = val;
      this.playVisible = true;
      if (val == "语音") {
        this.play();
      } else {
        this.initVideo();
      }
    },
    //关闭弹框的事件
    closeDialog() {
      if (this.switchplay == "语音") {
        this.stop();
      } else {
        this.onPlayerPause();
      }
    },
    //播放
    play() {
      this.$refs.audio.play();
    },
    //音频暂停
    stop() {
      this.$refs.audio.pause();
      this.$refs.audio.currentTime = 0;
    },
    initVideo() {
      //原生初始化视频方法
      let myVideo = this.$refs.video;
      //ontimeupdate
      myVideo = function () {
        myFunction();
      };
      let _this = this;
      function myFunction() {
        let playTime = myVideo.currentTime;
        setTimeout(function () {
          localStorage.setItem("cacheTime", playTime);
        }, 500);
        let time = localStorage.getItem("cacheTime");
        // 当前播放位置发生变化时触发。
        if (playTime - Number(time) > 2) {
          myVideo.currentTime = Number(time);
        } else {
        }
      }
    },
    // 播放
    onPlayerPlay(player) {
      this.$refs.video.play();
    },
    // 暂停
    onPlayerPause(player) {
      this.$refs.video.pause();
      // this.$refs.video.currentTime = 0;
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
    // 获取列表
    async init() {
      let res = await rivingGetList({
        time: this.timedrive,
        keyword: this.keyword,
        type: this.type,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.dataList = res.data.data;
          this.dataList.forEach((item) => {
            this.$set(item, "radio", false);
            if (item.images) {
              item.imagesList = this.$imgHttp + item.images.split(",");
            }
            if (item.video) {
              item.videoList = this.$imgHttp + item.video.split(",");
            }
            if (item.recording) {
              item.recordingList = this.$imgHttp + item.recording.split(",");
            }
          });
        } else {
          this.dataList = [];
        }
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 单选
    selectedItem(row) {
      if(row.radio) {
        this.idsList.push(row.id)
      }else {
          if(this.idsList.length > 0) {
              console.log(this.idsList.findIndex(x => x == row.id))
              this.idsList.splice(this.idsList.findIndex(x => x == row.id),1)
          }
      }
    },
    // 全选
    changeRadio() {
      let arr = [];
      this.single = !this.single;
      this.dataList.forEach((item) => {
        if (this.single) {
          arr.push(item.id);
          item.radio = true;
        } else {
          item.radio = false;
          arr = [];
        }
        this.idsList = arr;
      });
    },
    //详情
    async detailInfoClick(id) {
      this.fromData = {};
      let res = await rivingGetDetails({ id });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.fromData = res.data.data;
          this.fromData.department_id = this.fromData.department_id + ''
          console.log(new Date(this.fromData.finish_time * 1000));
          // this.fromData.repair_time = this.fromData.repair_time * 1000;
          // this.fromData.finish_time = this.fromData.finish_time * 1000;
          this.dateStr = this.fromData.repair_time * 1000
          this.titleMaxLength = 50 - this.fromData.describe.length;
          this.fromData.number = this.fromData.train.number;
          this.centerDialogVisible = true;
        } else {
        }
      } else {
        this.$message.error(res.data.msg);
      }
    },
    //删除
    async deleteBut() {
      if (this.idsList.length > 0) {
        let ids = this.idsList.join(",");
        let res = await rivingDel({
          ids: ids,
        });
        // rivingDel
        if (res.data.code == 1) {
          this.$message.success("删除成功");
          this.init();
        } else {
          this.$message.error(res.data.msg);
        }
      } else {
        this.$message.warning("请先选中您要删除的数据");
      }
    },
    //导入
    importBut() {},
    //导出
    exportBue() {},
    // 提交
    async submit() {
      this.fromData.repair_time = this.fromData.repair_time / 1000;
      if(this.fromData.describe.length < 5) {
          this.$message.warning('报修描述不能低于五个字')
          return
      }
      console.log(1)
      let res = await rivingEdit({
        item: this.fromData.item,
        type: this.fromData.type,
        department_id: this.fromData.department_id,
        describe: this.fromData.describe,
        type: this.fromData.type,
        repair_time: new Date(this.dateStr).getTime() / 1000,
        images: this.fromData.images,
        recording: this.fromData.recording,
        video: this.fromData.video,
        id: this.fromData.id,
        train_id: this.fromData.train_id,
      });
      if (res.data.code == 1) {
        this.centerDialogVisible = false;
        this.$message.success("修改成功");
      } else {
        this.$message.error(res.data.msg);
      }
    },
    checkSize() {
      var txtLength = this.fromData.describe.length;
      this.titleMaxLength = 50 - txtLength;


         
    },
  },
};
</script>

<style lang="less" >
.box {
  width: 100%;
  height: 100%;
  background-color: #F9F9FB;
  padding: 0 !important;
  .head {
    .head_card {
      .el-card__body{
        padding: 28px 32px 32px 0;
      }
      .head_tabs_nr, .el-tabs__header{
        margin-top: 0;
        margin-left: 30px;
      }
      .head_tabs {
        .head_tabs_nr {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }
        .journal_input {
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
        .el-tabs__item {
          height: 45px;
          font-size: 20px !important;
          font-weight: 600;
          &:hover {
            color: #004DA1;
          }
        }
        .el-tabs__item.is-active {
          color: #004DA1  !important;
        }
        .el-tabs__active-bar {
          width: 50px !important;
          position: absolute;
          bottom: 0;
          left: 50% !important;
          transform: translateX(-50%) !important;
          height: 3.5px;
          font-weight: 600;
          font-family: PingFang SC;
          background-color: #004DA1;
          z-index: 1;
        }
        .el-tabs__nav-wrap::after{
          background-color: #E6E6E6;
          height: 1px;
        }
        .is-active{
          color: #004DA1;
        }
        .head_tabs_select_box {
          display: flex;
          .head_tabs_select {
            width: 120px;
            height: 64px;
            .el-date-editor{
              input {
                background-color: #EDEDED !important;
                border-color: #EDEDED !important;
                &::placeholder {
                  color: #606266;
                }
              }
            }
            .head_tabs_select_item {
              .el-input__inner {
                background-color: #EDEDED !important;
                border-color: #EDEDED !important;
                &::placeholder {
                  color: #606266;
                }
              }
            }
            .headPicker {
              width: 140px !important;
            }
          }
          .head_tabs_select_left {
            margin-left: 20px;
          }
        }
        //
        .head_tabs_middle {
          padding: 20px;
          padding-left: 0;
          background-color: #f9f9fbff;
          .middle_card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            /deep/ .el-card {
              width: 40%;
            }
            // flex-wrap: wrap;
            .box_item_middle {
              width: 50px;
            }
            .card_box:nth-child(odd) {
              margin-left: 20px;
            }
            .card_box {
              width: 49%;
              margin-bottom: 20px;
              .box_item {
                padding: 10px;
                border-radius: 15px 15px 0 0;
                width: 100%;
                box-sizing: border-box;
                
                .box_item_1 {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                .box_item_2 {
                  margin-top: 20px;
                  display: flex;
                  font-size: 18px;
                  align-items: center;
                  .item_2_img {
                    width: 23px;
                    height: 26px;
                    margin-right: 5px;
                    display: inline-block;
                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }

                  .box_item_2_div {
                    margin-left: 20px;
                  }
                }
              }
            }
          }
        }
        //
        .box_item_bottom {
          box-sizing: border-box;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #F7F7F7;
          height: 60px;
          padding-left: 10px;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          .i-box{
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-left: 8px;
            color: #333;
            font-size: 16px;
            img{
              vertical-align: middle;
              width: 16px;
              height: 24px;
            }
            
            span{
              margin-left: 5px;
            }
          }
          .i-box:nth-child(2){
            margin-left: 30px;
            img{
              width: 26px;
              height: 25px;
            }
          }

          .bottom_img {
            margin-left: 20px;
          }
          .bottom_right {
            margin-right: 20px;
            color: #108ee9ff;
            cursor: pointer;
            font-size: 20px;
          }
        }
      }
    }
  }
  //
  .jour-footer {
    box-sizing: border-box;
    height: 80px;
    background: #ffffffff;
    line-height: 80px;
    text-align: center;
    /* 方法一 */
    position: fixed;
    bottom: 0;
    z-index: 9999;
    left: 120px;
    right: 0;
    padding: 0 20px;
    .footer_box {
      display: flex;
      justify-content: space-between;
    }
    .footer_box_but {
      display: inline-block;
      .box_but_css {
        width: 80px;
        border-radius: 5px;
      }
    }
  }
  //
  .box_dialog {
    border-radius: 15px;
    .el-dialog {
      width: 600px;
      margin-top: 10px;
      .el-dialog__title {
        font-weight: 600;
      }
      border-radius: 10px !important;
      .el-dialog__headerbtn .el-dialog__close {
        background-color: #adadadff;
        border-radius: 50%;
        color: #ffffffff;
        padding: 2px;
      }
      .dialog_div_report .el-textarea__inner{
          font-size: 18px;
        }
      .dialog_div {
        display: flex;
        justify-content: space-between;
        height: 25px;
        .el-input__inner{
          font-size: 18px;
        }
        .dialog_div_title {
          font-size: 17px;
          font-weight: 600;
          color: #333333ff;
        }
        .dialog_div_content {
          display: flex;
          .content_input input {
            border: none;
            text-align: right;
            margin-top: -20px;
            padding: 0;
          }
          .content_input {
            margin-right: 10px;
            select::-ms-expand {
              display: none;
            }
            .input_voice {
              display: flex;
              .voice_css {
                width: 70px;
                height: 35px;
                border-radius: 30px;
                border: 2px solid #eee;
                display: flex;
                justify-content: space-between;
                line-height: 35px;
                padding: 0 12px;
                margin-top: -5px;
                .css_img {
                  width: 15px;
                  height: 20px;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                  margin-top: 5px;
                }
                .css_img1 {
                  margin-top: 5px;
                  width: 22px;
                  height: 18px;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
                .css_font {
                  font-size: 18px;
                  font-weight: 600;
                }
              }
            }
          }

          .content_time input {
            border: none;
            text-align: right;
            // margin-top: -30px;
            padding: 0;
          }
          .content_time {
            margin-top: -10px;
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
              text-align: right;
            }
            /deep/ .el-date-editor {
              position: relative;
              .el-input__prefix {
                display: none;
              }
            }
          }
        }
        .dialog_div_icon {
          font-size: 18px;
        }
      }
      .dialog_div_report {
        .dialog_div_title {
          font-size: 17px;
          font-weight: 600;
          color: #333333ff;
        }
        .report_textarea {
          .textarea {
            margin-top: 10px;
          }
          .el-textarea__inner {
            padding: 0;
          }
          .textarea_num {
            text-align: right;
            color: #999;
          }
        }
      }
      .dialog_div_line {
        width: 100%;
        height: 1px;
        margin: 15px 0;
        background-color: #d8d8d8ff;
      }
      .dialog_but {
        width: 95%;
        border-radius: 5px;
      }
    }
  }
}
.select {
  .el-input {
    .el-input__suffix {
      display: none;
    }
  }
}

.textarea {
  .el-textarea__inner {
    border: none;
    resize: none;
    cursor: pointer;
    line-height: 20px;
  }
}

.item_2_text {
  display: inline-block;
  font-size: 22px;
}
.playcss {
  cursor: pointer;
}
.imgList_css {
  width: 250px;
  height: 250px;
  img {
    width: 100%;
    height: 100%;
  }
}

.journal-tag .tag{
  width: 74px;
  height: 42px;
  text-align: center;
  font-size: 18px;
  line-height: 42px;
  background-color: #FFF;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}
.journal-tag .tag.warning {
  border-color: rgba(247, 219, 5, 0.1);
  background-color:rgba(247, 219, 5, 0.1);
  color: rgb(247, 219, 5);
}
.journal-tag .tag.info {
  background-color:rgba(144, 147, 153, 1);
  color: #fff;
}
.journal-tag .tag.success {
  border-color: rgba(36, 237, 0, 0.1);
  background-color:rgba(36, 237, 0, 0.1);
  color: rgb(36, 237, 0);
}
.journal-tag .tag.danger {
  border-color: rgba(246, 6, 6, 0.1);
  background-color:rgba(246, 6, 6, 0.1);
  color: rgb(246, 6, 6);
}
.el-checkbox .el-checkbox__inner{
  border-radius: 50%;
  transform: scale(1.5);
}
</style>