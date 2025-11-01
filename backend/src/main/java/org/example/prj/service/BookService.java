package org.example.prj.service;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Request.BookRequest;
import org.example.prj.DTO.Response.BookDisplayResponse;
import org.example.prj.DTO.Response.BookResponse;
import org.example.prj.entity.Book;
import org.example.prj.entity.Count;
import org.example.prj.entity.Review;
import org.example.prj.exception.AppException;
import org.example.prj.exception.ErrorCode;
import org.example.prj.repository.BookRepository;
import org.example.prj.repository.CountRepository;
import org.example.prj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;


@Service
@Slf4j
public class BookService {
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private CountRepository countRepository;
    @Autowired
    private UserRepository userRepository;

    public BookResponse getBook(Long bookId) {
        Book book = bookRepository.getBookById(bookId)
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
                .language(book.getLanguage())
                .subject(book.getSubject())
                .build();
    }

    public Page<BookDisplayResponse> getListBooks(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findAll(pageable);

        return books.map(book -> new BookDisplayResponse(book.getId(),book.getTitle(),book.getAuthor(),
                book.getDescription(),book.getCoverImage()));
    }

    public Page<BookDisplayResponse> getListBooksByTitle(String title, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findByTitle(title,pageable);
        return books.map(book -> new BookDisplayResponse(book.getId(),book.getTitle(),book.getAuthor(),
                book.getDescription(),book.getCoverImage()));
    }

    @PreAuthorize("hasAuthority('ROLE_SCOPE_ADMIN')")
    @Transactional
    public BookResponse addBook(BookRequest bookRequest) {
        Book book = Book.builder()
                .title(bookRequest.getTitle())
                .author(bookRequest.getAuthor())
                .description(bookRequest.getDescription())
                .category(bookRequest.getCategory())
                .coverImage(bookRequest.getCoverImage())
                .fileUrl(bookRequest.getFileUrl())
                .createdAt(bookRequest.getCreatedAt())
                .language(bookRequest.getLanguage())
                .subject(bookRequest.getSubject())
                .build();
        Book savedBook = bookRepository.save(book);

        return BookResponse.builder()
                .id(savedBook.getId())
                .title(savedBook.getTitle())
                .author(savedBook.getAuthor())
                .description(savedBook.getDescription())
                .category(savedBook.getCategory())
                .coverImage(savedBook.getCoverImage())
                .fileUrl(savedBook.getFileUrl())
                .createdAt(savedBook.getCreatedAt())
                .language(savedBook.getLanguage())
                .subject(savedBook.getSubject())
                .build();

    }

    @PreAuthorize("hasAuthority('ROLE_SCOPE_ADMIN')")
    @Transactional
    public BookResponse editBook(BookRequest bookRequest,Long  bookId) {
        Book book = bookRepository.getBookById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // cập nhật các thuộc tính
        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setDescription(bookRequest.getDescription());
        book.setCategory(bookRequest.getCategory());
        book.setCoverImage(bookRequest.getCoverImage());
        book.setFileUrl(bookRequest.getFileUrl());
        book.setCreatedAt(bookRequest.getCreatedAt());
        book.setLanguage(bookRequest.getLanguage());
        book.setSubject(bookRequest.getSubject());

        bookRepository.save(book);

        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .category(book.getCategory())
                .coverImage(book.getCoverImage())
                .fileUrl(book.getFileUrl())
                .createdAt(book.getCreatedAt())
                .language(book.getLanguage())
                .subject(book.getSubject())
                .build();
    }

    @PreAuthorize("hasAuthority('ROLE_SCOPE_ADMIN')")
    public void deleteBook(Long bookId) {
        bookRepository.deleteById(bookId);
        log.info("Delete Successfull");
    }

//    @PreAuthorize("isAuthenticated()")
    public Double displayRating(Long id) {
        return bookRepository.findById(id)
                .map(book -> {
                    List<Review> reviews = book.getReviews();
                    if (reviews == null || reviews.isEmpty()) {
                        return 0.0;
                    }

                    double average = reviews.stream()
                            .mapToDouble(Review::getRating)
                            .average()
                            .orElse(0.0);

                    return average;
                })
                .orElse(0.0);
    }

    // Biến tạm lưu view hiện tại (trong tháng này)
    private final AtomicLong currentViewCount = new AtomicLong(0);

    // Khi gọi API /views => view +1
    public Long countViews() {
        return currentViewCount.incrementAndGet();
    }

    // Hàm chạy tự động mỗi tháng để tạo bản ghi mới
    public void createMonthlyCountRecord() {
        Long newUsers = userRepository.countNewUsersInLastMonth();
        Long totalViews = currentViewCount.getAndSet(0); // lấy số hiện tại rồi reset

        Count count = Count.builder()
                .newUsersQuantity(newUsers)
                .viewsQuantity(totalViews)
                .timestamp(LocalDateTime.now())
                .build();

        countRepository.save(count);
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