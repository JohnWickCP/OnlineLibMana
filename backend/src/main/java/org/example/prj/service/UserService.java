package org.example.prj.service;

import jakarta.transaction.Transactional;
import org.example.prj.DTO.Request.TilteFolder;
import org.example.prj.DTO.Response.BookDisplayResponse;
import org.example.prj.DTO.Response.BookResponse;
import org.example.prj.DTO.Response.ListUserResponse;
import org.example.prj.constant.StatusBook;
import org.example.prj.entity.*;
import org.example.prj.exception.AppException;
import org.example.prj.exception.ErrorCode;
import org.example.prj.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private FavouriteRepository favouriteRepository;
    @Autowired
    private BookshelfItemRepository bookshelfItemRepository;
    @Autowired
    private BookshelfRepository bookshelfRepository;


    @PreAuthorize("hasAuthority('ROLE_SCOPE_ADMIN')")
    public List<ListUserResponse> getListUsers(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);

        return users.stream()
                .map(user -> {
                    ListUserResponse listUserResponse = new ListUserResponse();
                    listUserResponse.setId(user.getId());
                    listUserResponse.setUsername(user.getUsername());
                    listUserResponse.setEmail(user.getEmail());
                    listUserResponse.setActive(user.isActive());
                    listUserResponse.setCreatedAt(user.getCreatedAt());

                    Long want = countBook("WANT", user, null);
                    listUserResponse.setWantQuantity(want);

                    Long reading = countBook("READING", user, null);
                    listUserResponse.setReadingQuantity(reading);

                    Long completed = countBook("COMPLETED", user, null);
                    listUserResponse.setCompletedQuantity(completed);

                    return listUserResponse;
                })
                .toList();
    }


    @PreAuthorize("isAuthenticated()")
    public String addReviewBook(Long bookId, double point) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("________________________________________________________________________");
        System.out.println("Authorities: " + auth.getAuthorities());

        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Review review = user.getReviews().stream()
                .filter(r -> r.getBook().getId().equals(bookId))
                .findFirst()
                .orElse(null);

        if (review == null) {
            review = new Review();
            review.setUser(user);
            review.setBook(book);
            review.setRating(point);
        } else {
            review.setRating(point);
        }

        reviewRepository.save(review);

        if (!user.getReviews().contains(review)) {
            user.getReviews().add(review);
        }

        return "Feedback successfully! Rating: " + point;
    }

    @PreAuthorize("hasAuthority('ROLE_SCOPE_USER')")
    public String addFBFolder(TilteFolder tilteFolder) throws Exception {
        if(favouriteRepository.existsByTitle(tilteFolder.getTitle())) {
            throw new AppException(ErrorCode.FOLDER_EXISTED);
        }
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).get();
        FavouriteBooks favouriteBooks = new FavouriteBooks();
        favouriteBooks.setTitle(tilteFolder.getTitle());
        favouriteBooks.setUser(user);
