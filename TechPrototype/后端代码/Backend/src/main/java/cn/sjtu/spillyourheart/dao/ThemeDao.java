package cn.sjtu.spillyourheart.dao;

import net.sf.json.JSONObject;

import java.util.List;

public interface ThemeDao {
    boolean verifyOne(Integer partitionId); //verify that one is deleted or not
    boolean verifyOne(String name); //verify that one is deleted or not
    boolean hasOne(Integer partitionId);
    boolean hasOne(String name);
    boolean duplicateOne(String name);
    Integer postOne(String name);
    void deleteOne(Integer partitionId);
    void updateOne(Integer partitionId,String name);
    JSONObject getOne(Integer partitionId);
    JSONObject getOneByName(String name);
    List<JSONObject> getAll();
}
