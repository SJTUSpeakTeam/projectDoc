package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.Relation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface RelationRepository extends MongoRepository<Relation,Integer>{
    @Query("{'userId':?0,'targetId':?1,'area':?2}")
    Relation findRelation(Integer userId,Integer targetId,String area);


    //@Query("{'userId':?1,'area':?2,'collect':true}.sort({'targetId':-1}).limit(10)")
    @Query("{'targetId':{$lt:?0},'userId':?1,'area':?2,'collect':true}")
    List<Relation> findCollectRelations(Integer beginTargetId, Integer userId, String area, Pageable pageable);

    @Query("{'userId':?0,'area':?1,'collect':true}")
    List<Relation> findAllCollectRelations(Integer userId, String area, Pageable pageable);
}