//        favouriteBooks.setBook(book);
        user.getFavouriteBooks().add(favouriteBooks);
        favouriteRepository.save(favouriteBooks);
        return "Create Successful:" + tilteFolder.getTitle() + " ";
    }

    @PreAuthorize("hasAuthority('ROLE_SCOPE_USER')")
    public String addFB(Long bookId,Long listId){
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).get();
        FavouriteBooks favouriteBooks = user.getFavouriteBooks().stream()
                .filter(f -> f.getId().equals(listId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Favourite list not found"));
        Book book = bookRepository.findById(bookId).get();
        if (favouriteBooks.getBooks().contains(book)) {
            return "Book already in favourite list.";
        }
        favouriteBooks.getBooks().add(book);
        favouriteRepository.save(favouriteBooks);
        return "Add Successful:" + book.getTitle();
    }

//
    @PreAuthorize("isAuthenticated()")
    public List<TilteFolder> getFBFolder() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FavouriteBooks> favouriteBooks = user.getFavouriteBooks();
        List<TilteFolder> folders = favouriteBooks.stream()
                .map(fb -> TilteFolder.builder()
                        .title(fb.getTitle())
                        .id(fb.getId())
                        .count(countBook("FB",user,fb.getId()))
                        .build())
                .toList();

        return folders;
    }

    @PreAuthorize("hasAuthority('ROLE_SCOPE_USER')")
    @Transactional
    public String deleteStatusBook(Long bookId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Bookshelf bookshelf = user.getBookshelf();

        BookshelfItem bookshelfItem = bookshelf.getItems().stream()
                .filter(item -> item.getBook().getId().equals(bookId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Book not found in bookshelf"));

        bookshelf.getItems().remove(bookshelfItem);

        bookshelfItem.setBookshelf(null);

        bookshelfRepository.save(bookshelf);

        return "Deleted book from bookshelf successfully. " + bookId;
    }



    @PreAuthorize("isAuthenticated()")
    public Long countBookByStautus(String status){
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long count = countBook(status,user,null);
        return count;
    }

    @PreAuthorize("isAuthenticated()")
    public String deleteFBfolder(Long id){
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getFavouriteBooks().removeIf(fb -> fb.getId().equals(id));
        userRepository.save(user);
        return "Delete Successful:" + id;
    }

    @PreAuthorize("hasAuthority('ROLE_SCOPE_USER')")
    public List<BookDisplayResponse> getFB(Long Id, Integer page, Integer size) {
        FavouriteBooks favourite = favouriteRepository.findById(Id)
                .orElseThrow(() -> new RuntimeException("Favourite not found"));

        Pageable pageable = PageRequest.of(page, size);

        List<Book> books = favourite.getBooks();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), books.size());

        List<Book> pagedBooks = books.subList(start, end);

        return pagedBooks.stream()
                .map(book -> new BookDisplayResponse(
                        book.getId(),
                        book.getTitle(),
                        book.getAuthor(),
                        book.getDescription(),
                        book.getCoverImage()
                ))
                .toList();

//        FavouriteBooks favouriteBooks = favouriteRepository.findById(favouriteListId)
//                .orElseThrow(() -> new RuntimeException("Favourite list not found"));
//
//        List<Book> books = favouriteBooks.getBooks();
//
//        // Phân trang thủ công
//        int start = page * size;
//        int end = Math.min(start + size, books.size());
//
//        if (start >= books.size()) {
//            return List.of(); // Trả về rỗng nếu page vượt quá số lượng
//        }
//
//        List<Book> pagedBooks = books.subList(start, end);
//
//        return pagedBooks.stream()
//                .map(book -> new BookDisplayResponse(
//                        book.getId(),
//                        book.getTitle(),
//                        book.getAuthor(),
//                        book.getDescription(),
//                        book.getCoverImage()
//                ))
//                .toList();
    }

    @PreAuthorize("hasAuthority('ROLE_SCOPE_USER')")
    @Transactional
    public String addBookByStatus(Long bookId, String status) {
        // 🔹 Lấy user đăng nhập
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔹 Lấy book theo id
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // 🔹 Kiểm tra bookshelf của user
        Bookshelf bookshelf = user.getBookshelf();
        if (bookshelf == null) {
            //  user chưa có bookshelf → tạo mới
            bookshelf = new Bookshelf();
            bookshelf.setUser(user);
            user.setBookshelf(bookshelf);

            //  Lưu bookshelf để có ID (chưa có item)
            bookshelf.setItems(new ArrayList<>());
            bookshelf = bookshelfRepository.save(bookshelf);
        }

        //  Lấy danh sách item hiện tại (tránh null)
        List<BookshelfItem> bookshelfItems = bookshelf.getItems();
        if (bookshelfItems == null) {
            bookshelfItems = new ArrayList<>();
            bookshelf.setItems(bookshelfItems);
        }

        //  Kiểm tra xem sách này đã có trong bookshelf chưa
        Optional<BookshelfItem> existingItemOpt = bookshelfItems.stream()
                .filter(item -> item.getBook().getId().equals(bookId))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            //  Có rồi → cập nhật status
            BookshelfItem existingItem = existingItemOpt.get();
            existingItem.setStatus(StatusBook.valueOf(status));
            bookshelfItemRepository.save(existingItem);

            return " Updated status of book: " + book.getTitle();
        } else {
            //  Chưa có → thêm mới
            BookshelfItem newItem = new BookshelfItem();
            newItem.setBook(book);
            newItem.setStatus(StatusBook.valueOf(status));
            newItem.setBookshelf(bookshelf);

            // 🔹 Lưu item
            bookshelfItemRepository.save(newItem);

            // 🔹 Thêm vào list và cập nhật bookshelf
            bookshelfItems.add(newItem);
            bookshelfRepository.save(bookshelf);

            return " Added new book to bookshelf: " + book.getTitle();
        }
    }

    @PreAuthorize("isAuthenticated()")
    public String deleteFB(Long id,Long listId) {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        FavouriteBooks favouriteBook = user.getFavouriteBooks().stream()
                .filter(fb -> fb.getId().equals(listId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.LIST_NOT_FOUND));

        if (!favouriteBook.getBooks().removeIf(bb -> bb.getId().equals(id))) {
            throw  new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        favouriteRepository.save(favouriteBook);
        return "Delete Successful:" + id;
    }

    @PreAuthorize("isAuthenticated()")
    public Page<BookResponse> getBooksDependOnStatus(String status, Integer page, Integer size) {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StatusBook enumStatus;
        try {
            enumStatus = StatusBook.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }

        List<BookshelfItem> bookshelfItems = user.getBookshelf().getItems();

        List<Book> books = bookshelfItems.stream()
                .filter(item -> item.getStatus() == enumStatus)
                .map(BookshelfItem::getBook)
                .toList();
        System.out.println("----------------------------------------------------------------");
        System.out.println("Bookshelf items: " + books.size());
        int start = page * size;
        int end = Math.min(start + size, books.size());
        if (start >= books.size()) {
            return Page.empty();
        }

        List<BookResponse> pagedBooks = books.subList(start, end).stream()
                .map(book -> new BookResponse(
                        book.getId(),
                        book.getTitle(),
                        book.getAuthor(),
                        book.getDescription(),
                        book.getCoverImage()
                ))
                .toList();
        System.out.println("----------------------------------------------------------------");
        System.out.println("Bookshelf items: " + books.size());
        System.out.println(books.getFirst().getTitle());
        System.out.println(pagedBooks.getFirst().getId());

        Pageable pageable = PageRequest.of(page, size);
        return new PageImpl<>(pagedBooks, pageable, books.size());
    }


//    Count book depend on mode
public Long countBook(String mode, User user, Long listId) {
    if (user == null) {
        return 0L;
    }
    if (mode.equals("FB")) {
        // Nếu FavouriteBooks có thể null
        if (user.getFavouriteBooks() == null) {
            return 0L;
        }
        return user.getFavouriteBooks().stream()
                .filter(fb -> fb.getId().equals(listId))
                .findFirst()
                .map(fb -> (long) fb.getBooks().size())
                .orElse(0L);
    } else {
        if (user.getBookshelf() == null || user.getBookshelf().getItems() == null) {
            return 0L;
        }
        return user.getBookshelf().getItems().stream()
                .filter(bsi -> bsi.getStatus() == StatusBook.valueOf(mode))
                .count();
    }
}
}
