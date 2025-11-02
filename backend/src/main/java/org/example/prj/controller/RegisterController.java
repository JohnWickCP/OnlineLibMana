package org.example.prj.controller;

import lombok.RequiredArgsConstructor;
import org.example.prj.DTO.Request.RegisterRequest;
import org.example.prj.entity.Role;
import org.example.prj.entity.User;
import org.example.prj.exception.AppException;
import org.example.prj.exception.ErrorCode;
import org.example.prj.repository.RoleRepository;
import org.example.prj.repository.UserRepository;
import org.example.prj.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RegisterController {
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final CountService countService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // Lấy role USER từ DB
        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER chưa được tạo trong DB"));

        // Tạo user mới (chưa kích hoạt)
        User newUser = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .createdAt(LocalDateTime.now())
                .active(false)
                .role(role)
                .build();

        userRepository.save(newUser);

        // Sinh token magic link
        String token = authenticationService.generateToken(newUser);
        String magicLink = "http://localhost:8081/magic/login/token=" + token;

        emailService.sendEmail(
                newUser.getEmail(),
                "Xác thực tài khoản",
                magicLink
        );


        emailService.sendEmail(
                newUser.getEmail(),
                "Xác thực tài khoản",
                magicLink
        );
        // Cộng bộ đếm ngay
        countService.incrementNewUserCount();
        return ResponseEntity.ok("Vui lòng kiểm tra email để xác thực tài khoản.");
    }
}
