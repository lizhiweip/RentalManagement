package com.li.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.li.common.R;
import com.li.common.UniqueIdGenerator;
import com.li.dto.ContractDto;
import com.li.pojo.Contract;
import com.li.pojo.Property;
import com.li.pojo.User;
import com.li.service.ContractService;
import com.li.service.PropertyService;
import com.li.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @Author lzw
 * @Date 2024/1/8 20:56
 * @description
 */
@Slf4j
@RestController
@RequestMapping("/contract")
public class ContractController {
    @Autowired
    private ContractService contractService;
    @Autowired
    private UserService userService;
    @Autowired
    private PropertyService propertyService;
    static final DateTimeFormatter ISO_DATE_TIME_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
    //租户点击租房后智能生成合同
    @PostMapping("save")
   @Transactional
    public synchronized R<String> save(String propertyId, String userName, String email, String password,
                            String startDate, String endDate){

        System.out.println("1111122"+propertyId + userName + email + password + startDate + endDate);
        LocalDateTime parsedStartDate = null;
        LocalDateTime parsedEndDate = null;


        if (startDate != null && !startDate.isEmpty()) {
            parsedStartDate = LocalDateTime.parse(startDate, ISO_DATE_TIME_FORMATTER);
        }

        if (endDate != null && !endDate.isEmpty()) {
            parsedEndDate = LocalDateTime.parse(endDate, ISO_DATE_TIME_FORMATTER);
        }
        //现验证用户
        if(userName == null || email == null || password == null){
            return R.error("用户姓名，邮箱，密码都不能为空");
        }
        LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
        userLambdaQueryWrapper.eq(userName != null,User::getUserName,userName);
        userLambdaQueryWrapper.eq(email != null,User::getEmail,email);
        userLambdaQueryWrapper.eq(password != null, User::getEmail, email);
        User user = userService.getOne(userLambdaQueryWrapper);
        if(user == null){
            return R.error("用户信息错误！");
        }
        //日期验证

        LocalDateTime now = LocalDateTime.now().minusDays(1);
        if (parsedStartDate.isBefore(now) || parsedStartDate.isAfter(parsedEndDate)){
            return R.error("时间不合法");
        }
        Duration duration = Duration.between(parsedStartDate, parsedEndDate);
        Long days = duration.toDays();
        System.out.println("days:"+days);
        if(days < 30){
            return R.error("租房时间不能少于一个月");
        }

        //房产验证
        LambdaQueryWrapper<Property> propertyLambdaQueryWrapper = new LambdaQueryWrapper<>();
        propertyLambdaQueryWrapper.eq(propertyId!=null, Property::getPropertyId,propertyId);
        Property property1 = propertyService.getOne(propertyLambdaQueryWrapper);
        if(property1 == null){
            return R.error("出现未知错误,请刷新页面");
        }
        //查询房子的当前钻状态，如果当前已经被出租了就不能租
        Integer status = property1.getStatus();
        if(status == 1){
            return R.error("房子已经被其他用户租了，请选择其他房子");
        }
        //创建合同
        Contract contract = new Contract();
        contract.setContractId(UniqueIdGenerator.generateUniqueId());
        contract.setPropertyId(property1.getPropertyId());
        contract.setLandlordId(property1.getOwnerId());
        contract.setTenantId(user.getUserId());
        contract.setContractStartDate(parsedStartDate);
        contract.setContractEndDate(parsedEndDate);
        //计算总的租金
        BigDecimal total = property1.getRentAmount().multiply(BigDecimal.valueOf(days / 30));
        contract.setContractAmount(total);
        String otherInfo = "租户备注："+user.getDescription() + ",房产备注：" +property1.getOtherInfo();
        contract.setOtherContractInfo(otherInfo);
        //把房子状态设置成已出租
        property1.setStatus(1);
        propertyService.updateById(property1);
        //保存合同
        contractService.save(contract);
        return R.success("合同生成成功！");
    }

