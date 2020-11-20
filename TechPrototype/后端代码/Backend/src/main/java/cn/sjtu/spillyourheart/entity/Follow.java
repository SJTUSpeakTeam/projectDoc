package cn.sjtu.spillyourheart.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;

import java.util.Date;

@Document(collection = "follow")
public class Follow {
    @Id
    @Field("_id")
    @JsonIgnore
    private ObjectId id;
    @Indexed
    private Integer userId;
    @Indexed
    private Integer targetId;
    private Date createTime;

    public void init(){
        id = null;
        userId = null;
        targetId = null;
        createTime = new Date();
    }

    public Follow() {
    }

    public Follow(Integer userId, Integer targetId) {
        init();
        this.userId = userId;
        this.targetId = targetId;
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

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
