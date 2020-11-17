package cn.sjtu.spillyourheart.daoImpl;

import cn.sjtu.spillyourheart.dao.TagDao;
import cn.sjtu.spillyourheart.entity.Tag;
import cn.sjtu.spillyourheart.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TagDaoImpl implements TagDao{
    @Autowired
    private TagRepository tagRepository;

    @Override
    public void postOne(String content){
        Tag tag = new Tag();
        tag.setContent(content);
        tagRepository.saveAndFlush(tag);
    }
    @Override
    public boolean hasOne(String content) {
        Tag tag = tagRepository.getTag(content);
        if(String.valueOf(tag).equals("null"))
            return false;
        return true;
    }
    @Override
    public void deleteOne(String content){
        Tag tag = tagRepository.getTag(content);
        tagRepository.delete(tag);
    }
    @Override
    public void updateOne(String content,String newContent){
        Tag tag = tagRepository.getTag(content);
        tagRepository.delete(tag);
        Tag newtag = new Tag();
        newtag.setContent(newContent);
        tagRepository.saveAndFlush(newtag);
    }
    @Override
    public List<String> getAll(){
        List<Tag> tagList = tagRepository.getTags();
        List<String> stringList = new ArrayList<>();
        for(Tag tag : tagList){
            stringList.add(tag.getContent());
        };
        return stringList;
    }
}
