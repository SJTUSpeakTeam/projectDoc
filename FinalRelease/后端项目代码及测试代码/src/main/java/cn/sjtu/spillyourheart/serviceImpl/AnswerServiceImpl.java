package cn.sjtu.spillyourheart.serviceImpl;

import cn.sjtu.spillyourheart.dao.AnswerDao;
import cn.sjtu.spillyourheart.dao.CommentDao;
import cn.sjtu.spillyourheart.dao.QuestionDao;
import cn.sjtu.spillyourheart.dao.UserDao;
import cn.sjtu.spillyourheart.entity.Answer;
import cn.sjtu.spillyourheart.entity.Comment;
import cn.sjtu.spillyourheart.entity.Relation;
import cn.sjtu.spillyourheart.service.AnswerService;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import cn.sjtu.spillyourheart.utilis.sensitivewordutils.sensitiveWords;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class AnswerServiceImpl implements AnswerService {
    @Autowired
    private AnswerDao answerDao;
    @Autowired
    private QuestionDao questionDao;
    @Autowired
    private CommentDao commentDao;
    @Autowired
    private UserDao userDao;

    @Override
    public Msg postAnswer(JSONObject object){
            //验证是否存在参数
        if((!object.containsKey("questionId"))
                || (!object.containsKey("userId"))
                || (!object.containsKey("content"))
        )
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        Integer questionId = -1;
        Integer userId = -1;
        String content = null;
            //验证参数正确性
        try {
            questionId = (Integer) (object.get("questionId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"questionId必须是个整型常量 :(");
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
            //验证问题是否存在及未被删除
        if(!questionDao.hasOne(questionId) || !questionDao.verifyOne(questionId))
            return  MsgUtil.makeMsg(MsgCode.ERROR,"相关问题已被删除 :(");
        sensitiveWords Words = new sensitiveWords();
        JSONObject object1 = Words.examine(content);
        if(object1.containsKey("keyWord"))
            return MsgUtil.makeMsg(MsgCode.ERROR,"内容有违禁词: "+object1.getString("keyWord")+" :(");

        int answerId = answerDao.postOne(questionId,userId,content);
        questionDao.addAnswerNum(questionId);
        JSONObject result = new JSONObject();
        result.put("answerId",answerId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg deleteAnswer(JSONObject object){
            //验证是否存在参数
        if((!object.containsKey("answerId"))
                || (!object.containsKey("userId"))
        )
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        Integer answerId = -1;
        Integer userId = -1;
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
            //验证回复是否存在
        if(!answerDao.hasOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(");
            //验证用户是否相对应
        if(!answerDao.getOne(answerId).getUserId().equals(userId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"用户不对应 :(");
        List<Comment> commentList = commentDao.getByAnswerFilteredByTime(answerId,-1);
        for(Comment comment:commentList){
            commentDao.deleteOne(comment.getCommentId());
        }
        Answer answer = answerDao.getOne(answerId);
        questionDao.decreaseAnswerNum(answer.getQuestionId());
        answerDao.deleteOne(answerId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS);
    }

    @Override
    public Msg updateAnswer(JSONObject object){
            //验证是否存在参数
        if((!object.containsKey("answerId"))
                || (!object.containsKey("userId")
                || (!object.containsKey("content")))
        )
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        Integer answerId = -1;
        Integer userId = -1;
        String content = null;
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
            //验证回复是否存在
        if(!answerDao.hasOne(answerId) || !answerDao.verifyOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(");
            //验证用户是否相对应
        if(!answerDao.getOne(answerId).getUserId().equals(userId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"用户不对应 :(");
        answerDao.updateOne(answerId,content);
        JSONObject result = new JSONObject();
        object.put("answerId",answerId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getAnswer(Integer answerId){
        if(!answerDao.hasOne(answerId) || !answerDao.verifyOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(");
        Answer answer = answerDao.getOne(answerId);
        JSONObject result = JSONObject.fromObject(answer);
        result.remove("status");
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getAnswerByQuestion(Integer beginAnswerId,Integer questionId){
            //验证问题是否存在（不需要检查是否未被删除，因为压根用户就拿不到删除的问题）
        if(!questionDao.hasOne(questionId))
            return  MsgUtil.makeMsg(MsgCode.ERROR,"相关问题不存在 :(");
        List<Answer> answerList = answerDao.getByQuestionFilteredByTime(questionId,beginAnswerId);
        JSONObject result = new JSONObject();
        List<JSONObject> resultList = new ArrayList<>();
        for(Answer answer: answerList){
            JSONObject object = JSONObject.fromObject(answer);
            object.remove("status");
            resultList.add(object);
        }
        result.put("answer",resultList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getUserAnswers(Integer beginAnswerId,Integer userId){
        JSONObject result = new JSONObject();
        List<Answer> answerList = answerDao.getUserAnswers(beginAnswerId,userId);
        List<JSONObject> resultList = new ArrayList<>();
        for(Answer answer:answerList){
            JSONObject object = JSONObject.fromObject(answer);
            object.remove("status");
            resultList.add(object);
        }
        result.put("answers",resultList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getAdminAnswers(JSONObject object){
        if(!object.containsKey("beginAnswerId"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        int answerId = -1;
        String searchList = "";
        JSONObject result = new JSONObject();
        List<Answer> answerList = new ArrayList<>();
        try {
            answerId = (Integer) (object.get("beginAnswerId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"beginAnswerId必须是个整型常量 :(");
        }
        if(object.containsKey("search")){
            try{
                searchList = (String)object.get("search");
            }catch (Exception e){
                return MsgUtil.makeMsg(MsgCode.ERROR,"search必须是个字符串数组 :(");
            }
        }
        Boolean getOrNot = false;

        //deleted
        if(object.containsKey("delete") && object.getBoolean("delete")){
            getOrNot = true;
            answerList = answerDao.getDeletedList(answerId,searchList);
        }

        //ban(将新搜索到的加入内容中)
        if(object.containsKey("ban") && object.getBoolean("ban")){
            getOrNot = true;
            answerList.addAll(answerDao.getBannedList(answerId,searchList));
        }

        if(!getOrNot){
            answerList = answerDao.getAllList(answerId,searchList);
        }

        //将questionList重新排序
        Collections.sort(answerList, new Comparator<Answer>() {
            @Override
            public int compare(Answer o1, Answer o2) {
                return  o2.getAnswerId()-o1.getAnswerId();
            }
        });

        result.put("answers",answerList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg likeAnswer(Integer userId,Integer answerId,Boolean like){
        if(!answerDao.hasOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(");
        if(!answerDao.verifyOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"回复已被删除 :(");
        if(!userDao.hasRelation(userId,answerId,"Answer")){
            userDao.createRelation(userId,answerId,"Answer");
        }
        Relation relation = userDao.getRelation(userId,answerId,"Answer");
        if(like == relation.getLike())
            return MsgUtil.makeMsg(MsgCode.ERROR,"点赞布尔相同 :(");
        relation.setLike(like);
        userDao.saveRelation(relation);
        if(like)
            answerDao.addLike(answerId);
        else
            answerDao.decreaseLike(answerId);
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg collectAnswer(Integer userId,Integer answerId,Boolean collect){
        if(!answerDao.hasOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(");
        if(!answerDao.verifyOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"回复已被删除 :(");
        if(!userDao.hasRelation(userId,answerId,"Answer")){
            userDao.createRelation(userId,answerId,"Answer");
        }
        Relation relation = userDao.getRelation(userId,answerId,"Answer");
        if(collect == relation.getCollect())
            return MsgUtil.makeMsg(MsgCode.ERROR,"收藏布尔相同 :(");
        relation.setCollect(collect);
        userDao.saveRelation(relation);
        if(collect)
            answerDao.addCollect(answerId);
        else
            answerDao.decreaseCollect(answerId);
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg banAnswer(JSONObject object){
        if(!object.containsKey("answerId"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        int answerId = -1;
        try {
            answerId = (Integer) (object.get("answerId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"answerId必须是个整型常量 :(");
        }
        if(!answerDao.hasOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(");
        if(!answerDao.verifyOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"回复已被删除或封禁 :(");
        answerDao.ban(answerId);
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg unbanAnswer(JSONObject object){
        if(!object.containsKey("answerId"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        int answerId = -1;
        try {
            answerId = (Integer) (object.get("answerId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"answerId必须是个整型常量 :(");
        }
        if(!answerDao.hasOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(");
        if(!answerDao.bannedOne(answerId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"回复已被解禁 :(");
        answerDao.unban(answerId);
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }
}
