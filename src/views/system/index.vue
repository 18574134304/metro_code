<template>
  <div class="search">
    <!-- 资金流水单 -->
    <div>
      <div v-for="(item, index) in radioLit" :key="index">
        <Radio
          style="margin-top: 15px"
          v-model="item.Radio"
          @click.native="itemRadio(item)"
          >Radio</Radio
        >
      </div>
      <div>
        <Radio v-model="single" @click.native="changeRadio">全选</Radio>
      </div>
    </div>
    <!-- 自定义导出数据 -->
    <Modal
      v-model="exportModalVisible"
      :title="exportTitle"
      :loading="loadingExport"
      @on-ok="exportCustomData"
    >
      <Form ref="exportForm" :label-width="100">
        <FormItem label="导出文件名">
          <Input v-model="filename" />
        </FormItem>
        <FormItem label="自定义导出列">
          <CheckboxGroup v-model="chooseColumns">
            <Checkbox
              v-for="(item, i) in exportColumns"
              :label="item.title"
              :key="i"
              :value="item.checked"
              :disabled="item.disabled"
            ></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="备注">
          <Input
            v-model="exportRemarks"
            placeholder="备注"
            style="width: 300px"
          />
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="electronicWaybill"
      title="资金流水单"
      width="1250"
      :styles="{ top: '150px' }"
    >
      <div style="text-align: right; margin-left: 20px">
        <List :border="false" :split="false" header="" footer="" size="small">
          <div>
            <div style="width: 1200px; display: flex; text-align: right">
              <ListItem style="width: 450px; text-align: right">
                <span>单证号:</span>
                <span class="listMomoney">
                  <!-- 1504760039443985430 -->
                  {{ fundSheetData.serialNumber }}
                </span>
              </ListItem>

              <ListItem style="width: 450px; text-align: right">
                <span>资金流水单上传时间:</span>
                <span class="listMomoney">未上传</span>
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <span style="margin-left: 40px">运单号:</span>
                <span
                  class="listMomoney hauto"
                  style="width: 170px; padding-right: 5px"
                >
                  <!-- 1504760039443985430 -->
                  {{ fundSheetData.orderNo }}
                </span>
              </ListItem>
            </div>

            <div style="width: 1200px; display: flex; text-align: right">
              <ListItem style="width: 450px; text-align: right">
                <span>实际承运人名称:</span>
                <span
                  v-if="fundSheetData.affiliatedCompanyName"
                  class="listMomoney"
                >
                  {{ fundSheetData.affiliatedCompanyName }} ({{
                    fundSheetData.fullName
                  }})
                </span>
                <span v-else class="listMomoney">
                  {{ fundSheetData.fullName }}
                </span>
              </ListItem>

              <ListItem style="width: 450px; text-align: right">
                <span>统一社会信用代码或个人证件号码:</span>
                <span class="listMomoney">
                  <!-- 915100000898813766 -->
                  {{ fundSheetData.actualCarrierId }}
                </span>
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <span style="margin-left: 40px">车辆牌照号:</span>
                <span class="listMomoney">
                  <!-- 豫HH2652 -->
                  {{ fundSheetData.vehicleNum }}
                </span>
              </ListItem>
            </div>
            <div style="width: 1200px; display: flex; text-align: right">
              <ListItem style="width: 450px; text-align: right">
                <span>车牌颜色代码:</span>
                <span class="listMomoney">
                  <!-- 302001 -->
                  {{ fundSheetData.colorType }}
                </span>
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <span>运费金额:</span>
                <span class="listMomoney hautoss">
                  <span>
                    <span style="color: red">
                      {{ fundSheetData.sfreightFee }}
                    </span>
                    元
                  </span>
                  <span v-if="fundSheetData.pricingType == 1">
                    <span style="color: red"
                      >{{ fundSheetData.driverUnitPrice }}
                    </span>
                    元/吨
                  </span>

                  <span v-if="fundSheetData.pricingType == 2">
                    <span style="color: red">
                      {{ fundSheetData.driverTotalPrice }}</span
                    >
                    元</span
                  >
                </span>
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <span></span>
                <span class="listMomoney"></span>
              </ListItem>
            </div>
            <div style="width: 1200px; display: flex; text-align: right">
              <ListItem style="width: 450px; text-align: right">
                <span>托运单号:</span>
                <span class="listMomoney">
                  <!-- 1504760039443985430 -->
                  {{ fundSheetData.orderNo }}
                </span>
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <span>付款方式代码:</span>
                <span class="listMomoney">
                  <!-- 39 -->
                  {{ fundSheetData.payCode }}
                </span>
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <!-- <span>收款帐户信息:</span>
                <span class="listMomoney">中国民生银行</span> -->
                <span></span>
                <span class="listMomoney"></span>
              </ListItem>
            </div>
            <div style="width: 1200px; display: flex; text-align: right">
              <ListItem style="width: 450px; text-align: right">
                <span>收款方名称:</span>
                <span class="listMomoney">
                  <!-- 新乡市宇泽货运部 (张鑫) -->
                  <!-- 河南枕山实业有限公司 -->
                  {{ fundSheetData.fullName }}
                </span>
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <span>收款账户信息:</span>
                <span class="listMomoney">
                  <!-- 410822198307211019 -->
                  {{ fundSheetData.cardNumber }}
                </span>
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <span style="margin-left: 40px">流水号:</span>
                <span class="listMomoney">{{ fundSheetData.svrId }}</span>
              </ListItem>
            </div>
            <div style="width: 1200px; display: flex; text-align: right">
              <ListItem style="width: 450px; text-align: right">
                <span>实际支付金额:</span>
                <span class="listMomoney"
                  ><span style="color: red">
                    <!-- 50000 -->
                    {{ fundSheetData.amountMoney }}
                  </span>
                  元</span
                >
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <span>ETC金额:</span>
                <span class="listMomoney"
                  ><span style="color: red"> {{ fundSheetData.etcCargo }}</span>
                  元</span
                >
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <span style="margin-left: 40px">油卡金额:</span>
                <span class="listMomoney"
                  ><span style="color: red">
                    {{ fundSheetData.oilcostCargo }}</span
                  >
                  元</span
                >
              </ListItem>
            </div>
            <div style="width: 1200px; display: flex; text-align: right">
              <ListItem style="width: 450px; text-align: right">
                <span>日期时间:</span>
                <span class="listMomoney">{{ fundSheetData.createTime }}</span>
              </ListItem>
              <ListItem style="width: 450px; text-align: right">
                <span></span>
                <span class="listMomoney"
                  ><span style="color: red"> </span>
                </span>
              </ListItem>

              <ListItem style="width: 450px; text-align: right">
                <span></span>
                <span class="listMomoney"></span>
              </ListItem>
            </div>
          </div>
        </List>
      </div>

      <div slot="footer">
        <Button @click="electronicWaybill = false">取消</Button>
        <Button :loading="loadingbut" type="primary" @click="capitalDetermine"
          >确定</Button
        >
      </div>
    </Modal>

    <!-- 司机详情   -->
    <DriverDetails
      @DriverDetaEnd="DriverDetaEnd"
      :BidderdUserId="BidderdUserId"
      :driverModalue="this.driverModalue"
    >
    </DriverDetails>
    <!-- 货主详情 -->
    <OwnerDetails
      @OwnerDetaiEnd="OwnerDetaiEnd"
      :OwnerDetailsId="OwnerDetailsId"
      :OwnerDetailsModalue="this.OwnerDetailsModalue"
    >
    </OwnerDetails>
    <!-- 个体户 -->
    <IndividualBusinessDetails
      @individualBusinessEnd="individualBusinessEnd"
      :individualBusinessId="individualBusinessId"
      :individualBusiness="this.individualBusiness"
    >
    </IndividualBusinessDetails>
    <!-- 车主 -->
    <NewOwnerDetails
      @newOwnerDetailsEnd="newOwnerDetailsEnd"
      :newOwnerDetailsId="newOwnerDetailsId"
      :newOwnerDetails="this.newOwnerDetails"
    >
    </NewOwnerDetails>
  </div>
