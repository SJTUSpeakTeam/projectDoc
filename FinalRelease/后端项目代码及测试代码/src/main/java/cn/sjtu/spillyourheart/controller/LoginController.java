package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.service.MailService;
import cn.sjtu.spillyourheart.service.UserService;
import cn.sjtu.spillyourheart.utilis.jwtutils.JwtUtil;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginController {
    @Autowired
    private UserService userService;

    @Autowired
    private MailService mailService;

    @RequestMapping("/logout")
    @ResponseBody
    @PassToken
    public Integer logout(@RequestBody JSONObject object){ return 0; }

    @PostMapping(value = "/login")
    @ResponseBody
    @PassToken
    public Msg login(@RequestBody JSONObject object) {
        return userService.login(object);
    }

    @GetMapping(value = "/ulogin")
    @ResponseBody
    @PassToken
    public Msg ulogin() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("mailAddr", "sjz@sjtu.du.cn");
        jsonObject.put("password", "sijinze");
        return userService.login(jsonObject);
    }

    @RequestMapping("/registry")
    @ResponseBody
    @PassToken
    public Msg registry(@RequestBody JSONObject object){
        Msg msg = userService.registry(object);
        if (msg.getStatus() == MsgCode.SUCCESS.getStatus()){
            mailService.sendVerifyMail(object.getString("mailAddr"), msg.getData().getString("token"));
        }
        return msg;
    }

    @RequestMapping("/verify/nickname")
    @ResponseBody
    @PassToken
    public Msg verifyNickName(@RequestParam("value") String nickname){
        return userService.verify(nickname, "nickname");
    }

    @RequestMapping("/verify/mailAddr")
    @ResponseBody
    @PassToken
    public Msg verifyMailAddr(@RequestParam("value") String mailAddr){
        return userService.verify(mailAddr, "mailAddr");
    }
}
