package org.example.prj.service;

import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Response.DashboardResponse;
import org.example.prj.entity.BookRating;
import org.example.prj.entity.Count;
import org.example.prj.entity.Dashboard;
import org.example.prj.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private CountRepository countRepository;
    @Autowired
    private DashBoardRepository dashBoardRepository;
    @Autowired
    private BookRatingDistributionRepository bookRatingDistributionRepository;

    @PreAuthorize("hasAuthority('ROLE_SCOPE_ADMIN')")
    public DashboardResponse getDashboard(){
        DashboardResponse dashboardResponse = new DashboardResponse();
        dashboardResponse.setTotalBooks(bookRepository.count());
        dashboardResponse.setNewUsersQuantity(userRepository.countNewUsersInLastMonth());
        dashboardResponse.setTotalUsers(userRepository.count());
        dashboardResponse.setView(countRepository.findTopByOrderByTimestampDesc().getViewsQuantity());
        dashboardResponse.setStartDay(countRepository.findTopByOrderByTimestampDesc().getTimestamp());
        dashboardResponse.setRating(calculateBookRating());
        dashboardResponse.setUsers(monthlyUsers());
//        Dashboard dashboard = new Dashboard();
//        dashboard.setTotalBooks(bookRepository.count());
//        dashboard.setNewUsersQuantity(userRepository.countNewUsersInLastMonth());
//        dashboard.setTotalUsers(userRepository.count());
//        dashboard.setView(countRepository.findTopByOrderByTimestampDesc().getViewsQuantity());
//        dashboard.setStartDay(countRepository.findTopByOrderByTimestampDesc().getTimestamp());

//        dashboard.setTotalBooks(bookRepository.findAll().size());
//        dashboard.setTotalUsers(userRepository.findAll().size());
//        Count dashboard = new Count();
//        dashboard.setView(countRepository.);
//        dashBoardRepository.save(dashboard);
        return dashboardResponse;
    }

    public List<BookRating> calculateBookRating(){
        return bookRatingDistributionRepository.findAll();
    }

    public List<Long> monthlyUsers() {
        List<Count> latest = countRepository.findTop3ByOrderByTimestampDesc();

        // Nếu rỗng thì trả về list [0, 0, 0]
        if (latest.isEmpty()) {
            return Arrays.asList(0L, 0L, 0L);
        }

        List<Long> result = latest.stream()
                .map(Count::getNewUsersQuantity)
                .collect(Collectors.toList());

        Collections.reverse(result);

        while (result.size() < 3) {
            result.add(0, 0L);
        }

        return result;
    }


}
