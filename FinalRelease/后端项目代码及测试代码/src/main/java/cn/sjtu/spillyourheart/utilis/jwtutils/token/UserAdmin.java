package cn.sjtu.spillyourheart.utilis.jwtutils.token;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// 需要用户为管理员的 UserAdmin 注解
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface UserAdmin {
    boolean required() default true;
}
