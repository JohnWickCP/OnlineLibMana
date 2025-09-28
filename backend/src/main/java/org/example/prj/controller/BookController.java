package org.example.prj.controller;

import org.example.prj.DTO.Request.BookRequest;
import org.example.prj.DTO.Response.ApiResponse;
import org.example.prj.DTO.Response.BookDisplayResponse;
import org.example.prj.DTO.Response.BookResponse;
import org.example.prj.service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/book")
public class BookController {

    private final BookService bookService;
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

//    Add book(Admin)
    @PostMapping("/addBook")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<BookResponse> addBook(@RequestBody BookRequest bookRequest) {
        return ApiResponse.<BookResponse>builder()
                .result(bookService.addBook(bookRequest))
                .build();
    }

//    Edit book(Admin)
    @PostMapping("/editBook/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<BookResponse> editBook(@RequestBody BookRequest bookRequest,
                                              @PathVariable Long id) {
        return ApiResponse.<BookResponse>builder()
                .result(bookService.editBook(bookRequest,id))
                .build();
    }

//    Delete book(Admin)
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }
}
