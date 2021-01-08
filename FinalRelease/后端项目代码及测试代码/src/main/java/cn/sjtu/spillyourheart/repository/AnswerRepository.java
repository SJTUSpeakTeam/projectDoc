package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.Answer;
import cn.sjtu.spillyourheart.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer,Integer> {
    @Query(nativeQuery = true,value = "select * from Answer where question_id = ?1 and status = 1 and (?2 = -1 or answer_id < ?2) order by answer_id desc limit 10")
    List<Answer> getByQuestionIdFilteredByTime(int questionId,int beginAnswerId);
    @Query(nativeQuery = true,value = "select * from Answer where status = 1 and (?1 = -1 or answer_id < ?1) and user_id = ?2 order by answer_id desc limit 10")
    List<Answer> getUserAnswers(int beginAnswerId,int userId);
    @Query(nativeQuery = true,value = "select any_value(answer_id)as answer_id," +
            "any_value(content) as content," +
            "any_value(date) as date," +
            "any_value(favor_num) as favor_num," +
            "any_value(like_num) as like_num," +
            "question_id," +
            "any_value(status) as status," +
            "any_value(user_id) as user_id," +
            "any_value(visit_num) as visit_num from Answer where status = 1 and (?1 = -1 or question_id < ?1) and user_id = ?2 group by question_id order by question_id desc limit 10")
    List<Answer> getUserAnswersOrderByQuestionId(int beginQuestionId,int userId);
    @Query(nativeQuery = true,value = "select * from Answer where status = 0 and (?1=-1 or answer_id<?1) and(?2='' or (content like ?2)) order by answer_id desc limit 10")
    List<Answer> getDeletedAnswers(int beginAnswerId, String search);
    @Query(nativeQuery = true,value = "select * from Answer where status = -1 and (?1=-1 or answer_id<?1) and(?2='' or (content like ?2)) order by answer_id desc limit 10")
    List<Answer> getBannedAnswers(int beginAnswerId,String search);
    @Query(nativeQuery = true,value = "select * from Answer where (?1=-1 or answer_id<?1) and(?2='' or (content like ?2)) order by answer_id desc limit 10")
    List<Answer> getAllAnswers(int beginAnswerId,String search);
}
