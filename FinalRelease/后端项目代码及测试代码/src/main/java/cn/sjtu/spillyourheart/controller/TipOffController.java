package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class TipOffController {
    //@Autowired
    //private TipOffService tipOffService;

    @RequestMapping("/postTipOff")
    public Msg postTipOff(@RequestBody JSONObject object){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }

    //@RequestMapping("/getTipOff")
    //public Msg getTipOff(@RequestBody JSONObject object){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }

    @RequestMapping("/getTipOffs")
    public Msg getTipOffs(@RequestParam("userId") int userId){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }

    @RequestMapping("/deleteTipOff")
    public Msg deleteTipOff(@RequestBody JSONObject object){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }

    @RequestMapping("/updateTipOff")
    public Msg updateTipOff(@RequestBody JSONObject object){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }
}
