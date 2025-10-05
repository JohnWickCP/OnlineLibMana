package org.example.prj.DTO.Request;

import lombok.*;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    private String newPassword;
    private String oldPassword;
    private String token;
}
