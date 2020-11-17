package cn.sjtu.spillyourheart.serviceImpl;

import cn.sjtu.spillyourheart.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {
    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendVerifyMail(String to, String token) {
        String subject = "[邮箱认证] 交大说说账号认证";
        String content = "您好，感谢您注册交大说说系统！\n\n请点击以下链接，完成邮箱认证！: )\n\nhttp://202.120.40.8:30391/auth?value=" + token;
        String from = "1053285132@qq.com";
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);//收信人
        message.setSubject(subject);//主题
        message.setText(content);//内容
        message.setFrom(from);//发信人

        mailSender.send(message);
    }
}
