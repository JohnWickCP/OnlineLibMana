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

//    Display book when click book(public)
    @GetMapping("/{id}")
    public ApiResponse<BookResponse> getBook(@PathVariable Long id) {
        return ApiResponse.<BookResponse>builder()
                .result(bookService.getBook(id))
                        .build();
    }

//    Get list book(public)
    @GetMapping
    public ApiResponse<Page<BookDisplayResponse>> getBooks(@RequestParam(defaultValue = "0") Integer page,
                                                           @RequestParam(defaultValue = "20") Integer size){
        return ApiResponse.<Page<BookDisplayResponse>>builder()
                .result(bookService.getListBooks(page,size))
                .build();
    }

//    Search book(public)
    @GetMapping("/{title}")
    public ApiResponse<Page<BookDisplayResponse>> getBook(@PathVariable String title,
                                                          @RequestParam(defaultValue = "0") Integer page,
                                                          @RequestParam(defaultValue = "20") Integer size){
        return ApiResponse.<Page<BookDisplayResponse>>builder()
                .result(bookService.getListBooksByTitle(title,page,size))
                .build();
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
