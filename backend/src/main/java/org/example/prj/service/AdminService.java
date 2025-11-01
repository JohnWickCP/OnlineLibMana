package org.example.prj.service;

import lombok.extern.slf4j.Slf4j;
import org.example.prj.entity.Count;
import org.example.prj.entity.Dashboard;
import org.example.prj.repository.BookRepository;
import org.example.prj.repository.CountRepository;
import org.example.prj.repository.DashBoardRepository;
import org.example.prj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;


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

    @PreAuthorize("hasAuthority('ROLE_SCOPE_ADMIN')")
    public Dashboard getDashboard(){

        Dashboard dashboard = new Dashboard();
        dashboard.setTotalBooks(bookRepository.count());
        dashboard.setNewUsersQuantity(userRepository.countNewUsersInLastMonth());
        dashboard.setTotalUsers(userRepository.count());
        dashboard.setView(countRepository.findTopByOrderByTimestampDesc().getViewsQuantity());
        dashboard.setStartDay(countRepository.findTopByOrderByTimestampDesc().getTimestamp());
//        dashboard.setTotalBooks(bookRepository.findAll().size());
//        dashboard.setTotalUsers(userRepository.findAll().size());
//        Count dashboard = new Count();
//        dashboard.setView(countRepository.);
        dashBoardRepository.save(dashboard);
        return dashboard;
    }
}
