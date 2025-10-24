package org.example.prj.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Response.AuthenticationResponse;
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

    @GetMapping("/login/{token}")
    public ResponseEntity<AuthenticationResponse> loginWithMagicLink(@PathVariable("token") String token) {
        try {
            var jwt = authenticationService.verifyToken(token, false);

            String username = jwt.getJWTClaimsSet().getSubject();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            // Kích hoạt tài khoản
            if (!user.isActive()) {
                user.setActive(true);
                userRepository.save(user);
            }

            // Sinh JWT để login thẳng
            String newToken = authenticationService.generateToken(user);

            return ResponseEntity.ok(AuthenticationResponse.builder()
                    .success(true)
                    .token(newToken)
                    .build());
        } catch (Exception e) {
            log.error("Magic login failed", e);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
