package com.devs.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchemaDTO {
    private Long id;
    private String name;
    private byte[] sourceFile;
    private Date createDate;
    private Date deleteDate;
    private Date updateDate;
    private String description;
    private List<HistoryDTO> history;
    private Integer based;
    private Integer version;
    private String username;
}
