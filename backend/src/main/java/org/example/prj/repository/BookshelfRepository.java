package org.example.prj.repository;

import org.example.prj.entity.Bookshelf;
import org.springframework.data.repository.CrudRepository;

public interface BookshelfRepository extends CrudRepository<Bookshelf, Long> {
}
