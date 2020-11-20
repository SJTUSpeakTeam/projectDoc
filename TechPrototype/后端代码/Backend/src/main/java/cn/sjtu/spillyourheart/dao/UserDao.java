package cn.sjtu.spillyourheart.dao;

import cn.sjtu.spillyourheart.entity.RegularUser;
import cn.sjtu.spillyourheart.entity.Relation;
import cn.sjtu.spillyourheart.entity.User;
import cn.sjtu.spillyourheart.entity.UserAuth;
import cn.sjtu.spillyourheart.entity.VO.MetaUser;
import cn.sjtu.spillyourheart.repository.UserRepository;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;
import org.springframework.data.mongodb.core.query.Meta;

import java.util.List;

public interface UserDao {
    User findUserById(Integer id);
    User getDetail(User user);
    UserAuth checkUser(String phone, String password);
    UserAuth findUserAuthById(Integer id);
    List<MetaUser> findAllMeta(Integer page);
    MetaUser findOneMeta(Integer id);
    UserAuth findByKey(String key);
    Boolean banLiftUser(Integer id, Boolean valid);
    List<User> aggregate(Integer type, String time_value);
    User save(User user);
    UserAuth saveAuth(UserAuth userAuth);
    RegularUser saveRegular(RegularUser regularUser);
    Boolean delete(Integer id);
    Boolean deleteAuth(Integer id);
    Boolean deleteRegular(Integer id);
    Boolean exist(Integer id);
    Boolean exist(String value, String type);
    Boolean existAuth(Integer id);
    UserAuth findUserAuthByEP(String mailAddr, String password);
    Boolean hasRelation(Integer userId,Integer targetId,String area);
    Relation getRelation(Integer userId,Integer targetId,String area);
    void createRelation(Integer userId,Integer targetId,String area);
    void saveRelation(Relation relation);
}
