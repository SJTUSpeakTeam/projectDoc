package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;

public interface SensitiveWordService {
    Msg postOne(JSONObject object);
    Msg deleteOne(JSONObject object);
    Msg getAll();
}
