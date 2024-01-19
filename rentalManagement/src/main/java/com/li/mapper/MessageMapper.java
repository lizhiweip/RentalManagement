package com.li.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.li.pojo.Message;
import org.apache.ibatis.annotations.Mapper;

/**
 * @Author lzw
 * @Date 2024/1/13 15:28
 * @description
 */
@Mapper
public interface MessageMapper extends BaseMapper<Message> {
}
