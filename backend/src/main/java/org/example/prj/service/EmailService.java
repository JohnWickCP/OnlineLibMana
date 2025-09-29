package org.example.prj.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {
    @Autowired
    JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String content) {
        // Tạm thời log ra console (thay vì gửi thật)
        String body = content;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("your-email@gmail.com");
        message.setTo(to);
        message.setSubject("INFORMATION ACCOUNT");
        message.setText(body);
        mailSender.send(message);
        log.info("Send email to: {}\nSubject: {}\nContent: {}", to, subject, content);
    }
}