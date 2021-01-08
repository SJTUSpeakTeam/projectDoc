package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.SpillYourHeartApplicationTests;
import cn.sjtu.spillyourheart.dao.UserDao;
import cn.sjtu.spillyourheart.entity.RegularUser;
import cn.sjtu.spillyourheart.entity.User;
import cn.sjtu.spillyourheart.repository.RegularUserRepository;
import cn.sjtu.spillyourheart.repository.UserAuthRepository;
import cn.sjtu.spillyourheart.repository.UserRepository;
import cn.sjtu.spillyourheart.service.UserService;
import net.sf.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class LoginControllerTest extends SpillYourHeartApplicationTests {
    @Test
    public void contentLoads(){}

    // 屏蔽http网络请求
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserService userService;

    @Autowired
    private UserDao userDao;

    static private UserRepository userRepository;

    static private UserAuthRepository userAuthRepository;

    static private RegularUserRepository regularUserRepository;

    @Autowired
    private  LoginController loginController;

    @Before
    public void SetUp(){
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @AfterEach
    void tearDown(){}

    @AfterAll
    static void clearEmptyUsers(){
        List<User> userList = userRepository.findAll();
        List<RegularUser> regularUsers = regularUserRepository.findAll();
        List<RegularUser> deprecateRegulars = new ArrayList<>();
        for(RegularUser regularUser: regularUsers){
            Boolean find;
            find = false;
            for(User user: userList){
                if (user.getUserId() == regularUser.getUserId()){
                    find = true;
                    break;
                }
            }
            if (!find){
                deprecateRegulars.add(regularUser);
            }
        }
        regularUserRepository.deleteAll(deprecateRegulars);
    }

    @Test
    public void loginNotVerify() throws Exception{
        JSONObject data = new JSONObject();
        String mailAddr = "sjz@sjtu.edu.cn";
        String password = "sijinze";
        data.put("mailAddr",mailAddr);
        data.put("password",password);
        MvcResult mvcResult = mockMvc.perform(post("http://localhost:30392/login").content(String.valueOf(data)).contentType(MediaType.APPLICATION_JSON_VALUE))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andReturn();

        JSONObject resultJSON = JSONObject.fromObject(mvcResult.getResponse().getContentAsString());
        Integer status = resultJSON.getInt("status");
        assertEquals(-1, status);   // not verify by mail addr
    }

    @Test
    public void loginWrongPsw() throws Exception{
        JSONObject data = new JSONObject();
        String mailAddr = "sjz@sjtu.edu.cn";
        String password = "sijinze";
        data.put("mailAddr",mailAddr);
        data.put("password",password);

        // wrong password user type
        data = new JSONObject();
        mailAddr = "lhy159840@sjtu.edu.cn";
        password = "123456159840";
        data.put("mailAddr",mailAddr);
        data.put("password",password);


        Integer status = userService.login(data)
                .getStatus();
        assertEquals(-1, status);
    }

    @Test
    public void loginSuccess() throws Exception{
        JSONObject data = new JSONObject();
        String mailAddr = "sjz@sjtu.edu.cn";
        String password = "sijinze";
        data.put("mailAddr",mailAddr);
        data.put("password",password);

        // normally login
        data = new JSONObject();
        mailAddr = "lhy159840@sjtu.edu.cn";
        password = "123456";
        data.put("mailAddr",mailAddr);
        data.put("password",password);

        Integer status = userService.login(data)
                .getStatus();
        assertEquals(0, status);
    }

    @Test
    public void logout() throws Exception{
        // 登出正常执行
        JSONObject data = new JSONObject();
        MvcResult mvcResult = mockMvc.perform(post("http://localhost:30392/logout").content(String.valueOf(data)).contentType(MediaType.APPLICATION_JSON_VALUE))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andReturn();

        assertEquals(true, mvcResult.getResponse().getContentAsString().equals("0"));
    }

    @Test
    public void registrySuccess() throws Exception {
        JSONObject data = new JSONObject();
        String mailAddr = "test@sjtu.edu.cn";
        String password = "justTest";
        String phoneNum = "12345678901";
        String nickname = "justTest";
        data.put("mailAddr", mailAddr);
        data.put("password", password);
        data.put("phoneNum", phoneNum);
        data.put("nickname", nickname);
        MvcResult mvcResult = mockMvc.perform(post("http://localhost:30392/registry").content(String.valueOf(data)).contentType(MediaType.APPLICATION_JSON_VALUE))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andReturn();

        JSONObject resultJSON = JSONObject.fromObject(mvcResult.getResponse().getContentAsString());
        Integer status = resultJSON.getInt("status");
        Integer userId = userDao.findUserAuthByEP(mailAddr, password).getUserId();

        userDao.delete(userId);
        userDao.deleteAuth(userId);
        userDao.deleteRegular(userId);

        assertEquals(0, status);
    }

    @Test
    public void registryLackParam() throws Exception{
        JSONObject data = new JSONObject();
        String mailAddr = "test@sjtu.edu.cn";
        String password = "justTest";
        String phoneNum = "12345678901";
        String nickname = "justTest";
        data.put("mailAddr",mailAddr);
        data.put("password",password);
        data.put("phoneNum", phoneNum);
        data.put("nickname", nickname);

        // lack param
        data = new JSONObject();
        data.put("mailAddr",mailAddr);
        data.put("password",password);

        Integer status = userService.registry(data).getStatus();

        assertEquals(-1, status);
    }

    @Test
    public void registryLackParamV2() throws Exception{
        // 注册正常执行
        JSONObject data = new JSONObject();
        String mailAddr = "test@sjtu.edu.cn";
        String password = "justTest";
        String phoneNum = "12345678901";
        String nickname = "justTest";
        data.put("mailAddr",mailAddr);
        data.put("password",password);
        data.put("phoneNum", phoneNum);
        data.put("nickname", nickname);

        // lack param v2
        data = new JSONObject();
        data.put("phoneNum", phoneNum);
        data.put("nickname", nickname);

        Integer status = userService.registry(data).getStatus();

        assertEquals(-1, status);
    }

    @Test
    public void verifyNicknameSuccess() throws Exception{
        // nickname invalid
        JSONObject data = new JSONObject();
        MvcResult mvcResult = mockMvc.perform(post("http://localhost:30392/verify/nickname?value=sjz").content(String.valueOf(data)).contentType(MediaType.APPLICATION_JSON_VALUE))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andReturn();

        JSONObject resultJSON = JSONObject.fromObject(mvcResult.getResponse().getContentAsString());
        Integer status = resultJSON.getInt("status");
        assertEquals(-1, status);
    }

    @Test
    public void verifyNicknameFail() throws Exception{
        // nickname is valid
        JSONObject data = new JSONObject();
        MvcResult mvcResult = mockMvc.perform(post("http://localhost:30392/verify/nickname?value=thisistotallyvalidbecausetoolong").content(String.valueOf(data)).contentType(MediaType.APPLICATION_JSON_VALUE))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andReturn();

        JSONObject resultJSON = JSONObject.fromObject(mvcResult.getResponse().getContentAsString());
        Integer status = resultJSON.getInt("status");
        assertEquals(0, status);
    }

    @Test
    public void verifyMailAddrSuccess() throws Exception{
        // mailAddr invalid
        JSONObject data = new JSONObject();
        MvcResult mvcResult = mockMvc.perform(post("http://localhost:30392/verify/mailAddr?value=sjz@sjtu.edu.cn").content(String.valueOf(data)).contentType(MediaType.APPLICATION_JSON_VALUE))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andReturn();

        JSONObject resultJSON = JSONObject.fromObject(mvcResult.getResponse().getContentAsString());
        Integer status = resultJSON.getInt("status");
        assertEquals(-1, status);
    }

    @Test
    public void verifyMailAddrFail() throws Exception{
        // mailAddr valid
        JSONObject data = new JSONObject();
        MvcResult mvcResult = mockMvc.perform(post("http://localhost:30392/verify/mailAddr?value=thisistotallyvalidbecausetoolong").content(String.valueOf(data)).contentType(MediaType.APPLICATION_JSON_VALUE))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andReturn();

        JSONObject resultJSON = JSONObject.fromObject(mvcResult.getResponse().getContentAsString());
        Integer status = resultJSON.getInt("status");
        assertEquals(0, status);
    }
}
