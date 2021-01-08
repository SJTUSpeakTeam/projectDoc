package cn.sjtu.spillyourheart.serviceImpl;

import cn.sjtu.spillyourheart.dao.FollowDao;
import cn.sjtu.spillyourheart.dao.UserDao;
import cn.sjtu.spillyourheart.entity.Follow;
import cn.sjtu.spillyourheart.entity.User;
import cn.sjtu.spillyourheart.entity.UserAuth;
import cn.sjtu.spillyourheart.entity.VO.MetaUser;
import cn.sjtu.spillyourheart.service.FollowService;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowServiceImpl implements FollowService {
    @Autowired
    private FollowDao followDao;

    @Autowired
    private UserDao userDao;

    @Override
    public Msg getAllFollow(Integer userId) {
        List<Follow> relations = helperFindRelations(userId, "allFollow");
        if (relations == null){
            return MsgUtil.makeMsg(MsgCode.ERROR, "查不到 userId " + userId.toString() + " 的 follow 列表");
        }
        // 构造返回值
        JSONObject jsonObject = new JSONObject();
        JSONArray jsonArray = new JSONArray();
        for (Follow relation: relations){
            jsonArray.add(relation.getTargetId());
        }
        jsonObject.put("followIds", jsonArray);
        return MsgUtil.makeMsg(MsgCode.SUCCESS, MsgUtil.SUCCESS_MSG, jsonObject);
    }

    @Override
    public Msg getAllFollower(Integer userId) {
        List<Follow> relations = helperFindRelations(userId, "allFollower");
        if (relations == null){
            return MsgUtil.makeMsg(MsgCode.ERROR, "查不到 userId " + userId.toString() + " 的 follower 列表");
        }
        // 构造返回值
        JSONObject jsonObject = new JSONObject();
        JSONArray jsonArray = new JSONArray();
        for (Follow relation: relations){
            jsonArray.add(relation.getUserId());
        }
        jsonObject.put("followIds", jsonArray);
        return MsgUtil.makeMsg(MsgCode.SUCCESS, MsgUtil.SUCCESS_MSG, jsonObject);
    }

    @Override
    public Msg isFollow(JSONObject inputObject) {
        Integer userId;
        JSONArray followIds;
        // 取参数
        try {
            userId = inputObject.getInt("userId");
            followIds = inputObject.getJSONArray("followIds");
        }
        catch (Exception e){
            e.printStackTrace();
            return MsgUtil.makeMsg(MsgCode.ERROR, "参数获取失败");
        }
        // 查所有的关注列表
        List<Follow> relations = helperFindRelations(userId, "allFollow");
        if (relations == null){
            return MsgUtil.makeMsg(MsgCode.ERROR, "查不到 userId " + userId.toString() + " 的 follow 列表");
        }
        // 若关注列表中有其人，添加至返回值
        JSONObject jsonObject = new JSONObject();
        JSONArray jsonArray = new JSONArray();
        for (Follow relation: relations){
            if (followIds.contains(relation.getTargetId()))
                jsonArray.add(relation.getTargetId());
        }
        jsonObject.put("followIds", jsonArray);
        return MsgUtil.makeMsg(MsgCode.SUCCESS, MsgUtil.SUCCESS_MSG, jsonObject);
    }

    @Override
    public Msg remove(JSONObject inputObject) {
        Integer userId;
        JSONArray followIds;
        // 取参数
        try {
            userId = inputObject.getInt("userId");
            followIds = inputObject.getJSONArray("followIds");
        }
        catch (Exception e){
            e.printStackTrace();
            return MsgUtil.makeMsg(MsgCode.ERROR, "参数获取失败");
        }
        // 进行取关
        followIds = followDao.remove(userId, followIds);
        // 若 取关者 存在，就更新 取关者 信息
        MetaUser from = userDao.findOneMeta(userId);
        if (from != null){
            from.regularUser.setFollowNum(from.regularUser.getFollowNum() - followIds.size());
            userDao.saveRegular(from.regularUser);
        }
        // 若 被取关者 存在，就更新 被取关者 信息
        for (int i = 0; i < followIds.size(); ++i){
            MetaUser to = userDao.findOneMeta(followIds.getInt(i));
            if (to != null){
                to.regularUser.setFansNum(to.regularUser.getFansNum() - 1);
                userDao.saveRegular(to.regularUser);
            }
        }
        // 构造返回值
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("followIds", followIds);
        return MsgUtil.makeMsg(MsgCode.SUCCESS, MsgUtil.SUCCESS_MSG, jsonObject);
    }

    @Override
    public Msg follow(JSONObject inputObject) {
        Integer userId;
        JSONArray followIds;
        // 取参数
        try {
            userId = inputObject.getInt("userId");
            followIds = inputObject.getJSONArray("followIds");
        }
        catch (Exception e){
            e.printStackTrace();
            return MsgUtil.makeMsg(MsgCode.ERROR, "参数获取失败");
        }
        // 检查 关注者 是否存在，不存在无法关注
        MetaUser from = userDao.findOneMeta(userId);
        if (from == null){
            return MsgUtil.makeMsg(MsgCode.ERROR, "用户 id: " + userId.toString() + "不存在，无法关注");
        }
        // 检查 被关注者 是否存在
        for (int i = 0; i < followIds.size(); ++i){
            Integer toId = followIds.getInt(i);
            if (toId == userId){
                return MsgUtil.makeMsg(MsgCode.ERROR, "不能自己关注自己");
            }
            MetaUser to = userDao.findOneMeta(toId);
            if (to == null){
                return MsgUtil.makeMsg(MsgCode.ERROR, "用户 id: " + userId.toString() + "不存在，无法关注");
            }
        }
        // 关注相关用户
        followIds = followDao.follow(userId, followIds);
        // 改变 关注者 的统计信息
        from.regularUser.setFollowNum(from.regularUser.getFollowNum() + followIds.size());
        userDao.saveRegular(from.regularUser);
        // 改变 被关注者 的统计信息
        for (int i = 0; i < followIds.size(); ++i){
            MetaUser to = userDao.findOneMeta(followIds.getInt(i));
            to.regularUser.setFansNum(to.regularUser.getFansNum() + 1);
            userDao.saveRegular(to.regularUser);
        }


        // 构造返回值
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("followIds", followIds);
        return MsgUtil.makeMsg(MsgCode.SUCCESS, MsgUtil.SUCCESS_MSG, jsonObject);
    }

    private List<Follow> helperFindRelations(Integer userId, String type){
        List<Follow> relations = null;
        try {
            if (type.equals("allFollow")){
                relations = followDao.getAllFollow(userId);
            }
            else if (type.equals("allFollower")){
                relations = followDao.getAllFollower(userId);
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return null;
        }
        return relations;
    }
}
