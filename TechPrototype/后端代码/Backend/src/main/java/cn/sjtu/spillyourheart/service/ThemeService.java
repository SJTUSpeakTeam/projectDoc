package cn.sjtu.spillyourheart.service;

import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;

public interface ThemeService {
    Msg postTheme(JSONObject object);
    Msg getTheme(int ThemeId);
    Msg getThemes();
    Msg deleteTheme(JSONObject object);
    Msg deleteThemes(JSONObject object);
    Msg updateTheme(JSONObject object);
}
