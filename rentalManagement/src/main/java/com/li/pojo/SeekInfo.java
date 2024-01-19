package com.li.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @Author lzw
 * @Date 2024/1/8 9:40
 * @description
 */
@Data
public class SeekInfo implements Serializable {
    @TableId("seekInfoId")
    private String seekInfoId;
    @TableField("seekerId")
    private String seekerId;
    @TableField("seekingType")
    private String seekingType;
    @TableField("desiredLocation")
    private String desiredLocation;
    @TableField("maxRentAmount")
    private BigDecimal maxRentAmount;
    @TableField("otherSeekInfo")
    private String otherSeekInfo;
}
