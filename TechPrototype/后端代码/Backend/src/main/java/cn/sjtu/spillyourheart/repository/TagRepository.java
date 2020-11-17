package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag,Integer> {
    @Query(nativeQuery = true,value="select * from Tag where content = ?1")
    Tag getTag(@Param("content") String content);

    @Query(nativeQuery = true,value="select * from Tag")
    List<Tag> getTags();
}
