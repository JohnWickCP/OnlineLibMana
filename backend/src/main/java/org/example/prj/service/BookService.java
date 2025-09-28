package org.example.prj.service;

import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Request.BookRequest;
import org.example.prj.DTO.Response.BookDisplayResponse;
import org.example.prj.DTO.Response.BookResponse;
import org.example.prj.entity.Book;
import org.example.prj.exception.AppException;
import org.example.prj.exception.ErrorCode;
import org.example.prj.repository.BookRepositytory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Slf4j
public class BookService {
    @Autowired
    private BookRepositytory bookRepositytory;

    public BookResponse getBook(Long bookId) {
        Book book = bookRepositytory.getBookById(bookId)
                .orElseThrow(()->new AppException(ErrorCode.BOOK_NOT_FOUND));
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .category(book.getCategory())
                .coverImage(book.getCoverImage())
                .fileUrl(book.getFileUrl())
                .createdAt(book.getCreatedAt())
                .build();
    }

    public Page<BookDisplayResponse> getListBooks(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepositytory.findAll(pageable);

        return books.map(book -> new BookDisplayResponse(book.getId(),book.getTitle(),book.getAuthor(),book.getCoverImage()));
    }

    public Page<BookDisplayResponse> getListBooksByTitle(String title, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepositytory.findByTitle(title,pageable);
        return books.map(book -> new BookDisplayResponse(book.getId(),book.getTitle(),book.getAuthor(),book.getCoverImage()));
    }

    public BookResponse addBook(BookRequest bookRequest) {
        Book book = Book.builder()
                .title(bookRequest.getTitle())
                .author(bookRequest.getAuthor())
                .description(bookRequest.getDescription())
                .category(bookRequest.getCategory())
                .coverImage(bookRequest.getCoverImage())
                .fileUrl(bookRequest.getFileUrl())
                .createdAt(bookRequest.getCreatedAt())
                .build();
        bookRepositytory.save(book);
        return BookResponse.builder()
                .title(bookRequest.getTitle())
                .author(bookRequest.getAuthor())
                .description(bookRequest.getDescription())
                .category(bookRequest.getCategory())
                .coverImage(bookRequest.getCoverImage())
                .fileUrl(bookRequest.getFileUrl())
                .createdAt(bookRequest.getCreatedAt())
                .build();
    }

    public BookResponse editBook(BookRequest bookRequest,Long  bookId) {
        Book book = bookRepositytory.getBookById(bookId)
                .orElseThrow(()->new AppException(ErrorCode.BOOK_NOT_FOUND));
        book = Book.builder()
                .title(bookRequest.getTitle())
                .author(bookRequest.getAuthor())
                .description(bookRequest.getDescription())
                .category(bookRequest.getCategory())
                .coverImage(bookRequest.getCoverImage())
                .fileUrl(bookRequest.getFileUrl())
                .createdAt(bookRequest.getCreatedAt())
                .build();
        bookRepositytory.save(book);

        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .category(book.getCategory())
                .coverImage(book.getCoverImage())
                .fileUrl(book.getFileUrl())
                .createdAt(book.getCreatedAt())
                .build();
    }

    public void deleteBook(Long bookId) {
        bookRepositytory.deleteById(bookId);
        log.info("Delete Successfull");
    }


}




//private Long id;
//private String title;
//private String author;
//private String description;
//private String category;
//private String coverImage;
//private String fileUrl;
//private LocalDateTime createdAt;