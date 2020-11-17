package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;

public interface FollowService {
    Msg getAllFollow(Integer userId);
    Msg getAllFollower(Integer userId);
    Msg isFollow(JSONObject jsonObject);
    Msg remove(JSONObject jsonObject);
    Msg follow(JSONObject jsonObject);
}
