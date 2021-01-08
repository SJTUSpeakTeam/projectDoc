package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.SpillYourHeartApplicationTests;
import cn.sjtu.spillyourheart.dao.FollowDao;
import cn.sjtu.spillyourheart.service.FollowService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class FollowControllerTest extends SpillYourHeartApplicationTests {
    @Autowired
    private FollowController followController;

    @Autowired
    private FollowService followService;

    @Autowired
    private FollowDao followDao;

    @Before
    public void SetUp(){ }

    @AfterEach
    void tearDown(){}

    @Test
    public void listFollow(){
        Integer userId = 3;

        Integer status = followController.listFollow(userId)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void listFollowInvalidUserId(){
        Integer userId = 3;

        // invalid userId
        userId = -1;

        Integer status = followController.listFollow(userId)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void listFollower(){
        Integer userId = 3;

        Integer status = followController.listFollower(userId)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void listFollowerInvalidUserId(){
        Integer userId = 3;

        // invalid userId
        userId = -1;

        Integer status = followController.listFollow(userId)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void isFollow(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray followIds = new JSONArray();
        for(Integer i = 0; i < 20; ++i){
            if (i == userId)
                continue;
            followIds.add(i);
        }

        inputData.put("userId", userId);
        inputData.put("followIds", followIds);

        Integer status = followController.isFollow(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    public void isFollowLackParams(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray followIds = new JSONArray();
        for(Integer i = 0; i < 20; ++i){
            if (i == userId)
                continue;
            followIds.add(i);
        }

        // lack param
        inputData = new JSONObject();

        inputData.put("followIds", followIds);

        Integer status = followController.isFollow(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    public void isFollowInvalidUserId(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray followIds = new JSONArray();
        for(Integer i = 0; i < 20; ++i){
            if (i == userId)
                continue;
            followIds.add(i);
        }

        // invalid userId
        inputData = new JSONObject();

        userId = -1;

        inputData.put("followIds", followIds);
        inputData.put("userId", userId);

        Integer status = followController.isFollow(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void remove(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray followIds = new JSONArray();
        for(Integer i = 0; i < 20; ++i){
            if (i == userId)
                continue;
            followIds.add(i);
        }

        inputData.put("userId", userId);
        inputData.put("followIds", followIds);

        Integer status = followController.remove(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void removeLackParams(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray followIds = new JSONArray();
        for(Integer i = 0; i < 20; ++i){
            if (i == userId)
                continue;
            followIds.add(i);
        }

        // lack param
        inputData = new JSONObject();

        inputData.put("followIds", followIds);

        Integer status = followController.remove(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void removeInvalidUserId(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray followIds = new JSONArray();
        for(Integer i = 0; i < 20; ++i){
            if (i == userId)
                continue;
            followIds.add(i);
        }

        // invalid userId
        inputData = new JSONObject();

        userId = -1;

        inputData.put("followIds", followIds);
        inputData.put("userId", userId);

        Integer status = followController.remove(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void follow(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray followIds = new JSONArray();
        followIds.add(20);

        inputData.put("userId", userId);
        inputData.put("followIds", followIds);

        Integer status = followController.follow(inputData)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void followLackParams(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray followIds = new JSONArray();
        followIds.add(20);

        inputData.put("userId", userId);
        inputData.put("followIds", followIds);

        // lack param
        inputData = new JSONObject();

        inputData.put("followIds", followIds);

        Integer status = followController.follow(inputData)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void followInvalidUserId(){
        JSONObject inputData = new JSONObject();

        Integer userId = 3;
        JSONArray followIds = new JSONArray();
        followIds.add(20);

        inputData.put("userId", userId);
        inputData.put("followIds", followIds);

        // invalid userId
        inputData = new JSONObject();

        userId = -1;

        inputData.put("followIds", followIds);
        inputData.put("userId", userId);

        Integer status = followController.follow(inputData)
                .getStatus();
        assertEquals(-1, status);
    }
}
