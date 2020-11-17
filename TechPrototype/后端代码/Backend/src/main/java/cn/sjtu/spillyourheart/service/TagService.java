package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;

public interface TagService {
    Msg postTag(JSONObject object);
    Msg getTags();
    Msg deleteTag(JSONObject object);
    Msg deleteTags(JSONObject object);
    Msg updateTag(JSONObject object);
}
