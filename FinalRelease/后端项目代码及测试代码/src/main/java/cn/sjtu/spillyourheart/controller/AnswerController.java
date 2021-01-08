package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.service.AnswerService;
import cn.sjtu.spillyourheart.service.ExpertBadgeService;
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

@CrossOrigin
@RestController
public class AnswerController {
    @Autowired
    private AnswerService answerService;
    @Autowired
    private ExpertBadgeService expertBadgeService;

    @RequestMapping("/postAnswer")
    @UserToken
    @UserValid
    public Msg postAnswer(@RequestBody JSONObject object){
        Msg result = answerService.postAnswer(object);
        if(object.containsKey("userId")){
            JSONObject expertObject  = new JSONObject();
            expertObject.put("userId",object.getInt("userId"));
            Msg expertMsg = expertBadgeService.judge(expertObject);
            System.out.println(JSONObject.fromObject(expertMsg).toString());
        }
        return result;
    }

    @RequestMapping("/getAnswer")
    @PassToken
    public Msg getAnswer(@RequestParam("answerId") int answerId){ return answerService.getAnswer(answerId); }

    @RequestMapping("/getAnswerByQuestion")
    @PassToken
    public Msg getAnswerByQuestion(@RequestParam("beginAnswerId") int beginAnswerId,@RequestParam("questionId") int questionId) {
        return answerService.getAnswerByQuestion(beginAnswerId,questionId);
    }

    @RequestMapping("/getUserAnswers")
    @UserToken
    @UserValid
    public Msg getUserAnswers(@RequestParam("beginAnswerId") int beginAnswerId,@RequestParam("userId") int userId){
        return answerService.getUserAnswers(beginAnswerId,userId);
    }

    @RequestMapping("/getAdminAnswers")
    @UserToken
    @UserAdmin
    public Msg getAdminAnswers(@RequestBody JSONObject object){ return answerService.getAdminAnswers(object); }

    @RequestMapping("/deleteAnswer")
    @UserToken
    @UserValid
    public Msg deleteAnswer(@RequestBody JSONObject object){ return answerService.deleteAnswer(object); }

    @RequestMapping("/banAnswer")
    @UserToken
    @UserAdmin
    public Msg banAnswer(@RequestBody JSONObject object){ return answerService.banAnswer(object); }

    @RequestMapping("/unbanAnswer")
    @UserToken
    @UserAdmin
    public Msg unbanAnswer(@RequestBody JSONObject object){ return answerService.unbanAnswer(object); }

    @RequestMapping("/updateAnswer")
    @UserToken
    @UserValid
    public Msg updateAnswer(@RequestBody JSONObject object){ return answerService.updateAnswer(object); }

    @RequestMapping("/likeAnswer")
    @UserToken
    @UserValid
    public Msg likeAnswer(@RequestParam("userId") int userId,
                            @RequestParam("answerId") int answerId,
                            @RequestParam("like") boolean like){ return answerService.likeAnswer(userId,answerId,like); }

    @RequestMapping("/collectAnswer")
    @UserToken
    @UserValid
    public Msg collectAnswer(@RequestParam("userId") int userId,
                               @RequestParam("answerId") int answerId,
                               @RequestParam("collect") boolean collect){ return answerService.collectAnswer(userId,answerId,collect); }

    @RequestMapping("/browseAnswer")
    @UserToken
    @UserValid
    public Msg browseAnswer(@RequestParam("userId") int userId,
                              @RequestParam("answerId") int answerId){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }
}
