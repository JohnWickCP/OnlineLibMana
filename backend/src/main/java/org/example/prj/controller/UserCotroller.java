package org.example.prj.controller;

import com.nimbusds.jose.JOSEException;
import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Request.AuthenticationRequest;
import org.example.prj.DTO.Request.LogoutRequest;
import org.example.prj.DTO.Response.ApiResponse;
import org.example.prj.DTO.Response.AuthenticationResponse;
import org.example.prj.repository.UserRepository;
import org.example.prj.service.AuthenticationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Slf4j
@RestController
@RequestMapping("/home")
public class UserCotroller {
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;

    public UserCotroller(UserRepository userRepository, AuthenticationService authenticationService) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
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
    public void logoutAccount(@RequestBody LogoutRequest  logoutRequest) throws ParseException, JOSEException {
        authenticationService.logout(logoutRequest);
        log.info("Logout successful");
    }


    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id){
        userRepository.deleteById(id);
    }
}
