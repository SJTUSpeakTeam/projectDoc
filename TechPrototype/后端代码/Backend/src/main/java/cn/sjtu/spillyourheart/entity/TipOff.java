package cn.sjtu.spillyourheart.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.Date;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "tip_off", schema = "syh")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "tipOffId")
public class TipOff {
    private Integer tipOffId;
    private Integer userId;
    @JsonFormat(shape=JsonFormat.Shape.STRING,pattern="yyyy-MM-dd",timezone="GMT+8")
    private Date createTime;
    private String content;
    private Short status;
    private String conversation;

    @Id
    @Column(name = "tip_off_id")
    @GeneratedValue(strategy = IDENTITY)
    public Integer getTipOffId() {
        return tipOffId;
    }

    public void setTipOffId(int tipOffId) {
        this.tipOffId = tipOffId;
    }

    @Basic
    @Column(name = "user_id")
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
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
    @Column(name = "content")
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Basic
    @Column(name = "status")
    public Short getStatus() {
        return status;
    }

    public void setStatus(short status) {
        this.status = status;
    }

    @Basic
    @Column(name = "conversation")
    public String getConversation() {
        return conversation;
    }

    public void setConversation(String conversation) {
        this.conversation = conversation;
    }
}
