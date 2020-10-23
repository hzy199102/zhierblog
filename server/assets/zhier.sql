/*
 Navicat MySQL Data Transfer

 zhier

*/

-- ----------------------------
--  Table structure for `score`
-- ----------------------------
DROP TABLE IF EXISTS `score`;
CREATE TABLE `score` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `SOCRE` int(11) NOT NULL DEFAULT '0' COMMENT '评分',
  `DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '日期',
  `CREATE_DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UPDATE_DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8 COMMENT='评分表';


-- ----------------------------
--  Records of `websites`
-- ----------------------------
BEGIN;
-- INSERT INTO `websites` VALUES ('10001', '', '80', '', ''), ('10002', '', '90', '', '');
COMMIT;

