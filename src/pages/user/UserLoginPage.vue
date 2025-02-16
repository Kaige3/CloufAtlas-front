<template>
  <div id="userLoginPage">
    <h2 class="title">凯的云图库 - 用户登录</h2>
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

      <div class="tips">
        没有账号？
        <RouterLink to="/user/register">去注册</RouterLink>
      </div>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width:100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import {useLoginUserStore} from "@/store/user";
import {useRouter} from "vue-router";
import {userLoginUsingPost} from "@/api/userController";
import {message} from "ant-design-vue";

const router = useRouter();
const loginUserStore = useLoginUserStore();

// 表单接受数据
const formState = reactive<API.UserLoginDto>({
  userAccount: '',
  userPassword: '',
})

// 提交表单
const handleSubmit = async (values: any) => {
  // 登录成功，把状态保存到全局状态中
  const res = await userLoginUsingPost(values);
  if (res.data.code === 0 && res.data.data){
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    router.push({
      path: '/',
      replace: true,
    })
  }else {
    message.error('登录失败'+res.data.message)
  }
  console.log('Received values of form: ', values);
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
