package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface FollowRepository extends MongoRepository<Follow, String> {
    List<Follow> findByUserId(Integer userId);

    List<Follow> findByTargetId(Integer targetId);

    List<Follow> findByUserIdAndTargetId(Integer userId, Integer targetId);

    Long deleteByUserIdAndTargetId(Integer userId, Integer targetId);
}
