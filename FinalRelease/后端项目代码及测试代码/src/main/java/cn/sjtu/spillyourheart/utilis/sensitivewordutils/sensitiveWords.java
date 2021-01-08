package cn.sjtu.spillyourheart.utilis.sensitivewordutils;

import cn.sjtu.spillyourheart.dao.SensitiveWordDao;
import cn.sjtu.spillyourheart.entity.SensitiveWord;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Component
public class sensitiveWords {
    @Autowired
    private SensitiveWordDao sensitiveWordDao;

    private static List<SensitiveWord> sensitiveWords = new ArrayList<>();

    @PostConstruct
    public void init(){
        System.out.println("INITIATE sensitiveWords");
        try {
            sensitiveWords = sensitiveWordDao.getAll();
        } catch (Exception e){
            e.printStackTrace();
        }
        System.out.println(sensitiveWords.size());
    }

    public void addOne(SensitiveWord sensitiveWord){
        sensitiveWords.add(sensitiveWord);
        //System.out.println("After add: "+sensitiveWords.size());
    }

    public void deleteOne(Integer sensitiveWordId){
        for(int i = 0;i < sensitiveWords.size();i++){
            //System.out.println(i);
            if(sensitiveWords.get(i).getSensitiveWordId() == sensitiveWordId)
                sensitiveWords.remove(i);
        }
        //System.out.println("After delete: "+sensitiveWords.size());
    }

    public void setSensitiveWords(List<SensitiveWord> sensitiveWordList){
        sensitiveWords = sensitiveWordList;
    }

    public List<SensitiveWord> getSensitiveWords(){
        return sensitiveWords;
    }

    public JSONObject examine(String str){
        JSONObject object = new JSONObject();
        List<SensitiveWord>  sensitiveWordList = sensitiveWords;
        for(SensitiveWord sensitiveWord : sensitiveWordList){
            if(str.indexOf(sensitiveWord.getWordContent())!=-1){
                object.put("keyWord",sensitiveWord.getWordContent());
                /*
                if(area.equals("Question")){
                    sensitiveWord.setQuestionBanNum(sensitiveWord.getQuestionBanNum()+1);
                    sensitiveWordRepository.saveAndFlush(sensitiveWord);
                }
                if(area.equals("Answer")){
                    sensitiveWord.setAnswerBanNum(sensitiveWord.getAnswerBanNum()+1);
                    sensitiveWordRepository.saveAndFlush(sensitiveWord);
                }
                if(area.equals("Comment")){
                    sensitiveWord.setCommentBanNum(sensitiveWord.getCommentBanNum()+1);
                    sensitiveWordRepository.saveAndFlush(sensitiveWord);
                }
                if(area.equals("User")){
                    sensitiveWord.setUserBanNum(sensitiveWord.getUserBanNum()+1);
                    sensitiveWordRepository.saveAndFlush(sensitiveWord);
                }
                if(area.equals("Profile")){
                    sensitiveWord.setProfileBanNum(sensitiveWord.getProfileBanNum()+1);
                    sensitiveWordRepository.saveAndFlush(sensitiveWord);
                }*/
                break;
            }
        }
        return object;
    }
}
