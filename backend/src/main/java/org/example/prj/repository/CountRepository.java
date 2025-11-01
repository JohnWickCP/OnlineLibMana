package org.example.prj.repository;


import org.example.prj.entity.Count;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountRepository extends JpaRepository<Count, Long> {
    Count findTopByOrderByTimestampDesc();
}