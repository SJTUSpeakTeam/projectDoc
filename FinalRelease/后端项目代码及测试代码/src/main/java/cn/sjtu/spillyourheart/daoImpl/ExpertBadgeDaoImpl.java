package cn.sjtu.spillyourheart.daoImpl;

import cn.sjtu.spillyourheart.dao.ExpertBadgeDao;
import cn.sjtu.spillyourheart.entity.ExpertBadge;
import cn.sjtu.spillyourheart.repository.ExpertBadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class ExpertBadgeDaoImpl implements ExpertBadgeDao {
    @Autowired
    private ExpertBadgeRepository expertBadgeRepository;

    @Override
    public Integer postOne(Integer userId,String profession,String information){
        ExpertBadge expertBadge = new ExpertBadge();
        expertBadge.setUserId(userId);
        expertBadge.setProfession(profession);
        expertBadge.setGrantDate(new Date());
        expertBadge.setBadageImg("");
        expertBadge.setBadageInf(information);
        expertBadgeRepository.saveAndFlush(expertBadge);
        return expertBadge.getBadgeId();
    }

    @Override
    public void deleteOne(Integer badgeId){
        ExpertBadge expertBadge = expertBadgeRepository.getOne(badgeId);
        expertBadgeRepository.delete(expertBadge);
    }

    @Override
    public Integer updateOne(Integer badgeId,String profession,String information){
        ExpertBadge expertBadge = expertBadgeRepository.getOne(badgeId);
        expertBadge.setBadageInf(information);
        expertBadge.setProfession(profession);
        expertBadgeRepository.saveAndFlush(expertBadge);
        return expertBadge.getBadgeId();
    }

    @Override
    public List<ExpertBadge> getAllByUser(Integer userId){
        return expertBadgeRepository.getAllByUser(userId);
    }
}
