package org.example.prj.DTO.Response;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.example.prj.entity.BookRating;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long totalUsers;
    private Long newUsersQuantity;
    private Long totalBooks;
    private Long view;
    private List<Long> users;
    private List<BookRating> rating;
    private LocalDateTime startDay;
}
