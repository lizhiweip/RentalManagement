package com.li.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;


import java.io.Serializable;

/**
 * @Author lzw
 * @Date 2024/1/8 9:29
 * @description
 */
@Data
public class User implements Serializable {
    @TableId("userId")
    private String userId;
    @TableField("userName")
    private String userName;
    @TableField("passWord")
    private String passWord;
    @TableField("email")
    private String email;
    @TableField("phoneNumber")
    private String phoneNumber;
    @TableField("description")
    private String description;
    @TableField("role")
    private Integer role;//0是房东，1是租户，-1是管理员
}
