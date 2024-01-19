package com.li.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.li.mapper.PropertyMapper;
import com.li.pojo.Property;
import com.li.service.PropertyService;
import org.springframework.stereotype.Service;

/**
 * @Author lzw
 * @Date 2024/1/8 20:49
 * @description
 */
@Service
public class PropertyServiceImpl extends ServiceImpl<PropertyMapper, Property> implements PropertyService {
}
