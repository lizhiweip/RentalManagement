package com.li.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.li.common.R;
import com.li.common.UniqueIdGenerator;
import com.li.pojo.Property;
import com.li.service.PropertyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * @Author lzw
 * @Date 2024/1/8 20:56
 * @description
 */
@Slf4j
@RestController
@RequestMapping("/property")
public class PropertyController {
   @Autowired
    private PropertyService propertyService;

    /**
     * 可以根据条件查找出所有的房产信息
     * @param propertyType
     * @param address
     * @param minAmount
     * @param maxAmount
     * @param maxArea
     * @param minArea
     * @return
     */
   @GetMapping("/list")
   public R<List<Property>> list(@RequestParam(required = false) String propertyType, @RequestParam(required = false)String address,
                                    @RequestParam(required = false) BigDecimal minAmount, @RequestParam(required = false)BigDecimal maxAmount,
                                    @RequestParam(required = false) Float maxArea, @RequestParam(required = false) Float minArea,
                                    @RequestParam(required = false)Integer status){
       LambdaQueryWrapper<Property> propertyLambdaQueryWrapper = new LambdaQueryWrapper<>();
       propertyLambdaQueryWrapper.like(propertyType!=null, Property::getPropertyType,propertyType);
       propertyLambdaQueryWrapper.like(address!=null,Property::getAddress,address);
       propertyLambdaQueryWrapper.eq(status!=null,Property::getStatus,status);
       propertyLambdaQueryWrapper.ge(minAmount != null, Property::getRentAmount, minAmount);
       propertyLambdaQueryWrapper.le(maxAmount != null, Property::getRentAmount, maxAmount);
       propertyLambdaQueryWrapper.ge(minArea != null, Property::getArea, minArea);
       propertyLambdaQueryWrapper.le(maxArea != null, Property::getArea, maxArea);
       List<Property> list = propertyService.list(propertyLambdaQueryWrapper);
       return R.success(list);
   }

    /**
     * 房东可以通过userId查找到自己名下的所有房产信息，并且可以增加，删除，更新房产信息
     */


    @DeleteMapping("/delete")
    public R<String> delete(String propertyId){
        if(propertyId == null){
            return R.error("系统出现错误，请重试！");
        }
        Property property = propertyService.getById(propertyId);
        if(property == null){
            return R.error("出现错误请重试");
        }
        if(property.getStatus() == 1){
            return R.error("正在出租的房子无法删除");
        }
        propertyService.removeById(propertyId);
        return R.success("删除成功");
    }

    @PostMapping("/save")
    public R<String> save(@RequestBody Property property){
        property.setPropertyId(UniqueIdGenerator.generateUniqueId());
        property.setStatus(0);
        try {
            propertyService.save(property);
        }catch (Exception e){
            return R.error("请检查信息是否有错");
        }
        return R.success("添加成功");
    }

    @PostMapping("/update")
    public R<String> update(@RequestBody Property property){
        String propertyId = property.getPropertyId();
        Property property1 = propertyService.getById(propertyId);
        if(property1.getStatus()!=0){
            return R.error("正在出租的房子无法更新");
        }
        BeanUtils.copyProperties(property, property1);
        propertyService.updateById(property1);
        return R.success("更新成功");
    }

    @GetMapping("/getByUser")
    public R<List<Property>> getByUser(String userId){
        if(userId == null){
            return R.error("出现问题请重试！");
        }
        LambdaQueryWrapper<Property> propertyLambdaQueryWrapper = new LambdaQueryWrapper<>();
        propertyLambdaQueryWrapper.eq(userId!=null,Property::getOwnerId,userId);
        Integer status = 0;
        propertyLambdaQueryWrapper.eq(status!=null,Property::getStatus,status);
        List<Property> list = propertyService.list(propertyLambdaQueryWrapper);
        return R.success(list);
    }



}
