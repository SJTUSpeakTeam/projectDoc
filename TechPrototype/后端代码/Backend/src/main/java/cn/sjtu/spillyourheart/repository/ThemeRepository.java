package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ThemeRepository extends JpaRepository<Theme,Integer> {
    @Query(nativeQuery = true,value="select * from theme where status = 1")
    List<Theme> getThemes();

    @Query(nativeQuery = true,value="select * from theme where name = ?1 and status = 1")
    Theme getThemeByName(String name);
}
