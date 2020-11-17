package cn.sjtu.spillyourheart.serviceImpl;

import cn.sjtu.spillyourheart.dao.TagDao;
import cn.sjtu.spillyourheart.service.TagService;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;

import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TagServiceImpl implements TagService {
    @Autowired
    private TagDao tagDao;

    @Override
    public Msg postTag(JSONObject object){
        String content = "";
        if(!object.containsKey("content"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        try {
            content = (String) (object.get("content"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个字符串 :(");
        }
        tagDao.postOne(content);
        JSONObject result = new JSONObject();
        result.put("content",content);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getTags(){
        List<String> stringList = tagDao.getAll();
        JSONObject result = new JSONObject();
        result.put("tags",stringList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg deleteTag(JSONObject object){
        String content = "";
        if(!object.containsKey("content"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        try {
            content = (String) (object.get("content"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个字符串 :(");
        }
        if(!tagDao.hasOne(content))
            return MsgUtil.makeMsg(MsgCode.ERROR,"content无对应标签 :(");
        tagDao.deleteOne(content);
        return MsgUtil.makeMsg(MsgCode.SUCCESS);
    }

    @Override
    public Msg deleteTags(JSONObject object){
        List<String> stringList = new ArrayList<>();
        if(!object.containsKey("content"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        try{
            stringList = (List<String>) (object.get("content"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个string数组 :(");
        }
        for(int i = 0;i < stringList.size();i++)
            if(!tagDao.hasOne(stringList.get(i)))
                return MsgUtil.makeMsg(MsgCode.ERROR,"string: "+stringList.get(i)+"无对应标签 :(");
        for(int i = 0;i < stringList.size();i++)
            tagDao.deleteOne(stringList.get(i));
        return MsgUtil.makeMsg(MsgCode.SUCCESS);
    }

    @Override
    public Msg updateTag(JSONObject object){
        String content = "";
        String newContent = "";
        if(!object.containsKey("content") || !object.containsKey("newContent"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        try {
            content = (String) (object.get("content"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"content必须是个字符串 :(");
        }
        try {
            newContent = (String) (object.get("newContent"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"newContent必须是个字符串 :(");
        }
        if(!tagDao.hasOne(content))
            return MsgUtil.makeMsg(MsgCode.ERROR,"content无对应标签 :(");
        tagDao.updateOne(content,newContent);
        JSONObject result = new JSONObject();
        result.put("content",newContent);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }
}
