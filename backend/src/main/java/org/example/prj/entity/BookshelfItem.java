package org.example.prj.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.prj.constant.StatusBook;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "bookshelf_item",
        uniqueConstraints = @UniqueConstraint(columnNames = {"bookshelf_id", "book_id"})
)
public class BookshelfItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Trạng thái riêng cho từng sách trong bookshelf
    @Enumerated(EnumType.STRING)
    private StatusBook status;

    @ManyToOne
    @JoinColumn(name = "bookshelf_id", nullable = false)
    private Bookshelf bookshelf;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
}
