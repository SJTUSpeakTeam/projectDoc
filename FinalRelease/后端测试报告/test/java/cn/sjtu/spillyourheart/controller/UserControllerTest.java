package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.SpillYourHeartApplicationTests;
import cn.sjtu.spillyourheart.controller.UserController;
import cn.sjtu.spillyourheart.dao.UserDao;
import cn.sjtu.spillyourheart.service.UserService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserControllerTest extends SpillYourHeartApplicationTests {
    @Autowired
    private UserController userController;

    @Autowired
    private UserService userService;

    @Autowired
    private UserDao userDao;

    @Before
    public void SetUp(){ }

    @AfterEach
    void tearDown(){}

    @Test
    public void getOneUser(){
        // 检查正常取用户信息
        Integer userId = 20;

        Integer status = userController.getOneUser(userId)
                .getStatus();
        assertEquals(0, status);
    }

    public void getOneUserWrongId(){
        Integer userId = -1;

        Integer status = userController.getOneUser(userId)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void getAllUser(){
        // 检查正常取所有用户信息
        Integer page = 0;

        JSONObject retData = userController.getAllUser(page).getData();
        Integer status = userController.getAllUser(page)
                .getStatus();
        assertEquals(0, status);
        assertEquals(true, retData.getJSONArray("userList").size() > 0);
    }

    @Test
    public void getAllUserWrongId(){
        Integer page = -1;

        Integer status = userController.getAllUser(page)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void getSomeUser(){
        // 检查正常取某些取用户信息
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray idArray = new JSONArray();
        for(Integer i = 0; i < 20; ++i){
            if (i == userId)
                continue;
            idArray.add(i);
        }

        inputData.put("checkFollow", true);
        inputData.put("userId", userId);
        inputData.put("idArray", idArray);

        Integer status = userController.getSomeUser(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void getSomeUserNoIdArray(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray idArray = new JSONArray();
        for(Integer i = 0; i < 20; ++i){
            if (i == userId)
                continue;
            idArray.add(i);
        }

        inputData.put("checkFollow", true);
        inputData.put("userId", userId);
        inputData.put("idArray", idArray);

        // 没有 idArray
        inputData = new JSONObject();

        Integer status = userController.getSomeUser(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void getSomeUserNoId(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray idArray = new JSONArray();
        for(Integer i = 0; i < 20; ++i){
            if (i == userId)
                continue;
            idArray.add(i);
        }

        inputData.put("checkFollow", true);
        inputData.put("userId", userId);
        inputData.put("idArray", idArray);

        // 没有 userId
        inputData = new JSONObject();
        inputData.put("idArray", idArray);

        Integer status = userController.getSomeUser(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void getUserByKey(){
        // 正常关键词获取用户信息
        JSONObject inputData = new JSONObject();
        String nickname = "sjz";
        String mailAddr = "sjz@sjtu.du.cn";
        Integer ageFrom = -1;
        Integer ageTo = 999;
        Boolean gender = true;
        Integer userType = 2;
        Integer pageNum = 0;

        inputData.put("nickname", nickname);
        inputData.put("mailAddr", mailAddr);
        inputData.put("ageFrom", ageFrom);
        inputData.put("ageTo", ageTo);
        inputData.put("gender", gender);
        inputData.put("userType", userType);
        inputData.put("pageNum", pageNum);

        Integer status = userController.getUserByKey(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void getUserByKeyNoSpecificParams(){
        // 正常关键词获取用户信息
        JSONObject inputData = new JSONObject();
        String nickname = "sjz";
        String mailAddr = "sjz@sjtu.du.cn";
        Integer ageFrom = -1;
        Integer ageTo = 999;
        Boolean gender = true;
        Integer userType = 2;
        Integer pageNum = 0;

        inputData.put("nickname", nickname);
        inputData.put("mailAddr", mailAddr);
        inputData.put("ageFrom", ageFrom);
        inputData.put("ageTo", ageTo);
        inputData.put("gender", gender);
        inputData.put("userType", userType);
        inputData.put("pageNum", pageNum);

        // no specific params
        inputData = new JSONObject();

        inputData.put("ageFrom", ageFrom);
        inputData.put("ageTo", ageTo);
        inputData.put("userType", userType);
        inputData.put("pageNum", pageNum);

        Integer status = userController.getUserByKey(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void getUserByKeyWrongAgeField(){
        // 正常关键词获取用户信息
        JSONObject inputData = new JSONObject();
        String nickname = "sjz";
        String mailAddr = "sjz@sjtu.du.cn";
        Integer ageFrom = -1;
        Integer ageTo = 999;
        Boolean gender = true;
        Integer userType = 2;
        Integer pageNum = 0;

        inputData.put("nickname", nickname);
        inputData.put("mailAddr", mailAddr);
        inputData.put("ageFrom", ageFrom);
        inputData.put("ageTo", ageTo);
        inputData.put("gender", gender);
        inputData.put("userType", userType);
        inputData.put("pageNum", pageNum);

        // wrong age field
        inputData = new JSONObject();

        ageTo = 999;
        ageFrom = 888;

        inputData.put("nickname", nickname);
        inputData.put("mailAddr", mailAddr);
        inputData.put("ageFrom", ageFrom);
        inputData.put("ageTo", ageTo);
        inputData.put("gender", gender);
        inputData.put("userType", userType);
        inputData.put("pageNum", pageNum);

        Integer status = userController.getUserByKey(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void banUser(){
        JSONObject inputData = new JSONObject();
        JSONArray idArray = new JSONArray();
        idArray.add(3);
        inputData.put("idArray", idArray);

        Integer status = userController.banUser(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void banUserWrongIdArray(){
        JSONObject inputData = new JSONObject();
        JSONArray idArray = new JSONArray();
        idArray.add(3);
        inputData.put("idArray", idArray);

        // wrong idArray
        inputData = new JSONObject();
        idArray = new JSONArray();
        idArray.add(-1);
        inputData.put("idArray", idArray);

        Integer status = userController.banUser(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void banUserNoIdArray(){
        JSONObject inputData = new JSONObject();
        JSONArray idArray = new JSONArray();
        idArray.add(3);
        inputData.put("idArray", idArray);

        // no idArray
        inputData = new JSONObject();

        Integer status = userController.banUser(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void liftBan(){
        JSONObject inputData = new JSONObject();
        JSONArray idArray = new JSONArray();
        idArray.add(3);
        inputData.put("idArray", idArray);

        Integer status = userController.liftBan(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void liftBanWrongIdArray(){
        JSONObject inputData = new JSONObject();
        JSONArray idArray = new JSONArray();
        idArray.add(3);
        inputData.put("idArray", idArray);

        // wrong idArray
        inputData = new JSONObject();
        idArray = new JSONArray();
        idArray.add(-1);
        inputData.put("idArray", idArray);

        Integer status = userController.liftBan(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void liftBanNoIdArray(){
        JSONObject inputData = new JSONObject();
        JSONArray idArray = new JSONArray();
        idArray.add(3);
        inputData.put("idArray", idArray);

        // no idArray
        inputData = new JSONObject();

        Integer status = userController.liftBan(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void modifyInfo(){
        JSONObject inputData = new JSONObject();
        Integer userId = 3;
        String avatar = "http://www.honghanda.com/ueditor/php/upload/image/20181211/1544510494198001.jpg";
        Integer age = 20;
        Boolean gender = true;
        String phoneNum = "12345678901";
        String profile = "happy day";
        String mailAddr = "sjz@sjtu.du.cn";
        String nickname = "sjz";

        inputData.put("userId", userId);
        inputData.put("avatar", avatar);
        inputData.put("age", age);
        inputData.put("gender", gender);
        inputData.put("phoneNum", phoneNum);
        inputData.put("profile", profile);
        inputData.put("mailAddr", mailAddr);
        inputData.put("nickname", nickname);

        Integer status = userController.modifyInfo(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void modifyInfoLackParams(){
        JSONObject inputData = new JSONObject();
        Integer userId = 3;
        String avatar = "http://www.honghanda.com/ueditor/php/upload/image/20181211/1544510494198001.jpg";
        Integer age = 20;
        Boolean gender = true;
        String phoneNum = "12345678901";
        String profile = "happy day";
        String mailAddr = "sjz@sjtu.du.cn";
        String nickname = "sjz";

        inputData.put("userId", userId);
        inputData.put("avatar", avatar);
        inputData.put("age", age);
        inputData.put("gender", gender);
        inputData.put("phoneNum", phoneNum);
        inputData.put("profile", profile);
        inputData.put("mailAddr", mailAddr);
        inputData.put("nickname", nickname);

        // lack params
        inputData = new JSONObject();

        inputData.put("userId", userId);
        inputData.put("avatar", avatar);
        inputData.put("age", age);
        inputData.put("gender", gender);

        Integer status = userController.modifyInfo(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void modifyPassword(){
        JSONObject inputData = new JSONObject();
        Integer userId = 3;
        String password = "justATest";

        inputData.put("userId", userId);
        inputData.put("password", password);

        Integer status = userController.modifyPassword(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void modifyPasswordNoUserId(){
        JSONObject inputData = new JSONObject();
        Integer userId = 3;
        String password = "justATest";

        inputData.put("userId", userId);
        inputData.put("password", password);

        // no userId
        inputData = new JSONObject();
        inputData.put("password", password);

        Integer status = userController.modifyPassword(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void transfer(){
        JSONObject inputData = new JSONObject();
        Integer userId = 3;
        Integer userType = 3;

        inputData.put("userId", userId);
        inputData.put("userType", userType);

        Integer status = userController.transfer(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void transferNoUserId(){
        JSONObject inputData = new JSONObject();
        Integer userId = 3;
        Integer userType = 3;

        inputData.put("userId", userId);
        inputData.put("userType", userType);

        // no userId
        inputData = new JSONObject();

        inputData.put("userType", userType);

        Integer status = userController.transfer(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void transferInvalidUserId(){
        JSONObject inputData = new JSONObject();
        Integer userId = 3;
        Integer userType = 3;

        inputData.put("userId", userId);
        inputData.put("userType", userType);

        // invalid userId
        inputData = new JSONObject();

        inputData.put("userType", userType);

        Integer status = userController.transfer(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void suppliment(){
        assertEquals(true, userService.findUserAuthById(3) != null);
        assertEquals(true, userService.findUserById(3) != null);
    }
}
