package com.aivle0102.book.service;

import com.aivle0102.book.domain.Book;

import java.util.List;

public interface BookService {

    // 1) 도서 목록 (/book/list)
    List<Book> getBookList();

    // 2) 도서 상세 (/book/detail/{id})
    Book getBookDetail(Long id);

    // 3) 도서 등록 (/book/insert)
    Book insertBook(Book book);

    // 4) 도서 수정 (/book/update/{id})
    Book updateBook(Long id, Book book);

    // 5) 도서 삭제 (/book/delete/{id})
    void deleteBook(Long id);

    // 6) AI 표지 이미지 URL 저장 (/book/{id}/createImg)
    Book updateCoverUrl(Long id, String coverImageUrl);
}
