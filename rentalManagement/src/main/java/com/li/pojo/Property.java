package com.li.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @Author lzw
 * @Date 2024/1/8 9:36
 * @description
 */
@Data
public class Property implements Serializable {
    @TableId("propertyId")
    private String propertyId;
    @TableField("ownerId")
    private String ownerId;
    @TableField("propertyType")
    private String propertyType;
    @TableField("address")
    private String address;
    @TableField("area")
    private Float area;
    @TableField("rentAmount")
    private BigDecimal rentAmount;

    @TableField("status")
    private Integer status;

    @TableField("otherInfo")
    private String otherInfo;
}
