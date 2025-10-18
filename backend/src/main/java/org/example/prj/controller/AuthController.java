package org.example.prj.controller;

import com.nimbusds.jose.JOSEException;
import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Request.AuthenticationRequest;
import org.example.prj.DTO.Request.LogoutRequest;
import org.example.prj.DTO.Response.ApiResponse;
import org.example.prj.DTO.Response.AuthenticationResponse;
import org.example.prj.repository.UserRepository;
import org.example.prj.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@Slf4j
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationService authenticationService, UserRepository userRepository) {
        this.authenticationService = authenticationService;
        this.userRepository = userRepository;
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

//    @GetMapping
//    @ResponseBody
//    public String home(@AuthenticationPrincipal OAuth2User principal) {
//        return "Hello, " + principal.getAttribute("email");
//    }

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> loginAccount(@RequestBody AuthenticationRequest authenticationRequest) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.authentication(authenticationRequest))
                .build();
    }

    @PostMapping("/logout")
//    @PreAuthorize("isAuthenticated()")
    public void logoutAccount(@RequestBody LogoutRequest logoutRequest) throws ParseException, JOSEException {
        authenticationService.logout(logoutRequest);
        log.info("Logout successful");
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id){
        userRepository.deleteById(id);
    }
}

