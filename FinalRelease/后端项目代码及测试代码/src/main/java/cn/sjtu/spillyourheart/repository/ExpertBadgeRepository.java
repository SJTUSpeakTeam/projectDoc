package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.ExpertBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExpertBadgeRepository extends JpaRepository<ExpertBadge,Integer> {
    @Query(nativeQuery = true,value = "select * from expert_badge where user_id=?1")
    List<ExpertBadge> getAllByUser(Integer userId);
}
