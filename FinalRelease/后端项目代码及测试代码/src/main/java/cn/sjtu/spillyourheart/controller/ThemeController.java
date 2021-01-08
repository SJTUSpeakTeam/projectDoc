package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.service.ThemeService;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserAdmin;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserToken;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class ThemeController {
    @Autowired
    private ThemeService themeService;

    @RequestMapping("/postTheme")
    //@UserToken
    //@UserAdmin
    public Msg postTheme(@RequestBody JSONObject object){ return themeService.postTheme(object); }

    @RequestMapping("/getTheme")
    @PassToken
    public Msg getTheme(@RequestParam("themeId") int ThemeId){ return themeService.getTheme(ThemeId); }

    @RequestMapping("/getThemes")
    @PassToken
    public Msg getThemes(){ return themeService.getThemes(); }

    @RequestMapping("/deleteTheme")
    //@UserToken
    //@UserAdmin
    public Msg deleteTheme(@RequestBody JSONObject object){ return themeService.deleteTheme(object); }

    @RequestMapping("/deleteThemes")
    //@UserToken
    //@UserAdmin
    public Msg deleteThemes(@RequestBody JSONObject object){ return themeService.deleteThemes(object); }

    @RequestMapping("/updateTheme")
    //@UserToken
    //@UserAdmin
    public Msg updateTheme(@RequestBody JSONObject object){ return themeService.updateTheme(object); }
}
