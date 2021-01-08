package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CommentServiceTest {
    @Autowired
    private AnswerService answerService;
    @Autowired
    private QuestionService questionService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private ThemeService themeService;
    @Autowired
    private SensitiveWordService sensitiveWordService;

    @Before
    public void SetUp(){
        JSONObject data = new JSONObject();
        data.put("name","tester");
        themeService.postTheme(data);

        data.put("name","jj");
        sensitiveWordService.postOne(data);


        JSONObject temp = new JSONObject();
        //创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        newPostQuestion = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");
        System.out.println(newPostQuestion);

        //插入一条新回复
        temp.put("questionId",newPostQuestion);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostAnswer = JSONObject
                .fromObject(answerService.postAnswer(temp))
                .getJSONObject("data")
                .getInt("answerId");
    }

    @AfterEach
    void tearDown(){}

    Integer newPostQuestion = 0;

    Integer newPostAnswer = 0;

    Integer newPostComment = 0;

    @Test
    @Transactional
    public void postComment() throws Exception {
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

        data.put("answerId",newPostAnswer);
        data.put("userId",1);

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = commentService.postComment(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("content",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个字符串 :(").getJSONObject();
        verifyJSON = commentService.postComment(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //违禁词
        data.put("content","test-jj");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"内容有违禁词: jj :(").getJSONObject();
        verifyJSON = commentService.postComment(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程1: 无父级评论
        data.put("content","test-content");
        verifyJSON =  JSONObject
                .fromObject(commentService.postComment(data));
        assertEquals(verifyJSON.getInt("status"),0);

        int fatherCommentId = verifyJSON.getJSONObject("data")
                .getInt("commentId");
            //正常流程2: 有父级评论
        data.put("fatherCommentId",fatherCommentId);
        verifyJSON = commentService.postComment(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);

            //删除该父级评论
        data.put("commentId",fatherCommentId);
        commentService.deleteComment(data);

            //父级评论已被删除
        data.remove("commentId");
        data.put("fatherCommentId",fatherCommentId);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"父级评论已被删除 :(").getJSONObject();
        verifyJSON = commentService.postComment(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
    }
    @Test
    @Transactional
    public void deleteComment() throws Exception {
        JSONObject data = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

        data.put("commentId",0);

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = commentService.deleteComment(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("userId","test-error");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"userId必须是个整型常量 :(").getJSONObject();
        verifyJSON = commentService.deleteComment(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //不存在相应评论
        data.put("userId",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应评论 :(").getJSONObject();
        verifyJSON = commentService.deleteComment(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新评论
        temp.put("answerId",newPostAnswer);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostComment = JSONObject
                .fromObject(commentService.postComment(temp))
                .getJSONObject("data")
                .getInt("commentId");

            //用户不对应
        data.put("commentId",newPostComment);
        data.put("userId",2);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"用户不对应 :(").getJSONObject();
        verifyJSON = commentService.deleteComment(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程
        data.put("userId",1);
        verifyJSON = commentService.deleteComment(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void getComment() throws Exception {
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //不存在相应评论
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应评论 :(").getJSONObject();
        verifyJSON = commentService.getComment(0).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新评论
        temp.put("answerId",newPostAnswer);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostComment = JSONObject
                .fromObject(commentService.postComment(temp))
                .getJSONObject("data")
                .getInt("commentId");

            //正常流程
        verifyJSON = commentService.getComment(newPostComment).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void likeComment() throws Exception {
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //不存在相应评论
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应评论 :(").getJSONObject();
        verifyJSON = commentService.likeComment(1,0,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新评论
        temp.put("answerId",newPostAnswer);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostComment = JSONObject
                .fromObject(commentService.postComment(temp))
                .getJSONObject("data")
                .getInt("commentId");

            //删除该评论
        temp.put("commentId",newPostComment);
        commentService.deleteComment(temp);

            //评论已被删除
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"评论已被删除 :(").getJSONObject();
        verifyJSON = commentService.likeComment(1,newPostComment,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新评论
        temp.put("answerId",newPostAnswer);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostComment = JSONObject
                .fromObject(commentService.postComment(temp))
                .getJSONObject("data")
                .getInt("commentId");

            //正常流程
        verifyJSON = commentService.likeComment(1,newPostComment,true).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);

            //点赞布尔相同
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"点赞布尔相同 :(").getJSONObject();
        verifyJSON = commentService.likeComment(1,newPostComment,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
    }

    @Test
    @Transactional
    public void getCommentByAnswer() throws Exception{
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //删除回复
        temp.put("userId",1);
        temp.put("answerId",newPostAnswer);
        answerService.deleteAnswer(temp);

            //回复不存在
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"相关回复已被删除 :(").getJSONObject();
        verifyJSON = commentService.getCommentByAnswer(-1,newPostAnswer).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新回复
        temp.put("questionId",newPostQuestion);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostAnswer = JSONObject
                .fromObject(answerService.postAnswer(temp))
                .getJSONObject("data")
                .getInt("answerId");

            //插入一条新评论
        temp.put("answerId",newPostAnswer);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostComment = JSONObject
                .fromObject(commentService.postComment(temp))
                .getJSONObject("data")
                .getInt("commentId");

            //正常流程
        verifyJSON = commentService.getCommentByAnswer(-1,newPostAnswer).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }
}
