package org.example.prj.repository;

import org.example.prj.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> getBookById(Long id);

    // ❌ XÓA query cũ này đi (hoặc comment lại)
    // @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    // Page<Book> findByTitle(@Param("title") String title, Pageable pageable);

    // ✅ THÊM query mới này - Tìm từ 3 trường
    @Query("SELECT b FROM Book b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Book> findByTitle(@Param("keyword") String keyword, Pageable pageable);

    boolean existsByTitle(String title);
    boolean existsByAuthor(String author);
}