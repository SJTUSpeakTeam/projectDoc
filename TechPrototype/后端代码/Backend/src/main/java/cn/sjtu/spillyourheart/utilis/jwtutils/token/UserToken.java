package cn.sjtu.spillyourheart.utilis.jwtutils.token;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// 需要登录且有 token 才能进行操作的 UserToken 注解
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface UserToken {
    boolean required() default true;
}
