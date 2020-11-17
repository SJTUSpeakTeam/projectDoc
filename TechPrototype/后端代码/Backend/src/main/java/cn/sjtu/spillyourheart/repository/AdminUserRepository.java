package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser,Integer> {
}
