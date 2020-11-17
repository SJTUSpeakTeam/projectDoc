package cn.sjtu.spillyourheart.utilis.msgutils;

import net.sf.json.JSONObject;

public class MsgUtil {

    public static final int SUCCESS = 0;
    public static final int ERROR = -1;
    public static final int LOGIN_USER_ERROR = -100;
    public static final int NOT_LOGGED_IN_ERROR = -101;

    public static final String SUCCESS_MSG = "操作成功 :)";
    public static final String ERROR_MSG = "操作失败或出现未知错误 :(";

    public static final String PARAMETER_ERR_MSG = "参数获取错误 :(";

    public static final String LOGIN_SUCCESS_MSG = "登录成功 :)";
    public static final String LOGOUT_SUCCESS_MSG = "登出成功 :)";
    public static final String LOGOUT_ERR_MSG = "登出异常 :(";
    public static final String LOGIN_USER_ERROR_MSG = "用户不存在或用户名或密码错误 :(";
    public static final String NOT_LOGGED_IN_ERROR_MSG = "登录失效，请重新登录 :(";

    public static final String ADD_TO_CART_SUCCESS = "加入购物车成功 :)";
    public static final String CREATE_PURCHASE_SUCCESS = "下单成功 :)";
    public static final String NO_ENOUGH_INVENTORY = "库存不足 :(";



    public static Msg makeMsg(MsgCode code, JSONObject data){
        return new Msg(code, data);
    }

    public static Msg makeMsg(MsgCode code, String msg, JSONObject data){
        return new Msg(code, msg, data);
    }

    public static Msg makeMsg(MsgCode code){
        return new Msg(code);
    }

    public static Msg makeMsg(MsgCode code, String msg){
        return new Msg(code, msg);
    }

    public static Msg makeMsg(int status, String msg, JSONObject data){
        return new Msg(status, msg, data);
    }

    public static Msg makeMsg(int status, String msg){
        return new Msg(status, msg);
    }
}
