package org.example.prj.DTO.Response;

import lombok.*;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordResponse {
    private boolean success;
}
