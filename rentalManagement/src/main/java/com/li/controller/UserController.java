package com.li.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.li.common.R;
import com.li.common.UniqueIdGenerator;
import com.li.dto.ContractDto;
import com.li.pojo.*;
import com.li.service.ContractService;
import com.li.service.MessageService;
import com.li.service.PropertyService;
import com.li.service.SeekInfoService;
import com.li.service.impl.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


/**
 * @Author lzw
 * @Date 2024/1/8 20:53
 * @description
 */
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private PropertyService propertyService;
    @Autowired
    private SeekInfoService seekInfoService;
    @Autowired
    private ContractService contractService;
    @Autowired
    private MessageService messageService;

    @PostMapping("/login")
    public R<User> login(String email, String password){
        System.out.println("email:"+email+" "+"password"+password);
        if(email == null || password == null){
            return R.error("账号或密码为空!");
        }
        LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
        userLambdaQueryWrapper.eq(email!=null,User::getEmail,email);
        User user = userService.getOne(userLambdaQueryWrapper);
        if(user == null){
            return R.error("用户不存在，请检查用户名是否正确");
        }
        if(password.equals(user.getPassWord())){
            return R.success(user);
        }else{
            return R.error("密码错误!");
        }
    }

    @PostMapping("/sign")
    public R<User> sign(@RequestBody User user){
        String email = user.getEmail();
        LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
        userLambdaQueryWrapper.eq(email != null,User::getEmail,email);
        if(userService.getOne(userLambdaQueryWrapper) != null){
            return R.error("该邮箱账号已被注册!");
        }else {
            user.setUserId(UniqueIdGenerator.generateUniqueId());
            userService.save(user);
            return R.success(user);
        }
    }

    @PostMapping("/update")
   public R<User> update(@RequestBody User user){
        String email = user.getEmail();
        LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
        userLambdaQueryWrapper.eq(email != null,User::getEmail,email);
        User user1 = userService.getOne(userLambdaQueryWrapper);
        if(user1 == null) return R.error("出现错误!");
        user.setUserId(user1.getUserId());
        userService.updateById(user);
        return R.success(user);
    }

    @PostMapping("/delete")
    public R<String> delete(@RequestBody User user){
        String email = user.getEmail();
        if (email == null){
            return R.error("出现错误!");
        }
        LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
        userLambdaQueryWrapper.eq(email != null,User::getEmail,email);
        userService.remove(userLambdaQueryWrapper);
        return R.success("注销成功!");
    }

    @GetMapping("/getUser")
    public R<User> getUserById(String userId){
        if(userId == null){
            return R.error("请先登录");
        }
        LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
        userLambdaQueryWrapper.eq(userId!=null,User::getUserId,userId);
        User user = userService.getOne(userLambdaQueryWrapper);
        if(user == null){
            return R.error("找不到用户");
        }else{
            return R.success(user);
        }
    }

    @GetMapping("/property")
    public R<List<Property>> propertyList(String userId){
        if(userId == null){
            return R.error("请先登录");
        }
        LambdaQueryWrapper<Property> propertyLambdaQueryWrapper = new LambdaQueryWrapper<>();
        propertyLambdaQueryWrapper.eq(userId!=null,Property::getOwnerId,userId);
        List<Property> list = propertyService.list(propertyLambdaQueryWrapper);
        return R.success(list);
    }

    @GetMapping("/seekinfo")
    public R<List<SeekInfo>> seekInfoList(String userId){
        if(userId == null){
            return R.error("请先登录");
        }
        LambdaQueryWrapper<SeekInfo> seekInfoLambdaQueryWrapper = new LambdaQueryWrapper<>();
        seekInfoLambdaQueryWrapper.eq(userId!=null, SeekInfo::getSeekerId,userId);
        List<SeekInfo> list = seekInfoService.list(seekInfoLambdaQueryWrapper);
        return R.success(list);
    }

    @GetMapping("/contract")
    public R<List<ContractDto>> contractList(String userId){
        if(userId == null){
            return R.error("请先登录");
        }
        //房东身份的合同
        List<Contract> list = new ArrayList<>();
        LambdaQueryWrapper<Contract> contractLambdaQueryWrapper = new LambdaQueryWrapper<>();
        contractLambdaQueryWrapper.eq(userId!=null,Contract::getLandlordId,userId);
        list = contractService.list(contractLambdaQueryWrapper);
        //租户身份的合同
        List<Contract> list2 = new ArrayList<>();
        LambdaQueryWrapper<Contract> contractLambdaQueryWrapper2 = new LambdaQueryWrapper<>();
        contractLambdaQueryWrapper2.eq(userId!=null,Contract::getTenantId,userId);
        list2 = contractService.list(contractLambdaQueryWrapper2);
        //把list2合到list1中
        for(Contract contract : list2){
            list.add(contract);
        }
        //把list的东西复制到dtoList
        List<ContractDto> contractDtoList = new ArrayList<>();
        for(Contract contract : list){
            ContractDto contractDto = new ContractDto();
            BeanUtils.copyProperties(contract, contractDto);
            String landlordId = contract.getLandlordId();
            LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
            userLambdaQueryWrapper.eq(landlordId!=null, User::getUserId, landlordId);
            User landlord = userService.getOne(userLambdaQueryWrapper);
            contractDto.setLandName(landlord.getUserName());
            String tenantId = contract.getTenantId();
            LambdaQueryWrapper<User> userLambdaQueryWrapper2 = new LambdaQueryWrapper<>();
            userLambdaQueryWrapper2.eq(tenantId!=null,User::getUserId, tenantId);
            User tenant = userService.getOne(userLambdaQueryWrapper2);
            contractDto.setTenantName(tenant.getUserName());
            String propertyId = contract.getPropertyId();
            LambdaQueryWrapper<Property> propertyLambdaQueryWrapper = new LambdaQueryWrapper<>();
            propertyLambdaQueryWrapper.eq(propertyId!=null,Property::getPropertyId,propertyId);
            Property property = propertyService.getOne(propertyLambdaQueryWrapper);
            contractDto.setArea(property.getArea());
            contractDto.setAddress(property.getAddress());
            contractDto.setPropertyType(property.getPropertyType());
            contractDtoList.add(contractDto);
        }
        return R.success(contractDtoList);
    }

    @GetMapping("/message")
    public R<List<Property>> getMessage(String userId){
        if(userId == null){
            return R.error("出现问题，请重试！");
        }
        LambdaQueryWrapper<Message> messageLambdaQueryWrapper = new LambdaQueryWrapper<>();
        messageLambdaQueryWrapper.eq(userId!=null, Message::getUserId, userId);
        List<Message> list = messageService.list(messageLambdaQueryWrapper);
        List<Property> propertyList = new ArrayList<>();
        for(Message message : list){
            String propertyId = message.getPropertyId();
            LambdaQueryWrapper<Property> propertyLambdaQueryWrapper = new LambdaQueryWrapper<>();
            propertyLambdaQueryWrapper.eq(propertyId!=null, Property::getPropertyId, propertyId);
            Property property = propertyService.getOne(propertyLambdaQueryWrapper);
            propertyList.add(property);
        }
        return R.success(propertyList);
    }




}
