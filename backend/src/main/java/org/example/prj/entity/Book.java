package org.example.prj.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String author;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String category;
    private String coverImage;
    private String fileUrl;
    private LocalDateTime createdAt;
    private String language;
    private String subject;

    @OneToMany(mappedBy = "book",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookshelfItem> bookshelfItems = new ArrayList<>();

    @ManyToMany(mappedBy = "books",cascade = CascadeType.ALL)
    private List<FavouriteBooks> favouriteBooks = new ArrayList<>();

    // getters and setters
}

