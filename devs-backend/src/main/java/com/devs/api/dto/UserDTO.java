package com.devs.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import javax.validation.constraints.Email;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO
{
    private Long id;
    private String firstName;
    private String lastName;
    @Email
    private String email;
    private String username;
    private String university;
    private String country;
    private String occupation;
    private String password;
    private String role;
    private Date deleteDate;
}
