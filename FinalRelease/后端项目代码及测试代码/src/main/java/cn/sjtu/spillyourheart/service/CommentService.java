package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;

public interface CommentService {
    Msg postComment(JSONObject object);
    Msg deleteComment(JSONObject object);
    Msg updateComment(JSONObject object);
    Msg getComment(Integer commentId);
    Msg getCommentByAnswer(Integer beginCommentId,Integer answerId);
    Msg likeComment(Integer userId,Integer commentId,Boolean like);
}
