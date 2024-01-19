package com.li;

import com.li.dto.ContractDto;
import com.li.mapper.ContractMapper;
import com.li.mapper.PropertyMapper;
import com.li.mapper.UserMapper;
import com.li.pojo.Contract;
import com.li.pojo.User;
import com.li.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class RentalManagementApplicationTests {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ContractMapper contractMapper;
    @Autowired
    private PropertyMapper propertyMapper;

    @Test
    void contextLoads() {
        Contract contractDto = contractMapper.selectById("1");
        propertyMapper.selectProperty();
        userMapper.selectUserById("1");
        System.out.println(contractDto);
    }

}
