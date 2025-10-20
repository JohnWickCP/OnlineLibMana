package org.example.prj;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PrjApplication {

    public static void main(String[] args) {
        // 🔹 Load các biến môi trường từ file .env
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing() // tránh lỗi nếu chưa có file .env
                .load();

        // 🔹 Ghi toàn bộ biến vào System properties
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );

        // 🔹 Chạy Spring Boot
        SpringApplication.run(PrjApplication.class, args);
    }
}
