package org.example.prj.repository;

import org.example.prj.entity.BookRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRatingDistributionRepository
        extends JpaRepository<BookRating, String> {
}
