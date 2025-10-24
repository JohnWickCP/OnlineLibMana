package org.example.prj.DTO.Request;

import lombok.*;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TilteFolder {
    String title;
    String description;
}
