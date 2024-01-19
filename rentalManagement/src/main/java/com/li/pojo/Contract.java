package com.li.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * @Author lzw
 * @Date 2024/1/8 10:29
 * @description
 */
@Data
public class Contract implements Serializable {
    @TableId("contractId")
    private String contractId;
    @TableField("propertyId")
    private String propertyId;
    @TableField("landlordId")
    private String landlordId;//房东的userId;
    @TableField("tenantId")
    private String tenantId;//租户的userId;
    @TableField("contractStartDate")
    private LocalDateTime contractStartDate;
    @TableField("contractEndDate")
    private LocalDateTime contractEndDate;
    @TableField("contractAmount")
    private BigDecimal contractAmount;
    @TableField("otherContractInfo")
    private String otherContractInfo;
    @TableField("status")
    private Integer status;
}
