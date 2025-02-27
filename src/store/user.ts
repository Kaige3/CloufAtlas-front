import {defineStore} from "pinia";
import {ref} from "vue";
import {getLoginUserVoUsingGet} from "@/api/userController";

export const useLoginUserStore = defineStore("loginUserStore", () =>{
  const loginUser = ref<API.LoginUserVo>({
      userName : "未登录",
      userAvatar : "",

  })

  async function fetchLoginUser(){
    const res = await getLoginUserVoUsingGet();
    if(res.data.code === 0 && res.data.data){
      loginUser.value = res.data.data
    }

  }

  // 获取用户信息
  function setLoginUser(user:any){
    loginUser.value = user;
  }

  return {
    loginUser,
    setLoginUser,
    fetchLoginUser
  }
});

