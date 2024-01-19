package com.li.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.li.common.R;
import com.li.common.UniqueIdGenerator;
import com.li.pojo.SeekInfo;
import com.li.service.SeekInfoService;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;



/**
 * @Author lzw
 * @Date 2024/1/8 20:55
 * @description
 */
@Slf4j
@RestController
@RequestMapping("/seekInfo")
public class SeekInfoController {
    @Autowired
    private SeekInfoService seekInfoService;

    @GetMapping("/list")
    public R<List<SeekInfo>> list(@RequestParam(required = false) String seekingType, @RequestParam(required = false)String desiredLocation,
                                  @RequestParam(required = false)BigDecimal max, @RequestParam(required = false)BigDecimal min){
          LambdaQueryWrapper<SeekInfo> seekInfoLambdaQueryWrapper = new LambdaQueryWrapper<>();
          seekInfoLambdaQueryWrapper.like(seekingType!=null, SeekInfo::getSeekingType, seekingType);
          seekInfoLambdaQueryWrapper.like(desiredLocation!=null, SeekInfo::getDesiredLocation,desiredLocation);
          seekInfoLambdaQueryWrapper.ge(min!=null,SeekInfo::getMaxRentAmount,min);
          seekInfoLambdaQueryWrapper.le(max!=null,SeekInfo::getMaxRentAmount,max);
          List<SeekInfo> list = seekInfoService.list(seekInfoLambdaQueryWrapper);
          return R.success(list);
      }

    /**
     * 租户可以查看自己发布的求租信息
     */
    @GetMapping("/query")
    public R<List<SeekInfo>> list(@RequestParam String seekerId){
        LambdaQueryWrapper<SeekInfo> seekInfoLambdaQueryWrapper = new LambdaQueryWrapper<>();
        seekInfoLambdaQueryWrapper.eq(seekerId!=null, SeekInfo::getSeekerId, seekerId);
        List<SeekInfo> list = seekInfoService.list(seekInfoLambdaQueryWrapper);
        return R.success(list);
    }

    @PostMapping("/save")
    public R<String> save(@RequestBody SeekInfo seekInfo){
        seekInfo.setSeekInfoId(UniqueIdGenerator.generateUniqueId());
        seekInfoService.save(seekInfo);
        return R.success("添加成功!");
    }

    @DeleteMapping("/delete")
    public R<String> delete(String userId, String seekInfoId){
        System.out.println("userId: "+userId+" seekInfoId: "+seekInfoId);
        if(userId == null || seekInfoId == null){
            return R.error("系统出现错误，请重试");
        }
        LambdaQueryWrapper<SeekInfo> seekInfoLambdaQueryWrapper = new LambdaQueryWrapper<>();
        seekInfoLambdaQueryWrapper.eq(seekInfoId!=null, SeekInfo::getSeekInfoId, seekInfoId);
        SeekInfo seekInfo = seekInfoService.getOne(seekInfoLambdaQueryWrapper);
        if(seekInfo == null || !seekInfo.getSeekerId().equals(userId)){
            return R.error("系统出现错误，请重试");
        }else{
            seekInfoService.removeById(seekInfoId);
        }
        return R.success("删除成功");
    }

    @PostMapping("/update")
    public R<String> update(@RequestBody SeekInfo seekInfo){
        seekInfoService.updateById(seekInfo);
        return R.success("更新成功");
    }

    @DeleteMapping("/remove")
    public R<String> remove(String seekInfoId){
        if(seekInfoId == null){
            return R.error("系统出现错误，请重试");
        }else{
            LambdaQueryWrapper<SeekInfo> seekInfoLambdaQueryWrapper = new LambdaQueryWrapper<>();
            seekInfoLambdaQueryWrapper.eq(seekInfoId!=null, SeekInfo::getSeekInfoId, seekInfoId);
            SeekInfo seekInfo = seekInfoService.getOne(seekInfoLambdaQueryWrapper);
            if(seekInfo == null){
                return R.error("系统出现错误，请重试！");
            }
            seekInfoService.removeById(seekInfoId);
            return R.success("删除成功");


        }




    }



}
