package org.example.prj.controller;

import lombok.RequiredArgsConstructor;
import org.example.prj.DTO.Request.RegisterRequest;
import org.example.prj.entity.Role;
import org.example.prj.entity.User;
import org.example.prj.repository.RoleRepository;
import org.example.prj.repository.UserRepository;
import org.example.prj.service.AuthenticationService;
import org.example.prj.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RegisterController {

    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email đã tồn tại!");
        }
        if(userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Screen đã tồn tại!");
        }

        // 🔑 Lấy role USER từ DB
        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER chưa được tạo trong DB"));

        User newUser = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .active(false)
                .role(role) // gán role đã tồn tại
                .build();

        userRepository.save(newUser);

        // Sinh token magic link
        String token = authenticationService.generateToken(newUser);
        String magicLink = "http://localhost:3000/magic-login?token=" + token;

        emailService.sendEmail(newUser.getEmail(), "Xác thực tài khoản",
                "Click link để kích hoạt: " + magicLink);
        return ResponseEntity.ok("Vui lòng kiểm tra email để xác thực tài khoản.");
    }

}

