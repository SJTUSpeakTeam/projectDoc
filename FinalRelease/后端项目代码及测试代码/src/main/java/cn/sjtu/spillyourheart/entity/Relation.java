package cn.sjtu.spillyourheart.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;
import java.util.Date;

@Document(collection = "relation")
public class Relation {
    @Id
    @Field("_id")
    @JsonIgnore
    private ObjectId id;
    @Indexed
    private Integer userId;
    @Indexed
    private Integer targetId;
    @Indexed
    private String area;
    private Boolean like;
    private Boolean collect;
    private Date createTime;

    public void init(){
        id = null;
        userId = null;
        targetId = null;
        area = null;
        like = null;
        collect = null;
        createTime = new Date();
    }

    public Relation() {
    }

    public Relation(Integer userId, Integer targetId) {
        init();
        this.userId = userId;
        this.targetId = targetId;
    }

    public Relation(Integer userId, Integer targetId, String area) {
        init();
        this.userId = userId;
        this.targetId = targetId;
        this.area = area;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getTargetId() {
        return targetId;
    }

    public void setTargetId(Integer targetId) {
        this.targetId = targetId;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Boolean getLike() {
        return like;
    }

    public void setLike(Boolean like) {
        this.like = like;
    }

    public Boolean getCollect() {
        return collect;
    }

    public void setCollect(Boolean collect) {
        this.collect = collect;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
