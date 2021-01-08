package cn.sjtu.spillyourheart.repository;


import cn.sjtu.spillyourheart.entity.RegularUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegularUserRepository extends JpaRepository<RegularUser,Integer> {
}
