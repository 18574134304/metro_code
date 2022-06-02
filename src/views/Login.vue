<template>
  <div class="box">
    <div class="background">
      <div class="">
        <div class="login_box">
          <div class="login_box_img">
            <div class="avatar_box"></div>
          </div>
          <div class="login_box_title">地铁车载信息交互与可视化终端</div>
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login_form"
            label-width="50px"
            label-position="top"
          >
            <div class="login_form_title">工号</div>
            <el-form-item prop="account" class="login_form_input">
              <div class="log_input">
                <el-input
                 placeholder="请输入工号"
                  style="border: 0px"
                  v-model="loginForm.account"
                  prefix-icon="iconfont icondenglu"
                ></el-input>
              </div>
            </el-form-item>
            <div class="login_form_title">密码</div>
            <el-form-item prop="password">
              <div class="log_input">
                <el-input
                 placeholder="请输入密码"
                  v-model="loginForm.password"
                  prefix-icon="iconfont iconmima"
                  type="password"
                ></el-input>
              </div>
            </el-form-item>

            <el-form-item class="btns">
              <el-button class="btns_click" type="info" @click="login"
                >登 录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginGo, getChannel } from "@/views/utils/api";
export default {
  data() {
    return {
      loginForm: {
        account: "",
        password: "",
      },
      loginRules: {
        account: [{ required: true, message: "请输入工号", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 2, max: 8, message: "密码为 2~8 位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async login() {
      let formData = new FormData();
      formData.append("account", this.loginForm.account);
      formData.append("password", this.loginForm.password);
      let res = await loginGo("user/login", formData);
      if (res.status == 200) {
        localStorage.setItem("user", JSON.stringify(res.data.data));
        this.$router.push({ path: "/index" });
      } else {
        this.$message.error("登录失败");
      }




      // let res = await loginGo("user/login", this.loginForm);
      // if (res.status == 200) {
      //   // 存储自己uid
      //   localStorage.setItem("user", JSON.stringify(res.data.data));
      //    localStorage.setItem("token", JSON.stringify(res.data.token));
      //     this.$router.push({ path: "/index" });
      //   console.log(res);
      // } else {
      //   this.$message.error("登录失败");
      // }
      // this.$refs.loginFormRef.validate((valid) => {
      //   if (valid) {
      //   }
      // });
    },
  },
};
</script>

<style lang="less">
.background {
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url("../assets/login1.png");
  // 登录框
  .login_box {
    width: 450px;
    height: 430px;
    background-color: #fff;
    border-radius: 15px; // 圆角
    position: absolute; // 绝对定位
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); // 根据自己位置 以自己为长度位移
    .login_box_img {
      height: 575px;
      text-align: center;
      position: absolute; // 绝对定位
      left: 50%;
      top: 75%;
      transform: translate(-50%, -50%);
    }
    .login_box_title {
      font-size: 20px;
      position: absolute; // 绝对定位
      left: 20%;
      top: 36%;
      font-weight: 800;
    }
    // 头像框
    .avatar_box {
      width: 80px;
      height: 80px;
      border: 1px solid #eee;
      border-radius: 20%; // 加圆角
      padding: 10px;
      box-shadow: 0 0 10px #ddd; // 盒子阴影
      opacity: 0.8; //透明属性
      background-color: #9b9b9b;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%; // 加圆角
        background-color: #eee;
      }
    }

    .loginRem {
      color: black;
      font-weight: 900;
    }
    .btns {
      display: flex; // 弹性布局
      border-radius: 30px;
      justify-content: center; // 尾部对齐
      .btns_click {
        width: 267px;
        height: 40px;
        background-color: #094194;
        border-radius: 15px;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0%;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box; // 设置边框
      margin-top: -10px;
      .login_form_title {
        font-size: 15px;
        font-weight: 600;
      }
      // .login_form_input/l-input/{
      //    border: 0px;
      // }
    }
  }
}
.log_input input {
  border: none;
  border-bottom: 1px solid #eee;
  width: 90%;
}
.log_input{
  .el-input--prefix .el-input__inner{
    padding: 0;
  }
}
</style>