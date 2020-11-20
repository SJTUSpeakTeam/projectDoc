package cn.sjtu.spillyourheart.dao;

import cn.sjtu.spillyourheart.entity.Answer;

import java.util.List;

public interface AnswerDao {
    boolean verifyOne(Integer answerId); //verify that one is deleted or not
    boolean hasOne(Integer answerId);
    Integer postOne(Integer questionId, Integer userId, String content);
    void deleteOne(Integer answerId);
    Answer getOne(Integer answerId);
    List<Answer> getByQuestionFilteredByTime(Integer questionId,Integer beginAnswerId);
    List<Answer> getUserAnswers(Integer beginAnswerId,Integer userId);
    void updateOne(Integer answerId,String content);
    void addLike(Integer answerId);
    void decreaseLike(Integer answerId);
    void addCollect(Integer answerId);
    void decreaseCollect(Integer answerId);
}
