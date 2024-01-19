package com.li.dto;

import com.li.pojo.Property;
import lombok.Data;

/**
 * @Author lzw
 * @Date 2024/1/8 22:06
 * @description
 */
@Data
public class PropertyDto extends Property {
    private String ownerName;
}
