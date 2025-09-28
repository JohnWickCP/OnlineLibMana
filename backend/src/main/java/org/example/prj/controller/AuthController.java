package org.example.prj.controller;

import org.example.prj.DTO.Response.AuthenticationResponse;
import org.example.prj.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    // Endpoint này sẽ được gọi sau khi Google login thành công
    @GetMapping("/google")
    public ResponseEntity<AuthenticationResponse> loginWithGoogle(@AuthenticationPrincipal OAuth2User principal) {
        // Lấy email từ Google
        String email = principal.getAttribute("email");

        // Gọi sang AuthenticationService để sinh JWT của hệ thống bạn
        AuthenticationResponse response = authenticationService.authenticateWithGoogle(email);

        return ResponseEntity.ok(response);
    }
}

