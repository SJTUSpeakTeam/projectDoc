package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.service.MailService;
import cn.sjtu.spillyourheart.service.UserService;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserAdmin;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserValid;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private MailService mailService;

    @RequestMapping("/get-one")
    @UserToken
    public Msg getOneUser(@RequestParam("id") Integer id) {
        return userService.findOne(id);
    }

    @RequestMapping("/get-all")
    @UserToken
    @UserAdmin
    public Msg getAllUser(@RequestParam("page") Integer page) {
        return userService.findAll(page);
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
        System.out.println("okay,baning");
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
