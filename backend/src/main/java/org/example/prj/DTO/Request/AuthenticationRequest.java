package org.example.prj.DTO.Request;

import lombok.*;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {
    private String email;
    private String password;
}

