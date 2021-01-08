package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
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
public class ThemeServiceTest {
    @Autowired
    private ThemeService themeService;

    @Before
    public void SetUp(){
    }

    @AfterEach
    void tearDown(){}

    private Integer newPost = 0;

    @Test
    @Transactional
    public void postTheme() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = themeService.postTheme(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("name",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"name必须是个字符串 :(").getJSONObject();
        verifyJSON = themeService.postTheme(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常流程
        data.put("name","test");
        verifyJSON = themeService.postTheme(data).getJSONObject();
    }

    @Test
    @Transactional
    public void getThemeAndThemes() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //正常流程
        verifyJSON = themeService.getThemes().getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }
}
