package cn.sjtu.spillyourheart.daoImpl;

import cn.sjtu.spillyourheart.dao.ThemeDao;
import cn.sjtu.spillyourheart.entity.Theme;
import cn.sjtu.spillyourheart.repository.ThemeRepository;
import net.sf.json.JSON;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class ThemeDaoImpl implements ThemeDao {
    @Autowired
    ThemeRepository themeRepository;

    @Override
    public Integer postOne(String name){
        try {
            Theme themeTest = themeRepository.getThemeByName(name);
            if (!String.valueOf(themeTest).equals("null"))
                return -1;
        }catch (Exception e){
            e.printStackTrace();
            return -2;
        }
        Theme theme = new Theme();
        theme.setName(name);
        theme.setStatus((short) 1);
        theme.setCreateTime(new Date());
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd hh:mm:ss");
        System.out.println("当前时间为: " + ft.format(new Date()));
        themeRepository.saveAndFlush(theme);
        theme = themeRepository.getThemeByName(name);
        return theme.getThemeId();
    }

    @Override
    public void deleteOne(Integer themeId){
        Theme theme = themeRepository.getOne(themeId);
        theme.setStatus((short) 0);
        themeRepository.saveAndFlush(theme);
    }

    @Override
    public void updateOne(Integer themeId,String name){
        Theme theme = themeRepository.getOne(themeId);
        theme.setName(name);
        themeRepository.saveAndFlush(theme);
    }

    @Override
    public boolean hasOne(Integer themeId){
        Theme theme = themeRepository.getOne(themeId);
        if(String.valueOf(theme).equals("null"))
            return false;
        return true;
    }

    @Override
    public boolean hasOne(String name){
        Theme theme = themeRepository.getThemeByName(name);
        if(String.valueOf(theme).equals("null"))
            return false;
        return true;
    }

    @Override
    public boolean verifyOne(Integer themeId){
        Theme theme = themeRepository.getOne(themeId);
        if(theme.getStatus() == 0)
            return false;
        return true;
    }

    @Override
    public boolean verifyOne(String name){
        Theme theme = themeRepository.getThemeByName(name);
        if(theme.getStatus() == 0)
            return false;
        return true;
    }

    @Override
    public boolean duplicateOne(String name){
        Theme themeTest = themeRepository.getThemeByName(name);
        if (!String.valueOf(themeTest).equals("null"))
            return true;
        return false;
    }

    @Override
    public JSONObject getOne(Integer themeId){
        System.out.println(themeId);
        Theme theme = themeRepository.getOne(themeId);
        System.out.println(theme.toString());
        JSONObject object = new JSONObject();
        object.put("themeId",theme.getThemeId());
        object.put("name",theme.getName());
        object.put("createTime",theme.getCreateTime());
        return object;
    }

    @Override
    public JSONObject getOneByName(String name){
        Theme theme = themeRepository.getThemeByName(name);
        JSONObject object = JSONObject.fromObject(theme);
        object.remove("status");
        return object;
    }

    @Override
    public List<JSONObject> getAll(){
        List<JSONObject> objectList = new ArrayList<>();
        List<Theme> themeList = themeRepository.getThemes();
        for(Theme theme : themeList){
            JSONObject object = JSONObject.fromObject(theme);
            object.remove("status");
            objectList.add(object);
        }
        return objectList;
    }
}
