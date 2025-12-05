package com.aivle0102.book.controller;

import com.aivle0102.book.domain.Book;
import com.aivle0102.book.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book")
public class BookController {

    private final BookService bookService;

    // 생성자 주입
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // 1. 도서 목록
    @GetMapping("/list")
    public ResponseEntity<List<Book>> getBookList() {
        return ResponseEntity.ok(bookService.getBookList());
    }

    // 2. 도서 상세
    @GetMapping("/detail/{id}")
    public ResponseEntity<Book> getBookDetail(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookDetail(id));
    }

    // 3. 도서 등록
    @PostMapping("/insert")
    public ResponseEntity<Book> insertBook(@RequestBody Book book) {
        Book saved = bookService.insertBook(book);
        return ResponseEntity.ok(saved);
    }

    // 아래는 파트너 담당 (수정/삭제/URL 업데이트)
    // ...
}
