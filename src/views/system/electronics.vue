<template>
  <!-- 电子手册 -->
  <div>
    <div class="box">
      <div class="head_electronics">
        <el-card class="head_electronics_card">
          <el-tabs
            @tab-click="handleClick"
            class="head_electronics_tabs"
            v-model="activeName"
          >
            <el-tab-pane label="司机账号管理" name="driver"> </el-tab-pane>
            <el-tab-pane label="地面端账号管理" name="groundEnd"> </el-tab-pane>
            <el-tab-pane label="排班管理" name="typesetting"> </el-tab-pane>
            <el-tab-pane label="电子手册" name="electronics">
              <div class="electronics_tabs_nr">
                <div>
                  <el-button class="electronics_btn" @click="electronicsAdd"
                    >添加手册</el-button
                  >
                </div>
                <div class="nr_input">
                  <el-input
                    class="electronics_input"
                    size="small"
                    placeholder="搜索"
                    prefix-icon="el-icon-search icons"
                    v-model="keyword"
                    @input="searchBtn"
                  >
                  </el-input>
                </div>
              </div>
              <!--  -->
              <div class="electronics_table">
                <el-card>
                  <div>
                    <el-table
                      height="500"
                      stripe
                      :data="tableData.data"
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="date"
                        label="一级分类"
                        align="center"
                      >
                        <template slot-scope="scope">
                          {{
                            scope.row.one != null
                              ? scope.row.one.name
                              : "暂无分类"
                          }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="date"
                        label="二级分类"
                        align="center"
                      >
                        <template slot-scope="scope">
                          {{
                            scope.row.two != null
                              ? scope.row.two.name
                              : "暂无分类"
                          }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="date"
                        label="三级分类"
                        align="center"
                      >
                        <template slot-scope="scope">
                          {{
                            scope.row.three != null
                              ? scope.row.three.name
                              : "暂无分类"
                          }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="date" label="类型" align="center">
                        <template slot-scope="scope">
                          {{ scope.row.type == "image" ? "图片" : "视频" }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="date"
                        label="更新时间"
                        align="updatetime"
                      >
                        <template slot-scope="scope">
                          {{ scope.row.updatetime | dateFormat }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="date" label="备注" align="center">
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
                  </div>

                  <div class="electronics_footer">
                    <div></div>
                    <div class="electronics_Pagination">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        background
                        layout="prev, pager, next,jumper"
                        :total="tableData.total"
                        size="medium"
                      >
                      </el-pagination>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="公告" name="notice"> </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
    <!-- 弹框 -->
    <div class="electronics_dialog">
      <el-dialog :title="dialogTitletitle" :visible.sync="centerDialogVisible">
        <div class="dialog_box_tetle">
          <div class="box_tetle_left">请选择</div>
          <div class="right_font">
            <div class="add_tree" v-if="treeText" @click="addclassification">
              添加分类
            </div>
            <div class="box_tetle_right" @click="treeEdit">
              {{ treeText ? "完成" : "编辑" }}
            </div>
          </div>
        </div>
        <div class="dialog_middle"></div>
        <div class="dialog_box">
          <div class="box_left">
            <el-tree
              class="tree"
              accordion
              :expand-on-click-node="false"
              :data="classificationList"
              node-key="id"
              default-expand-all
              @node-click="handleNodeClick"
              :props="defaultProps"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                  <i
                    v-if="data.type == 'Tertiary'"
                    class="el-icon-caret-right"
                  />
                  <span>
                    <span class="tree_label">{{ node.label }}</span>
                  </span>
                  <i
                    v-if="data.type == 'catalog'"
                    class="el-icon-caret-bottom"
                  />
                  <i v-if="data.type == 'menu'" class="el-icon-caret-bottom" />
                </span>
                <span v-if="treeText">
                  <el-button
                    class="node_but1"
                    type="text"
                    size="mini"
                    @click="() => classificationEdit(node, data)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    class="node_but"
                    type="text"
                    size="mini"
                    @click="() => classificationRemove(node, data)"
                  >
                    删除
                  </el-button>
                </span>
              </span>
              <span class="tree_label_xian"></span>
            </el-tree>
          </div>
          <div class="box_right">
            <div class="box_right_tetle">手册内容</div>
            <div>
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="60px"
                class="dialog_ruleForm"
              >
                <el-form-item
                  label="上传类型"
                  prop="driver_id"
                  label-width="90px"
                >
                  <div class="div_input">
                    <div></div>
                    <div class="content_input">
                      <el-select
                        v-model="ruleForm.driver_id"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in tepyList"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
                <div class="box_right_line"></div>
                <div>
                  <el-form-item label="上传" prop="uploads">
                    <div class="div_input">
                      <!-- <div></div> -->
                      <div class="div_input_upload">
                        <div v-if="!this.imgarr">
                          <el-upload
                            action=""
                            multiple
                            :limit="1"
                            ref="upload_img"
                            :on-exceed="uploadExceed"
                            list-type="picture-card"
                            :on-change="beforeAvatarUpload"
                            :on-preview="handlePictureCardPreview"
                            :before-upload="beforeUpload"
                          >
                            <img
                              class="upload_img"
                              src="../../assets/electronics/1.png"
                              alt=""
                              srcset=""
                            />
                          </el-upload>
                        </div>
                        <div v-else class="upload_css">
                          <i
                            class="el-icon-circle-close upload_imgs_icon"
                            @click="datileImg"
                          ></i>
                          <div class="upload_imgs">
                            <img
                              v-if="fileType == 'img'"
                              :src="showurl"
                              alt=""
                              srcset=""
                            />
                            <video
                              v-if="fileType == 'mp4'"
                              :src="showurl"
                              class="video-js vjs-big-play-centered vjs-fluid"
                              webkit-playsinline="true"
                              playsinline="true"
                              x-webkit-airplay="allow"
                              x5-playsinline
                              autoplay="autoplay"
                              ref="video"
                            ></video>
                            <span v-if="fileType == 'pdf'">pdf</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </div>
                <div class="box_right_line"></div>
              </el-form>
            </div>
          </div>
        </div>
        <span slot="footer">
          <div class="box_right_button">
            <el-button
              v-if="dialogTitletitle == '添加手册'"
              type="primary"
              class="dialog_but"
              @click="submit"
              >保存</el-button
            >
            <el-button
              v-if="dialogTitletitle == '编辑手册'"
              type="primary"
              class="dialog_but"
              @click="submitEdit"
              >编辑</el-button
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
        <div class="tips_nr">确定要删除该账号吗？</div>
        <span slot="footer">
          <div class="tips_div">
            <el-button class="div_but" @click="dialogTips = false"
              >取消</el-button
            >
            <el-button class="div_but1" type="primary" @click="deteleCurrent"
              >确 定</el-button
            >
          </div>
        </span>
      </el-dialog>
    </div>
    <!-- 添加分类 -->
    <div class="tips_classification">
      <el-dialog
        class="tips"
        title="添加分类"
        :visible.sync="dialogclassification"
        center
      >
        <div class="ification">
          <el-input v-model="name" placeholder="请输入"></el-input>
        </div>
        <div>
          <div class="electronics-upload">
            <div class="classification_css" v-if="imgNone">
              <i
                class="el-icon-circle-close classification_imgs_icon"
                @click="classificationDetele"
              ></i>
              <img
                :src="this.$imgHttp + this.classificationEditData.image"
                alt=""
                srcset=""
              />
            </div>
            <div v-if="!imgNone">
              <el-upload
                class="electronics_img"
                action=""
                list-type="picture-card"
                multiple
                :limit="1"
                ref="upload_img"
                accept=".jpg, .jpeg, .png"
                :on-preview="handlePictureCardPreview"
                :http-request="handleTestSuccess"
                :on-exceed="uploadExceed"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </div>
        <span slot="footer">
          <div class="tips_div">
            <el-button class="div_but" @click="dialogclassification = false"
              >取消</el-button
            >
            <el-button
              v-if="this.switch == 2"
              class="div_but1"
              type="primary"
              @click="classificationEditClick"
              >编辑</el-button
            >
            <el-button
              v-if="this.switch == 1"
              class="div_but1"
              type="primary"
              @click="classificationAdd"
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
  addManual,
  editManual,
  delManual,
  getManualList,
  getManualDetails,
  addCategory,
  getCategoryList,
  editCategory,
  delCategory,
  upload,
} from "@/views/utils/api/form-data";
let timers = null;
let users = JSON.parse(localStorage.getItem("user"));
export default {
  data() {
    return {
      data: [
        {
          id: 1,
          label: "目录1232131",
          type: "catalog",
          children: [
            {
              id: 2,
              type: "menu",
              label: "菜单1",
              children: [
                {
                  id: 2,
                  type: "Tertiary",
                  label: "菜单1",
                },
                {
                  id: 3,
                  type: "Tertiary",
                  label: "菜单2",
                },
              ],
            },
            {
              id: 3,
              type: "menu",
              label: "菜单2",
            },
          ],
        },
        {
          id: 4,
          type: "catalog",
          label: "目录2",
          children: [
            {
              type: "menu",
              id: 5,
              label: "菜单1",
            },
            {
              id: 6,
              type: "menu",
              label: "菜单2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "childlist",
        label: "name",
      },
      //
      dialogclassification: false,
      dialogTips: false,
      centerDialogVisible: false, //
      classification: false,
      ruleForm: {
        driver_id: "",
        uploads: "",
      },
      rules: {
        driver_id: [
          { required: true, message: "请输入活动名称", trigger: "change" },
        ],
        uploads: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },

      activeName: "electronics",
      tepyList: [
        {
          name: "图片",
          value: "image",
        },
        {
          name: "视频",
          value: "video",
        },
        {
          name: "文档",
          value: "pdf",
        },
      ],
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
      value: "",
      treeText: false,
      videoForm: {
        Video: "",
      },
      videoFlag: true,
      classificationList: [],
      imgarr: null,
      keyword: "",
      dialogTitletitle: "",
      inamgFlag: false,
      treeId: "",
      treeData: {},
      accessToken: users.token,
      header: {
        accessToken: this.accessToken,
      },
      imgRul: "",
      name: "",
      fileType: "",
      showurl: "",
      switch: "1",
      classificationEditData: {},
      imgNone: false,
    };
  },
  created() {
    this.init();
    this.getclassification();
  },
  mounted() {
    // console.log(this.$imgHttp);
    document.getElementsByClassName(
      "el-pagination__jump"
    )[0].childNodes[0].nodeValue = "跳至";
  },
  methods: {
    beforeUpload(file) {
      this.UploadSuccessful = false;
      file.name.substring(file.name.lastIndexOf(".") + 1);
      let whiteList = null;
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      // const whiteList = ["pdf", "jpg", "jpeg", "png"];
      if (!this.ruleForm.driver_id) {
        this.$message.warning("请选择上传类型");
        this.inamgFlag = false;
        this.$refs.upload_img.clearFiles();
        return;
      }
      if (this.ruleForm.driver_id == "image") {
        whiteList = ["pdf", "jpg", "jpeg", "png"];
      }
      if (this.ruleForm.driver_id == "pdf") {
        whiteList = ["pdf"];
      }
      if (this.ruleForm.driver_id == "video") {
        whiteList = ["mp4"];
      }
      if (whiteList.indexOf(fileSuffix) === -1) {
        if (this.ruleForm.driver_id == "image") {
          this.$message.warning("请上传jpg、jpeg、png格式的图片");
          this.$refs.upload_img.clearFiles();
          this.inamgFlag = false;
          return false;
        }
        if (this.ruleForm.driver_id == "pdf") {
          this.$message.warning("请上传 pdf 格式的文件");
          this.$refs.upload_img.clearFiles();
          this.inamgFlag = false;
          return false;
        }
        if (this.ruleForm.driver_id == "video") {
          this.$message.warning("请上传 mp4 格式的视频");
          this.$refs.upload_img.clearFiles();
          this.inamgFlag = false;
          return false;
        }
      }
      this.UploadSuccessful = true;
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
      let res = await getManualList({
        keyword: this.keyword,
        category_id: "",
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.tableData = res.data.data;
        } else {
          this.tableData = {};
        }
      } else {
        // this.$message.error("=");
      }
    },
    async getclassification() {
      let res = await getCategoryList({
        keyword: this.keyword,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.classificationList = res.data.data;
        } else {
        }
      } else {
        // this.$message.error("");
      }
    },
    // 上传图片
    async beforeAvatarUpload(file) {
      let res = await upload({
        file: file.raw,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.imgRul = res.data.data;
          this.showurl = this.$imgHttp + this.imgRul.url;
        } else {
          this.imgRul = "";
        }
      } else {
      }
      let types = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (types == "mp4") {
        this.fileType = "mp4";
      } else if (types == "pdf") {
        this.fileType = "pdf";
      } else {
        this.fileType = "img";
      }
      if (this.UploadSuccessful) {
        this.imgarr = file;
      }
    },

    //限制文件一次只能上传一个
    uploadExceed() {
      this.$message.error("一次只能上传一个文件！");
    },
    // 删除图片
    datileImg() {
      this.imgarr = null;
      this.imgRul = "";
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
    // 添加
    electronicsAdd() {
      this.centerDialogVisible = true;
      this.dialogTitletitle = "添加手册";
      this.ruleForm.driver_id = "";
      this.name = "";
      this.imgarr = null;
      this.imgRul = "";
      this.treeText = false;
      // this.ruleForm.driver_id=""
    },
    // 添加手册
    async submit() {
      if (!this.treeId) {
        this.$message.warning("请选择分类");
        return;
      }
      if (!this.ruleForm.driver_id) {
        this.$message.warning("请选择上传类型");
        return;
      }
      if (!this.imgRul) {
        this.$message.warning("请上传文件");
        return;
      }
      let res = await addManual({
        url: this.imgRul.url,
        category_id: this.treeId,
        type: this.ruleForm.driver_id,
      });
      if (res.data.code == 1) {
        this.centerDialogVisible = false;
        this.$message.success("添加成功");
        this.init();
        this.$refs.upload_img.clearFiles();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 编辑手册
    async handleEdit(index, row) {
      this.treeText = false;
      this.centerDialogVisible = true;
      this.dialogTitletitle = "编辑手册";
      let res = await getManualDetails({ id: row.id });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.ruleForm = res.data.data;
          this.ruleForm.driver_id = res.data.data.type;
        }
        // 判断图片地址是否为空
        console.log(this.ruleForm.url);
        if (this.ruleForm.url) {
          this.imgarr = this.ruleForm.url;
          this.showurl = this.$imgHttp + this.ruleForm.url;
        } else {
          this.imgarr = null;
          this.imgRul = "";
        }

        if (this.ruleForm.type == "image") {
          this.fileType = "img";
        } else if (this.ruleForm.type == "video") {
          this.fileType = "mp4";
        } else if (this.ruleForm.type == "pdf") {
          this.fileType = "pdf";
        }
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 编辑手册确定
    async submitEdit() {
      if (!this.ruleForm.driver_id) {
        this.$message.warning("请选择上传类型");
        return;
      }
      if (!this.imgRul) {
        this.$message.warning("请上传文件");
        return;
      }
      let res = await editManual({
        url: this.imgRul.url,
        category_id: this.ruleForm.three.id,
        type: this.ruleForm.driver_id,
        id: this.ruleForm.id,
      });
      if (res.data.code == 1) {
        this.centerDialogVisible = false;
        this.$message.success("修改成功");
        this.init();
        this.$refs.upload_img.clearFiles();
      } else {
        this.$message.error(res.data.msg);
      }
    },

    // 删除
    handleDelete(index, row) {
      this.dialogTips = true;
      this.deteleRow = row;
    },
    // 删除确定
    async deteleCurrent() {
      let res = await getManualList({
        id: this.deteleRow.id,
      });
      if (res.data.code == 1) {
        this.$message.success("删除成功");
        this.dialogTips = false;
        this.init();
      } else {
        this.$message.error("删除失败");
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 分类上传图片
    async handleTestSuccess(file) {
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
      let res = await upload({
        file: file.file,
      });
      if (res.data.code == 1) {
        if (res.data.data) {
          this.imgRul = res.data.data;
        } else {
          this.imgRul = "";
        }
      } else {
      }
    },
    // 删除分类图片
    classificationDetele() {
      this.imgNone = false;
      console.log(this.imgNone);
    },
    handlePictureCardPreview(file) {},
    // tree的新增
    treeEdit() {
      this.treeText = !this.treeText;
    },
    // 树状结构每一项
    handleNodeClick(data) {
      this.treeData = data;
      this.treeId = data.id;
    },
    // 添加分类
    addclassification() {
      this.switch = 1;
      if (!this.treeId) {
        return this.$message.warning("请选择要添加的分类");
      }
      this.dialogclassification = true;
      this.name = "";
      this.imgarr = null;
      this.imgRul = "";
      this.imgNone = false;
    },
    // 分类确定
    async classificationAdd() {
      if (!this.name) {
        return this.$message.warning("请填写分类名称");
      }
      let res = await addCategory({
        name: this.name,
        pid: this.treeData.id,
        image: this.imgRul.url,
        //
      });
      if (res.data.code == 1) {
        this.$message.success("添加成功");
        this.dialogclassification = false;
        this.getclassification();
      } else {
        this.$message.error("添加失败");
      }
    },
    // 分类编辑
    classificationEdit(node, data) {
      console.log(data);
      this.switch = 2;
      this.classificationEditData = data;
      this.dialogclassification = true;
      this.name = this.classificationEditData.name;
      if (this.classificationEditData.image) {
        this.imgNone = true;
      } else {
        this.imgNone = false;
      }
    },
    // 分类编辑确定
    async classificationEditClick() {
      let image = "";
      if (this.imgRul) {
        image = this.imgRul.url;
      } else {
        image = this.classificationEditData.image;
      }
      let res = await editCategory({
        name: this.name,
        pid: this.classificationEditData.pid,
        image: image,
        id: this.classificationEditData.id,
      });
      if (res.data.code == 1) {
        this.$message.success("修改成功");
        this.dialogclassification = false;
        this.getclassification();
      } else {
        this.$message.error("修改失败");
      }
    },
    // 分类删除
    async classificationRemove(node, data) {
      let res = await delCategory({
        id: data.id,
      });
      if (res.data.code == 1) {
        this.$message.success("删除成功");
        this.getclassification();
      } else {
        this.$message.error("该分类下有子集分类不可删除");
      }
    },
  },
};
</script>

<style lang="less">
.head_electronics {
  .head_electronics_card {
     .el-card__body {
      padding: 0;
    }
    .head_electronics_tabs {
      font-size: 18px;
      .electronics_tabs_nr {
        display: flex;
        justify-content: space-between;
        .electronics_btn {
          font-size: 18px;
          background-color: #004da1;
          color: #fff;
          margin-top: 10px;
        }
        .nr_input {
          margin-top: 13px;
          .electronics_input {
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
  .electronics_table {
    margin-top: 20px;
    background-color: #f9f9fbff;
    padding: 20px;
  }
  .electronics_footer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .electronics_Pagination {
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
.electronics_dialog {
  border-radius: 15px;
  .el-dialog {
    width: 900px;
    .dialog_box {
      display: flex;
      border-left: 1px solid #eee;
    }
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
    .box_left {
      width: 50%;
      .tree {
        .catalog_let {
          // margin-left: 50px;
          position: relative;
          top: 0;
          left: 20%;
          text-align: right;
        }
        .tree_operation {
          display: flex;
          justify-content: space-between;
          .operation_btn {
            width: 50px;
            height: 50px;
          }
        }
      }
      .el-tree .el-tree-node__expand-icon.expanded {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      .el-tree .el-icon-caret-right:before {
        content: "\e78b";
      }
      .el-tree-node__content {
        height: 40px;
      }
      .custom-tree-node {
        height: 60px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        padding: 0 20px;
        .tree_label {
          display: inline-block;
          height: 40px;
          font-size: 18px;
          line-height: 40px;
        }
        .tree_label_xian {
          display: inline-block;
          width: 100%;
          height: 1px;
          background-color: #eee;
          margin: 2px 0;
        }
        .node_but,
        .node_but1 {
          width: 50px;
          height: 25px;
          border-radius: 30px;
          border: 1px solid red;
          color: orangered;
          font-size: 14px;
          padding: 5px;
          padding-top: 3;
        }
        .node_but1 {
          border: 1px solid #eee !important;
          color: #606266 !important;
        }
      }
    }
    .box_right {
      width: 61%;
      border-left: 1px solid #eee;
      .box_right_tetle {
        font-size: 16px;
        margin-top: -46px;
        font-weight: 600;
        border-top: 1px solid #eee;
        padding-top: 5px;
        border-left: 1px solid #eee;
        padding-left: 5px;
      }
      .dialog_ruleForm {
        padding-top: 20px;
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
        // .content_input  {
        // .el-select{
        //   .el-input .el-input--suffix{
        //     .el-input__inner{
        //       display: none;
        //     }
        //   }
        // }
        // }
        .div_input_upload {
          margin-top: 40px;
          .upload_img {
            width: 150px;
            height: 150px;
          }
          .upload_img {
            .el-upload--picture-card {
              border: 0;
            }
            .avatar-uploader /deep/ .el-upload {
              border: 1px dashed #d9d9d9;
              border-radius: 6px;
              background-color: #fff;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              width: 180px;
              height: 180px;
            }
            .avatar-uploader .el-upload:hover {
              border-color: #409eff;
            }
            .avatar-uploader-icon {
              font-size: 28px;
              color: #8c939d;
              width: 178px;
              height: 178px;
              line-height: 178px;
              text-align: center;
            }
            .showUploader /deep/ .el-upload-list {
              display: none;
            }
            .avatar {
              width: 178px;
              height: 178px;
              display: block;
            }
          }
        }
      }
      .box_right_line {
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
.dialog_box_tetle {
  width: 45%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding-top: 5px;
  .box_tetle_left {
    font-weight: 600;
    font-size: 16px;
    border-left: 1px solid #eee;
    padding-left: 10px;
  }
  .right_font {
    display: flex;
    .box_tetle_right {
      margin-right: 30px;
      color: #004da1;
      font-weight: 600;
      cursor: pointer;
      font-size: 16px;
    }
    .add_tree {
      height: 20px;
      line-height: 20px;
      margin-right: 10px;
      border: 1px solid #004da1;
      border-radius: 30px;
      color: #004da1;
      padding: 5px;
      cursor: pointer;
    }
  }
}
.box_right_button {
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
.tips_dialog,
.tips_classification {
  .tips {
    border-radius: 50px !important;
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
    .ification input {
      border: none;
      border-bottom: 1px solid #eee;
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
        height: 50px;
      }
      .div_but {
        background-color: #fff;
      }
    }
  }
}
.tips_classification {
  .el-dialog {
    width: 380px;
    margin-top: 10px;
  }
}
.upload_css {
  .upload_imgs_icon {
    position: absolute;
    top: 28px;
    left: 145px;
    font-size: 18px;
    cursor: pointer;
  }
  .upload_imgs {
    width: 150px;
    height: 150px;
    img {
      width: 100%;
      height: 100%;
    }
    video {
      width: 150px;
      height: 150px;
    }
  }
}
.electronics-upload {
  margin-top: 20px;
  .el-upload--picture-card {
    width: 100px !important;
    height: 100px !important;
    line-height: 100px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
}
.classification_css {
  width: 88px;
  height: 88px;
  img {
    width: 100%;
    height: 100%;
  }
  .classification_imgs_icon {
    position: relative;
    top: 5px;
    left: 80px;
    font-size: 18px;
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