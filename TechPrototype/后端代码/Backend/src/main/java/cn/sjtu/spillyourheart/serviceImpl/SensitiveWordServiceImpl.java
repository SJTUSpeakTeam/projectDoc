package cn.sjtu.spillyourheart.serviceImpl;

import cn.sjtu.spillyourheart.dao.SensitiveWordDao;
import cn.sjtu.spillyourheart.entity.SensitiveWord;
import cn.sjtu.spillyourheart.service.SensitiveWordService;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import cn.sjtu.spillyourheart.utilis.sensitivewordutils.sensitiveWords;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SensitiveWordServiceImpl implements SensitiveWordService {
    @Autowired
    private SensitiveWordDao sensitiveWordDao;

    @Override
    public Msg postOne(JSONObject object){
        if(!object.containsKey("name"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        String name = null;
        try {
            name = (String) (object.get("name"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"name必须是个字符串 :(");
        }
        if(sensitiveWordDao.hasOne(name))
            return MsgUtil.makeMsg(MsgCode.ERROR,"已存在该敏感词 :(");
        SensitiveWord sensitiveWord = sensitiveWordDao.postOne(name);
        Integer sensitiveWordId = sensitiveWord.getSensitiveWordId();
        sensitiveWords Words = new sensitiveWords();
        Words.addOne(sensitiveWord);
        JSONObject result = new JSONObject();
        result.put("sensitiveWordId",sensitiveWordId);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg deleteOne(JSONObject object){
        if(!object.containsKey("sensitiveWordId"))
            return MsgUtil.makeMsg(MsgCode.PARAMETER_ERROR);
        Integer sensitiveWordId = -1;
        try {
            sensitiveWordId = (Integer) (object.get("sensitiveWordId"));
        }catch (Exception e) {
            return MsgUtil.makeMsg(MsgCode.ERROR,"sensitiveWordId必须是个整型常量 :(");
        }
        if(!sensitiveWordDao.hasOne(sensitiveWordId))
            return MsgUtil.makeMsg(MsgCode.ERROR,"不存在该敏感词 :(");
        sensitiveWordDao.deleteOne(sensitiveWordId);
        sensitiveWords Words = new sensitiveWords();
        Words.deleteOne(sensitiveWordId);
        JSONObject result = new JSONObject();
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }

    @Override
    public Msg getAll(){
        List<SensitiveWord> sensitiveWordList = sensitiveWordDao.getAll();
        List<JSONObject> jsonObjectList = new ArrayList<>();
        for(SensitiveWord sensitiveWord:sensitiveWordList){
            jsonObjectList.add(JSONObject.fromObject(sensitiveWord));
        }
        JSONObject result = new JSONObject();
        result.put("sensitiveWord",jsonObjectList);
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }
}
