package cn.sjtu.spillyourheart.dao;

import cn.sjtu.spillyourheart.entity.Follow;
import net.sf.json.JSONArray;

import java.util.List;

public interface FollowDao {
    List<Follow> getAllFollow(Integer userId);
    List<Follow> getAllFollower(Integer targetId);
    JSONArray remove(Integer userId, JSONArray followIds);
    JSONArray follow(Integer userId, JSONArray followIds);
}
