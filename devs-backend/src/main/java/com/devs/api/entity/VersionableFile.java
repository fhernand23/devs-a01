package com.devs.api.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class VersionableFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", length = 255)
    private String name;

    @Lob
    @Type(type = "org.hibernate.type.BinaryType")
    @Column(name = "sourceFile")
    private byte[] sourceFile;

    @Column(name = "version")
    private Integer version;

    @Column(name = "based", nullable = true)
    private Integer based;

    @NotNull
    @Column(name = "createDate", nullable = false)
    private Date createDate;

    @Column(name = "deleteDate", nullable = true)
    private Date deleteDate;

    @Column(name = "updateDate", nullable = true)
    private Date updateDate;

    @NotNull
    @Column(name = "description", length = 255)
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}