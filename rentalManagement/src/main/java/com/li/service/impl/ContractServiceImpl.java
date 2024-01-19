package com.li.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.li.mapper.ContractMapper;
import com.li.pojo.Contract;
import com.li.service.ContractService;
import org.springframework.stereotype.Service;

/**
 * @Author lzw
 * @Date 2024/1/8 20:49
 * @description
 */
@Service
public class ContractServiceImpl extends ServiceImpl<ContractMapper, Contract> implements ContractService {
}
