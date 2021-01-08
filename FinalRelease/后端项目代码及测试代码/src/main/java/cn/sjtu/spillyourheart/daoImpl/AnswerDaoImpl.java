package cn.sjtu.spillyourheart.daoImpl;

import cn.sjtu.spillyourheart.dao.AnswerDao;
import cn.sjtu.spillyourheart.entity.Answer;
import cn.sjtu.spillyourheart.entity.Question;
import cn.sjtu.spillyourheart.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public class AnswerDaoImpl implements AnswerDao {
    @Autowired
    private AnswerRepository answerRepository;

    @Override
    public boolean verifyOne(Integer answerId){
        Answer answer = answerRepository.getOne(answerId);
        if(answer.getStatus() ==  1)
            return true;
        return false;
    }

    @Override
    public boolean bannedOne(Integer answerId){
        Answer answer = answerRepository.getOne(answerId);
        if(answer.getStatus() ==  -1)
            return true;
        return false;
    }

    @Override
    public boolean hasOne(Integer answerId){
        Optional<Answer> answerTest;
        answerTest = answerRepository.findById(answerId);
        if(answerTest.equals(Optional.empty()))
            return false;
        return true;
    }

    @Override
    public Integer postOne(Integer questionId, Integer userId, String content){
        Answer answer = new Answer();
        answer.setContent(content);
        answer.setQuestionId(questionId);
        answer.setUserId(userId);
        answer.setCreateTime(new Date());
        answer.setFavorNum(0);
        answer.setLikeNum(0);
        answer.setVisitNum(0);
        answer.setStatus((short) 1);
        answerRepository.saveAndFlush(answer);
        return answer.getAnswerId();
    }

    @Override
    public void deleteOne(Integer answerId){
        Answer answer = answerRepository.getOne(answerId);
        answer.setStatus((short) 0);
        answerRepository.saveAndFlush(answer);
    }

    @Override
    public Answer getOne(Integer answerId){
        return answerRepository.getOne(answerId);
    }

    @Override
    public List<Answer> getByQuestionFilteredByTime(Integer questionId,Integer beginAnswerId){
        return answerRepository.getByQuestionIdFilteredByTime(questionId,beginAnswerId);
    }

    @Override
    public List<Answer> getUserAnswers(Integer beginAnswerId,Integer userId){
        return answerRepository.getUserAnswers(beginAnswerId,userId);
    }

    @Override
    public List<Answer> getUserAnswersOrderByQuestionId(Integer beginQuestionId,Integer userId){
        return answerRepository.getUserAnswersOrderByQuestionId(beginQuestionId,userId);
    }

    @Override
    public List<Answer> getDeletedList(Integer beginAnswerId,String search){
        return answerRepository.getDeletedAnswers(beginAnswerId,'%'+search+'%');
    }

    @Override
    public List<Answer> getBannedList(Integer beginAnswerId,String search){
        return answerRepository.getBannedAnswers(beginAnswerId,'%'+search+'%');
    }

    @Override
    public List<Answer> getAllList(Integer beginAnswerId,String search){
        return answerRepository.getAllAnswers(beginAnswerId,'%'+search+'%');
    }

    @Override
    public void updateOne(Integer answerId,String content){
        Answer answer = answerRepository.getOne(answerId);
        answer.setContent(content);
        answerRepository.saveAndFlush(answer);
    }

    @Override
    public void addLike(Integer answerId){
        Answer answer = answerRepository.getOne(answerId);
        answer.setLikeNum(answer.getLikeNum()+1);
        answerRepository.saveAndFlush(answer);
    }

    @Override
    public void decreaseLike(Integer answerId){
        Answer answer = answerRepository.getOne(answerId);
        answer.setLikeNum(answer.getLikeNum()-1);
        answerRepository.saveAndFlush(answer);
    }

    @Override
    public void addCollect(Integer answerId){
        Answer answer = answerRepository.getOne(answerId);
        answer.setFavorNum(answer.getFavorNum()+1);
        answerRepository.saveAndFlush(answer);
    }

    @Override
    public void decreaseCollect(Integer answerId){
        Answer answer = answerRepository.getOne(answerId);
        answer.setFavorNum(answer.getFavorNum()-1);
        answerRepository.saveAndFlush(answer);
    }

    @Override
    public void ban(Integer answerId){
        Answer answer = answerRepository.getOne(answerId);
        answer.setStatus((short) -1);
        answerRepository.saveAndFlush(answer);
    }

    @Override
    public void unban(Integer answerId){
        Answer answer = answerRepository.getOne(answerId);
        answer.setStatus((short) 1);
        answerRepository.saveAndFlush(answer);
    }
}
