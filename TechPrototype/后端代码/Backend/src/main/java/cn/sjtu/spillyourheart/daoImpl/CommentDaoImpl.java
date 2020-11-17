package cn.sjtu.spillyourheart.daoImpl;

import cn.sjtu.spillyourheart.dao.CommentDao;
import cn.sjtu.spillyourheart.entity.Answer;
import cn.sjtu.spillyourheart.entity.Comment;
import cn.sjtu.spillyourheart.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public class CommentDaoImpl implements CommentDao {
    @Autowired
    private CommentRepository commentRepository;

    @Override
    public boolean verifyOne(Integer commentId){
        Comment comment = commentRepository.getOne(commentId);
        if(comment.getStatus() == 0)
            return false;
        return true;
    }

    @Override
    public boolean hasOne(Integer commentId){
        Optional<Comment> commentTest;
        commentTest = commentRepository.findById(commentId);
        if(commentTest.equals(Optional.empty()))
            return false;
        return true;
    }

    @Override
    public Integer postOne(Integer answerId, Integer userId, String content,Integer fatherCommentId){
        Comment comment = new Comment();
        comment.setAnswerId(answerId);
        comment.setStatus((short) 1);
        comment.setCommentContent(content);
        comment.setCommentedNum(0);
        comment.setFatherCommentId(fatherCommentId);
        comment.setLikeNum(0);
        comment.setCreateTime(new Date());
        comment.setUserId(userId);
        commentRepository.saveAndFlush(comment);
        return comment.getCommentId();
    }

    @Override
    public void addCommentNum(Integer commentId){
        Comment comment = commentRepository.getOne(commentId);
        comment.setCommentedNum(comment.getCommentedNum()+1);
        commentRepository.saveAndFlush(comment);
    }

    @Override
    public void deleteOne(Integer commentId){
        Comment comment = commentRepository.getOne(commentId);
        comment.setStatus((short) 0);
        commentRepository.saveAndFlush(comment);
    }

    @Override
    public void updateOne(Integer commentId,String content){
        Comment comment = commentRepository.getOne(commentId);
        comment.setCommentContent(content);
        commentRepository.saveAndFlush(comment);
    }

    @Override
    public Comment getOne(Integer commentId){
        return commentRepository.getOne(commentId);
    }

    @Override
    public List<Comment> getByAnswerFilteredByTime(Integer answerId, Integer beginCommentId){
        return commentRepository.getByAnswerIdFilteredByTime(answerId,beginCommentId);
    }

    @Override
    public void addLike(Integer commentId){
        Comment comment = commentRepository.getOne(commentId);
        comment.setLikeNum(comment.getLikeNum()+1);
        commentRepository.saveAndFlush(comment);
    }

    @Override
    public void decreaseLike(Integer commentId){
        Comment comment = commentRepository.getOne(commentId);
        comment.setLikeNum(comment.getLikeNum()-1);
        commentRepository.saveAndFlush(comment);
    }

}
