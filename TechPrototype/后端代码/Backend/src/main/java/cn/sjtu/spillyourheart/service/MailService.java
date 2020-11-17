package cn.sjtu.spillyourheart.service;

public interface MailService {
    public void sendVerifyMail(String to, String token);
}
