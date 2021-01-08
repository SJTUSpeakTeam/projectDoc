package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;

public interface AnswerService {
    Msg postAnswer(JSONObject object);
    Msg deleteAnswer(JSONObject object);
    Msg updateAnswer(JSONObject object);
    Msg getAnswer(Integer answerId);
    Msg getAnswerByQuestion(Integer beginAnswerId,Integer questionId);
    Msg getUserAnswers(Integer beginAnswerId,Integer userId);
    Msg getAdminAnswers(JSONObject object);
    Msg likeAnswer(Integer userId,Integer answerId,Boolean like);
    Msg collectAnswer(Integer userId,Integer answerId,Boolean collect);
    Msg banAnswer(JSONObject object);
    Msg unbanAnswer(JSONObject object);
}
