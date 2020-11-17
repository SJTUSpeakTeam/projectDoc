package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer,Integer> {
    @Query(nativeQuery = true,value = "select * from Answer where question_id = ?1 and status = 1 and (?2 = -1 or answer_id < ?2) order by answer_id desc limit 10")
    List<Answer> getByQuestionIdFilteredByTime(int questionId,int beginAnswerId);
    @Query(nativeQuery = true,value = "select * from Answer where status = 1 and (?1 = -1 or answer_id < ?1) and user_id = ?2 order by answer_id desc limit 10")
    List<Answer> getUserAnswers(int beginAnswerId,int userId);
}
