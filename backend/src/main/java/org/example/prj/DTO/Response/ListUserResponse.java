package org.example.prj.DTO.Response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListUserResponse {
    private Long id;
    private String username;
    private String email;
    private boolean active;
    private LocalDateTime createdAt;
    private Long readingQuantity;
    private Long wantQuantity;
    private Long completedQuantity;
}
