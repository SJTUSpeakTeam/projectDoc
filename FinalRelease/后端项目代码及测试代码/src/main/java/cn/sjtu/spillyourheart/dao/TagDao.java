package cn.sjtu.spillyourheart.dao;

import java.util.List;

public interface TagDao {
    void postOne(String content);
    boolean hasOne(String content);
    void deleteOne(String content);
    void updateOne(String content,String newContent);
    List<String> getAll();
}
