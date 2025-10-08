package org.example.prj.repository;

import org.example.prj.entity.InvalidationTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InValidationTokenRepository extends JpaRepository<InvalidationTokenEntity,Long> {
    boolean existsById(String id);
}
