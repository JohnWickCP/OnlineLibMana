package org.example.prj.service;

import lombok.extern.slf4j.Slf4j;
import org.example.prj.entity.Dashboard;
import org.example.prj.repository.BookRepository;
import org.example.prj.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Slf4j
@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    @PreAuthorize("hasAuthority('ROLE_SCOPE_ADMIN')")
    public Dashboard getDashboard(){
        Dashboard dashboard = new Dashboard();
        dashboard.setTotalBooks(bookRepository.findAll().size());
        dashboard.setTotalUsers(userRepository.findAll().size());
        return dashboard;
    }
}
