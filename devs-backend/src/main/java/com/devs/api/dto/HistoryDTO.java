package com.devs.api.dto;

import com.devs.api.entity.History;
import com.devs.api.entity.SchemaHistory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoryDTO {
    private Date createDate;
    private Long id;
    private byte[] sourceFile;
    private Date updateDate;
    private Integer version;
    private UserDTO user;

    public static HistoryDTO convertToHistoryDTO(History history) {
        HistoryDTO historyDTO = new HistoryDTO();
        historyDTO.setCreateDate(history.getCreateDate());
        historyDTO.setId(history.getId());
        historyDTO.setSourceFile(history.getSourceFile());
        historyDTO.setUpdateDate(history.getUpdateDate());
        historyDTO.setVersion(history.getVersion());

        // Convert User to UserDTO
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(history.getUser().getUsername());
        historyDTO.setUser(userDTO);

        return historyDTO;
    }
}
