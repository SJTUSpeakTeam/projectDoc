package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserAdmin;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserValid;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import cn.sjtu.spillyourheart.service.QuestionService;

@RestController
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @RequestMapping("/postQuestion")
    @UserToken
    @UserValid
    public Msg postQuestion(@RequestBody JSONObject object){ return questionService.postQuestion(object); }

    @RequestMapping("/getQuestion")
    @PassToken
    public Msg getQuestion(@RequestParam("questionId") int questionId){ return questionService.getQuestion(questionId); }

    @RequestMapping("/getNotDeletedQuestions")
    @UserToken
    @UserAdmin
    public Msg getNotDeletedQuestions(@RequestParam("beginQuestionId") int beginQuestionId){ return questionService.getNotDeletedQuestions(beginQuestionId); }

    @RequestMapping("/getUserQuestions")
    @UserToken
    @UserValid
    public Msg getUserQuestions(@RequestParam("beginQuestionId") int beginQuestionId,@RequestParam("userId") int userId){
        return questionService.getUserQuestions(beginQuestionId,userId);
    }

    @RequestMapping("/getHotQuestions")
    @PassToken
    public Msg getHotQuestions(){ return questionService.getHotQuestions(); }

    @RequestMapping("/getNewQuestions")
    @PassToken
    public Msg getNewQuestions(){ return questionService.getNewQuestions(); }

    @RequestMapping("/getFilterQuestions")
    @PassToken
    public Msg getFilterQuestions(@RequestBody JSONObject object){ return questionService.getFilterQuestions(object); }

    @RequestMapping("/likeQuestion")
    @UserToken
    @UserValid
    public Msg likeQuestion(@RequestParam("userId") int userId,
                            @RequestParam("questionId") int questionId,
                            @RequestParam("like") boolean like){ return questionService.likeQuestion(userId,questionId,like); }

    @RequestMapping("/relateToQuestion")
    @UserToken
    @UserValid
    public Msg relateToQuestion(@RequestParam("userId") int userId,
                              @RequestParam("questionId") int questionId){ return questionService.relateToQuestion(userId,questionId); }


    @RequestMapping("/collectQuestion")
    @UserToken
    @UserValid
    public Msg collectQuestion(@RequestParam("userId") int userId,
                            @RequestParam("questionId") int questionId,
                            @RequestParam("collect") boolean collect){ return questionService.collectQuestion(userId,questionId,collect); }

    @RequestMapping("/browseQuestion")
    @UserToken
    @UserValid
    public Msg browseQuestion(@RequestParam("userId") int userId,
                               @RequestParam("questionId") int questionId){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }

    @RequestMapping("/deleteQuestion")
    @UserToken
    @UserValid
    public Msg deleteQuestion(@RequestBody JSONObject object){ return questionService.deleteQuestion(object); }

    @RequestMapping("/banQuestion")
    @UserToken
    @UserAdmin
    public Msg banQuestion(@RequestBody JSONObject object){ return questionService.banQuestion(object); }

    @RequestMapping("/unbanQuestion")
    @UserToken
    @UserAdmin
    public Msg unbanQuestion(@RequestBody JSONObject object){ return questionService.unbanQuestion(object); }

    @RequestMapping("/updateQuestion")
    @UserToken
    @UserValid
    public Msg updateQuestion(@RequestBody JSONObject object){ return questionService.updateQuestion(object); }
}
