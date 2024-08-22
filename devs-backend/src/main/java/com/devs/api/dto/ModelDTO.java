package com.devs.api.dto;

import com.devs.api.entity.ModelHistory;
import com.devs.api.entity.Tag;
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
public class ModelDTO {
    private Long id;
    private String name;
    private byte[] sourceFile;
    private List<Tag> tags;
    private Integer version;
    private Date createDate;
    private Date deleteDate;
    private Date updateDate;
    private Boolean favorite;
    private List<HistoryDTO> history;
    private String description;
    private Integer based;
    private String username;
}
