package cn.sjtu.spillyourheart.serviceImpl;

import cn.sjtu.spillyourheart.dao.*;
import cn.sjtu.spillyourheart.entity.*;
import cn.sjtu.spillyourheart.entity.VO.MetaUser;
import cn.sjtu.spillyourheart.service.ExpertBadgeService;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONObject;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpertBadgeServiceImpl implements ExpertBadgeService {
    @Autowired
    private ExpertBadgeDao expertBadgeDao;
    @Autowired
    private ThemeDao themeDao;
    @Autowired
    private AnswerDao answerDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private QuestionDao questionDao;

    @Override
    public Msg getOneByUser(Integer userId) {
        JSONObject result = new JSONObject();
        List<ExpertBadge> allBadges  = expertBadgeDao.getAllByUser(userId);
        if(allBadges.size() == 0){
            return MsgUtil.makeMsg(MsgCode.SUCCESS);
        }
        result.put("expertId",allBadges.get(0).getBadgeId());
        result.put("field",allBadges.get(0).getProfession());
        result.put("grantDate",allBadges.get(0).getGrantDate());
        result.put("Information",allBadges.get(0).getBadageInf());
        return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
    }
    @Override
    public Msg judge(JSONObject object){
        Integer userId = -1;
        userId = (Integer) object.get("userId");

        List<JSONObject> allThemes = themeDao.getAll();
        List<ExpertBadge> allBadges  = expertBadgeDao.getAllByUser(userId);
        Map<String, Double> themeMapper = new HashMap<String,Double>();

        //得到该用户的answer(最近的)和follower人数
        List<Answer> userAllAnswers = answerDao.getUserAnswers(-1,userId);
        RegularUser user = userDao.findOneMeta(userId).regularUser;
        Integer followers = user.getFansNum();

        for(Answer answer:userAllAnswers){
            JSONObject question = questionDao.getOne(answer.getQuestionId());
            JSONObject theme = themeDao.getOne(question.getInt("themeId"));
            String key = theme.getString("name");
            System.out.println(key);
            double value = answer.getLikeNum()*1 + answer.getFavorNum()*1.5;
            System.out.println(value);
            if(themeMapper.containsKey(key)){

                themeMapper.put(key,  (themeMapper.get(key)+100.0+value));
            }
            else{
                themeMapper.put(key,  (0.0+value));
            }
        }
        String maxString = "";
        Double maxValue = 0.0;
        for (Map.Entry<String, Double> entry : themeMapper.entrySet()) {
            if(entry.getValue()>maxValue){
                maxString = entry.getKey();
                maxValue = entry.getValue();
            }
            System.out.println("key = " + entry.getKey() + ", value = " + entry.getValue());
        }
        if(maxValue*0.7 + followers*0.3 > 1000) {//score: a score that can be assigned a badge
            boolean flag = false;
            Integer badgeId = 0;
            Integer expertId = 0;
            for(ExpertBadge expertBadge:allBadges){
                flag = true;//every user can only has one badge
                badgeId = expertBadge.getBadgeId();
            }
            if(flag)
                expertId = expertBadgeDao.updateOne(badgeId,maxString,maxString+" 专家徽章");
            else{
                expertId = expertBadgeDao.postOne(userId,maxString,maxString+" 专家徽章");
            }
            JSONObject result = new JSONObject();
            result.put("expertId",expertId);
            result.put("field",maxString);
            return MsgUtil.makeMsg(MsgCode.SUCCESS,result);
        }
        return MsgUtil.makeMsg(MsgCode.ERROR);
    }
}
