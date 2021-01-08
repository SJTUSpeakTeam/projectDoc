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
public class AnswerServiceTest {
    @Autowired
    private AnswerService answerService;
    @Autowired
    private QuestionService questionService;
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
        //before:创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");
        System.out.println(newPost);
    }

    @AfterEach
    void tearDown(){}

    Integer newPost = 0;

    Integer newPostAnswer = 0;

    @Test
    @Transactional
    public void postAnswer() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

        data.put("questionId",newPost);
        data.put("userId",1);

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = answerService.postAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("content",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个字符串 :(").getJSONObject();
        verifyJSON = answerService.postAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //问题不存在或删除
        data.put("content","test-content");
        data.put("questionId",0);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"相关问题已被删除 :(").getJSONObject();
        verifyJSON = answerService.postAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //违禁词
        data.put("questionId",newPost);
        data.put("content","test-jj");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"内容有违禁词: jj :(").getJSONObject();
        verifyJSON = answerService.postAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程
        data.put("content","test");
        verifyJSON = answerService.postAnswer(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void deleteAnswer() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

        data.put("answerId",1);
        //data.put("userId",1);

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = answerService.deleteAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("userId","test-error");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"userId必须是个整型常量 :(").getJSONObject();
        verifyJSON = answerService.deleteAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新回复
        temp.put("questionId",newPost);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostAnswer = JSONObject
                .fromObject(answerService.postAnswer(temp))
                .getJSONObject("data")
                .getInt("answerId");

            //找不到相应回复
        data.put("userId",1);
        data.put("answerId",0);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(").getJSONObject();
        verifyJSON = answerService.deleteAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //用户不对应
        data.put("answerId",newPostAnswer);
        data.put("userId",2);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"用户不对应 :(").getJSONObject();
        verifyJSON = answerService.deleteAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程
        data.put("userId",1);
        verifyJSON = answerService.deleteAnswer(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void updateAnswer() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

        data.put("answerId",1);
        data.put("content","test-content-change");

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = answerService.updateAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("userId","test-error");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"userId必须是个整型常量 :(").getJSONObject();
        verifyJSON = answerService.updateAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新回复
        temp.put("questionId",newPost);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostAnswer = JSONObject
                .fromObject(answerService.postAnswer(temp))
                .getJSONObject("data")
                .getInt("answerId");

            //找不到相应回复
        data.put("userId",1);
        data.put("answerId",0);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(").getJSONObject();
        verifyJSON = answerService.updateAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //用户不对应
        data.put("answerId",newPostAnswer);
        data.put("userId",2);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"用户不对应 :(").getJSONObject();
        verifyJSON = answerService.updateAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程
        data.put("userId",1);
        verifyJSON = answerService.updateAnswer(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void getAnswer() throws Exception {
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //不存在相应回复
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(").getJSONObject();
        verifyJSON = answerService.getAnswer(0).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新回复
        temp.put("questionId",newPost);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostAnswer = JSONObject
                .fromObject(answerService.postAnswer(temp))
                .getJSONObject("data")
                .getInt("answerId");

        verifyJSON = answerService.getAnswer(newPostAnswer).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void banAndunbanAnswer() throws Exception {
        JSONObject data = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = answerService.banAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = answerService.unbanAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("answerId","test-error");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"answerId必须是个整型常量 :(").getJSONObject();
        verifyJSON = answerService.banAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = answerService.unbanAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //不存在相应回复
        data.put("answerId",0);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(").getJSONObject();
        verifyJSON = answerService.banAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = answerService.unbanAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新回复
        temp.put("questionId",newPost);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostAnswer = JSONObject
                .fromObject(answerService.postAnswer(temp))
                .getJSONObject("data")
                .getInt("answerId");

            //正常流程封禁及已封禁
        data.put("answerId",newPostAnswer);
        verifyJSON = answerService.banAnswer(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"回复已被删除或封禁 :(").getJSONObject();
        verifyJSON = answerService.banAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程解禁及已解禁
        data.put("answerId",newPostAnswer);
        verifyJSON = answerService.unbanAnswer(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"回复已被解禁 :(").getJSONObject();
        verifyJSON = answerService.unbanAnswer(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
    }

    @Test
    @Transactional
    public void likeAndCollectAnswer() throws Exception {
        JSONObject data = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //插入一条新回复
        temp.put("questionId",newPost);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostAnswer = JSONObject
                .fromObject(answerService.postAnswer(temp))
                .getJSONObject("data")
                .getInt("answerId");

            //不存在相应回复
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应回复 :(").getJSONObject();
        verifyJSON = answerService.likeAnswer(1,0,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = answerService.collectAnswer(1,0,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //删除回复
        data.put("answerId",newPostAnswer);
        data.put("userId",1);
        verifyJSON = answerService.deleteAnswer(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);

            //回复已被删除
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"回复已被删除 :(").getJSONObject();
        verifyJSON = answerService.likeAnswer(1,newPostAnswer,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = answerService.collectAnswer(1,newPostAnswer,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新回复
        temp.put("questionId",newPost);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostAnswer = JSONObject
                .fromObject(answerService.postAnswer(temp))
                .getJSONObject("data")
                .getInt("answerId");

            //正常流程
        verifyJSON = answerService.likeAnswer(1,newPostAnswer,true).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
        verifyJSON = answerService.collectAnswer(1,newPostAnswer,true).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);

            //收藏和点赞布尔相同
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"点赞布尔相同 :(").getJSONObject();
        verifyJSON = answerService.likeAnswer(1,newPostAnswer,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"收藏布尔相同 :(").getJSONObject();
        verifyJSON = answerService.collectAnswer(1,newPostAnswer,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
    }

    @Test
    @Transactional
    public void getAnswerByQuestion() throws Exception{
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //不存在相关问题
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"相关问题不存在 :(").getJSONObject();
        verifyJSON = answerService.getAnswerByQuestion(-1,0).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一条新回复
        temp.put("questionId",newPost);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostAnswer = JSONObject
                .fromObject(answerService.postAnswer(temp))
                .getJSONObject("data")
                .getInt("answerId");

            //正常流程
        verifyJSON = answerService.getAnswerByQuestion(-1,newPost).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void getUserQuestions() throws Exception{
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

        //插入一条新回复
        temp.put("questionId",newPost);
        temp.put("content","test-content");
        temp.put("userId",1);
        newPostAnswer = JSONObject
                .fromObject(answerService.postAnswer(temp))
                .getJSONObject("data")
                .getInt("answerId");

        //正常流程
        verifyJSON = answerService.getUserAnswers(-1,1).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void getAdminQuestions() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = answerService.getAdminAnswers(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("beginAnswerId",-1);
        data.put("search",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"search必须是个字符串数组 :(").getJSONObject();
        verifyJSON = answerService.getAdminAnswers(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程1: delete and ban
        data.put("search","");
        data.put("delete",true);
        data.put("ban",true);
        verifyJSON = answerService.getAdminAnswers(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);

            //正常流程1: delete and ban
        data.remove("delete",true);
        data.remove("ban",true);
        verifyJSON = answerService.getAdminAnswers(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }
}
