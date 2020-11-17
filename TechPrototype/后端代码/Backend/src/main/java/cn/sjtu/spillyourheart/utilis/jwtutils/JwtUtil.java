package cn.sjtu.spillyourheart.utilis.jwtutils;

import cn.sjtu.spillyourheart.entity.UserAuth;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

public class JwtUtil {
    public static String getToken(UserAuth userAuth) {
        String token = "";
        token = JWT.create().withAudience(userAuth.getUserId().toString())
                .sign(Algorithm.HMAC256(userAuth.getPassword()));
        return token;
    }
}
