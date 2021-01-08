package cn.sjtu.spillyourheart.service;


import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;

public interface ExpertBadgeService {
    Msg getOneByUser(Integer userId);
    Msg judge(JSONObject object);
}
