package com.li.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

/**
 * @Author lzw
 * @Date 2024/1/13 15:26
 * @description
 */
@Data
public class Message {
    @TableId("messageId")
    private String messageId;
    @TableField("userId")
    private String userId;
    @TableField("propertyId")
    private String propertyId;
}
