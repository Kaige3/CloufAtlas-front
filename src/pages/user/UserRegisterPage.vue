<template>
  <div id="userLoginPage">
    <h2 class="title">凯的云图库 - 用户注册</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">

      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
        <a-input placeholder="请输入账号" v-model:value="formState.userAccount" />
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[{ required: true, message: '请输入密码' },
                { min:8,message:'密码至少8位'}]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码"/>
      </a-form-item>

      <a-form-item
        name="checkPassword"
        :rules="[{ required: true, message: '请输入确认密码' },
                { min:8,message:'确认密码至少8位'}]"
      >
        <a-input-password v-model:value="formState.checkPassword" placeholder="请输入确认密码"/>
      </a-form-item>

      <div class="tips">
        没有账号？
        <RouterLink to="/user/register">去注册</RouterLink>
      </div>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width:100%">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import {useLoginUserStore} from "@/store/user";
import {useRouter} from "vue-router";
import {userLoginUsingPost, userRegisterUsingPost} from "@/api/userController";
import {message} from "ant-design-vue";

const router = useRouter();
const loginUserStore = useLoginUserStore();

// 表单接受数据
const formState = reactive<API.UserRegisterDto>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

// 提交表单
const handleSubmit = async (values: any) => {
  // 校验表单
  if (formState.userPassword !== formState.checkPassword) {
    message.error('两次输入的密码不一致');
    return;
  }
  console.log('=======',values)
  const res = await userRegisterUsingPost(values);
  if (res.data.code === 0 && res.data.data) {
    message.success('注册成功');
    router.push({
      path: '/user/login',
      replace: true,
    })
  }
  else {
      message.error("注册失败"+res.data.message);
    }

};


</script>

<style scoped>

#userLoginPage {
  width: 360px;
  margin: 0 auto;
}

.title{
  text-align: center;
  margin-bottom: 20px;
}

.desc{
  text-align: center;
  color: #bbb;
  margin-bottom: 20px;
}

.tips{
  text-align: right;
  margin-bottom: 16px;
  color: #bbbbbb;
  font-size: 13px;
}

</style>
