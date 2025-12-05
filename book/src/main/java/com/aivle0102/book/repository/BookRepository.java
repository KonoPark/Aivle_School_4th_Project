package com.aivle0102.book.repository;

import com.aivle0102.book.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
    // findAll, findById, save, deleteById 등은 JPA가 자동 제공
}
