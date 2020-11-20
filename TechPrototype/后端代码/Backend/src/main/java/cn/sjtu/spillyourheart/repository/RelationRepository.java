package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.Relation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface RelationRepository extends MongoRepository<Relation,Integer>{
    @Query("{'userId':?0,'targetId':?1,'area':?2}")
    Relation findRelation(Integer userId,Integer targetId,String area);

}
