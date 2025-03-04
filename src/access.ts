// 是否为首次登录用户
import router from "@/router";
import {useLoginUserStore} from "@/store/user";
import {message} from "ant-design-vue";

let firstFetchLoginUser = true;

// 全局权限校验
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore();
  let loginUser = loginUserStore.loginUser;
  // 首次加载，返回用户信息
  if(firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser();
    loginUser =loginUserStore.loginUser;
    firstFetchLoginUser = false;
  }
  const toRrl = to.fullPath;
  if(toRrl.startsWith('/admin')) {
    if(!loginUser || loginUser.userRole !== 'admin') {
      message.error("您没有权限访问该页面");
      next(`/user/login?redirect=${toRrl}`);
      return
    }
  }
  next();
})
