package org.example.prj.repository;

import org.example.prj.entity.Book;
import org.example.prj.entity.FavouriteBooks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavouriteRepository extends JpaRepository<FavouriteBooks,Long> {
    Page<Book> findById(Long id, Pageable pageable);
}
