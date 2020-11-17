package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.service.FollowService;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserValid;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/follow")
public class FollowController {
    @Autowired
    private FollowService followService;

    @RequestMapping("/list-follow")
    @UserToken
    @UserValid
    public Msg listFollow(@RequestParam("userId") Integer userId) {
        return followService.getAllFollow(userId);
    }

    @RequestMapping("/list-follower")
    @UserToken
    @UserValid
    public Msg listFollower(@RequestParam("userId") Integer userId) {
        return followService.getAllFollower(userId);
    }

    @RequestMapping("/is-follow")
    @UserToken
    @UserValid
    public Msg isFollow(@RequestBody JSONObject object) {
        return followService.isFollow(object);
    }

    @RequestMapping("/follow")
    @UserToken
    @UserValid
    public Msg follow(@RequestBody JSONObject object) {
        return followService.follow(object);
    }

    @RequestMapping("/remove")
    @UserToken
    @UserValid
    public Msg remove(@RequestBody JSONObject object) {
        return followService.remove(object);
    }
}
