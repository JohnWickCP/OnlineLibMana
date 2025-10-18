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
    private String title;
    private String author;
    private String decription;
    private String coverImage;
}
