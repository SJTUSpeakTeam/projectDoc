package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.dao.*;
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

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class QuestionServiceTest {
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
    }

    @AfterEach
    void tearDown(){}

    Integer newPost = 0;

    @Test
    @Transactional
    public void postQuestion() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

        data.put("header","test-header");
        data.put("content","test-content");
        data.put("theme","tester");//existed

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = questionService.postQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        //assertEquals(resultJSON.getString("msg"),verifyJSON.getString("msg"));
        //assertEquals(resultJSON.get("data"),verifyJSON.get("data"));

            //参数获取错误
        data.put("userId","str");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"userId必须是个整型常量 :(").getJSONObject();
        verifyJSON = questionService.postQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //不存在的主题
        data.put("theme","notExisted");
        data.put("userId",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在该主题: notExisted :(").getJSONObject();
        verifyJSON = questionService.postQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //违禁词(header)
        data.put("header","jj");
        data.put("theme","tester");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"标题有违禁词: jj :(").getJSONObject();
        verifyJSON = questionService.postQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //违禁词(content)
        data.put("content","jj");
        data.put("header","test-header");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"内容有违禁词: jj :(").getJSONObject();
        verifyJSON = questionService.postQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程
        data.put("header","test-header");
        data.put("content","test-content");
        data.put("theme","tester");
        data.put("userId",1);
        verifyJSON = JSONObject.fromObject(questionService.postQuestion(data));;
        System.out.println(verifyJSON.toString());
        assertEquals(verifyJSON.getInt("status"),0);
        assertNotNull(verifyJSON.get("data"));
        newPost = verifyJSON.getJSONObject("data").getInt("questionId");
        assertNotEquals(newPost,0);


    }

    @Test
    @Transactional
    public void deleteQuestion() throws Exception{
        JSONObject temp = new JSONObject();
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //before:创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");
        data.put("questionId",newPost);
        System.out.println(data.toString());

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = questionService.deleteQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("userId","str");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"userId必须是个整型常量 :(").getJSONObject();
        verifyJSON = questionService.deleteQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //userId对应不上
        data.put("userId",2);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"userId与原问题userId不同 :(").getJSONObject();
        verifyJSON = questionService.deleteQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程
        data.put("userId",1);
        verifyJSON = questionService.deleteQuestion(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void updateQuestion() throws Exception{
        JSONObject temp = new JSONObject();
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //before:创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");
        data.put("questionId",newPost);

            //缺少参数
        data.put("userId",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = questionService.updateQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("theme",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"theme必须是个字符串 :(").getJSONObject();
        verifyJSON = questionService.updateQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //没有该theme
        data.put("theme","notExisted");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在该主题: notExisted :(").getJSONObject();
        verifyJSON = questionService.updateQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //不存在相应提问
        data.put("theme","tester");
        data.put("questionId",0);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(").getJSONObject();
        verifyJSON = questionService.updateQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //删除该question
        temp.put("questionId",newPost);
        questionService.deleteQuestion(temp);
        data.put("questionId",newPost);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"提问已被删除 :(").getJSONObject();
        verifyJSON = questionService.updateQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //before:创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");
        data.put("questionId",newPost);

            //userId不同
        data.put("theme","tester");
        data.put("userId",2);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"userId与原问题userId不同 :(").getJSONObject();
        verifyJSON = questionService.updateQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //content不是字符串
        data.put("userId",1);
        data.put("content",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"content必须是字符串 :(").getJSONObject();
        verifyJSON = questionService.updateQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程
        data.put("content","test_content");
        verifyJSON = questionService.updateQuestion(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void getQuestion() throws Exception{
        JSONObject temp = new JSONObject();

        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //before:创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");


            //不存在相应提问
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(").getJSONObject();
        verifyJSON = questionService.getQuestion(0).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //删除该question,提问已被删除
        temp.put("questionId",newPost);
        questionService.deleteQuestion(temp);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"提问已被删除 :(").getJSONObject();
        verifyJSON = questionService.getQuestion(newPost).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //before:创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");

            //正常流程
        verifyJSON = questionService.getQuestion(newPost).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void banAndunbanQuestion() throws Exception{
        JSONObject temp = new JSONObject();
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //before:创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");
        //data.put("questionId",newPost);

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = questionService.banQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = questionService.unbanQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("questionId","test-error");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"questionId必须是个整型常量 :(").getJSONObject();
        verifyJSON = questionService.banQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = questionService.unbanQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //问题不存在
        data.put("questionId",0);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(").getJSONObject();
        verifyJSON = questionService.banQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = questionService.unbanQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);


        data.put("questionId",newPost);
            //正常封禁
        verifyJSON = questionService.banQuestion(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);
            //已被封禁
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"提问已被封禁 :(").getJSONObject();
        verifyJSON = questionService.banQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常解禁
        verifyJSON = questionService.unbanQuestion(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);
            //已被解禁
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"提问已被解禁 :(").getJSONObject();
        verifyJSON = questionService.unbanQuestion(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
    }

    @Test
    @Transactional
    public void getHotAndNewQuestions() throws Exception{
        JSONObject verifyJSON = new JSONObject();

            //正常流程: Hot
        verifyJSON = questionService.getHotQuestions().getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);

            //正常流程: New
        verifyJSON = questionService.getNewQuestions().getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void getNotDeletedQuestions() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = questionService.getNotDeletedQuestions(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取不正确
        data.put("beginQuestionId","test-error");
        resultJSON =MsgUtil.makeMsg(MsgCode.ERROR,"beginQuestionId必须是个整型常量 :(").getJSONObject();
        verifyJSON = questionService.getNotDeletedQuestions(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程1(get all)
        data.put("beginQuestionId",-1);
        data.put("search","");
        data.put("theme","");
        verifyJSON = questionService.getNotDeletedQuestions(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);

            //正常流程2
        data.put("delete",true);
        data.put("ban",true);
        verifyJSON = questionService.getNotDeletedQuestions(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);
    }

    @Test
    @Transactional
    public void getfilterQuestions() throws  Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = questionService.getFilterQuestions(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取不正确
        data.put("beginQuestionId","test-error");
        resultJSON =MsgUtil.makeMsg(MsgCode.ERROR,"beginQuestionId必须是个整型常量 :(").getJSONObject();
        verifyJSON = questionService.getFilterQuestions(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

        data.put("beginQuestionId",-1);
        data.put("search","test");
        data.put("theme","tester");

            //正常流程1: mostLike
        data.put("mostLike",true);
        verifyJSON = questionService.getFilterQuestions(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);

            //正常流程2: hottest
        data.remove("mostLike");
        data.put("hottest",false);
        verifyJSON = questionService.getFilterQuestions(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);

            //正常流程3: mostReply
        data.remove("hottest");
        data.put("mostReply",false);
        verifyJSON = questionService.getFilterQuestions(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);

            //正常流程4: newest
        data.remove("mostReply");
        data.put("newest",false);
        verifyJSON = questionService.getFilterQuestions(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);
    }

    @Test
    @Transactional
    public void getUserQuestions() throws Exception{
        JSONObject verifyJSON = new JSONObject();

            //正常流程
        verifyJSON = questionService.getUserQuestions(-1,1).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);
    }

    @Test
    @Transactional
    public void getUserAnswerAndCollectQuestions() throws Exception{
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //正常流程
        verifyJSON = questionService.getUserAnswerQuestions(-1,1).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);
        verifyJSON = questionService.getUserCollectQuestions(-1,1).getJSONObject();
        assertEquals(verifyJSON.getInt("status"), 0);
    }

    @Test
    @Transactional
    public void likeAndcollectQuestion() throws Exception{
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //before:创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");

            //不存在相应提问
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(").getJSONObject();
        verifyJSON = questionService.likeQuestion(1,0,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = questionService.collectQuestion(1,0,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //删除question
        temp.put("questionId",newPost);
        questionService.deleteQuestion(temp);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"提问已被删除 :(").getJSONObject();
        verifyJSON = questionService.likeQuestion(1,newPost,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = questionService.collectQuestion(1,newPost,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        temp.remove("questionId");
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");

            //正常流程
        verifyJSON = questionService.likeQuestion(1,newPost,true).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
        verifyJSON = questionService.collectQuestion(1,newPost,true).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);

            //不存在相应提问
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"点赞布尔相同 :(").getJSONObject();
        verifyJSON = questionService.likeQuestion(1,newPost,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"收藏布尔相同 :(").getJSONObject();
        verifyJSON = questionService.collectQuestion(1,newPost,true).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
    }

    @Test
    @Transactional
    public void relateToQuestion() throws Exception{
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //before:创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");

            //不存在相应提问
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在相应提问 :(").getJSONObject();
        verifyJSON = questionService.relateToQuestion(1,0).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //删除question
        temp.put("questionId",newPost);
        questionService.deleteQuestion(temp);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"提问已被删除 :(").getJSONObject();
        verifyJSON = questionService.relateToQuestion(1,newPost).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

        //创建新question
        temp.put("header","test-header");
        temp.put("content","test-content");
        temp.put("theme","tester");
        temp.put("userId",1);
        temp.remove("questionId");
        newPost = JSONObject
                .fromObject(questionService.postQuestion(temp))
                .getJSONObject("data")
                .getInt("questionId");

            //正常流程
        verifyJSON = questionService.relateToQuestion(1,newPost).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }
}
