package org.example.prj.controller;

import com.nimbusds.jose.JOSEException;
import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Request.AuthenticationRequest;
import org.example.prj.DTO.Request.LogoutRequest;
import org.example.prj.DTO.Request.TilteFolder;
import org.example.prj.DTO.Response.ApiResponse;
import org.example.prj.DTO.Response.AuthenticationResponse;
import org.example.prj.DTO.Response.BookDisplayResponse;
import org.example.prj.DTO.Response.BookResponse;
import org.example.prj.exception.AppException;
import org.example.prj.repository.UserRepository;
import org.example.prj.service.AuthenticationService;
import org.example.prj.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Slf4j
@RestController
@RequestMapping("/home")
public class UserCotroller {
//    private UserRepository userRepository;
    private UserService userService;
//    Book review
    @GetMapping("/reviewBook/{bookId}")
    public ApiResponse<String> addReviewBook(@RequestParam("bookId") Long bookId,Double point) {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<String>builder()
                .result(userService.addReviewBook(username,bookId,point))
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
    public ApiResponse<String> addFB(@RequestParam("bookId") Long bookId,
                                     @RequestBody Long listId) {
        return ApiResponse.<String>builder()
                .result(userService.addFB(bookId,listId))
                .build();
    }

//    Display favourite book(user)
    @GetMapping("/fb")
    public ApiResponse<List<BookDisplayResponse>> getFB(@RequestParam("listId") Long id,
                                                        @RequestParam(defaultValue = "0") Integer page,
                                                        @RequestParam(defaultValue = "20") Integer size) {
        return ApiResponse.<List<BookDisplayResponse>>builder()
                .result(userService.getFB(id,page,size))
                .build();
    }

//    Edit status book(user)
    @PostMapping("/editStatus/{bookId}/{status}")
    public ApiResponse<String> editStatus(@PathVariable Long bookId, @RequestParam("status") String status) {
        return ApiResponse.<String>builder()
                    .result(userService.editStatusBook(bookId,status))
                .build();
    }

//    Display status Listbook(user)
    @GetMapping("/books/{status}")
    public ApiResponse<Page<BookResponse>> getBooksDependOnStatus(@RequestParam("status") String status,
                                                                  @RequestParam(defaultValue = "0") Integer page,
                                                                  @RequestParam(defaultValue = "20") Integer size) {
        return ApiResponse.<Page<BookResponse>>builder()
                .result(userService.getBooksDependOnStatus(status,page,size))
                .build();
    }
}
