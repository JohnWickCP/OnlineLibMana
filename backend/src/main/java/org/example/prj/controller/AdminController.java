package org.example.prj.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Response.ApiResponse;
import org.example.prj.entity.Dashboard;
import org.example.prj.service.AdminService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;


@Slf4j
@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ApiResponse<Dashboard> getDashboard() {
        return ApiResponse.<Dashboard>builder()
                .result(adminService.getDashboard())
                .build();
    }
}
