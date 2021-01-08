package cn.sjtu.spillyourheart.daoImpl;

import cn.sjtu.spillyourheart.dao.FollowDao;
import cn.sjtu.spillyourheart.entity.Follow;
import cn.sjtu.spillyourheart.repository.FollowRepository;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FollowDaoImpl implements FollowDao {
    @Autowired
    private FollowRepository followRepository;

    @Override
    public List<Follow> getAllFollow(Integer userId) {
        return followRepository.findByUserId(userId);
    }

    @Override
    public List<Follow> getAllFollower(Integer targetId) {
        return followRepository.findByTargetId(targetId);
    }

    @Override
    public JSONArray remove(Integer userId, JSONArray followIds) {
        JSONArray jsonArray = new JSONArray();
        // 遍历 followIds 数组
        for(int i = 0; i < followIds.size(); i++) {
            // 判断是否存在关注，存在即删除
            Integer targetId = followIds.getInt(i);
            // 删除超过一个实例即加入结果
            if (followRepository.deleteByUserIdAndTargetId(userId, targetId) > 0)
                jsonArray.add(targetId);
        }
        return jsonArray;
    }

    @Override
    public JSONArray follow(Integer userId, JSONArray followIds) {
        JSONArray jsonArray = new JSONArray();
        // 遍历 followIds 数组
        for(int i = 0; i < followIds.size(); i++) {
            // 判断是否存在关注，对于存在的不要管它，多余的要删掉
            Integer targetId = followIds.getInt(i);
            List<Follow> relations = followRepository.findByUserIdAndTargetId(userId, targetId);
            if (relations.isEmpty()){
                // 不存在，插入，加入结果
                Follow relation = new Follow(userId, targetId);
                followRepository.insert(relation);
                jsonArray.add(targetId);
                continue;
            }
            else if (relations.size() == 1){
                continue;
            }
            else {
                // 大于一个？多余的全删掉
                relations.remove(0);
                followRepository.deleteAll(relations);
            }
        }
        return jsonArray;
    }
}
