package com.aivle0102.book.service.impl;

import com.aivle0102.book.domain.Book;
import com.aivle0102.book.repository.BookRepository;
import com.aivle0102.book.service.BookService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    // 생성자 주입
    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // ===== 네가 담당한 3개 =====

    // 1) 도서 목록 조회
    @Override
    public List<Book> getBookList() {
        return bookRepository.findAll();
    }

    // 2) 도서 상세 조회
    @Override
    public Book getBookDetail(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 ID의 도서를 찾을 수 없습니다. id=" + id));
    }

    // 3) 도서 등록
    @Override
    public Book insertBook(Book book) {
        LocalDateTime now = LocalDateTime.now();
        book.setCreatedAt(now);
        book.setUpdatedAt(now);
        return bookRepository.save(book);
    }

    // ===== 파트너 담당 (기본 구현 예시) =====

    // 4) 도서 수정
    @Override
    public Book updateBook(Long id, Book update) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 ID의 도서를 찾을 수 없습니다. id=" + id));

        book.setTitle(update.getTitle());
        book.setContent(update.getContent());
        book.setCoverImageUrl(update.getCoverImageUrl());
        book.setUpdatedAt(LocalDateTime.now());

        return bookRepository.save(book);
    }

    // 5) 도서 삭제
    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    // 6) AI 표지 이미지 URL 업데이트
    @Override
    public Book updateCoverUrl(Long id, String coverImageUrl) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 ID의 도서를 찾을 수 없습니다. id=" + id));

        book.setCoverImageUrl(coverImageUrl);
        book.setUpdatedAt(LocalDateTime.now());

        return bookRepository.save(book);
    }
}
