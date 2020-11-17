package cn.sjtu.spillyourheart.daoImpl;

import cn.sjtu.spillyourheart.dao.UserDao;
import cn.sjtu.spillyourheart.entity.*;
import cn.sjtu.spillyourheart.entity.VO.MetaUser;
import cn.sjtu.spillyourheart.repository.*;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserDaoImpl implements UserDao {
    static private Integer pageSize = 8;

    @Autowired
    UserAuthRepository userAuthRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RelationRepository relationRepository;

    @Autowired
    RegularUserRepository regularUserRepository;

    @Autowired
    AdminUserRepository adminUserRepository;

    @Override
    public UserAuth checkUser(String phone, String password) {
        return null;
    }

    @Override
    public User findUserById(Integer id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()){
            return userOptional.get();
        }
        else{
            System.out.println("[ERROR]UserDao: can't find User by Id:" + id.toString());
            return null;
        }

    }

    @Override
    public UserAuth findUserAuthById(Integer id) {
        Optional<UserAuth> userAuthOptional = userAuthRepository.findById(id);
        if (userAuthOptional.isPresent()){
            return userAuthOptional.get();
        }
        else{
            System.out.println("[ERROR]UserDao: can't find UserAuth by Id:" + id.toString());
            return null;
        }
    }

    @Override
    public List<MetaUser> findAllMeta(Integer page) {
        // 页码从 0 开始, 每页 8 个东西
        List<MetaUser> metaUsers = new ArrayList<>();
        List<UserAuth> userAuths = userAuthRepository.findByPage(pageSize, pageSize*page);
        for(UserAuth userAuth: userAuths){
            metaUsers.add(findOneMeta(userAuth.getUserId()));
        }
        return metaUsers;
    }

    @Override
    public MetaUser findOneMeta(Integer inputId) {
        Optional<UserAuth> userAuthOptional =  userAuthRepository.findById(inputId);
        UserAuth userAuth;
        if (userAuthOptional.isPresent()){
            userAuth = userAuthOptional.get();
        }
        else{
            return null;
        }

        MetaUser metaUser = new MetaUser();
        metaUser.userAuth = userAuth;
        Integer id;
        id = userAuth.getUserId();

        Optional<User> userOptional =  userRepository.findById(id);
        if (!userOptional.isPresent()){
            throw new RuntimeException("userAuth without user, id:" + id.toString());
        }
        else{
            metaUser.user = userOptional.get();
        }

        // 根据是否为管理员，获取相应的信息
        if (userAuth.getUserType() == 1){
            Optional<AdminUser> adminUserOptional = adminUserRepository.findById(id);
            // 若不存在即补全
            if (!adminUserOptional.isPresent()){
                System.out.println("[ERROR] UserDao: user with no adminUser, id:" + id.toString());
                AdminUser adminUser1 = new AdminUser();
                adminUser1.init();
                adminUser1.setUserId(id);
                metaUser.adminUser = adminUserRepository.save(adminUser1);
            }
            else{
                metaUser.adminUser = adminUserOptional.get();
            }
        }
        else{
            Optional<RegularUser> regularUserOptional = regularUserRepository.findById(id);
            // 若不存在即补全
            if (!regularUserOptional.isPresent()){
                System.out.println("[ERROR] UserDao: user with no regularUser, id:" + id.toString());
                RegularUser regularUser = new RegularUser();
                regularUser.init();
                regularUser.setUserId(id);
                metaUser.regularUser = regularUserRepository.save(regularUser);
            }
            else{
                metaUser.regularUser = regularUserOptional.get();
            }
        }
        return metaUser;
    }

    @Override
    public UserAuth findByKey(String key) {
        return null;
    }

    @Override
    public Boolean banLiftUser(Integer id, Boolean valid) {
        Optional<UserAuth> userAuthOptional = userAuthRepository.findById(id);
        if (userAuthOptional.isPresent()){
            UserAuth userAuth = userAuthOptional.get();
            // 不能 ban 管理员用户
            if (userAuth.getUserType() == 1){
                return false;
            }
            if (valid){
                userAuth.setUserType(2);
            }
            else {
                userAuth.setUserType(0);
            }
            userAuthRepository.save(userAuth);
            return true;
        }
        else {
            System.out.println("[ERROR]UserDao: failed ban/lift userAuths: " + id);
            return false;
        }
    }

    @Override
    public List<User> aggregate(Integer type, String time_value) {
        return null;
    }

    @Override
    @Transactional
    public User save(User user) {
        return userRepository.saveAndFlush(user);
    }

    @Override
    public UserAuth saveAuth(UserAuth userAuth) {
        return userAuthRepository.saveAndFlush(userAuth);

    }

    @Override
    public RegularUser saveRegular(RegularUser regularUser) {
        return regularUserRepository.save(regularUser);
    }

    @Override
    public Boolean delete(Integer id) {
        try {
            if(exist(id)){
                userRepository.deleteById(id);
            }
        }
        catch (Exception e){
            System.out.println("[ERROR]UserDao: failed deleting users: " + id);
            return false;
        }
        return true;
    }

    @Override
    public Boolean deleteAuth(Integer id) {
        try {
            if(existAuth(id)){
                userAuthRepository.deleteById(id);
            }
        }
        catch (Exception e){
            System.out.println("[ERROR]UserDao: failed deleting userAuths: " + id);
            return false;
        }
        return true;
    }

    @Override
    public Boolean deleteRegular(Integer id) {
        try {
            if(existAuth(id)){
                regularUserRepository.deleteById(id);
            }
        }
        catch (Exception e){
            System.out.println("[ERROR]UserDao: failed deleting regularUser: " + id);
            return false;
        }
        return true;
    }

    @Override
    public Boolean exist(Integer id) {
        return userRepository.existsById(id);
    }

    @Override
    public Boolean exist(String value, String type) {
        if (type.equals("nickname")){
            return userRepository.existsByNickname(value);
        }
        else if (type.equals("mailAddr")){
            return userAuthRepository.existsByMailAddr(value);
        }
        else {
            System.out.println("[ERROR]UserDao: querying an not valid User attribute existence");
            return false;
        }
    }

    @Override
    public Boolean existAuth(Integer id) {
        return userAuthRepository.existsById(id);
    }

    @Override
    public UserAuth findUserAuthByEP(String mailAddr, String password) {
        return userAuthRepository.findByEP(mailAddr, password);
    }

    @Override
    public Boolean hasRelation(Integer userId,Integer targetId,String area){
        Relation relation = relationRepository.findRelation(userId,targetId,area);
        if(String.valueOf(relation).equals("null"))
            return false;
        return true;
    }

    @Override
    public Relation getRelation(Integer userId,Integer targetId,String area){
        return relationRepository.findRelation(userId,targetId,area);
    }

    @Override
    public void createRelation(Integer userId,Integer targetId,String area){
        Relation relation = new Relation(userId,targetId,area);
        relation.setLike(false);
        relation.setCollect(false);
        relationRepository.save(relation);
    }

    @Override
    public void saveRelation(Relation relation){
        relationRepository.save(relation);
    }

    public User getDetail(User user){
        return null;
    }
}
