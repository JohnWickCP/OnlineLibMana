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
        LocalDateTime startOfMonth = now.withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1);

        boolean exists = countRepository.existsByTimestampBetween(startOfMonth, endOfMonth);

        if (!exists) {
            Count count = Count.builder()
                    .newUsersQuantity(0L)
                    .viewsQuantity(0L)
                    .timestamp(LocalDateTime.now())
                    .build();

            countRepository.save(count);
            System.out.println(" Created new count record for current month.");
        }
    }

    // Khi có người xem trang
    public void incrementViewCount() {
        currentViewCount.incrementAndGet();
    }

    // Khi có người đăng ký mới
    public void incrementNewUserCount() {
        currentNewUserCount.incrementAndGet();
    }

    // Flush tạm vào DB mỗi 1 giờ (để không mất dữ liệu)
    @Scheduled(cron = "0 0 * * * *")
    public void flushToDatabase() {
        Long viewsToAdd = currentViewCount.getAndSet(0);
        Long usersToAdd = currentNewUserCount.getAndSet(0);

        Count current = getCurrentMonthRecord();
        current.setViewsQuantity(current.getViewsQuantity() + viewsToAdd);
        current.setNewUsersQuantity(current.getNewUsersQuantity() + usersToAdd);

        countRepository.save(current);
        System.out.println("💾 Flushed to DB at: " + LocalDateTime.now());
    }

    // Tạo bản ghi thống kê mới vào đầu tháng
    @Scheduled(cron = "0 0 0 1 * *")
    public void createMonthlyCountRecord() {
        ensureCurrentMonthRecordExists();
    }

    // Lấy thống kê tính đến thời điểm hiện tại
    public Count getCurrentStats() {
        Count current = getCurrentMonthRecord();
        long totalViews = current.getViewsQuantity() + currentViewCount.get();
        long totalUsers = current.getNewUsersQuantity() + currentNewUserCount.get();

        Count snapshot = new Count();
        snapshot.setViewsQuantity(totalViews);
        snapshot.setNewUsersQuantity(totalUsers);
        snapshot.setTimestamp(current.getTimestamp());
        return snapshot;
    }

    private Count getCurrentMonthRecord() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1);
        return countRepository.findTopByTimestampBetween(startOfMonth, endOfMonth)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi tháng hiện tại"));
    }
}
