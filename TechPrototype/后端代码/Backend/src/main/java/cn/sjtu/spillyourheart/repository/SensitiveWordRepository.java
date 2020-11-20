package cn.sjtu.spillyourheart.repository;

import cn.sjtu.spillyourheart.entity.SensitiveWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SensitiveWordRepository extends JpaRepository<SensitiveWord,Integer> {
    @Query(nativeQuery = true,value="select * from sensitive_word")
    List<SensitiveWord> getSensitiveWords();

    @Query(nativeQuery = true,value="select * from sensitive_word where word_content = ?1")
    SensitiveWord getSensitiveWordBywordContent(String wordContent);
}
