package cn.sjtu.spillyourheart.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

import java.util.Date;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "adminUser", schema = "syh")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "userId")
public class AdminUser{
    private Integer userId;
    private Integer userBanNum;
    private Integer contentBanNum;
    private Integer senWordNum;

    public AdminUser(){
    }

    public void init(){
        setContentBanNum(0);
        setSenWordNum(0);
        setUserBanNum(0);
    }

    @Id
    @Column(name = "user_id")
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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
    @Column(name = "content_ban_num")
    public Integer getContentBanNum() {
        return contentBanNum;
    }

    public void setContentBanNum(Integer contentBanNum) {
        this.contentBanNum = contentBanNum;
    }

    @Basic
    @Column(name = "sen_word_num")
    public Integer getSenWordNum() {
        return senWordNum;
    }

    public void setSenWordNum(Integer senWordNum) {
        this.senWordNum = senWordNum;
    }
}