</template>
<script>
// 根据你的实际请求api.js位置路径修改
import DriverDetails from "@/views/componentsonn_source_goods/DriverDetails";
import OwnerDetails from "@/views/componentsonn_source_goods/OwnerDetails";
import {
  geTransactionFlowList,
  fundFlowSheet,
  receiptquery,
  receiptDownload,
} from "@/api/finance";
import { uploadFlowSheet } from "@/api/monitoring";

import { getStore } from "@/libs/storage";
import IndividualBusinessDetails from "@/views/componentsonn_source_goods/IndividualBusinessDetails";
import NewOwnerDetails from "@/views/componentsonn_source_goods/newOwnerDetails";
import excel from "@/libs/excel";
import { addDownloadRecord } from "@/api/index";
export default {
  name: "transactionFlow",
  data() {
    return {
      single: false,
      radioLit: [
        {
          label: "男",
          value: "0",
          selected: "1",
          Radio: false,
        },
        {
          label: "男",
          value: "1",
          selected: "1",
          Radio: false,
        },
        {
          label: "男",
          value: "2",
          selected: "1",
          Radio: false,
        },
        {
          label: "男",
          value: "3",
          selected: "1",
          Radio: false,
        },
        {
          label: "男",
          value: "4",
          selected: "1",
          Radio: false,
        },
      ],
      individualBusiness: false, //个体户弹框
      individualBusinessId: "", //个体户Id
      newOwnerDetails: false, //车主弹框
      newOwnerDetailsId: "", //车主Id
      todayTimeBtn: true,
      loadingbut: false,
      loadingbuts: false,
      receiptDate: "",
      receiptDates: "",
      electronicWaybill: false,
      fundSheetData: {},
      BidderdUserId: "", //报价人Id
      driverModalue: false, //司机详情弹框

      OwnerDetailsId: "", //货主Id
      OwnerDetailsModalue: false, //货主详情弹框
      loading: false,
      currentWithdrawalId: "",
      date: [],
      arrRadio: [],
      userArray: [
        { key: -1, value: "全部" },
        { key: 0, value: "货主" },
        { key: 1, value: "司机" },
        { key: 2, value: "个体户" },
        { key: 3, value: "车主" },
      ],
      accountDetailsTypeArray: [
        { key: -1, value: "全部" },
        { key: 1, value: "收入" },
        { key: 2, value: "支出" },
      ],
      accountDetailsEventArray: [
        { key: -1, value: "全部" },
        { key: 1, value: "运费结算" },
        { key: 2, value: "余额提现" },
        { key: 3, value: "余额充值" },
        { key: 4, value: "提现退回" },
        { key: 5, value: "结算到账" },
      ],
      accountDetailsStateArray: [
        { key: -1, value: "全部" },
        { key: 0, value: "失败" },
        { key: 1, value: "审核中" },
        { key: 2, value: "打款中" },
        { key: 3, value: "成功" },
      ],
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        serialNumber: "",
        userPhone: "",
        userName: "",
        userType: "",
        accountDetailsType: "",
        accountDetailsEvent: "",
        accountDetailsState: "",
        startDate: "",
        endDate: "",
      },
      header: {
        accessToken: getStore("accessToken"),
      },
      accessToken: getStore("accessToken"),
      form: {},
      exportData: [], // 多选数据
      exportModalVisible: false, // 自定义导出显示
      exportTitle: "确认导出",
      loadingExport: true, // 导出加载状态
      chooseColumns: [],
      filename: "流水明细",
      exportRemarks: "",
      exportColumns: [
        {
          title: "#",
          key: "indexs",
          width: "60",
        },
        {
          title: "单证号",
          key: "serialNumber",
          width: 100,
          sortable: true,
        },
        {
          title: "交易时间",
          key: "createTime",
          width: 100,
          sortable: true,
        },
        {
          title: "用户",
          key: "driver",
          width: 100,
          sortable: true,
        },
        {
          title: "手机号",
          key: "userPhone",
          width: 100,
          sortable: true,
        },
        {
          title: "用户类型",
          key: "userType",
          width: 100,
          sortable: true,
        },
        {
          title: "运费金额",
          key: "rfreightFees",
          width: 100,
          sortable: true,
        },
        {
          title: "油卡",
          key: "oilcostCargos",
          width: 100,
          sortable: true,
        },
        {
          title: "ETC",
          key: "etcCargos",
          width: 100,
          sortable: true,
        },
        {
          title: "实际支付",
          key: "balances",
          width: 100,
          sortable: true,
        },
        {
          title: "类型",
          key: "accountDetailsType",
          width: 100,
          sortable: true,
        },
        {
          title: "事件",
          key: "accountDetailsEvent",
          width: 100,
          sortable: true,
        },
        {
          title: "交易方式",
          key: "payType",
          width: 100,
          sortable: true,
        },
        {
          title: "交易账户",
          key: "channelName",
          width: 100,
          sortable: true,
        },
        {
          title: "银行交易流水号",
          key: "transactionLogserialNumber",
          width: 100,
          sortable: true,
        },
        {
          title: "结束时间",
          key: "updateTime",
          width: 100,
          sortable: true,
        },
        {
          title: "备注",
          key: "remarks",
          minWidth: 150,
          tooltip: true,
        },
        {
          title: "状态",
          key: "accountDetailsState",
          width: 100,
          sortable: true,
        },
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "#",
          type: "index",
          width: 60,
        },
        {
          title: "单证号",
          key: "serialNumber",
          minWidth: 190,
        },
        {
          title: "交易时间",
          key: "createTime",
          minWidth: 180,
        },
        {
          title: "省厅上传",
          slot: "provinceTax",
          minWidth: 100,
        },

        {
          title: "用户",
          width: 240,
          sortable: false,
          render: (h, params) => {
            let text = "";
            let names = "";
            let calkNamtext = "";
            let owtext = "";
            if (params.row.userType == 0) {
              // re = "货主";
              names = params.row.username;
            } else if (params.row.userType == 1) {
              // re = "司机";
              names = params.row.username;
            } else if (params.row.userType == 3) {
              names = params.row.username;
              if (params.row.carrierType == 2) {
                // re = "个体户";  name
                names = params.row.uname;
              } else {
                // re = "车主"; affiliatedCompanyName
                names = params.row.affiliatedCompanyName;
                calkNamtext =
                  params.row.affiliatedCompanyName +
                  " ( " +
                  params.row.username +
                  " ) ";
              }
            }

            if (names.length > 8) {
              let text1 = names.substring(0, 4);
              let text2 = names.substring(names.length - 5);
              text = `${text1}...${text2}`;
            } else {
              text = names;
            }

            if (calkNamtext) {
              names = calkNamtext;
              text = text + " ( " + params.row.username + " ) ";
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top",
                  maxWidth: "220",
                  content: names,
                  transfer: true,
                },
              },
              [
                h(
                  "a",
                  {
                    props: {
                      type: "primary",
                      size: "small",
                    },
                    on: {
                      click: () => {
                        if (params.row.userType == 0) {
                          // re = "货主";
                          this.LookCargoOwnerInfo(params.row);
                        } else if (params.row.userType == 1) {
                          // re = "司机";
                          this.BidderdDiver(params.row);
                        } else if (params.row.userType == 3) {
                          if (params.row.carrierType == 2) {
                            // re = "个体户";
                            this.individualBusinessOpen(params.row);
                          } else {
                            // re = "车主";
                            this.newOwnerDetailsOpen(params.row);
                          }
                        }
                      },
                    },
                  },
                  text
                ),
              ]
            );
          },
        },
        // {
        //   title: "用户",
        //   key: "nickName",
        //   minWidth: 220,
        //   render: (h, params) => {
        //     let cargoOwnerName = "";
        //     let placTop = "top";
        //     if (params.row.username) {
        //       cargoOwnerName = params.row.username;

        //       if (params.index == 0) {
        //         placTop = "bottom";
        //       } else {
        //         placTop = "top";
        //       }
        //       let textN = "";
        //       if (cargoOwnerName.length > 12) {
        //         textN = cargoOwnerName.slice(0, 12) + "..."; // 进行数字截取
        //       } else {
        //         textN = cargoOwnerName;
        //       }
        //       return h(
        //         "Tooltip",
        //         {
        //           props: {
        //             placement: placTop,
        //             maxWidth: "220",
        //             content: cargoOwnerName,
        //             transfer: true,
        //           },
        //         },
        //         [
        //           h(
        //             "a",
        //             {
        //               props: {
        //                 type: "primary",
        //                 size: "small",
        //               },
        //               on: {
        //                 click: () => {
        //                   if (params.row.userType == 0) {
        //                     // re = "货主";
        //                     this.LookCargoOwnerInfo(params.row);
        //                   } else if (params.row.userType == 1) {
        //                     // re = "司机";
        //                     this.BidderdDiver(params.row);
        //                   } else if (params.row.userType == 3) {
        //                     if (params.row.carrierType == 2) {
        //                       // re = "个体户";
        //                       this.individualBusinessOpen(params.row);
        //                     } else {
        //                       // re = "车主";
        //                       this.newOwnerDetailsOpen(params.row);
        //                     }
        //                   }
        //                 },
        //               },
        //             },
        //             textN
        //           ),
        //         ]
        //       );
        //     }
        //   },
        // },

        {
          title: "用户类型",
          key: "userType",
          width: 100,
          render: (h, params) => {
            let re = "",
              color = "";
            if (params.row.userType == 0) {
              re = "货主";
              color = "blue";
            } else if (params.row.userType == 1) {
              re = "司机";
              color = "red";
            } else if (params.row.userType == 3) {
              if (params.row.carrierType == 2) {
                re = "个体户";
                color = "orange";
              } else {
                re = "车主";
                color = "cyan";
              }
            }
            return h("div", re);
          },
        },
        // {
        //   title: "交易金额",
        //   key: "amountMoney",
        //   minWidth: 140,
        //   render: (h, params) => {
        //     // if (params.row.accountDetailsType == 1) {
        //     //     let text = h(
        //     //     "div",
        //     //     {
        //     //       attrs: { content: params.row.amountMoney, placement: "div" },
        //     //       style: {
        //     //         color: "#21C38F",
        //     //       },
        //     //     },
        //     //     params.row.amountMoney
        //     //   );
        //     //   return h("div", { attrs: { content: params.row.amountMoney } }, [text]);
        //     // } else {
        //     //   let text = h(
        //     //     "div",
        //     //     {
        //     //       attrs: { content: params.row.amountMoney, placement: "div" },
        //     //       style: {
        //     //         color: "#FF0000",
        //     //       },
        //     //     },
        //     //     params.row.amountMoney
        //     //   );
        //     //   return h("div", { attrs: { content: params.row.amountMoney } }, [text]);
        //     // }
        //     return h("div", "￥ " + params.row.amountMoney);
        //   },
        // },
        // {
        //   title: "账户余额",
        //   key: "balance",
        //   minWidth: 140,
        //   render: (h, params) => {
        //     return h("div", "￥ " + params.row.balance);
        //   },
        // },

        {
          title: "运费金额",
          key: "balance",
          minWidth: 140,
          render: (h, params) => {
            return h("div", "￥ " + params.row.rfreightFee);
          },
        },
        {
          title: "油卡",
          key: "balance",
          minWidth: 140,
          render: (h, params) => {
            return h("div", "￥ " + params.row.oilcostCargo);
          },
        },
        {
          title: "ETC",
          key: "balance",
          minWidth: 140,
          render: (h, params) => {
            return h("div", "￥ " + params.row.etcCargo);
          },
        },
        {
          title: "实际支付",
          key: "balance",
          minWidth: 140,
          render: (h, params) => {
            return h("div", "￥ " + params.row.amountMoney);
          },
        },
        {
          title: "类型",
          key: "accountDetailsType",
          minWidth: 80,
          render: (h, params) => {
            let i = params.row.accountDetailsType;
            let arr = [];
            //  console.log(params.row.accountDetailsEvent);
            if (params.row.accountDetailsEvent == 5) {
              arr = ["", "收入", "支出"];
            } else {
              arr = ["", "支出", "收入"];
            }
            let text = arr[i];
            return h("div", text);
          },
        },
        {
          title: "事件",
          key: "accountDetailsEvent",
          minWidth: 100,
          render: (h, params) => {
            let i = params.row.accountDetailsEvent;
            let arr = [
              "",
              "运费结算",
              "余额提现",
              "余额充值",
              "提现退回",
              "结算到账",
            ];
            let curText = arr[i];
            return h("div", curText);
          },
        },
        {
          title: "交易方式",
          key: "payType",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "交易账户",
          key: "channelName",
          minWidth: 200,
          render: (h, params) => {
            let text = "--";
            if (params.row.arrivalType == 1) {
              let channelAcountStr = params.row.channelAcount;
              if (channelAcountStr) {
                let curText = channelAcountStr.substring(
                  channelAcountStr.length - 4
                );
                text = `${params.row.channelName}(${curText})`;
              }
              return h("div", text);
            } else {
              let channelNameStr = params.row.channelName;
              if (channelNameStr) {
                text = params.row.channelName;
              }
              return h("div", text);
            }
          },
        },
        {
          title: "银行交易流水号",
          key: "transactionLogserialNumber",
          minWidth: 180,
          render: (h, params) => {
            let curText = params.row.transactionLogserialNumber;
            let voucherText = params.row.voucher;
            if (curText) {
              let curText2 = "";
              if (curText.length > 14) {
                let text1 = curText.substring(0, 8);
                let text2 = curText.substring(curText.length - 6);
                curText2 = `${text1}....${text2}`;
              } else {
                curText2 = curText;
              }
              if (voucherText) {
                let text = h(
                  "div",
                  {
                    style: {
                      color: "#1495e7",
                      cursor: "pointer",
                      maxWidth: "160px",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    },
                    on: {
                      click: () => {
                        if (params.row.accountDetailsEvent == 5) {
                          this.signContractClick(voucherText);
                        } else {
                          this.showPic(voucherText);
                        }
                      },
                    },
                  },
                  curText2
                );
                return h(
                  "Tooltip",
                  {
                    attrs: {
                      content: curText,
                      maxWidth: "180",
                      placement: "top",
                    },
                  },
                  [text]
                );
              } else {
                let text = h(
                  "div",
                  {
                    style: {
                      cursor: "pointer",
                      maxWidth: "170px",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    },
                  },
                  curText2
                );
                return h(
                  "Tooltip",
                  {
                    attrs: {
                      content: curText,
                      maxWidth: "180",
                      placement: "top",
                    },
                  },
                  [text]
                );
              }
            } else {
              return h("div", "--");
            }
          },
        },
        {
          title: "结束时间",
          key: "updateTime",
          minWidth: 180,
          render: (h, params) => {
            let text = params.row.updateTime;
            if (params.row.accountDetailsState == 1) {
              text = "**-**-** **:**:**";
            } else if (params.row.accountDetailsState == 2) {
              text = "**-**-** **:**:**";
            }
            return h("div", text);
          },
        },
        {
          title: "备注",
          key: "remarks",
          minWidth: 150,
          tooltip: true,
        },
        {
          title: "状态",
          key: "accountDetailsState",
          fixed: "right",
          minWidth: 100,
          render: (h, params) => {
            if (params.row.accountDetailsState == 0) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "失败",
                  },
                }),
              ]);
            } else if (params.row.accountDetailsState == 1) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "default",
                    text: "审核中",
                  },
                }),
              ]);
            } else if (params.row.accountDetailsState == 2) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "default",
                    text: "打款中",
                  },
                }),
              ]);
            } else {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "成功",
                  },
                }),
              ]);
            }
          },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 120,
          render: (h, params) => {
            if (params.row.settleBillId) {
              return h("div", [
                h(
                  "a",
                  {
                    on: {
                      click: () => {
                        let billMnagement = "";
                        if (params.row.userType == 0) {
                          billMnagement = "cargoName";
                        } else {
                          billMnagement = "driverName1";
                        }
                        let a = params.row.userType;
                        let search = JSON.stringify(this.searchForm);
                        this.$router.push({
                          name: "paydetails",
                          query: {
                            id: params.row.settleBillId,
                            goPayDetailsType: 2,
                            search: search,
                            billMnagement: billMnagement,
                            business: params.row.business,
                          },
                        });
                      },
                    },
                  },
                  "明细"
                ),
                h("Divider", {
                  props: {
                    type: "vertical",
                  },
                }),

                h(
                  "a",
                  {
                    on: {
                      click: () => {
                        if (params.row.accountDetailsEvent != 5) {
                          return this.$Message.warning(
                            "该交易类型，没有资金流水单"
                          );
                        } else {
                          this.capitalFlow = 1;
                          this.fundFlowSheetClick(params.row);
                        }
                      },
                    },
                  },
                  "详情"
                ),
              ]);
            } else {
              return h("div", [
                h(
                  "b",
                  {
                    on: {},
                  },
                  "--"
                ),
              ]);
            }
          },
        },
      ],
      data: [], // 表单数据
      pageNumber: 1, // 当前页数
      pageSize: 10, // 页面大小
      total: 0, // 表单数据总数
      expenditure: "", //支出
      income: "", //收入
      // detailsId
      todayTime: "",
      capitalFlow: 1,
      provincialData: {},
    };
  },
  components: {
    DriverDetails,
    OwnerDetails,
    IndividualBusinessDetails,
    NewOwnerDetails,
  },
  methods: {
    // 全选
    changeRadio() {
      this.single = !this.single;
      this.radioLit.forEach((item) => {
        if (this.single) {
          item.Radio = true;
        } else {
          item.Radio = false;
        }
      });
    },
    // itemRadio
    itemRadio(row) {
      row.Radio = !row.Radio;
      var flag = true;
      for (let i = 0, len = this.radioLit.length; i < len; i++) {
        if (!this.radioLit[i].Radio) {
          flag = false;
          this.single = false;
          return false;
        }
      }
      if (flag) {
        this.single = true;
      }
    },
    // 省厅上传
    provincialDepartment(row) {
      this.provincialData = row;
      this.capitalFlow = 2;
      if (row.accountDetailsEvent == 5) {
        this.fundFlowSheetClick(row);
      } else {
        return this.$Message.warning("该交易类型，没有资金流水单");
      }
    },
    // 省厅上传确定
    capitalDetermine() {
      this.loadingbut = true;
      if (this.capitalFlow == 1) {
        this.loadingbut = false;
        this.electronicWaybill = false;
      } else {
        uploadFlowSheet({
          detailsId: this.provincialData.payAccountDetailsId,
        }).then((res) => {
          this.loadingbut = false;
          if (res.code == 200) {
            this.$Message.success("上传成功");
            this.getDataList();
            this.electronicWaybill = false;
          } else {
            this.$Message.error(res.message);
          }
        });
      }
    },
    // 税务上传
    TaxDriverClick(row) {
      console.log(row);
    },

    getCurrentTime() {
      //获取当前时间并打印
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      _this.receiptDates = yy + "-" + mm + "-" + dd;
      _this.todayTime = yy + "-" + mm + "-" + dd;
      _this.todayTime = _this.getTime(_this.todayTime);
    },
    //
    signContractClick(row) {
      let pdf = "";
      pdf =
        this.$baseUrl +
        "/freight/file/view/" +
        row +
        "?accessToken=" +
        this.accessToken +
        "&preview=true";
      window.open(pdf, "_blank");
    },
    //回单查询
    receiptQuery() {
      if (!this.receiptDates) {
        return this.$Message.warning("请先选择日期");
      }
      this.loadingbut = true;
      receiptquery({ queryDate: this.receiptDates }).then((res) => {
        this.loadingbut = false;
        // 重新加载数据
        this.getDataList();
      });
    },
    // 回单文件下载
    receiptFileDownload() {
      this.loadingbuts = true;
      receiptDownload({}).then((res) => {
        this.loadingbuts = false;
        // 重新加载数据
        this.getDataList();
      });
    },
    // 详情
    fundFlowSheetClick(row) {
      this.fundSheetData = row;
      this.electronicWaybill = true;
      fundFlowSheet({ detailsId: row.payAccountDetailsId }).then((res) => {
        this.fundSheetData = res.result;
      });
    },
    init() {
      this.getDataList();
      // 初始化导出列数据
      let array = [];
      this.exportColumns.forEach((e) => {
        // 指定列限制权限
        if (
          !this.getStore("roles").includes("ROLE_ADMIN") &&
          e.key == "mobile"
        ) {
          e.title = "[无权导出] " + e.title;
          e.disabled = true;
        } else {
          e.disabled = false;
        }
        array.push(e.title);
      });
      this.chooseColumns = array;
    },
    // 用户详情
    showCompanyInfoVo(row) {
      if (row.userType == "0") {
        this.LookCargoOwnerInfo(row);
      } else {
        this.BidderdDiver(row);
      }
    },
    //货主详细信息
    LookCargoOwnerInfo(row) {
      this.OwnerDetailsId = row.userId;
      this.OwnerDetailsModalue = true;
    },
    // 货主详细信息关闭
    OwnerDetaiEnd(val) {
      this.OwnerDetailsModalue = val;
      this.OwnerDetailsId = "";
    },
    // 司机
    BidderdDiver(row) {
      this.BidderdUserId = row.userId;
      this.driverModalue = true;
    },
    // 司机详情关闭
    DriverDetaEnd(val) {
      this.driverModalue = val;
      this.BidderdUserId = "";
    },
    //个体户详情
    individualBusinessOpen(row) {
      this.individualBusiness = true;
      this.individualBusinessId = row.userId;
    },
    //个体户信息关闭
    individualBusinessEnd(val) {
      this.individualBusiness = val;
      this.individualBusinessId = "";
    },

    //车主详情
    newOwnerDetailsOpen(row) {
      this.newOwnerDetails = true;
      this.newOwnerDetailsId = row.userId;
    },
    //车主信息关闭
    newOwnerDetailsEnd(val) {
      this.newOwnerDetails = val;
      this.newOwnerDetailsId = "";
    },
    showPic(v) {
      let image = new Image();
      image.src =
        this.$baseUrl +
        "/freight/file/view/" +
        v +
        "?accessToken=" +
        this.accessToken +
        "&preview=true";
      let viewer = new Viewer(image, {
        hidden: function () {
          viewer.destroy();
        },
      });
      viewer.show();
    },
    handleSuccess(res, file, fileList) {},
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    changeDate(val) {
      //改变选择日期
      this.searchForm.startDate = val[0];
      this.searchForm.endDate = val[1];
    },
    changeDatess(val) {
      this.receiptDates = val;
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.searchForm.serialNumber = "";
      this.searchForm.userPhone = "";
      this.searchForm.userName = "";
      this.searchForm.userType = "";
      this.searchForm.accountDetailsType = "";
      this.searchForm.accountDetailsEvent = "";
      this.searchForm.accountDetailsState = "";
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.date = [];
      this.receiptDates = "";
      this.receiptDate = "";
      // 重新加载数据
      this.getDataList();
    },
    getDataList() {
      this.loading = true;
      for (let item in this.searchForm) {
        if (!this.searchForm[item] && this.searchForm[item] !== 0) {
          delete this.searchForm[item];
        }
      }
      geTransactionFlowList(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
          this.income = 0;
          this.expenditure = 0;

          this.data.forEach((item) => {
            if (item.updateTime) {
              item.updateTimes = this.getTime(item.updateTime.substring(0, 10));
              if (this.todayTime == item.updateTimes) {
                this.todayTimeBtn = false;
              } else {
                this.todayTimeBtn = true;
              }
            }
            if (item.accountDetailsState == 3) {
              if (item.accountDetailsType == "1") {
                this.income += item.amountMoney;
              } else {
                this.expenditure += item.amountMoney;
              }
            }
          });

          if (this.data.length == 0 && this.searchForm.pageNumber > 1) {
            this.searchForm.pageNumber -= 1;
            this.getDataList();
          }
        }
      });
    },
    getTime(value) {
      let birthdays = new Date(value);
      let age = birthdays.valueOf();
      return age;
    },
    //选择导出数据
    exportSelectData() {
      if (this.exportData.length <= 0) {
        this.$Message.warning("您还未选择要导出的数据");
        return;
      }
      this.exportType = "part";
      this.exportModalVisible = true;
      this.exportTitle = "确认导出 " + this.exportData.length + " 条数据";
      this.exportRemarks = "";
    },
    changeSelect(e) {
      this.InsuranceList = e;
      this.exportData = e;
      this.exportData.forEach((item, index) => {
        // 序号
        item.indexs = index + 1;
        // 用户类型
        if (item.userType == 0) {
          item.userType = "货主";
        } else if (item.userType == 1) {
          item.userType = "司机";
        } else if (item.userType == 3) {
          if (item.carrierType == 2) {
            item.userType = "个体户";
          } else {
            item.userType = "车主";
          }
        } else {
          item.userType = "未知";
        }
        // 交易金额
        // if (item.amountMoney) {
        //   item.amountMoney = "￥ " + item.amountMoney;
        // }
        // 账户余额
        if (item.balance) {
          item.balance = "￥ " + item.balance;
        } else {
          item.balance = "￥ " + 0;
        }
        // y用户
        console.log(item.userType);
        if (item.userType == "货主") {
          item.driver = item.username;
        } else if (item.userType == "司机") {
          item.driver = item.username;
        } else if (item.userType == "个体户") {
          item.driver = item.uname; //个人
        } else if (item.userType == "车主") {
          item.driver =
            item.affiliatedCompanyName + " ( " + item.username + " ) ";
        }

        // 运费金额
        if (item.rfreightFee) {
          item.rfreightFees = "￥ " + item.rfreightFee;
        } else {
          item.rfreightFees = "￥ " + 0;
        }
        // 油卡
        if (item.oilcostCargo) {
          item.oilcostCargos = "￥ " + item.oilcostCargo;
        } else {
          item.oilcostCargos = "￥ " + 0;
        }
        // ETC
        if (item.etcCargo) {
          item.etcCargos = "￥ " + item.etcCargo;
        } else {
          item.etcCargos = "￥ " + 0;
        }
        // 实际支付
        if (item.amountMoney) {
          item.balances = "￥ " + item.amountMoney;
        }
        // 类型
        if (item.accountDetailsType == 1) {
          item.accountDetailsType = "收入";
        } else if (item.accountDetailsType == 2) {
          item.accountDetailsType = "支出";
        }
        //交易账户
        if (item.channelName) {
          item.channelName = item.channelName;
        } else {
          item.channelName = "--";
        }
        //三方交易凭证
        if (item.transactionLogserialNumber) {
          item.transactionLogserialNumber = item.transactionLogserialNumber;
        } else {
          item.transactionLogserialNumber = "--";
        }
        // 事件
        if (item.accountDetailsEvent == 1) {
          item.accountDetailsEvent = "运费结算";
        } else if (item.accountDetailsEvent == 2) {
          item.accountDetailsEvent = "余额提现";
        } else if (item.accountDetailsEvent == 3) {
          item.accountDetailsEvent = "余额充值";
        } else if (item.accountDetailsEvent == 4) {
          item.accountDetailsEvent = "提现退回";
        } else if (item.accountDetailsEvent == 5) {
          item.accountDetailsEvent = "结算到账";
        }
        // 状态
        if (item.accountDetailsState == 0) {
          item.accountDetailsState = "失败";
        } else if (item.accountDetailsState == 1) {
          item.accountDetailsState = "审核中";
        } else if (item.accountDetailsState == 2) {
          item.accountDetailsState = "打款中";
        } else {
          item.accountDetailsState = "成功";
        }
      });
    },
    exportCustomData() {
      // 上传记录
      let param = new FormData(); // 创建form对象
      // param.append("file", a); // 通过append向form对象添加数据
      param.append("fileName", this.filename); // 添加form表单中其他数据
      param.append("fileType", 6); // 通过append向form对象添加数据
      param.append("remarks", this.exportRemarks); // 添加form表单中其他数据
      addDownloadRecord(param).then((res) => {
        if (res.code == 200) {
          // 判断勾选导出列
          let array = [];
          this.exportColumns.forEach((e) => {
            this.chooseColumns.forEach((c) => {
              if (e.title == c && !e.disabled) {
                array.push(e);
              }
            });
          });
          let filename = res.result + " " + this.filename;
          this.exportColumns = array;
          this.exportModalVisible = false;
          let title = [];
          let key = [];
          this.exportColumns.forEach((e) => {
            title.push(e.title);
            key.push(e.key);
          });
          const params = {
            title: title,
            key: key,
            data: this.exportData,
            autoWidth: true,
            filename: filename,
          };
          excel.export_array_to_excel(params);
        } else {
          return this.$Message.error(res.message);
        }
      });
    },
  },
  mounted() {
    if (this.$route.query.search) {
      let obj = JSON.parse(this.$route.query.search);
      this.searchForm = obj;
      this.date = [];
      this.date.push(obj.startDate);
      this.date.push(obj.endDate);
    }
    this.init();
    this.getCurrentTime();
  },
};
</script>
<style lang="less">
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.elcteage {
  margin-top: 7px;
  display: inline-block;
  margin-left: 20px;
}
.listMomoney {
  margin-left: 15px;
  font-weight: 600;
}
.hauto {
  height: 24px;
  overflow-y: auto;
}
.hautoss {
  height: 24px;
  overflow-y: auto;
}
</style>