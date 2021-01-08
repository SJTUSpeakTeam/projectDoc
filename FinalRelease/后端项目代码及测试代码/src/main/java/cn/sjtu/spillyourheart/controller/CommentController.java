package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.service.CommentService;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
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
public class CommentController {
    @Autowired
    private CommentService commentService;

    @RequestMapping("/postComment")
    @UserToken
    @UserValid
    public Msg postComment(@RequestBody JSONObject object){ return commentService.postComment(object); }

    @RequestMapping("/getComment")
    @PassToken
    public Msg getComment(@RequestParam("commentId") int commentId){ return commentService.getComment(commentId); }

    @RequestMapping("/getCommentByAnswer")
    @PassToken
    public Msg getCommentByAnswer(@RequestParam("beginCommentId") int beginCommentId,@RequestParam("answerId") int answerId) {
        return commentService.getCommentByAnswer(beginCommentId,answerId);
    }

    @RequestMapping("/getUserComments")
    @UserToken
    @UserValid
    public Msg getUserComments(@RequestParam("beginCommentId") int beginCommentId,@RequestParam("userId") int userId){
        return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试");
    }

    @RequestMapping("/deleteComment")
    @UserToken
    @UserValid
    public Msg deleteComment(@RequestBody JSONObject object){ return commentService.deleteComment(object); }

    //updateComment is not allowed
    //@RequestMapping("/updateComment")
    //public Msg updateComment(@RequestBody JSONObject object){ return MsgUtil.makeMsg(MsgCode.SUCCESS,"测试"); }

    @RequestMapping("/likeComment")
    @UserToken
    @UserValid
    public Msg likeAnswer(@RequestParam("userId") int userId,
                          @RequestParam("commentId") int commentId,
                          @RequestParam("like") boolean like){ return commentService.likeComment(userId,commentId,like); }
}
