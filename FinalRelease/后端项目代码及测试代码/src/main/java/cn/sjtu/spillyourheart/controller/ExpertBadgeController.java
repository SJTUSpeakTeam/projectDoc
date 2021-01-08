package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.service.ExpertBadgeService;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserValid;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class ExpertBadgeController {
    @Autowired
    private ExpertBadgeService expertBadgeService;

    @RequestMapping("/getExpertBadge")
    @UserToken
    @UserValid
    public Msg getExpertBadge(@RequestParam("userId") int userId){ return expertBadgeService.getOneByUser(userId); }

}
