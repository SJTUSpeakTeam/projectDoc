package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.entity.User;
import cn.sjtu.spillyourheart.entity.UserAuth;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;

public interface UserService {
    UserAuth findUserAuthById(Integer id);
    User findUserById(Integer id);
    Msg login(JSONObject object);
    Msg registry(JSONObject object);
    Msg findAll(Integer page);
    Msg findByKey(JSONObject object);
    Msg banLiftUser(JSONObject object, Boolean valid);
    Msg verify(String value, String type);
    Msg findOne(Integer id);
    Msg transfer(JSONObject jsonObject);
    Msg modify(JSONObject jsonObject);
    JSONObject parseToken(String token);
}
