package org.example.prj.repository;

import org.example.prj.DTO.Response.ApiResponse;
import org.example.prj.entity.BookshelfItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookshelfItemRepository extends JpaRepository<BookshelfItem,Long> {
}
