package cn.sjtu.spillyourheart.serviceImpl;

import cn.sjtu.spillyourheart.dao.UserDao;
import cn.sjtu.spillyourheart.entity.RegularUser;
import cn.sjtu.spillyourheart.entity.User;
import cn.sjtu.spillyourheart.entity.UserAuth;
import cn.sjtu.spillyourheart.entity.VO.MetaUser;
import cn.sjtu.spillyourheart.service.UserService;
import cn.sjtu.spillyourheart.utilis.jwtutils.JwtUtil;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    @Override
    public UserAuth findUserAuthById(Integer id) {
        return userDao.findUserAuthById(id);
    }

    @Override
    public User findUserById(Integer id) {
        return userDao.findUserById(id);
    }

    @Override
    public Msg login(JSONObject object) {
        String mailAddr = object.get("mailAddr").toString();
        String password = object.get("password").toString();
        UserAuth userAuth;
        // 根据 ID 搜寻 userAuth 实体类
        System.out.println("[LOG]UserService: login with: mailAddr:" + mailAddr + ", " + "password:" + password);
        try {
            userAuth = userDao.findUserAuthByEP(mailAddr, password);
            if (userAuth == null){
                System.out.println("[ERROR]:UserService: login with an unknown account");
                return MsgUtil.makeMsg(MsgCode.ERROR, MsgUtil.LOGIN_USER_ERROR_MSG);
            }
        }
        catch (Exception e){
            System.out.println("[ERROR]:UserService: login encounter an unknown error");
            e.printStackTrace();
            return MsgUtil.makeMsg(MsgCode.ERROR, MsgUtil.ERROR_MSG);
        }
        // 根据 userAuth 的 userType 决定返回类型，userType
        Integer userType = userAuth.getUserType();
        switch (userType){
            case 0: return MsgUtil.makeMsg(MsgCode.ERROR, "您的账号已被 ban");
            case 1:
            case 2: break;
            case 3: return MsgUtil.makeMsg(MsgCode.ERROR, "请先进行邮箱认证");
            default: return MsgUtil.makeMsg(MsgCode.ERROR, "错误，未知用户类型: " + userType.toString());
        }
        // 取出 user 信息
        User user = userDao.findUserById(userAuth.getUserId());
        // 构造返回值
        JSONObject data = JSONObject.fromObject(user);
        data.put("token", JwtUtil.getToken(userAuth));
        data.put("email", userAuth.getMailAddr());
        data.put("userType", userAuth.getUserType());
        return MsgUtil.makeMsg(MsgCode.SUCCESS, MsgUtil.LOGIN_SUCCESS_MSG, data);
    }

    @Override
    public Msg registry(JSONObject object) {
        User user = new User();
        UserAuth userAuth = new UserAuth();
        RegularUser regularUser = new RegularUser();

        String mailAddr;
        String phoneNum;
        String password;
        String nickname;

        try{
            mailAddr = object.get("mailAddr").toString();
            phoneNum = object.get("phoneNum").toString();
            password = object.get("password").toString();
            nickname = object.get("nickname").toString();
        }
        catch (Exception e){
            System.out.println("[ERROR]UserService: parsing registry parameters failed");
            e.printStackTrace();
            return MsgUtil.makeMsg(MsgUtil.ERROR, MsgUtil.ERROR_MSG);
        }

        user.init();
        regularUser.init();

        user.setPhoneNum(phoneNum);
        user.setNickname(nickname);

        // user need to do mail validation
        userAuth.setUserType(3);
        userAuth.setPassword(password);
        userAuth.setMailAddr(mailAddr);

        try{
            user = userDao.save(user);
        }
        catch (Exception e){
            System.out.println("[ERROR]UserService: creating user entity failed");
            e.printStackTrace();
            clearUser(user.getUserId());
            return MsgUtil.makeMsg(MsgUtil.ERROR, MsgUtil.ERROR_MSG);
        }

        Integer id = user.getUserId();
        if (id == null){
            System.out.println("[ERROR]UserService: getting null user id");
            clearUser(id);
            return MsgUtil.makeMsg(MsgUtil.ERROR, MsgUtil.ERROR_MSG);
        }

        // create userAuth id after user entity is created
        userAuth.setUserId(id);
        regularUser.setUserId(id);

        // create token for controller
        String token = JwtUtil.getToken(userAuth);

        try {
            userDao.saveAuth(userAuth);
            userDao.saveRegular(regularUser);
        }
        catch (Exception e){
            System.out.println("[ERROR]UserService: creating Auth/Regular entity failed");
            e.printStackTrace();
            clearUser(id);
            return MsgUtil.makeMsg(MsgCode.ERROR, MsgUtil.ERROR_MSG);
        }
        // 生成返回信息
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("token", token);
        return MsgUtil.makeMsg(MsgUtil.SUCCESS, MsgUtil.SUCCESS_MSG, jsonObject);
    }

    @Override
    public Msg findByKey(JSONObject object) {
        return null;
    }

    @Override
    public Msg banLiftUser(JSONObject object, Boolean valid) {
        JSONArray array;
        try{
            array = object.getJSONArray("idArray");
        }
        catch (Exception e){
            System.out.println("[ERROR] UserService: liftBan: idArray 不存在，参数错误");
            e.printStackTrace();
            return MsgUtil.makeMsg(MsgUtil.ERROR, "用户的 idArray 不存在");
        }
        try {
            for (int i = 0; i < array.size(); i++) {
                Integer id = array.getInt(i);
                // check user existence first
                if (userDao.banLiftUser(id, valid)){
                    continue;
                }
                else{
                    System.out.println("[ERROR] UserService: liftBan: id 不存在或尝试 ban 管理员用户" + id.toString());
                    return MsgUtil.makeMsg(MsgUtil.ERROR, "用户的 id 不存在或该用户为管理员");
                }
            }
        }
        catch (Exception e){
            System.out.println("[ERROR] UserService: liftBan: 未知错误");
            e.printStackTrace();
            return MsgUtil.makeMsg(MsgUtil.ERROR, MsgUtil.ERROR_MSG);
        }
        return MsgUtil.makeMsg(MsgUtil.SUCCESS, MsgUtil.SUCCESS_MSG);
    }

    @Override
    public Msg verify(String value, String type) {
        if (userDao.exist(value, type)){
            return MsgUtil.makeMsg(MsgUtil.ERROR, MsgUtil.ERROR_MSG);
        }
        else{
            return MsgUtil.makeMsg(MsgUtil.SUCCESS, MsgUtil.SUCCESS_MSG);

        }
    }

    @Override
    public Msg findOne(Integer id) {
        MetaUser metaUser = userDao.findOneMeta(id);
        if (metaUser == null){
            return MsgUtil.makeMsg(MsgCode.ERROR, "所请求的用户不存在");
        }
        // 对于普通用户，要更新其访问次数信息
        if (metaUser.regularUser != null){
            metaUser.regularUser.setVisitNum(metaUser.regularUser.getVisitNum() + 1);
            userDao.saveRegular(metaUser.regularUser);
        }
        else {
            System.out.println("[WARNING] UserService: findOne with no regularUser, id: " + id.toString());
        }
        return MsgUtil.makeMsg(MsgCode.SUCCESS, MsgUtil.SUCCESS_MSG, metaUser.toJSONObject());
    }

    @Override
    public Msg transfer(JSONObject jsonObject) {
        Integer userId;
        Integer userType;
        try {
            userId = jsonObject.getInt("userId");
            userType = jsonObject.getInt("userType");
        }
        catch (Exception e){
            e.printStackTrace();
            return MsgUtil.makeMsg(MsgCode.ERROR, "读取参数失败");
        }
        UserAuth userAuth = userDao.findUserAuthById(userId);
        if (userAuth == null){
            System.out.println("[ERROR] UserService: transfer a unknown userAuth");
            return MsgUtil.makeMsg(MsgCode.ERROR, "用户不存在，id：" + userId.toString());
        }
        userAuth.setUserType(userType);
        userDao.saveAuth(userAuth);
        return MsgUtil.makeMsg(MsgCode.SUCCESS, MsgUtil.SUCCESS_MSG);
    }

    @Override
    public Msg modify(JSONObject jsonObject) {
        Integer userId = null;
        String token = "";
        String msg;
        JSONObject returnVal = new JSONObject();

        // 取出对应参数
        if (jsonObject.containsKey("userId")){
            userId = jsonObject.getInt("userId");
        }

        if (userId == null){
            return MsgUtil.makeMsg(MsgCode.ERROR, "参数错误：userId 不存在");
        }

        // 从数据库中取出 VO 类
        MetaUser metaUser = userDao.findOneMeta(userId);

        // 根据是否包含某个 key，修改用户信息
        if (jsonObject.containsKey("avatar")){
            metaUser.user.setAvatar(jsonObject.getString("avatar"));
        }
        if (jsonObject.containsKey("gender")){
            metaUser.user.setGender(jsonObject.getBoolean("gender"));
        }
        if (jsonObject.containsKey("phoneNum")){
            metaUser.user.setPhoneNum(jsonObject.getString("phoneNum"));
        }
        if (jsonObject.containsKey("profile")){
            metaUser.regularUser.setProfile(jsonObject.getString("profile"));
        }
        if (jsonObject.containsKey("mailAddr")){
            metaUser.userAuth.setMailAddr(jsonObject.getString("mailAddr"));
            metaUser.userAuth.setUserType(3);
            // 改动返回值
            msg = "您已改动邮箱地址，请重新登录";
            token = JwtUtil.getToken(metaUser.userAuth);
            returnVal.put("mailAddr", metaUser.userAuth.getMailAddr());
        }
        else{
            msg = "修改个人信息成功 : )";
        }
        if (jsonObject.containsKey("nickname")){
            metaUser.user.setNickname(jsonObject.getString("nickname"));
        }
        if (jsonObject.containsKey("password")){
            metaUser.userAuth.setPassword(jsonObject.getString("password"));
            // 改动返回值
            token = JwtUtil.getToken(metaUser.userAuth);
        }

        // 将改动的数据持久化到数据库
        userDao.saveAuth(metaUser.userAuth);
        userDao.save(metaUser.user);
        userDao.saveRegular(metaUser.regularUser);

        // 构造返回值
        returnVal.put("token", token);
        return MsgUtil.makeMsg(MsgCode.SUCCESS, msg, returnVal);
    }

    @Override
    public Msg findAll(Integer page) {
        List<MetaUser> metaUserList = userDao.findAllMeta(page);
        JSONArray jsonArray = new JSONArray();
        for (MetaUser metaUser : metaUserList){
            jsonArray.add(metaUser.toJSONObject());
        }
        JSONObject object = new JSONObject();
        object.put("userList", jsonArray);
        object.put("page", page);
        List<String> strings = new ArrayList<>();
        if (strings.contains("happy")){
            return null;
        }
        return MsgUtil.makeMsg(MsgCode.SUCCESS, MsgUtil.SUCCESS_MSG, object);
    }

    private void clearUser(Integer id){
        userDao.delete(id);
        userDao.deleteAuth(id);
        userDao.deleteRegular(id);
        return;
    }

    @Override
    public JSONObject parseToken(String token){
        // 获取 token 中的 user id
        String userId;
        try {
            userId = JWT.decode(token).getAudience().get(0);
        } catch (JWTDecodeException j) {
            System.out.println("[ERROR]: token parse false as JWT exception");
            return null;
        }
        // 确定 userAuth 存在
        Integer id = Integer.parseInt(userId);
        System.out.println("[LOG] get user id: " + id.toString());
        UserAuth userAuth = findUserAuthById(id);
        if (userAuth == null) {
            System.out.println("[ERROR]: token parse false as UserAuth not exist");
            return null;
        }
        // 验证 token
        JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256(userAuth.getPassword())).build();
        try {
            jwtVerifier.verify(token);
        } catch (JWTVerificationException e) {
            System.out.println("[ERROR]: token parse false as token verification failed");
            return null;
        }
        // 构造返回值
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("userId", userId);
        jsonObject.put("token", token);
        jsonObject.put("userTypeOld", userAuth.getUserType());
        return jsonObject;
    }
}
