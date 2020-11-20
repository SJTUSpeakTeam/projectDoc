package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment,Integer> {
    @Query(nativeQuery = true,value = "select * from Comment where answer_id = ?1 and status = 1 and (?2 = -1 or comment_id < ?2) order by comment_id desc limit 10")
    List<Comment> getByAnswerIdFilteredByTime(int answerId, int beginCommentId);
}
