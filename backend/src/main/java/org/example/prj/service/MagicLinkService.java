//package org.example.prj.service;
//
//import org.springframework.stereotype.Service;
//
//@Service
//public class MagicLinkService {
//
//    private final JwtService jwtService;
//    private final EmailService emailService;
//
//    public MagicLinkService(JwtService jwtService, EmailService emailService) {
//        this.jwtService = jwtService;
//        this.emailService = emailService;
//    }
//
//    public void sendMagicLink(String email) {
//        // Sinh token tạm thời
//        String token = jwtService.generateMagicToken(email, 10); // 10 phút
//
//        String magicLink = "http://localhost:3000/magic-login?token=" + token;
//
//        // Gửi mail
//        String subject = "Your login link";
//        String content = "Click this link to login: " + magicLink;
//        emailService.sendEmail(email, subject, content);
//    }
//}
