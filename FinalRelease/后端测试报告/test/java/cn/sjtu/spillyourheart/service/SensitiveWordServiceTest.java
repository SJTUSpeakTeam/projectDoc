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
public class SensitiveWordServiceTest {
    @Autowired
    private SensitiveWordService sensitiveWordService;

    @Before
    public void SetUp(){}

    @AfterEach
    void tearDown(){}

    private Integer newPost=0;

    @Test
    @Transactional
    public void postOne() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = sensitiveWordService.postOne(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("name",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"name必须是个字符串 :(").getJSONObject();
        verifyJSON =sensitiveWordService.postOne(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程
        data.put("name","test-jj");
        verifyJSON =JSONObject
                .fromObject(sensitiveWordService.postOne(data));
        //assertEquals(verifyJSON.getInt("status"),0);


            //已存在该敏感词
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"已存在该敏感词 :(").getJSONObject();
        verifyJSON =sensitiveWordService.postOne(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);


    }

    @Test
    @Transactional
    public void deleteOne() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = sensitiveWordService.deleteOne(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("sensitiveWordId","test-error");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"sensitiveWordId必须是个整型常量 :(").getJSONObject();
        verifyJSON =sensitiveWordService.deleteOne(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //不存在该敏感词
        data.put("sensitiveWordId",0);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"不存在该敏感词 :(").getJSONObject();
        verifyJSON =sensitiveWordService.deleteOne(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
    }


    @Test
    @Transactional
    public void getAll() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

        data.put("name","test-jj");
        sensitiveWordService.postOne(data);

        verifyJSON = sensitiveWordService.getAll().getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }
}
