package com.li.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.li.mapper.MessageMapper;
import com.li.pojo.Message;
import com.li.service.MessageService;
import org.springframework.stereotype.Service;

/**
 * @Author lzw
 * @Date 2024/1/13 15:45
 * @description
 */
@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message> implements MessageService {

}
