package cn.sjtu.spillyourheart.daoImpl;

import cn.sjtu.spillyourheart.dao.SensitiveWordDao;
import cn.sjtu.spillyourheart.entity.SensitiveWord;
import cn.sjtu.spillyourheart.repository.SensitiveWordRepository;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public class SensitiveWordDaoImpl implements SensitiveWordDao {
    @Autowired
    private SensitiveWordRepository sensitiveWordRepository;

    @Override
    public SensitiveWord postOne(String content){
        SensitiveWord sensitiveWord = new SensitiveWord();
        sensitiveWord.setAnswerBanNum(0);
        sensitiveWord.setCommentBanNum(0);
        sensitiveWord.setProfileBanNum(0);
        sensitiveWord.setQuestionBanNum(0);
        sensitiveWord.setUserBanNum(0);
        sensitiveWord.setCreateTime(new Date());
        sensitiveWord.setWordContent(content);
        sensitiveWordRepository.saveAndFlush(sensitiveWord);
        return sensitiveWord;
    }

    @Override
    public boolean hasOne(String content){
        SensitiveWord sensitiveWord = sensitiveWordRepository.getSensitiveWordBywordContent(content);
        if(String.valueOf(sensitiveWord).equals("null"))
            return false;
        return true;
    }

    @Override
    public boolean hasOne(Integer sensitiveWordId){
        Optional<SensitiveWord> sensitiveWord = sensitiveWordRepository.findById(sensitiveWordId);
        if(sensitiveWord.equals(Optional.empty()))
            return false;
        return true;
    }

    @Override
    public void deleteOne(Integer sensitiveWordId){
        SensitiveWord sensitiveWord = sensitiveWordRepository.getOne(sensitiveWordId);
        sensitiveWordRepository.delete(sensitiveWord);
    }


    @Override
    public List<SensitiveWord> getAll(){
        System.out.println(sensitiveWordRepository.getSensitiveWords().size());
        return sensitiveWordRepository.getSensitiveWords();
    }

    /*
    @Override
    public JSONObject examine(String str,String area){
        Boolean flag = false;
        String word = "";
        JSONObject object = new JSONObject();
        List<SensitiveWord>  sensitiveWordList = sensitiveWordRepository.getSensitiveWords();
        for(SensitiveWord sensitiveWord : sensitiveWordList){
            if(str.indexOf(sensitiveWord.getWordContent())!=-1){
                flag = true;
                word = sensitiveWord.getWordContent();
                object.put("prohibit",flag);
                object.put("keyWord",word);
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
                }

                break;
            }
        }
        return object;
    }
    */
}
