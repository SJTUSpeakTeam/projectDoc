package cn.sjtu.spillyourheart.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.Date;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "sensitiveWord", schema = "syh")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "sensitiveWordId")
public class SensitiveWord {
    private Integer sensitiveWordId;
    private String wordContent;
    @JsonFormat(shape=JsonFormat.Shape.STRING,pattern="yyyy-MM-dd",timezone="GMT+8")
    private Date createTime;
    private Integer profileBanNum;
    private Integer userBanNum;
    private Integer questionBanNum;
    private Integer answerBanNum;
    private Integer commentBanNum;

    public SensitiveWord(){
    }

    @Id
    @Column(name = "sensitive_word_id")
    @GeneratedValue(strategy = IDENTITY)
    public Integer getSensitiveWordId() {
        return sensitiveWordId;
    }

    public void setSensitiveWordId(Integer sensitiveWordId) {
        this.sensitiveWordId = sensitiveWordId;
    }

    @Basic
    @Column(name = "word_content")
    public String getWordContent() {
        return wordContent;
    }

    public void setWordContent(String wordContent) {
        this.wordContent = wordContent;
    }

    @Basic
    @Column(name = "create_time")
    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    @Basic
    @Column(name = "profile_num")
    public Integer getProfileBanNum() {
        return profileBanNum;
    }

    public void setProfileBanNum(Integer profileBanNum) {
        this.profileBanNum = profileBanNum;
    }

    @Basic
    @Column(name = "user_ban_num")
    public Integer getUserBanNum() {
        return userBanNum;
    }

    public void setUserBanNum(Integer userBanNum) {
        this.userBanNum = userBanNum;
    }

    @Basic
    @Column(name = "question_ban_num")
    public Integer getQuestionBanNum() {
        return questionBanNum;
    }

    public void setQuestionBanNum(Integer questionBanNum) {
        this.questionBanNum = questionBanNum;
    }

    @Basic
    @Column(name = "answer_ban_num")
    public Integer getAnswerBanNum() {
        return answerBanNum;
    }

    public void setAnswerBanNum(Integer answerBanNum) {
        this.answerBanNum = answerBanNum;
    }

    @Basic
    @Column(name = "comment_ban_num")
    public Integer getCommentBanNum() {
        return commentBanNum;
    }

    public void setCommentBanNum(Integer commentBanNum) {
        this.commentBanNum = commentBanNum;
    }
}
