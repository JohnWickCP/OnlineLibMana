package org.example.prj.DTO.Response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String description;
    private String category;
    private String coverImage;
    private String fileUrl;
    private LocalDateTime createdAt;
    private String language;

    public BookResponse(Long id, String title, String author, String description, String coverImage) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
        this.coverImage = coverImage;
    }

}
