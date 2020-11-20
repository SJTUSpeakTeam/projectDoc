package cn.sjtu.spillyourheart.serviceImpl;

import cn.sjtu.spillyourheart.dao.*;
import cn.sjtu.spillyourheart.entity.Answer;
import cn.sjtu.spillyourheart.entity.Comment;
import cn.sjtu.spillyourheart.entity.Relation;
import cn.sjtu.spillyourheart.service.QuestionService;
import cn.sjtu.spillyourheart.utilis.sensitivewordutils.sensitiveWords;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService{
    @Autowired
    private QuestionDao questionDao;
    @Autowired
    private ThemeDao themeDao;
    @Autowired
    private AnswerDao answerDao;
    @Autowired
    private CommentDao commentDao;
    @Autowired
    private UserDao userDao;

    @Override
    public Msg postQuestion(JSONObject object){
        if((!object.containsKey("header"))
                || (!object.containsKey("content"))
                || (!object.containsKey("userId"))
                || (!object.containsKey("theme"))
                )
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        int userId = -1;
        List<String> tagList = new ArrayList<>();
        String header = "";
        String content = "";
        String theme = "";
        try {
            userId = (Integer) (object.get("userId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"userId必须是个整型常量 :(");
        }
        try {
            header = (String) (object.get("header"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"header必须是个字符串 :(");
        }
        try {
            content = (String) (object.get("content"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个字符串 :(");
        }
        try {
            theme = (String) (object.get("theme"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"theme必须是个字符串 :(");
        }
        if(object.containsKey("tags")) {
            try{
                tagList = object.getJSONArray("tags");
            }catch (Exception e){
                return MsgUtil.makeMsg(MsgCode.ERROR,"tags必须是个字符串数组 :(");
            }
        }
            //验证theme是否存在
        if(!themeDao.hasOne(theme) || !themeDao.verifyOne(theme))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在该主题: " +theme+" :(");
        sensitiveWords Words = new sensitiveWords();
        JSONObject object1 = Words.examine(header);
        if(object1.containsKey("keyWord"))
            return MsgUtil.makeMsg(MsgCode.ERROR,"标题有违禁词: "+object1.getString("keyWord")+" :(");
        object1 = Words.examine(content);
        if(object1.containsKey("keyWord"))
            return MsgUtil.makeMsg(MsgCode.ERROR,"内容有违禁词: "+object1.getString("keyWord")+" :(");

        int questionId = questionDao.postOne(userId,
                themeDao.getOneByName(theme).getInt("themeId"),
                header,
                content,
                tagList);
        JSONObject result = new JSONObject();
        result.put("questionId",questionId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg deleteQuestion(JSONObject object){
        if((!object.containsKey("questionId"))
                || (!object.containsKey("userId")))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        int questionId = -1;
        int userId = -1;
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
        if(!questionDao.hasOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(");
        if(((Integer)questionDao.getOne(questionId).get("userId"))!=userId)
            return MsgUtil.makeMsg(MsgCode.ERROR,"userId与原问题userId不同 :(");
        List<Answer> answerList = answerDao.getByQuestionFilteredByTime(questionId,-1);
        questionDao.deleteOne(questionId);
        for(Answer answer:answerList){
            List<Comment> commentList = commentDao.getByAnswerFilteredByTime(answer.getAnswerId(),-1);
            for(Comment comment:commentList){
                commentDao.deleteOne(comment.getCommentId());
            }
            answerDao.deleteOne(answer.getAnswerId());
        }
        return MsgUtil.makeMsg(MsgCode.SUCCESS);
    }

    @Override
    public Msg updateQuestion(JSONObject object){
        if((!object.containsKey("questionId"))
                || (!object.containsKey("userId"))
                || (!object.containsKey("theme")))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        int questionId = -1;
        int userId = -1;
        String theme = "";
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
            theme = (String) (object.get("theme"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"theme必须是个字符串 :(");
        }
            //验证theme是否存在
        if(!themeDao.hasOne(theme) || !themeDao.verifyOne(theme))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在该主题: " +theme+" :(");
        if(!questionDao.hasOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(");
        if(!questionDao.verifyOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"提问已被删除 :(");
        if(((Integer)questionDao.getOne(questionId).get("userId"))!=userId)
            return MsgUtil.makeMsg(MsgCode.ERROR,"userId与原问题userId不同 :(");
        List<String> tagList = new ArrayList<>();
        String header = "";
        String content = "";
        if(object.containsKey("tags")) {
            try{
                tagList = object.getJSONArray("tags");
            }catch (Exception e){
                return MsgUtil.makeMsg(MsgCode.ERROR,"tags必须是个字符串数组 :(");
            }
        }
        if(object.containsKey("header")) {
            try{
                header = (String)(object.get("header"));
            }catch (Exception e){
                return MsgUtil.makeMsg(MsgCode.ERROR,"header必须是字符串 :(");
            }
        }
        if(object.containsKey("content")) {
            try{
                content = (String)(object.get("content"));
            }catch (Exception e){
                return MsgUtil.makeMsg(MsgCode.ERROR,"content必须是字符串 :(");
            }
        }
        questionDao.updateOne(questionId,
                themeDao.getOneByName(theme).getInt("themeId"),
                object.containsKey("header")?header:null,
                object.containsKey("content")?content:null,
                object.containsKey("tags")?tagList:null
                );
        JSONObject result = new JSONObject();
        result.put("questionId",questionId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }
    @Override
    public Msg getQuestion(int questionId){
        if(!questionDao.hasOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(");
        if(!questionDao.verifyOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"提问已被删除 :(");
        JSONObject result;
        result = questionDao.getOne(questionId);
        if(!themeDao.hasOne(result.getInt("themeId")))
            return MsgUtil.makeMsg(MsgCode.ERROR,"提问的theme不存在 :(");
        if(!themeDao.verifyOne(result.getInt("themeId")))
            return MsgUtil.makeMsg(MsgCode.ERROR,"提问的theme已经删除 :(");
        String theme = themeDao.getOne(result.getInt("themeId")).getString("name");
        result.remove("themeId");result.put("theme",theme);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getNotDeletedQuestions(Integer beginQuestionId){
        JSONObject result = new JSONObject();
        List<JSONObject> questionList = questionDao.getNotDeletedQuestions(beginQuestionId);
        List<JSONObject> objectList = new ArrayList<>();
        for(JSONObject object:questionList){
            Integer themeId = object.getInt("themeId");
            if(!themeDao.hasOne(themeId))
                return MsgUtil.makeMsg(MsgCode.ERROR,"某一提问的theme不存在 :(");
            if(!themeDao.verifyOne(themeId))
                return MsgUtil.makeMsg(MsgCode.ERROR,"某一提问的theme已经删除 :(");
            String theme = themeDao.getOne(themeId).getString("name");
            object.remove("themeId");object.put("theme",theme);
            objectList.add(object);
        }
        result.put("questions",objectList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getHotQuestions(){
        JSONObject result = new JSONObject();
        List<JSONObject> questionList = questionDao.getHotList();
        List<JSONObject> objectList = new ArrayList<>();
        for(JSONObject object:questionList){
            Integer themeId = object.getInt("themeId");
            if(!themeDao.hasOne(themeId))
                return MsgUtil.makeMsg(MsgCode.ERROR,"某一提问的theme不存在 :(");
            if(!themeDao.verifyOne(themeId))
                return MsgUtil.makeMsg(MsgCode.ERROR,"某一提问的theme已经删除 :(");
            String theme = themeDao.getOne(themeId).getString("name");
            object.remove("themeId");object.put("theme",theme);
            objectList.add(object);
        }
        result.put("questions",objectList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getNewQuestions(){
        JSONObject result = new JSONObject();
        List<JSONObject> questionList = questionDao.getNewList();
        List<JSONObject> objectList = new ArrayList<>();
        for(JSONObject object:questionList){
            Integer themeId = object.getInt("themeId");
            if(!themeDao.hasOne(themeId))
                return MsgUtil.makeMsg(MsgCode.ERROR,"某一提问的theme不存在 :(");
            if(!themeDao.verifyOne(themeId))
                return MsgUtil.makeMsg(MsgCode.ERROR,"某一提问的theme已经删除 :(");
            String theme = themeDao.getOne(themeId).getString("name");
            object.remove("themeId");object.put("theme",theme);
            objectList.add(object);
        }
        result.put("questions",objectList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getFilterQuestions(JSONObject object){//not finished
        if(!object.containsKey("beginQuestionId"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        int questionId = -1;
        String searchList = "";
        String themeList = "";
        int themeId = -1;
        List<JSONObject> questionList = new ArrayList<>();
        try {
            questionId = (Integer) (object.get("beginQuestionId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"beginQuestionId必须是个整型常量 :(");
        }
        if(object.containsKey("search")){
            try{
                searchList = (String)object.get("search");
            }catch (Exception e){
                return MsgUtil.makeMsg(MsgCode.ERROR,"search必须是个字符串数组 :(");
            }
        }
        if(object.containsKey("theme")){
            themeId = 0;
            try{
                themeList = (String)object.get("theme");
            }catch (Exception e){
                return MsgUtil.makeMsg(MsgCode.ERROR,"theme必须是个字符串 :(");
            }
            if(themeList == "")
                themeId = -1;
        }
            //mostlike
        if(object.containsKey("mostLike") && object.getBoolean("mostLike")){
            if(themeList!="" && themeDao.hasOne(themeList) && themeDao.verifyOne(themeList)){
                themeId = themeDao.getOneByName(themeList).getInt("themeId");
            }
            questionList = questionDao.getFilterMostLikeList(questionId,searchList,themeId);
        }
            //hottest
        if(object.containsKey("hottest") && object.getBoolean("hottest")){
            if(themeList!="" && themeDao.hasOne(themeList) && themeDao.verifyOne(themeList)){
                themeId = themeDao.getOneByName(themeList).getInt("themeId");
            }
            questionList = questionDao.getFilterHottestList(questionId,searchList,themeId);
        }
            //mostReply
        if(object.containsKey("mostReply") && object.getBoolean("mostReply")){
            if(themeList!="" && themeDao.hasOne(themeList) && themeDao.verifyOne(themeList)){
                themeId = themeDao.getOneByName(themeList).getInt("themeId");
            }
            questionList = questionDao.getFilterMostReplyList(questionId,searchList,themeId);
        }
            //newest
        if(object.containsKey("newest") && object.getBoolean("newest")){
            if(themeList!="" && themeDao.hasOne(themeList) && themeDao.verifyOne(themeList)){
                themeId = themeDao.getOneByName(themeList).getInt("themeId");
            }
            questionList = questionDao.getFilterNewestList(questionId,searchList,themeId);
        }
        JSONObject result = new JSONObject();
        List<JSONObject> objectList = new ArrayList<>();
        for(JSONObject o:questionList){
            Integer _themeId = o.getInt("themeId");
            if(!themeDao.hasOne(_themeId))
                return MsgUtil.makeMsg(MsgCode.ERROR,"某一提问的theme不存在 :(");
            if(!themeDao.verifyOne(_themeId))
                return MsgUtil.makeMsg(MsgCode.ERROR,"某一提问的theme已经删除 :(");
            String theme = themeDao.getOne(_themeId).getString("name");
            o.remove("themeId");o.put("theme",theme);
            objectList.add(o);
        }
        result.put("questions",objectList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getUserQuestions(Integer beginQuestionId,Integer userId){
        JSONObject result = new JSONObject();
        List<JSONObject> questionList = questionDao.getUserQuestions(beginQuestionId,userId);
        List<JSONObject> objectList = new ArrayList<>();
        for(JSONObject o:questionList){
            Integer _themeId = o.getInt("themeId");
            if(!themeDao.hasOne(_themeId))
                return MsgUtil.makeMsg(MsgCode.ERROR,"某一提问的theme不存在 :(");
            if(!themeDao.verifyOne(_themeId))
                return MsgUtil.makeMsg(MsgCode.ERROR,"某一提问的theme已经删除 :(");
            String theme = themeDao.getOne(_themeId).getString("name");
            o.remove("themeId");o.put("theme",theme);
            objectList.add(o);
        }
        result.put("questions",questionList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg likeQuestion(Integer userId,Integer questionId,Boolean like){
        if(!questionDao.hasOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(");
        if(!questionDao.verifyOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"提问已被删除 :(");
        if(!userDao.hasRelation(userId,questionId,"Question")){
            userDao.createRelation(userId,questionId,"Question");
        }
        Relation relation = userDao.getRelation(userId,questionId,"Question");
        if(like == relation.getLike())
            return MsgUtil.makeMsg(MsgCode.ERROR,"点赞布尔相同 :(");

        relation.setLike(like);
        userDao.saveRelation(relation);
        if(like)
            questionDao.addLike(questionId);
        else{
            questionDao.decreaseLike(questionId);
        }
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg relateToQuestion(Integer userId,Integer questionId){
        if(!questionDao.hasOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(");
        if(!questionDao.verifyOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"提问已被删除 :(");
        if(!userDao.hasRelation(userId,questionId,"Question")){
            userDao.createRelation(userId,questionId,"Question");
        }
        Boolean like = false;
        Boolean collect = false;
        Relation relation = userDao.getRelation(userId,questionId,"Question");
        like = relation.getLike();
        collect = relation.getCollect();
        JSONObject result = new JSONObject();
        result.put("like",like);
        result.put("collect",collect);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg collectQuestion(Integer userId,Integer questionId,Boolean collect){
        if(!questionDao.hasOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(");
        if(!questionDao.verifyOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"提问已被删除 :(");
        if(!userDao.hasRelation(userId,questionId,"Question")){
            userDao.createRelation(userId,questionId,"Question");
        }
        Relation relation = userDao.getRelation(userId,questionId,"Question");
        if(collect == relation.getCollect())
            return MsgUtil.makeMsg(MsgCode.ERROR,"收藏布尔相同 :(");
        relation.setCollect(collect);
        userDao.saveRelation(relation);
        if(collect)
            questionDao.addCollect(questionId);
        else
            questionDao.decreaseCollect(questionId);
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg banQuestion(JSONObject object){
        if(!object.containsKey("questionId"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        int questionId = -1;
        try {
            questionId = (Integer) (object.get("questionId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"questionId必须是个整型常量 :(");
        }
        if(!questionDao.hasOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(");
        if(!questionDao.verifyOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"提问已被删除 :(");
        if(questionDao.bannedOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"提问已被封禁 :(");
        questionDao.ban(questionId);
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg unbanQuestion(JSONObject object){
        if(!object.containsKey("questionId"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        int questionId = -1;
        try {
            questionId = (Integer) (object.get("questionId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"questionId必须是个整型常量 :(");
        }
        if(!questionDao.hasOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(");
        if(!questionDao.bannedOne(questionId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"提问已被解禁 :(");
        questionDao.unban(questionId);
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }
}
