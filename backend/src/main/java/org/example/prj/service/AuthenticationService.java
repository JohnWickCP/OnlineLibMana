package org.example.prj.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Request.*;
import org.example.prj.DTO.Response.AuthenticationResponse;
import org.example.prj.DTO.Response.ChangePasswordResponse;
import org.example.prj.DTO.Response.IntrospectResponse;
import org.example.prj.entity.InvalidationTokenEntity;
import org.example.prj.entity.User;
import org.example.prj.exception.AppException;
import org.example.prj.exception.ErrorCode;
import org.example.prj.repository.InValidationTokenRepository;
import org.example.prj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InValidationTokenRepository invalidationTokenRepository;

    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    @Value("${jwt.valid-duration}")
    long VALID_DURATION;

    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public AuthenticationResponse authentication(AuthenticationRequest authenticationRequest) {
        var user = userRepository.findByEmail(authenticationRequest.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        boolean authenticated = passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword());
        if(!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .success(true)
                .build();
    }

    public String generateToken(User user) {
        JWSHeader header =new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet =new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("Baggio")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("SCOPE", buildScope(user))
                .claim("Id",buildId(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try{
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes(StandardCharsets.UTF_8)));
            log.debug("Signer key bytes: {}", Arrays.toString(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        }catch (JOSEException e){
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }


    public IntrospectResponse introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException {
        String token = introspectRequest.getToken();
        boolean isRefresh = true;
        try{
            verifyToken(token,isRefresh);
        }catch (AppException e){
            isRefresh = false;
        }
        return IntrospectResponse.builder().valid(isRefresh).build();
    }


    public void logout(LogoutRequest logoutRequest) throws ParseException, JOSEException{
        try{
            SignedJWT signedJWT = verifyToken(logoutRequest.getToken(),false);

            String Jid = signedJWT.getJWTClaimsSet().getJWTID();
            Date expirationDate = signedJWT.getJWTClaimsSet().getExpirationTime();

            InvalidationTokenEntity invalidationTokenEntity = InvalidationTokenEntity.builder()
                    .id(Jid).expiryTime(expirationDate).build();

            invalidationTokenRepository.save(invalidationTokenEntity);
        }catch (AppException e){
            log.error(e.getMessage());
        }
    }


    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(refreshTokenRequest.getToken(),true);
        String Jid = signedJWT.getJWTClaimsSet().getJWTID();
        String username = signedJWT.getJWTClaimsSet().getSubject();
        Date expirationDate = signedJWT.getJWTClaimsSet().getExpirationTime();

        if(invalidationTokenRepository.existsById(Jid)){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        invalidationTokenRepository.save(InvalidationTokenEntity.builder()
                .id(Jid).expiryTime(expirationDate).build());

        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .success(true)
                .token(token)
                .build();
    }


    public ChangePasswordResponse changePassword(ChangePasswordRequest changePasswordRequest) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(changePasswordRequest.getToken(),true);
        String username = signedJWT.getJWTClaimsSet().getSubject();
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        boolean authenticated = passwordEncoder.matches(user.getPassword(), changePasswordRequest.getOldPassword());
        if(!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        return ChangePasswordResponse.builder().success(true).build();
    }

    public SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes(StandardCharsets.UTF_8));
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (!isRefresh) ? signedJWT.getJWTClaimsSet().getExpirationTime()
                :new Date(signedJWT.getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESHABLE_DURATION,ChronoUnit.SECONDS).toEpochMilli());

        var verified = signedJWT.verify(verifier);
        if(!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);
        if(invalidationTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        return signedJWT;
    }

    public AuthenticationResponse authenticateWithGoogle(String email) {
        var user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // Nếu user chưa tồn tại thì tạo mới
                    User newUser = new User();
                    newUser.setUsername(email);
                    newUser.setEmail(email);
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // random pwd
                    return userRepository.save(newUser);
                });

        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .success(true)
                .token(token)
                .build();
    }

    public String buildScope(User user) {
        StringBuilder builder = new StringBuilder();
        if(user.getRole()!=null){
            builder.append("SCOPE_").append(user.getRole().getName());
        }
        return builder.toString().trim();
    }

    public Long buildId(User user){
        return user.getId();
    }

}
