/*
 Navicat Premium Data Transfer

 Source Server         : lzw
 Source Server Type    : MySQL
 Source Server Version : 80032 (8.0.32)
 Source Host           : localhost:3306
 Source Schema         : rentalmanagement

 Target Server Type    : MySQL
 Target Server Version : 80032 (8.0.32)
 File Encoding         : 65001

 Date: 09/01/2024 12:29:34
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for contract
-- ----------------------------
DROP TABLE IF EXISTS `contract`;
CREATE TABLE `contract`  (
  `contractId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '合同ID',
  `propertyId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '房产ID',
  `landlordId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '房东Id',
  `tenantId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '租户Id',
  `contractStartDate` datetime NOT NULL COMMENT '合同开始日期',
  `contractEndDate` datetime NOT NULL COMMENT '合同结束日期',
  `contractAmount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '合同金额',
  `otherContractInfo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '其他合同信息',
  PRIMARY KEY (`contractId`) USING BTREE,
  INDEX `PI`(`propertyId` ASC) USING BTREE,
  INDEX `lI`(`landlordId` ASC) USING BTREE,
  INDEX `TI`(`tenantId` ASC) USING BTREE,
  CONSTRAINT `lI` FOREIGN KEY (`landlordId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PI` FOREIGN KEY (`propertyId`) REFERENCES `property` (`propertyId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `TI` FOREIGN KEY (`tenantId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of contract
-- ----------------------------
INSERT INTO `contract` VALUES ('1', '1', '2', '3', '2024-01-09 12:23:28', '2024-04-01 12:23:33', '3000', '无');

-- ----------------------------
-- Table structure for property
-- ----------------------------
DROP TABLE IF EXISTS `property`;
CREATE TABLE `property`  (
  `propertyId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '房产id',
  `owenerId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '房产所有者id,user表外键',
  `propertyType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '房产类型',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '房产地址',
  `area` float NOT NULL COMMENT '房屋面积',
  `rentAmount` decimal(10, 2) NOT NULL COMMENT '房租价格',
  `otherInfo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '其他信息，比如多久起租',
  PRIMARY KEY (`propertyId`) USING BTREE,
  INDEX `OI`(`owenerId` ASC) USING BTREE,
  CONSTRAINT `OI` FOREIGN KEY (`owenerId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of property
-- ----------------------------
INSERT INTO `property` VALUES ('1', '2', '三室一厅', '中北大学蚊蝇五', 0, 2000.00, '有独卫');
INSERT INTO `property` VALUES ('2', '2', '单人间', '中北大学蚊蝇五203', 0, 500.00, '3个月起租');

-- ----------------------------
-- Table structure for seekinfo
-- ----------------------------
DROP TABLE IF EXISTS `seekinfo`;
CREATE TABLE `seekinfo`  (
  `seekInfoId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '求租信息Id',
  `seekerId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '求租用户Id',
  `seekingType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '寻找的房子类型',
  `desiredLocation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '期望房子地点',
  `maxRentAmout` decimal(10, 2) NULL DEFAULT NULL COMMENT '期望的最大租金',
  `otherSeekInfo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '其他求租信息',
  PRIMARY KEY (`seekInfoId`) USING BTREE,
  INDEX `SI`(`seekerId` ASC) USING BTREE,
  CONSTRAINT `SI` FOREIGN KEY (`seekerId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of seekinfo
-- ----------------------------
INSERT INTO `seekinfo` VALUES ('1', '3', '三室一厅', '中北大学', 1000.00, '房子楼层不要太高');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `userId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户ID',
  `userName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户姓名',
  `passWord` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户密码',
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户邮箱，用作登录账号',
  `phoneNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户电话号码',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户的一些备注或其他信息',
  `role` int NOT NULL COMMENT '0是房东，1是租户，-1是管理员',
  PRIMARY KEY (`userId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '荔枝味', '123456', '2090037702', '15779554232', '不想写课设', -1);
INSERT INTO `user` VALUES ('2', '张三', '654321', '2383767613@qq.com', '13027000692', '我是房东', 0);
INSERT INTO `user` VALUES ('3', '李四', '111111', '2090037703@qq.com', '15779554233', '我是租户', 1);

SET FOREIGN_KEY_CHECKS = 1;
