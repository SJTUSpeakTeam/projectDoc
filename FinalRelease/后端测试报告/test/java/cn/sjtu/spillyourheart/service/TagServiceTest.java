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
public class TagServiceTest {
    @Autowired
    private TagService tagService;

    private Integer newPost = 0;

    @Before
    public void SetUp(){
    }

    @AfterEach
    void tearDown(){}

    @Test
    @Transactional
    public void postTag() throws  Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = tagService.postTag(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("content",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个字符串 :(").getJSONObject();
        verifyJSON = tagService.postTag(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //正常处理
        data.put("content","test");
        verifyJSON = tagService.postTag(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void deleteTagandTags() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = tagService.deleteTag(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        verifyJSON = tagService.deleteTags(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("content",1);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个字符串 :(").getJSONObject();
        verifyJSON = tagService.deleteTag(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个string数组 :(").getJSONObject();
        verifyJSON = tagService.deleteTags(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //无对应标签
        data.put("content","test-tag");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"content无对应标签 :(").getJSONObject();
        verifyJSON = tagService.deleteTag(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);
        String[] array = new String[1];
        array[0] = "test-tag";
        data.put("content",array);
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"string: test-tag无对应标签 :(").getJSONObject();
        verifyJSON = tagService.deleteTags(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一个新tag
        data.put("content","test-tag-1");
        tagService.postTag(data).getJSONObject();

            //正常流程1
        data.put("content","test-tag-1");
        verifyJSON = tagService.deleteTag(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);

            //插入一个新tag
        data.put("content","test-tag-1");
        tagService.postTag(data).getJSONObject();

            //正常流程2
        array[0] = "test-tag-1";
        data.put("content",array);
        verifyJSON = tagService.deleteTags(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void getTags() throws Exception{
        JSONObject verifyJSON = new JSONObject();

            //正常流程
        verifyJSON = tagService.getTags().getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }

    @Test
    @Transactional
    public void updateTag() throws Exception{
        JSONObject data = new JSONObject();
        JSONObject resultJSON = new JSONObject();
        JSONObject verifyJSON = new JSONObject();

            //缺少参数
        resultJSON = MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR).getJSONObject();
        verifyJSON = tagService.updateTag(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //参数获取错误
        data.put("content",1);
        data.put("newContent","test-new-content");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个字符串 :(").getJSONObject();
        verifyJSON = tagService.updateTag(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //无对应标签
        data.put("content","test-no-exist");
        data.put("newContent","test-new-content");
        resultJSON = MsgUtil.makeMsg(MsgCode.ERROR,"content无对应标签 :(").getJSONObject();
        verifyJSON = tagService.updateTag(data).getJSONObject();
        assertEquals(resultJSON, verifyJSON);

            //插入一个新标签
        data.put("content","test-new-content");
        tagService.postTag(data);

            //正常流程
        verifyJSON = tagService.updateTag(data).getJSONObject();
        assertEquals(verifyJSON.getInt("status"),0);
    }
}
