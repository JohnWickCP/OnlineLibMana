package org.example.prj.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // guest / user / admin
    private String description;

    @OneToMany(mappedBy = "role")
    private List<User> users;

    // getters and setters
}
