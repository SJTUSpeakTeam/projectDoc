package cn.sjtu.spillyourheart.utilis.jwtutils.token;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// 需要登录才能进行操作的注解UserLoginToken注解
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface UserValid {
    boolean required() default true;
}
