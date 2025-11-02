package org.example.prj.repository;

import org.example.prj.entity.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DashBoardRepository extends JpaRepository<Dashboard,Long> {
}
