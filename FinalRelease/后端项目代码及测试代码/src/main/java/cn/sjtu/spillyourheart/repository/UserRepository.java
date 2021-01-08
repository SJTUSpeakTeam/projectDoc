package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByNickname(String nickname);
}
