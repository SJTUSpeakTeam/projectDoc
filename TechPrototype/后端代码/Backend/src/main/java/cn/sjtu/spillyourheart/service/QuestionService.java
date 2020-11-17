package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;

public interface QuestionService {
    Msg postQuestion(JSONObject object);
    Msg deleteQuestion(JSONObject object);
    Msg updateQuestion(JSONObject object);
    Msg getQuestion(int questionId);
    Msg getNotDeletedQuestions(Integer beginQuestionId);
    Msg getHotQuestions();
    Msg getNewQuestions();
    Msg getFilterQuestions(JSONObject object);
    Msg getUserQuestions(Integer beginQuestionId,Integer userId);
    Msg likeQuestion(Integer userId,Integer questionId,Boolean like);
    Msg relateToQuestion(Integer userId,Integer questionId);
    Msg collectQuestion(Integer userId,Integer questionId,Boolean collect);
    Msg banQuestion(JSONObject object);
    Msg unbanQuestion(JSONObject object);
}
