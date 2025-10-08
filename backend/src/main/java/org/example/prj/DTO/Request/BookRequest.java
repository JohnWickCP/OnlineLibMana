package org.example.prj.DTO.Request;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {
    private String title;
    private String author;
    private String description;
    private String category;
    private String coverImage;
    private String fileUrl;
    private LocalDateTime createdAt;
}
