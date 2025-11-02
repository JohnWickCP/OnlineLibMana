package org.example.prj.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.prj.DTO.Response.ApiResponse;
import org.example.prj.DTO.Response.DashboardResponse;
import org.example.prj.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ApiResponse<DashboardResponse> getDashboard() {
        return ApiResponse.<DashboardResponse>builder()
                .result(adminService.getDashboard())
                .build();
    }
}
