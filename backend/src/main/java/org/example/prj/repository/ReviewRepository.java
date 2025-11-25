package org.example.prj.repository;

import org.example.prj.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query(value = "SELECT rating FROM review WHERE book_id = :bookId AND user_id = :userId", nativeQuery = true)
    Double findRatingByBookIdAndUserId(@Param("bookId") Long bookId, @Param("userId") Long userId);
}
