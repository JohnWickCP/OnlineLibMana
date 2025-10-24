package org.example.prj.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String magicLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("your-email@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);

            // ✅ HTML nội dung đẹp, chỉ hiển thị "Click vào đây để xác nhận"
            String htmlContent = """
                    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                        <h2>Xin chào!</h2>
                        <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
                        <p>Vui lòng nhấn nút bên dưới để xác thực tài khoản của bạn:</p>
                        <p>
                            <a href="%s" style="
                                background-color: #1a73e8;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                            ">
                                Xác nhận tài khoản
                            </a>
                        </p>
                        <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
                        <hr>
                        <small>© 2025 YourCompany. All rights reserved.</small>
                    </div>
                    """.formatted(magicLink);

            helper.setText(htmlContent, true); // true => bật HTML mode

            mailSender.send(message);
            log.info("Email xác thực đã gửi đến {}", to);
        } catch (MessagingException e) {
            log.error("Lỗi khi gửi email xác thực: ", e);
            throw new RuntimeException("Gửi email thất bại!");
        }
    }
}
