package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.service.SensitiveWordService;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserAdmin;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserToken;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class SensitiveWordController {
    @Autowired
    private SensitiveWordService sensitiveWordService;

    @RequestMapping("/postSensitiveWord")
    //@UserToken
    //@UserAdmin
    public Msg postSensitiveWord(@RequestBody JSONObject object){ return sensitiveWordService.postOne(object); }

    @RequestMapping("/deleteSensitiveWord")
    //@UserToken
    //@UserAdmin
    public Msg deleteSensitiveWord(@RequestBody JSONObject object){ return sensitiveWordService.deleteOne(object); }


    @RequestMapping("/getSensitiveWords")
    //@UserToken
    //@UserAdmin
    public Msg getSensitiveWords(){ return sensitiveWordService.getAll(); }
}
