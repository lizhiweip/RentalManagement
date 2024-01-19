package com.li.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.li.dto.PropertyDto;
import com.li.pojo.Property;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @Author lzw
 * @Date 2024/1/8 17:55
 * @description
 */
@Mapper
public interface PropertyMapper extends BaseMapper<Property> {
    List<PropertyDto> selectProperty();
}
