package com.li.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.li.common.R;
import com.li.common.UniqueIdGenerator;
import com.li.pojo.Message;
import com.li.pojo.Property;
import com.li.pojo.User;
import com.li.service.MessageService;
import com.li.service.PropertyService;
import com.li.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.swing.*;
import java.io.Serializable;
import java.security.PublicKey;
import java.util.Collection;
import java.util.List;

/**
 * @Author lzw
 * @Date 2024/1/13 15:47
 * @description
 */
@Slf4j
@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageService messageService;
    @Autowired
    private UserService userService;
    @Autowired
    private PropertyService propertyService;

    @PostMapping("/send")
    public R<String> save(String userId, String propertyId){
        if(userId == null || propertyId==null){
            return R.error("出现问题，请重试");
        }
        LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
        userLambdaQueryWrapper.eq(userId!=null, User::getUserId, userId);
        User user = userService.getOne(userLambdaQueryWrapper);
        if(user == null){
            return R.error("找不到用户");
        }
        LambdaQueryWrapper<Property> propertyLambdaQueryWrapper = new LambdaQueryWrapper<>();
        propertyLambdaQueryWrapper.eq(propertyId!=null, Property::getPropertyId, propertyId);
        Property property = propertyService.getOne(propertyLambdaQueryWrapper);
        if(property == null){
            return R.error("找不到房产");
        }
        Message message = new Message();
        message.setMessageId(UniqueIdGenerator.generateUniqueId());
        message.setPropertyId(propertyId);
        message.setUserId(userId);
        messageService.save(message);
        return R.success("发送成功");
    }

    @Transactional
    @DeleteMapping("/delete")
    public R<String> delete(String userId, String propertyId){
        if(userId == null || propertyId == null){
            return R.error("出现错误，请重试！");
        }
        LambdaQueryWrapper<Message> messageLambdaQueryWrapper = new LambdaQueryWrapper<>();
        messageLambdaQueryWrapper.eq(userId!=null, Message::getUserId, userId);
        messageLambdaQueryWrapper.eq(propertyId!=null, Message::getPropertyId, propertyId);
        messageService.remove(messageLambdaQueryWrapper);
        return R.success("删除成功");
    }





}
