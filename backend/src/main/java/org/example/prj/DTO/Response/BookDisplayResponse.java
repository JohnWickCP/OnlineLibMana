package org.example.prj.DTO.Response;

import lombok.*;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDisplayResponse {
    private Long id;
    private String author;
    private String category;
    private String coverImage;
}
