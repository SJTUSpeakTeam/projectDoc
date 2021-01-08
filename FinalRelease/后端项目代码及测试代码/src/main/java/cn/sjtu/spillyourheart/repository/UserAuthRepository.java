package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface UserAuthRepository extends JpaRepository<UserAuth, Integer> {
    @Query(value = "select * from user_auth where `mail_addr` = :mail_addr and `password` = :password", nativeQuery = true)
    UserAuth findByEP(@Param("mail_addr")String mail_addr, @Param("password")String password);

    @Query(value = "select * from `user_auth` limit :page_size offset :offset", nativeQuery = true)
    List<UserAuth> findByPage(@Param("page_size")Integer pageSize, @Param("offset")Integer offset);

    boolean existsByMailAddr(String mailAddr);
}
