package org.example.prj.repository;


import org.example.prj.entity.Count;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface CountRepository extends JpaRepository<Count, Long> {
    Count findTopByOrderByTimestampDesc();
    boolean existsByTimestampBetween(LocalDateTime start, LocalDateTime end);
}