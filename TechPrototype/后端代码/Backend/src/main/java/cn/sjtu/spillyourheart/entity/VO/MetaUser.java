package cn.sjtu.spillyourheart.entity.VO;

import cn.sjtu.spillyourheart.entity.AdminUser;
import cn.sjtu.spillyourheart.entity.RegularUser;
import cn.sjtu.spillyourheart.entity.User;
import cn.sjtu.spillyourheart.entity.UserAuth;
import net.sf.json.JSONObject;

import java.util.Optional;

public class MetaUser {
    public User user;
    public UserAuth userAuth;
    public RegularUser regularUser;
    public AdminUser adminUser;

    public MetaUser(){
        user = null;
        userAuth = null;
        regularUser = null;
        adminUser = null;
    }

    public JSONObject toJSONObject(){
        JSONObject object = new JSONObject();
        if (user != null){
            JSONObject innerObject = JSONObject.fromObject(user);
            object.put("user", innerObject);
        }
        if (userAuth != null){
            JSONObject innerObject = JSONObject.fromObject(userAuth);
            innerObject.remove("userId");
            innerObject.remove("password");
            Integer userType = userAuth.getUserType();
            if (userType == 0){
                innerObject.put("humanStatus", "被禁用户");
            }
            else if (userType == 1){
                innerObject.put("humanStatus", "管理员");
            }
            else if (userType == 2){
                innerObject.put("humanStatus", "正常用户");
            }
            else if (userType == 3){
                innerObject.put("humanStatus", "待邮箱激活用户");
            }
            else{
                innerObject.put("humanStatus", "未知用户");
            }
            object.put("userAuth", innerObject);
        }
        if (regularUser != null){
            JSONObject innerObject = JSONObject.fromObject(regularUser);
            innerObject.remove("userId");
            object.put("regularUser", innerObject);
        }
        if (adminUser != null){
            JSONObject innerObject = JSONObject.fromObject(adminUser);
            innerObject.remove("userId");
            object.put("adminUser", innerObject);
        }
        return object;
    }
}
