package org.example.prj.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.prj.entity.User;
import org.example.prj.exception.AppException;
import org.example.prj.exception.ErrorCode;
import org.example.prj.repository.UserRepository;
import org.example.prj.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/magic")
@RequiredArgsConstructor
@Slf4j
public class MagicLoginController {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    @GetMapping("/login/token={token}")
    public ResponseEntity<Void> loginWithMagicLink(@PathVariable("token") String token) {
        try {
            var jwt = authenticationService.verifyToken(token, false);
            String username = jwt.getJWTClaimsSet().getSubject();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            // Kích hoạt tài khoản nếu chưa kích hoạt
            if (!user.isActive()) {
                user.setActive(true);
                userRepository.save(user);
            }

            // Chuyển hướng về trang login FE
            return ResponseEntity.status(302)
                    .header("Location", "https://onlinelibmana.online/auth/login")
                    .build();

        } catch (Exception e) {
            log.error("Magic login failed", e);
            // Nếu token sai hoặc hết hạn → redirect về trang lỗi
            return ResponseEntity.status(302)
                    .header("Location", "http://localhost:3000/login?activated=false")
                    .build();
        }
    }
}
