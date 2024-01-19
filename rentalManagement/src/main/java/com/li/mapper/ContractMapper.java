package com.li.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.li.dto.ContractDto;
import com.li.pojo.Contract;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @Author lzw
 * @Date 2024/1/8 17:54
 * @description
 */
@Mapper
public interface ContractMapper extends BaseMapper<Contract> {
  List<ContractDto> selectContractDto();
  Contract selectById(String contractId);
}
