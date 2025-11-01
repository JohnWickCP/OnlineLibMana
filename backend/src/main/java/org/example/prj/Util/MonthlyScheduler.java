package org.example.prj.Util;

import lombok.RequiredArgsConstructor;
import org.example.prj.service.BookService;
import org.example.prj.service.CountService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MonthlyScheduler {
    private final CountService countService;

    // 00:00 ngày 1 mỗi tháng
    @Scheduled(cron = "0 0 0 1 * *")
    public void scheduleMonthlyCount() {
        countService.createMonthlyCountRecord();
    }
}
