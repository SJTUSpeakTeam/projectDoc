package cn.sjtu.spillyourheart.serviceImpl;

import cn.sjtu.spillyourheart.dao.AnswerDao;
import cn.sjtu.spillyourheart.dao.CommentDao;
import cn.sjtu.spillyourheart.dao.UserDao;
import cn.sjtu.spillyourheart.entity.Comment;
import cn.sjtu.spillyourheart.entity.Relation;
import cn.sjtu.spillyourheart.service.CommentService;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import cn.sjtu.spillyourheart.utilis.sensitivewordutils.sensitiveWords;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentDao commentDao;
    @Autowired
    private AnswerDao answerDao;
    @Autowired
    private UserDao userDao;

    @Override
    public Msg postComment(JSONObject object){
            //验证是否存在参数
        if((!object.containsKey("answerId"))
                || (!object.containsKey("userId"))
                || (!object.containsKey("content"))
        )
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        Integer answerId = -1;
        Integer userId = -1;
        String content = null;
        Integer fatherCommentId = -1;
            //验证参数正确性
        try {
            answerId = (Integer) (object.get("answerId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"answerId必须是个整型常量 :(");
        }
        try {
            userId = (Integer) (object.get("userId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"userId必须是个整型常量 :(");
        }
        try {
            content = (String) (object.get("content"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个字符串 :(");
        }
        if(object.containsKey("fatherCommentId")){
            try {
                fatherCommentId = (Integer) (object.get("fatherCommentId"));
            }catch (Exception e) {
                return MsgUtil.makeMsg(MsgCode.ERROR,"fatherCommentId必须是个整型常量 :(");
            }
        }
            //验证回答是否存在及未被删除
        if(!answerDao.hasOne(answerId) || !answerDao.verifyOne(answerId))
            return  MsgUtil.makeMsg(MsgCode.ERROR,"相关问题已被删除 :(");
        sensitiveWords Words = new sensitiveWords();
        JSONObject object1 = Words.examine(content);
        if(object1.containsKey("keyWord"))
            return MsgUtil.makeMsg(MsgCode.ERROR,"内容有违禁词: "+object1.getString("keyWord")+" :(");
            //如果有父级评论
        if(fatherCommentId!=-1) {
            if(!commentDao.hasOne(fatherCommentId) || !commentDao.verifyOne(fatherCommentId))
                return  MsgUtil.makeMsg(MsgCode.ERROR,"父级评论已被删除 :(");
            commentDao.addCommentNum(fatherCommentId);
        }

        int commentId = commentDao.postOne(answerId,userId,content,fatherCommentId);
        JSONObject result = new JSONObject();
        result.put("commentId",commentId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg deleteComment(JSONObject object){
            //验证是否存在参数
        if((!object.containsKey("commentId"))
                || (!object.containsKey("userId"))
        )
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        Integer commentId = -1;
        Integer userId = -1;
            //验证参数正确性
        try {
            commentId = (Integer) (object.get("commentId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"commentId必须是个整型常量 :(");
        }
        try {
            userId = (Integer) (object.get("userId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"userId必须是个整型常量 :(");
        }
            //验证评论是否存在
        if(!commentDao.hasOne(commentId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应评论 :(");
            //验证用户是否相对应
        if(!commentDao.getOne(commentId).getUserId().equals(userId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"用户不对应 :(");
        commentDao.deleteOne(commentId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS);
    }

    @Override
    public Msg updateComment(JSONObject object){
            //评论不可更改
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getComment(Integer commentId){
        if(!commentDao.hasOne(commentId) || !commentDao.verifyOne(commentId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应评论 :(");
        Comment comment = commentDao.getOne(commentId);
        JSONObject result = JSONObject.fromObject(comment);
        result.remove("status");
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getCommentByAnswer(Integer beginCommentId,Integer answerId){
            //验证回复是否存在及未被删除
        if(!answerDao.hasOne(answerId) || !answerDao.verifyOne(answerId))
            return  MsgUtil.makeMsg(MsgCode.ERROR,"相关回复已被删除 :(");
        List<Comment> commentList = commentDao.getByAnswerFilteredByTime(answerId,beginCommentId);
        JSONObject result = new JSONObject();
        List<JSONObject> resultList = new ArrayList<>();
        for(Comment comment: commentList){
            JSONObject object = JSONObject.fromObject(comment);
            object.remove("status");
            resultList.add(object);
        }
        result.put("comment",resultList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg likeComment(Integer userId,Integer commentId,Boolean like){
        if(!commentDao.hasOne(commentId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应评论 :(");
        if(!commentDao.verifyOne(commentId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"评论已被删除 :(");
        if(!userDao.hasRelation(userId,commentId,"Comment")){
            userDao.createRelation(userId,commentId,"Comment");
        }
        Relation relation = userDao.getRelation(userId,commentId,"Comment");
        if(like == relation.getLike())
            return MsgUtil.makeMsg(MsgCode.ERROR,"点赞布尔相同 :(");
        relation.setLike(like);
        userDao.saveRelation(relation);
        if(like)
            commentDao.addLike(commentId);
        else
            commentDao.decreaseLike(commentId);
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }
}
