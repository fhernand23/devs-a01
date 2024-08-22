package com.devs.api.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name")
    private String name;

    @Column(name = "userId")
    private Long userId;

    @NotNull
    @Column(name = "createDate", nullable = false)
    private Date createDate;

    @Column(name = "deleteDate", nullable = true)
    private Date deleteDate;

    @Column(name = "updateDate", nullable = true)
    private Date updateDate;
}