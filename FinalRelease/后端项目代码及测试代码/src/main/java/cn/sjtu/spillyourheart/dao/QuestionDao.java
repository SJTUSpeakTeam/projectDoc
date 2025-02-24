package cn.sjtu.spillyourheart.dao;

import cn.sjtu.spillyourheart.entity.Question;
import net.sf.json.JSONObject;

import java.util.List;

public interface QuestionDao {
    boolean verifyOne(Integer questionId); //verify that one is normal or not
    boolean bannedOne(Integer questionId); //one is ban or not
    boolean deletedOne(Integer questionId); //one is deleted or not
    boolean hasOne(Integer questionId);
    Integer postOne(Integer userId, Integer themeId, String header, String content, List<String> tags);
    void deleteOne(Integer questionId);
    JSONObject getOne(Integer questionId);
    List<JSONObject> getNotDeletedList(Integer beginQuestionId,String search,int themeId);
    List<JSONObject> getHotList();
    List<JSONObject> getNewList();
    List<JSONObject> getDeletedList(int beginQuestionId,String search,int themeId);
    List<JSONObject> getBannedList(int beginQuestionId,String search,int themeId);
    List<JSONObject> getAllList(int beginQuestionId,String search,int themeId);
    List<JSONObject> getFilterMostLikeList(int beginQuestionId,String search,int themeId);
    List<JSONObject> getFilterHottestList(int beginQuestionId,String search,int themeId);
    List<JSONObject> getFilterNewestList(int beginQuestionId,String search,int themeId);
    List<JSONObject> getFilterMostReplyList(int beginQuestionId,String search,int themeId);
    List<JSONObject> getSemanticMostLikeList(int beginQuestionId,int themeId);
    List<JSONObject> getSemanticHottestList(int beginQuestionId,int themeId);
    List<JSONObject> getSemanticNewestList(int beginQuestionId,int themeId);
    List<JSONObject> getSemanticMostReplyList(int beginQuestionId,int themeId);
    List<JSONObject> getUserQuestions(int beginQuestionId,int userId);

    void updateOne(Integer questionId,Integer themeId,String header,String content,List<String> tags);
    void addLike(Integer questionId);
    void decreaseLike(Integer questionId);
    void addCollect(Integer questionId);
    void decreaseCollect(Integer questionId);
    void addAnswerNum(Integer questionId);
    void decreaseAnswerNum(Integer questionId);
    void ban(Integer questionId);
    void unban(Integer questionId);
}
