package com.li.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import com.li.pojo.Contract;
import lombok.Data;

/**
 * @Author lzw
 * @Date 2024/1/10 10:19
 * @description
 */
@Data
public class ContractDto extends Contract {
    private String landName;
    private String tenantName;
    private String propertyType;
    private String address;
    private Float area;
}
