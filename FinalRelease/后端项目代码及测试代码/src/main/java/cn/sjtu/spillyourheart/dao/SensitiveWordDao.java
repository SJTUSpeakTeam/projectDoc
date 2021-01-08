package cn.sjtu.spillyourheart.dao;

import cn.sjtu.spillyourheart.entity.SensitiveWord;
import net.sf.json.JSONObject;

import java.util.List;

public interface SensitiveWordDao {
    SensitiveWord postOne(String content);
    boolean hasOne(String content);
    boolean hasOne(Integer sensitiveWordId);
    void deleteOne(Integer sensitiveWordId);
    List<SensitiveWord> getAll();
    //JSONObject examine(String str,String area);
}
