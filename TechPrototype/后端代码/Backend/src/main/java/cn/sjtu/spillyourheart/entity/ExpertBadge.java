package cn.sjtu.spillyourheart.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.Date;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "expert_badge", schema = "syh")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "badgeId")
public class ExpertBadge {
    private Integer badgeId;
    private Integer userId;
    private String profession;
    @JsonFormat(shape=JsonFormat.Shape.STRING,pattern="yyyy-MM-dd",timezone="GMT+8")
    private Date grantDate;
    private String badageImg;
    private String badageInf;

    @Id
    @Column(name = "badge_id")
    @GeneratedValue(strategy = IDENTITY)
    public Integer getBadgeId() {
        return badgeId;
    }

    public void setBadgeId(Integer badgeId) {
        this.badgeId = badgeId;
    }

    @Basic
    @Column(name = "user_id")
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "profession")
    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    @Basic
    @Column(name = "grant_date")
    public Date getGrantDate() {
        return grantDate;
    }

    public void setGrantDate(Date grantDate) {
        this.grantDate = grantDate;
    }

    @Basic
    @Column(name = "badge_img")
    public String getBadageImg() {
        return badageImg;
    }

    public void setBadageImg(String badageImg) {
        this.badageImg = badageImg;
    }

    @Basic
    @Column(name = "badge_inf")
    public String getBadageInf() {
        return badageInf;
    }

    public void setBadageInf(String badageInf) {
        this.badageInf = badageInf;
    }
}