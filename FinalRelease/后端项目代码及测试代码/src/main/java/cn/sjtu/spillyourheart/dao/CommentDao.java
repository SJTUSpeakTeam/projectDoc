package cn.sjtu.spillyourheart.dao;

import cn.sjtu.spillyourheart.entity.Comment;

import java.util.List;

public interface CommentDao {
    boolean verifyOne(Integer commentId); //verify that one is deleted or not
    boolean hasOne(Integer commentId);
    Integer postOne(Integer answerId, Integer userId, String content,Integer fatherCommentId);
    void addCommentNum(Integer commentId);
    void deleteOne(Integer commentId);
    void updateOne(Integer commentId,String content);
    Comment getOne(Integer commentId);
    List<Comment> getByAnswerFilteredByTime(Integer answerId, Integer beginCommentId);
    void addLike(Integer commentId);
    void decreaseLike(Integer commentId);
}