    @GetMapping("/getById")
    public R<Contract> selectById(String contractId){
        if(contractId ==null){
            return R.error("合同id为空");
        }
        LambdaQueryWrapper<Contract> contractLambdaQueryWrapper = new LambdaQueryWrapper<>();
        contractLambdaQueryWrapper.eq(contractId!=null, Contract::getContractId, contractId);
        Contract contract = contractService.getOne(contractLambdaQueryWrapper);
        if(contract == null){
            return R.error("找不到");
        }
        return R.success(contract);


    }
    //线程同步
    //保证事务性
    @PostMapping("/saveByUser")
    public synchronized R<String> saveByUser(String userId, String propertyId, String startDate, String endDate){

        LocalDateTime parsedStartDate = null;
        LocalDateTime parsedEndDate = null;
        if (startDate != null && !startDate.isEmpty()) {
            parsedStartDate = LocalDateTime.parse(startDate, ISO_DATE_TIME_FORMATTER);
        }
        if (endDate != null && !endDate.isEmpty()) {
            parsedEndDate = LocalDateTime.parse(endDate, ISO_DATE_TIME_FORMATTER);
        }
        //日期验证
        LocalDateTime now = LocalDateTime.now().minusDays(1);
        if (parsedStartDate.isBefore(now) || parsedStartDate.isAfter(parsedEndDate)){
            return R.error("时间不合法");
        }
        Duration duration = Duration.between(parsedStartDate, parsedEndDate);
        Long days = duration.toDays();
        System.out.println("days:"+days);
        if(days < 30){
            return R.error("租房时间不能少于一个月");
        }
        //用户验证
        LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
        userLambdaQueryWrapper.eq(userId!=null, User::getUserId, userId);
        User user = userService.getOne(userLambdaQueryWrapper);
        if(userId == null || user == null){
            return R.error("出现错误，请稍后重试！");
        }
        //房产验证
        LambdaQueryWrapper<Property> propertyLambdaQueryWrapper = new LambdaQueryWrapper<>();
        propertyLambdaQueryWrapper.eq(propertyId!=null, Property::getPropertyId,propertyId);
        Property property1 = propertyService.getOne(propertyLambdaQueryWrapper);
        if(property1 == null){
            return R.error("出现未知错误,请刷新页面");
        }
        //查询房子的当前钻状态，如果当前已经被出租了就不能租
        Integer status = property1.getStatus();
        if(status == 1){
            return R.error("房子已经被其他用户租了，请选择其他房子");
        }
        //创建合同
        Contract contract = new Contract();
        contract.setContractId(UniqueIdGenerator.generateUniqueId());
        contract.setPropertyId(property1.getPropertyId());
        contract.setLandlordId(property1.getOwnerId());
        contract.setTenantId(user.getUserId());
        contract.setContractStartDate(parsedStartDate);
        contract.setContractEndDate(parsedEndDate);
        //计算总的租金
        BigDecimal total = property1.getRentAmount().multiply(BigDecimal.valueOf(days / 30));
        contract.setContractAmount(total);
        String otherInfo = "租户备注："+user.getDescription() + ",房产备注：" +property1.getOtherInfo();
        contract.setOtherContractInfo(otherInfo);
        //把房子状态设置成已出租
        property1.setStatus(1);
        propertyService.updateById(property1);
        //保存合同
        contractService.save(contract);
        return R.success("合同生成成功！");
    }

    //显示所有合同
    @GetMapping("/list")
    public R<List<ContractDto>> list(@RequestParam(required = false) String landName, @RequestParam(required = false) String tenantName){
        User land = null;
        User tenant = null;
        if(landName != null){
            LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
            userLambdaQueryWrapper.eq(landName!=null, User::getUserName, landName);
            land = userService.getOne(userLambdaQueryWrapper);
        }
        if(tenantName != null){
            LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
            userLambdaQueryWrapper.eq(tenantName!=null, User::getUserName, tenantName);
            tenant = userService.getOne(userLambdaQueryWrapper);
        }
        LambdaQueryWrapper<Contract> contractLambdaQueryWrapper = new LambdaQueryWrapper<>();
        if(land !=null){
            contractLambdaQueryWrapper.eq(land!=null, Contract::getLandlordId, land.getUserId());
        }
       if(tenant !=null){
           contractLambdaQueryWrapper.eq(tenant!=null, Contract::getTenantId, tenant.getUserId());
       }
       Integer status = 0;
         contractLambdaQueryWrapper.eq(status!=null, Contract::getStatus, status);
        List<Contract> list2 = contractService.list(contractLambdaQueryWrapper);
        List<Contract> list1 = list2.stream()
                .sorted(Comparator.comparing(Contract::getContractEndDate))
                .collect(Collectors.toList());

        List<ContractDto> list = new ArrayList<>();
        for(Contract contract : list1){
           ContractDto contractDto = new ContractDto();
            BeanUtils.copyProperties(contract,contractDto);
            if(land != null){
                contractDto.setLandName(land.getUserName());
            }else{
                LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
                userLambdaQueryWrapper.eq(contract.getLandlordId()!=null, User::getUserId, contract.getLandlordId());
                User user = userService.getOne(userLambdaQueryWrapper);
                contractDto.setLandName(user.getUserName());
            }
            if(tenant != null){
                contractDto.setTenantName(tenant.getUserName());
            }else{
                LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
                userLambdaQueryWrapper.eq(contract.getTenantId()!=null, User::getUserId, contract.getTenantId());
                User user = userService.getOne(userLambdaQueryWrapper);
                contractDto.setTenantName(user.getUserName());
            }
            String propertyId = contract.getPropertyId();
            LambdaQueryWrapper<Property> propertyLambdaQueryWrapper = new LambdaQueryWrapper<>();
            propertyLambdaQueryWrapper.eq(propertyId!=null, Property::getPropertyId, propertyId);
            Property property = propertyService.getOne(propertyLambdaQueryWrapper);
            contractDto.setPropertyType(property.getPropertyType());
            contractDto.setArea(property.getArea());
            contractDto.setAddress(property.getAddress());
            list.add(contractDto);
        }
        return R.success(list);
    }

    //合同到期，把房子状态设置成未出租
    @Transactional
    @GetMapping("/handle")
    public R<String> handle(String contractId){
        if(contractId == null){
            return R.error("出现错误请重试");
        }
        LambdaQueryWrapper<Contract> contractLambdaQueryWrapper = new LambdaQueryWrapper<>();
        contractLambdaQueryWrapper.eq(contractId!=null, Contract::getContractId, contractId);
        Contract contract = contractService.getOne(contractLambdaQueryWrapper);
        contract.setStatus(1);
        contractService.updateById(contract);
        String propertyId = contract.getPropertyId();
        LambdaQueryWrapper<Property> propertyLambdaQueryWrapper = new LambdaQueryWrapper<>();
        propertyLambdaQueryWrapper.eq(propertyId!=null, Property::getPropertyId, propertyId);
        Property property = propertyService.getOne(propertyLambdaQueryWrapper);
        property.setStatus(0);
        propertyService.updateById(property);
        return R.success("处理成功！");
    }
}
