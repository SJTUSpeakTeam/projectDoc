package cn.sjtu.spillyourheart.dao;

import cn.sjtu.spillyourheart.entity.ExpertBadge;

import java.util.List;

public interface ExpertBadgeDao {
    Integer postOne(Integer userId,String profession,String information);
    void deleteOne(Integer badgeId);
    Integer updateOne(Integer badgeId,String profession,String information);
    List<ExpertBadge> getAllByUser(Integer userId);
}
