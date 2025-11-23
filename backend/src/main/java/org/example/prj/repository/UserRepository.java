package org.example.prj.repository;

import org.example.prj.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    void deleteById(Long id);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :start AND u.createdAt < :end")
    Long countNewUsersBetween(LocalDateTime start, LocalDateTime end);

    default Long countNewUsersInLastMonth() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.minusMonths(1);
        return countNewUsersBetween(start, now);
    }

    @Query(value = "DELETE FROM review WHERE book_id = :bookId AND user_id = :userId", nativeQuery = true)
    void deleteRatingBook(@Param("bookId") Long bookId, @Param("userId") Long userId);

}
