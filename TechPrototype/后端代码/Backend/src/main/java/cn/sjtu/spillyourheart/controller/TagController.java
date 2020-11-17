package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.service.TagService;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserAdmin;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserValid;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class TagController {
    @Autowired
    private TagService tagService;

    @RequestMapping("/postTag")
    @UserToken
    @UserValid
    public Msg postTag(@RequestBody JSONObject object){ return tagService.postTag(object); }

    @RequestMapping("/getTags")
    @PassToken
    public Msg getTags(){ return tagService.getTags(); }

    @RequestMapping("/deleteTag")
    @UserToken
    @UserAdmin
    public Msg deleteTag(@RequestBody JSONObject object){ return tagService.deleteTag(object); }

    @RequestMapping("/deleteTags")
    @UserToken
    @UserAdmin
    public Msg deleteTags(@RequestBody JSONObject object){ return tagService.deleteTags(object); }

    @RequestMapping("/updateTag")
    @UserToken
    @UserAdmin
    public Msg updateTag(@RequestBody JSONObject object){ return tagService.updateTag(object); }
}
