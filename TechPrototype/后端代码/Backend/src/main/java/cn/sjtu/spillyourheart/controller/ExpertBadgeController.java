package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class ExpertBadgeController {
    //@Autowired
    //private ExpertBadgeService expertBadgeService;

    @RequestMapping("/postExpertBadge")
    public Msg postExpertBadge(@RequestBody JSONObject object){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }

    @RequestMapping("/getExpertBadge")
    public Msg getExpertBadge(@RequestParam("badgeId") int badgeId){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }

    @RequestMapping("/deleteExpertBadge")
    public Msg deleteExpertBadge(@RequestBody JSONObject object){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }

    @RequestMapping("/updateExpertBadge")
    public Msg updateExpertBadge(@RequestBody JSONObject object){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }

    @RequestMapping("/grantExpertBadge")
    public Msg grantExpertBadge(@RequestBody JSONObject object){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }
}
