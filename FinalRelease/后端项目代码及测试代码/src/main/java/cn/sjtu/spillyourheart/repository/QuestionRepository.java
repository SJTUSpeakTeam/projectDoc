package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question,Integer> {
    @Query(nativeQuery = true,value = "select * from Question where status = 1 order by visit_num desc limit 5")
    List<Question> getHotQuestions();
    @Query(nativeQuery = true,value = "select * from Question where status = 1 order by date desc limit 5")
    List<Question> getNewQuestions();
    @Query(nativeQuery = true,value = "select * from Question where status = 1 and (?1=-1 or question_id<?1) and(?2='' or (header like ?2) or (content like ?2))and (?3=-1 or theme_id=?3) order by like_num desc limit 10")
    List<Question> getMostLikeQuestions(int beginQuestionId,String search,int themeId);
    @Query(nativeQuery = true,value = "select * from Question where status = 1 and (?1=-1 or question_id<?1) and(?2='' or (header like ?2) or (content like ?2))and (?3=-1 or theme_id=?3) order by visit_num desc limit 10")
    List<Question> getHottestQuestions(int beginQuestionId,String search,int themeId);
    @Query(nativeQuery = true,value = "select * from Question where status = 1 and (?1=-1 or question_id<?1) and(?2='' or (header like ?2) or (content like ?2))and (?3=-1 or theme_id=?3) order by question_id desc limit 10")
    List<Question> getNewestQuestions(int beginQuestionId,String search,int themeId);
    @Query(nativeQuery = true,value = "select * from Question as q where status = 1 and (?1=-1 or question_id<?1) and(?2='' or (header like ?2) or (content like ?2))and (?3=-1 or theme_id=?3) order by (select count(*) from answer as a where a.question_id = q.question_id and a.status=1) desc LIMIT 10")
    List<Question> getMostReplyQuestions(int beginQuestionId,String search,int themeId);

    @Query(nativeQuery = true,value = "select * from Question where status = 1 and (?1=-1 or question_id<?1) and (?2=-1 or theme_id=?2) order by like_num  desc LIMIT 30")
    List<Question> getSemanticMostLikeQuestions(int beginQuestionId,int themeId);
    @Query(nativeQuery = true,value = "select * from Question where status = 1 and (?1=-1 or question_id<?1) and (?2=-1 or theme_id=?2) order by visit_num  desc LIMIT 30")
    List<Question> getSemanticHottestQuestions(int beginQuestionId,int themeId);
    @Query(nativeQuery = true,value = "select * from Question where status = 1 and (?1=-1 or question_id<?1) and (?2=-1 or theme_id=?2) order by question_id  desc LIMIT 30")
    List<Question> getSemanticNewestQuestions(int beginQuestionId,int themeId);
    @Query(nativeQuery = true,value = "select * from Question as q where status = 1 and (?1=-1 or question_id<?1) and (?2=-1 or theme_id=?2) order by (select count(*) from answer as a where a.question_id = q.question_id and a.status=1)  desc LIMIT 30")
    List<Question> getSemanticMostReplyQuestions(int beginQuestionId,int themeId);

    @Query(nativeQuery = true,value="select * from Question where status = 1 and (?1=-1 or question_id<?1) and(user_id=?2) order by question_id desc limit 10")
    List<Question> getUserQuestions(int beginQuestionId,int userId);
    @Query(nativeQuery = true,value = "select * from Question where (status = 1 or status = -1) and (?1=-1 or question_id<?1) and(?2='' or (header like ?2) or (content like ?2))and (?3=-1 or theme_id=?3) order by question_id desc limit 10")
    List<Question> getNotDeletedQuestions(int beginQuestionId,String search,int themeId);
    @Query(nativeQuery = true,value = "select * from Question where status = 0 and (?1=-1 or question_id<?1) and(?2='' or (header like ?2) or (content like ?2))and (?3=-1 or theme_id=?3) order by question_id desc limit 10")
    List<Question> getDeletedQuestions(int beginQuestionId,String search,int themeId);
    @Query(nativeQuery = true,value = "select * from Question where status = -1 and (?1=-1 or question_id<?1) and(?2='' or (header like ?2) or (content like ?2))and (?3=-1 or theme_id=?3) order by question_id desc limit 10")
    List<Question> getBannedQuestions(int beginQuestionId,String search,int themeId);
    @Query(nativeQuery = true,value = "select * from Question where (?1=-1 or question_id<?1) and(?2='' or (header like ?2) or (content like ?2))and (?3=-1 or theme_id=?3) order by question_id desc limit 10")
    List<Question> getAllQuestions(int beginQuestionId,String search,int themeId);
}
