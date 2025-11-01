package org.example.prj.controller;

import org.example.prj.DTO.Request.BookRequest;
import org.example.prj.DTO.Response.ApiResponse;
import org.example.prj.DTO.Response.BookDisplayResponse;
import org.example.prj.DTO.Response.BookResponse;
import org.example.prj.service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/book")
public class BookController {

    private final BookService bookService;
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

//    Display book when click book(public)
    @GetMapping("/id/{id}")
    public ApiResponse<BookResponse> getBook(@PathVariable Long id) {
        return ApiResponse.<BookResponse>builder()
                .result(bookService.getBook(id))
                        .build();
    }

//    Get list book(public)
    @GetMapping("/listbooks")
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
    public ApiResponse<BookResponse> addBook(@RequestBody BookRequest bookRequest) {
        return ApiResponse.<BookResponse>builder()
                .result(bookService.addBook(bookRequest))
                .build();
    }

//    Edit book(Admin)
    @PostMapping("/editBook/{id}")
    public ApiResponse<BookResponse> editBook(@RequestBody BookRequest bookRequest,
                                              @PathVariable Long id) {
        return ApiResponse.<BookResponse>builder()
                .result(bookService.editBook(bookRequest,id))
                .build();
    }

//    Delete book(Admin)
    @DeleteMapping("/delete/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

//    Display rating(public)
    @GetMapping("/rating/{bookId}")
    public ApiResponse<Double> displayRating(@PathVariable Long bookId){
        return ApiResponse.<Double>builder()
                .result(bookService.displayRating(bookId))
                .build();
    }

//    Count view(Admin)
    @PostMapping("/views")
    public ApiResponse<Long> countViews(){
        return ApiResponse.<Long>builder()
                .result(bookService.countViews())
                .build();
    }
}
