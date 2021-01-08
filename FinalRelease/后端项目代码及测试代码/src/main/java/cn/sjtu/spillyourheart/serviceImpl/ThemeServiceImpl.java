package cn.sjtu.spillyourheart.serviceImpl;

import cn.sjtu.spillyourheart.dao.ThemeDao;
import cn.sjtu.spillyourheart.service.ThemeService;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ThemeServiceImpl implements ThemeService {
    @Autowired
    ThemeDao themeDao;

    @Override
    public Msg postTheme(JSONObject object){
        String name = "";
        if(!object.containsKey("name"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        try {
            name = (String) (object.get("name"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"name必须是个字符串 :(");
        }
        Integer themeId = themeDao.postOne(name);
        if(themeId == -1){
            return MsgUtil.makeMsg(MsgCode.ERROR,"已存在对应theme");
        }
        JSONObject result = new JSONObject();
        result.put("themeId",themeId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getTheme(int themeId){
        if(!themeDao.hasOne(themeId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"ID没有对应的theme :(");
        if(!themeDao.verifyOne(themeId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"theme已被删除 :(");
        JSONObject result = themeDao.getOne(themeId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getThemes(){
        List<JSONObject> themeList = themeDao.getAll();
        JSONObject result = new JSONObject();
        result.put("themes",themeList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg deleteTheme(JSONObject object){
        if(!object.containsKey("themeId"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        if(!themeDao.hasOne((Integer) object.get("themeId")))
            return MsgUtil.makeMsg(MsgCode.ERROR,"ID没有对应的theme :(");
        if(!themeDao.verifyOne((Integer) object.get("themeId")))
            return MsgUtil.makeMsg(MsgCode.ERROR,"theme已被删除 :(");
        Integer themeId = -1;
        try {
            themeId = (Integer) (object.get("themeId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"themeId必须是个integer :(");
        }
        themeDao.deleteOne(themeId);
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg deleteThemes(JSONObject object){
        if(!object.containsKey("themeId"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        List<Integer> idList = new ArrayList<>();
        try{
            idList = object.getJSONArray("themeId");
        }catch (Exception e){
            return MsgUtil.makeMsg(MsgCode.ERROR,"themeId必须是个int数组 :(");
        }
        for(int i = 0;i < idList.size();i++){
            if(!themeDao.hasOne(idList.get(i)))
                return MsgUtil.makeMsg(MsgCode.ERROR,idList.get(i).toString()
                                                         +"没有对应的theme :(");
        }
        for(int i = 0;i < idList.size();i++){
            themeDao.deleteOne(idList.get(i));
        }
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg updateTheme(JSONObject object){
        if(!object.containsKey("themeId")
           || !object.containsKey("name"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        int themeId = 0;
        String name;
        try {
            themeId = (Integer) (object.get("themeId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"themeId必须是个integer :(");
        }
        try {
            name = (String) (object.get("name"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"name必须是个字符串 :(");
        }
        if(!themeDao.hasOne(themeId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"ID没有对应的theme :(");
        if(!themeDao.verifyOne(themeId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"theme已被删除 :(");
        if(themeDao.duplicateOne(name)) {
            JSONObject result = new JSONObject();
            result.put("themeId",themeDao.getOneByName(name).get("themeId"));
            return MsgUtil.makeMsg(MsgCode.SUCCESS, "已存在同名theme :)",result);
        }
        themeDao.updateOne(themeId,name);
        JSONObject result = new JSONObject();
        result.put("themeId",themeId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }
}
