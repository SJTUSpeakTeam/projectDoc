package cn.sjtu.spillyourheart.daoImpl;

import cn.sjtu.spillyourheart.dao.QuestionDao;
import cn.sjtu.spillyourheart.entity.Question;
import cn.sjtu.spillyourheart.entity.Tag;
import cn.sjtu.spillyourheart.repository.QuestionRepository;
import cn.sjtu.spillyourheart.repository.TagRepository;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public class QuestionDaoImpl implements  QuestionDao{
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private TagRepository tagRepository;

    @Override
    public Integer postOne(Integer userId,
                           Integer themeId,
                           String header,
                           String content,
                           List<String> tags) {
        Question question = new Question();
        question.setStatus((short) 1);
        question.setUserId(userId);
        question.setThemeId(themeId);
        question.setHeader(header);
        question.setContent(content);
        question.setCreateTime(new Date());
        question.setFavorNum(0);
        question.setLikeNum(0);
        question.setVisitNum(0);
        question.setAnswerNum(0);
        List<Tag> tagList= new ArrayList<>();
        for(int i = 0 ;i < tags.size();i++){
            Tag tag = tagRepository.getTag(tags.get(i));
            if(String.valueOf(tag).equals("null"))
            {
                tag = new Tag();
                tag.setContent(tags.get(i));
                tagRepository.saveAndFlush(tag);
            }
            tagList.add(tag);
        }
        question.setTags(tagList);
        questionRepository.saveAndFlush(question);
        return question.getQuestionId();
    }

    @Override
    public void deleteOne(Integer questionId) {
        Question question = questionRepository.getOne(questionId);
        question.setStatus((short) 0);
        questionRepository.saveAndFlush(question);
    }

    @Override
    public JSONObject getOne(Integer questionId) {
        Question question = questionRepository.getOne(questionId);
        JSONObject object = JSONObject.fromObject(question);
        object.remove("status");
        object.put("tags",question.getTags());
        return object;
    }

    @Override
    public List<JSONObject> getHotList(){
        List<Question> questionList = questionRepository.getHotQuestions();
        List<JSONObject> result = new ArrayList<>();
        for(Question question : questionList){
            JSONObject object = JSONObject.fromObject(question);
            object.remove("status");
            object.put("tags",question.getTags());
            result.add(object);
        }
        return result;
    }

    @Override
    public List<JSONObject> getNewList(){
        List<Question> questionList = questionRepository.getNewQuestions();
        List<JSONObject> result = new ArrayList<>();
        for(Question question : questionList){
            JSONObject object = JSONObject.fromObject(question);
            object.remove("status");
            object.put("tags",question.getTags());
            result.add(object);
        }
        return result;
    }

    @Override
    public List<JSONObject> getFilterMostLikeList(int beginQuestionId,
                                                  String search,
                                                  int themeId){
        List<JSONObject> result = new ArrayList<>();
        List<Question> questionList = questionRepository.getMostLikeQuestions(beginQuestionId, '%'+search+'%', themeId);
        for(Question question : questionList){
            JSONObject object = JSONObject.fromObject(question);
            object.remove("status");
            object.put("tags",question.getTags());
            result.add(object);
        }
        return result;
    }

    @Override
    public List<JSONObject> getFilterHottestList(int beginQuestionId,
                                                  String search,
                                                  int themeId){
        List<JSONObject> result = new ArrayList<>();
        List<Question> questionList = questionRepository.getHottestQuestions(beginQuestionId, '%'+search+'%', themeId);
        for(Question question : questionList){
            JSONObject object = JSONObject.fromObject(question);
            object.remove("status");
            object.put("tags",question.getTags());
            result.add(object);
        }
        return result;
    }

    @Override
    public List<JSONObject> getFilterNewestList(int beginQuestionId,
                                                  String search,
                                                  int themeId){
        List<JSONObject> result = new ArrayList<>();
        List<Question> questionList = questionRepository.getNewestQuestions(beginQuestionId, '%'+search+'%', themeId);
        for(Question question : questionList){
            JSONObject object = JSONObject.fromObject(question);
            object.remove("status");
            object.put("tags",question.getTags());
            result.add(object);
        }
        return result;
    }

    @Override
    public List<JSONObject> getFilterMostReplyList(int beginQuestionId,
                                                   String search,
                                                   int themeId){
        List<JSONObject> result = new ArrayList<>();
        List<Question> questionList = questionRepository.getMostReplyQuestions(beginQuestionId, '%'+search+'%', themeId);
        for(Question question : questionList){
            JSONObject object = JSONObject.fromObject(question);
            object.remove("status");
            object.put("tags",question.getTags());
            result.add(object);
        }
        return result;
    }

    @Override
    public List<JSONObject> getUserQuestions(int beginQuestionId,
                                             int userId){
        List<JSONObject> result = new ArrayList<>();
        List<Question> questionList = questionRepository.getUserQuestions(beginQuestionId,userId);
        for(Question question : questionList){
            JSONObject object = JSONObject.fromObject(question);
            object.remove("status");
            object.put("tags",question.getTags());
            result.add(object);
        }
        return result;
    }

    @Override
    public List<JSONObject> getNotDeletedQuestions(Integer beginQuestionId){
        List<JSONObject> result = new ArrayList<>();
        List<Question> questionList = questionRepository.getNotDeletedQuestions(beginQuestionId);
        for(Question question : questionList){
            JSONObject object = JSONObject.fromObject(question);
            object.put("tags",question.getTags());
            result.add(object);
        }
        return result;
    }

    @Override
    public void updateOne(Integer questionId,Integer themeId,String header,String content,List<String> tags) {
        Question question = questionRepository.getOne(questionId);
        question.setThemeId(themeId);
        if(header != null)
        question.setHeader(header);
        if(content != null)
        question.setContent(content);
        if(tags != null) {
            List<Tag> tagList = new ArrayList<>();
            for (int i = 0; i < tags.size(); i++) {
                Tag tag = tagRepository.getTag(tags.get(i));
                if (String.valueOf(tag).equals("null")) {
                    tag = new Tag();
                    tag.setContent(tags.get(i));
                    tagRepository.saveAndFlush(tag);
                }
                tagList.add(tag);
            }
            question.setTags(tagList);
        }
        questionRepository.saveAndFlush(question);
    }

    @Override
    public boolean hasOne(Integer questionId){
        Optional<Question> questionTest;
        questionTest = questionRepository.findById(questionId);
        if(questionTest.equals(Optional.empty()))
            return false;
        return true;
    }

    @Override
    public boolean verifyOne(Integer questionId){
        Question question = questionRepository.getOne(questionId);
        if(question.getStatus() ==  1)
            return true;
        return false;
    }

    @Override
    public boolean bannedOne(Integer questionId){
        Question question = questionRepository.getOne(questionId);
        if(question.getStatus() ==  -1)
            return true;
        return false;
    }

    @Override
    public void addLike(Integer questionId){
        Question question = questionRepository.getOne(questionId);
        question.setLikeNum(question.getLikeNum()+1);
        questionRepository.saveAndFlush(question);
    }

    @Override
    public void decreaseLike(Integer questionId){
        Question question = questionRepository.getOne(questionId);
        question.setLikeNum(question.getLikeNum()-1);
        questionRepository.saveAndFlush(question);
    }

    @Override
    public void addCollect(Integer questionId){
        Question question = questionRepository.getOne(questionId);
        question.setFavorNum(question.getFavorNum()+1);
        questionRepository.saveAndFlush(question);
    }

    @Override
    public void decreaseCollect(Integer questionId){
        Question question = questionRepository.getOne(questionId);
        question.setFavorNum(question.getFavorNum()-1);
        questionRepository.saveAndFlush(question);
    }

    @Override
    public void addAnswerNum(Integer questionId){
        Question question = questionRepository.getOne(questionId);
        question.setAnswerNum(question.getAnswerNum()+1);
        questionRepository.saveAndFlush(question);
    }

    @Override
    public void ban(Integer questionId){
        Question question = questionRepository.getOne(questionId);
        question.setStatus((short) -1);
        questionRepository.saveAndFlush(question);
    }

    @Override
    public void unban(Integer questionId){
        Question question = questionRepository.getOne(questionId);
        question.setStatus((short) 1);
        questionRepository.saveAndFlush(question);
    }
}
