package org.example.prj.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Request.PointRequest;
import org.example.prj.DTO.Request.TilteFolder;
import org.example.prj.DTO.Response.ApiResponse;
import org.example.prj.DTO.Response.BookDisplayResponse;
import org.example.prj.DTO.Response.BookResponse;
import org.example.prj.entity.User;
import org.example.prj.repository.UserRepository;
import org.example.prj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
public class UserCotroller {
//    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

//    Test
    @GetMapping("/listUser")
    public List<User> getUsers() {
        return userRepository.findAll();
    }


//    Book review
    @PostMapping("/reviewBook/{bookId}")
    public ApiResponse<String> addReviewBook(@PathVariable("bookId") Long bookId,@RequestBody PointRequest pointRequest) {
//        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<String>builder()
//                .result(userService.addReviewBook(username,bookId, pointRequest.getPoint()))
                .result(userService.addReviewBook(bookId, pointRequest.getPoint()))
                .build();
    }
//    Add favourite book folder
    @PostMapping("/addFBfolder")
    public ApiResponse<String> addFBFolder(@RequestBody TilteFolder tilteFolder) {
        return ApiResponse.<String>builder()
                .result(userService.addFBFolder(tilteFolder))
                .build();
    }
//    Add favourite book(User)
    @PostMapping("/addFB/{bookId}/favourites/{listId}")
    public ApiResponse<String> addFB(@PathVariable("bookId") Long bookId,
                                     @PathVariable("listId") Long listId) {
        return ApiResponse.<String>builder()
                .result(userService.addFB(bookId,listId))
                .build();
    }

//    Display favourite book(user)
    @GetMapping("/fb/{listId}")
    public ApiResponse<List<BookDisplayResponse>> getFB(@PathVariable("listId") Long id,
                                                        @RequestParam(defaultValue = "0") Integer page,
                                                        @RequestParam(defaultValue = "20") Integer size) {
        return ApiResponse.<List<BookDisplayResponse>>builder()
                .result(userService.getFB(id,page,size))
                .build();
    }

//    Add book for statusBook
    @PostMapping("/addBookByStatus/{bookId}/{status}")
    public ApiResponse<String> addBookByStatus(@PathVariable Long bookId, @PathVariable("status") String status){
        return ApiResponse.<String>builder()
                .result(userService.addBookByStatus(bookId,status))
                .build();
    }

//    Display status Listbook(user)
    @GetMapping("/books/{status}")
    public ApiResponse<Page<BookResponse>> getBooksDependOnStatus(@PathVariable("status") String status,
                                                                  @RequestParam(defaultValue = "0") Integer page,
                                                                  @RequestParam(defaultValue = "20") Integer size) {
        return ApiResponse.<Page<BookResponse>>builder()
                .result(userService.getBooksDependOnStatus(status,page,size))
                .build();
    }
}
