package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.entity.Follow;
import cn.sjtu.spillyourheart.service.FollowService;
import cn.sjtu.spillyourheart.service.MailService;
import cn.sjtu.spillyourheart.service.UserService;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserAdmin;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserValid;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private MailService mailService;

    @Autowired
    private FollowService followService;

    @RequestMapping("/get-one")
    @UserToken
    public Msg getOneUser(@RequestParam("id") Integer id) {
        return userService.findOne(id);
    }

    @RequestMapping("/get-all")
    @UserToken
    @UserAdmin
    public Msg getAllUser(@RequestParam("page") Integer page) {
        if (page < 0)
            return MsgUtil.makeMsg(MsgCode.ERROR, "出错，页码不能为负数");
        return userService.findAll(page);
    }

    @RequestMapping("/get-some")
    public Msg getSomeUser(@RequestBody JSONObject object) {
        Msg userMsg = userService.findSome(object);

        Boolean checkFollow = null;
        Integer userId = null;
        if (object.containsKey("checkFollow")){
            checkFollow = object.getBoolean("checkFollow");
        }
        if (object.containsKey("userId")) {
            userId = object.getInt("userId");
        }

        // check if follow
        if (checkFollow != null && checkFollow){
            if (userId == null){
                System.out.println("[ERROR] UserService: findSome: userId 为 null");
                return MsgUtil.makeMsg(MsgUtil.ERROR, "userId 为 null :(");
            }
            JSONObject followInput = new JSONObject();
            followInput.put("userId", object.getString("userId"));
            followInput.put("followIds", object.getJSONArray("idArray"));
            Msg followMsg = followService.isFollow(followInput);
            JSONArray followIds = followMsg.getData().getJSONArray("followIds");
            JSONObject returnVal = userMsg.getData();
            JSONArray userList = returnVal.getJSONArray("userList");
            for(Integer i = 0; i < userList.size(); ++i){
                JSONObject metaUser = userList.getJSONObject(i);
                JSONObject user = metaUser.getJSONObject("user");
                user.put("isFollow", false);
                for(Integer j = 0; j < followIds.size(); ++j){
                    Integer id = followIds.getInt(j);
                    if (id == user.getInt("userId")){
                        user.put("isFollow", true);
                        break;
                    }
                }
                metaUser.put("user", user);
                userList.set(i, metaUser);
            }
            returnVal.put("userList", userList);
            userMsg.setData(returnVal);
        }

        return userMsg;
    }

    @RequestMapping("/get-key")
    @UserToken
    @UserAdmin
    public Msg getUserByKey(@RequestBody JSONObject object){
        return userService.findByKey(object);
    }

    @RequestMapping("/ban")
    @UserToken
    @UserAdmin
    public Msg banUser(@RequestBody JSONObject object){
        return userService.banLiftUser(object, false);
    }

    @RequestMapping("/lift-ban")
    @UserToken
    @UserAdmin
    public Msg liftBan(@RequestBody JSONObject object){
        return userService.banLiftUser(object, true);
    }

    @RequestMapping("/modify-info")
    @UserToken
    @UserValid
    public Msg modifyInfo(@RequestBody JSONObject object){
        Msg msg = userService.modify(object);
        if (msg.getData().containsKey("mailAddr"))
        {
            mailService.sendVerifyMail(msg.getData().getString("mailAddr"), msg.getData().getString("token"));
        }
        return msg;
    }

    @RequestMapping("/modify-password")
    @UserToken
    @UserValid
    public Msg modifyPassword(@RequestBody JSONObject object){
        return userService.modify(object);
    }

    @RequestMapping("/transfer")
    @PassToken
    public Msg transfer(@RequestBody JSONObject object){
        return userService.transfer(object);
    }
}
