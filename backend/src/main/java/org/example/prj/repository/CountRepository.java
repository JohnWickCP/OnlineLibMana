package org.example.prj.repository;


import org.example.prj.entity.Count;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CountRepository extends JpaRepository<Count, Long> {
    Count findTopByOrderByTimestampDesc();
    List<Count> findTop3ByOrderByTimestampDesc();
    boolean existsByTimestampBetween(LocalDateTime start, LocalDateTime end);
    Optional<Count> findTopByTimestampBetween(LocalDateTime start, LocalDateTime end);
}