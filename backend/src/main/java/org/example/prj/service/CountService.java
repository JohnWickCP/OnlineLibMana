package org.example.prj.service;

import lombok.RequiredArgsConstructor;
import org.example.prj.entity.Count;
import org.example.prj.repository.CountRepository;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class CountService implements InitializingBean {

    private final CountRepository countRepository;

    private final AtomicLong currentViewCount = new AtomicLong(0);
    private final AtomicLong currentNewUserCount = new AtomicLong(0);

    @Override
    public void afterPropertiesSet() {
        ensureCurrentMonthRecordExists();
    }

    private void ensureCurrentMonthRecordExists() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1);

        boolean exists = countRepository.existsByTimestampBetween(startOfMonth, endOfMonth);

        if (!exists) {
            Count count = Count.builder()
                    .newUsersQuantity(0L)
                    .viewsQuantity(0L)
                    .timestamp(LocalDateTime.now())
                    .build();

            countRepository.save(count);
            System.out.println("✅ Created new count record for current month.");
        }
    }

    // Khi có người xem trang
    public Long countViews() {
        return currentViewCount.incrementAndGet();
    }

    // Khi có người đăng ký mới
    public void incrementNewUserCount() {
        currentNewUserCount.incrementAndGet();
    }

    // Tạo bản ghi thống kê mỗi tháng (và reset lại bộ đếm)
    @Scheduled(cron = "0 0 0 1 * *") // 0h ngày 1 hằng tháng
    public void createMonthlyCountRecord() {
        Long totalViews = currentViewCount.getAndSet(0);
        Long newUsers = currentNewUserCount.getAndSet(0);

        Count count = Count.builder()
                .newUsersQuantity(newUsers)
                .viewsQuantity(totalViews)
                .timestamp(LocalDateTime.now())
                .build();

        countRepository.save(count);
    }

    // Các phần còn lại (increment, createMonthlyCountRecord...) như trước
}

