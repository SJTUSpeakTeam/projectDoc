package cn.sjtu.spillyourheart.intercepter;

import cn.sjtu.spillyourheart.entity.User;
import cn.sjtu.spillyourheart.entity.UserAuth;
import cn.sjtu.spillyourheart.service.UserService;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserAdmin;
import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserValid;

import cn.sjtu.spillyourheart.utilis.jwtutils.token.UserToken;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;

public class AuthenticationInterceptor implements HandlerInterceptor {
    @Autowired
    UserService userService;
    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object object) throws Exception {
        System.out.println("--- checking authority:");
        // 从 http 请求头中取出 token
        String token;
        try {
            token = httpServletRequest.getHeader("token");
        }
        catch (Exception e){
            System.out.println("[ERROR] Interceptor: get header 'token' failed");
            e.printStackTrace();
            return false;
        }

        // 如果不是映射到方法直接通过
        if(!(object instanceof HandlerMethod)){
            System.out.println("preHandle: true as 不是映射到方法");
            System.out.println("--- checking authority: not method");
            return true;
        }

        HandlerMethod handlerMethod=(HandlerMethod)object;
        Method method=handlerMethod.getMethod();

        // 检查是否有 PassToken 注释，有则跳过认证
        if (method.isAnnotationPresent(PassToken.class)) {
            PassToken passToken = method.getAnnotation(PassToken.class);
            if (passToken.required()) {
                System.out.println("preHandle: true as ‘passToken’");
                System.out.println("--- checking authority: pass");
                return true;
            }
        }

        // 检查有没有需要用户登录的注解
        if (method.isAnnotationPresent(UserToken.class)) {
            UserToken userToken = method.getAnnotation(UserToken.class);

            if (userToken.required()) {
                // 执行认证
                if (token == null) {
                    System.out.println("preHandle: false as token is null");
                    System.out.println("--- checking authority: failed");
                    httpServletResponse.setStatus(401);
                    return false;
                }
                // 获取 token 中的 user id
                String userId;
                try {
                    userId = JWT.decode(token).getAudience().get(0);
                } catch (JWTDecodeException j) {
                    System.out.println("preHandle: false as JWT exception");
                    System.out.println("Error token: " + token);
                    System.out.println("--- checking authority: failed");
                    httpServletResponse.setStatus(401);
                    return false;
                    //
                }
                User user = userService.findUserById(Integer.parseInt(userId));
                if (user == null) {
                    System.out.println("preHandle: false as User not exist");
                    System.out.println("--- checking authority: failed");
                    httpServletResponse.setStatus(401);
                    return false;
                }
                // 验证 token
                UserAuth userAuth = userService.findUserAuthById(Integer.parseInt(userId));
                JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256(userAuth.getPassword())).build();
                try {
                    jwtVerifier.verify(token);
                } catch (JWTVerificationException e) {
                    System.out.println("preHandle: false as token verification failed");
                    System.out.println("--- checking authority: failed");
                    httpServletResponse.setStatus(401);
                    return false;
                }
                // 验证是否用户有效
                if (method.isAnnotationPresent(UserValid.class)){
                    if (userAuth.getUserType() == 0)
                    {
                        System.out.println("preHandle: false as" + " valid verification failed");
                        System.out.println("--- checking authority: failed");
                        httpServletResponse.setStatus(401);
                        return false;
                    }
                }
                // 验证用户是否为管理员
                else if (method.isAnnotationPresent(UserAdmin.class)){
                    if (userAuth.getUserType() != 1L)
                    {
                        System.out.println("preHandle: false as" + " admin verification failed");
                        System.out.println("--- checking authority: failed");
                        httpServletResponse.setStatus(401);
                        return false;
                    }
                }
                //将验证通过后的用户信息放到请求中
                httpServletRequest.setAttribute("currentUser", user);
                System.out.println("pass token : "+token);
                System.out.println("--- checking authority: success");
                return true;
            }
            else{
                System.out.println("preHandle: [ERROR] as UserToken.required() return false");
                System.out.println("--- checking authority: pass");
//                httpServletResponse.setStatus(500);
                return true;
            }
        }

        System.out.println("preHandle: [ERROR] as no control annotation found");
        System.out.println("--- checking authority: pass");
//            httpServletResponse.setStatus(500);
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest,
                           HttpServletResponse httpServletResponse,
                           Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest,
                                HttpServletResponse httpServletResponse,
                                Object o, Exception e) throws Exception {
    }
}
