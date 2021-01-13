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

-- ----------------------------
--  Table structure for `score`
-- ----------------------------
DROP TABLE IF EXISTS `zhier`.`schedule`;
CREATE TABLE `zhier`.`schedule` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '日程id',
  `calendarId` VARCHAR(16) NOT NULL COMMENT '日历id',
  `title` VARCHAR(200) NULL COMMENT '日程标题',
  `body` VARCHAR(500) NULL COMMENT '日程内容',
  `start` TIMESTAMP NULL COMMENT '日程开始时间',
  `end` TIMESTAMP NULL COMMENT '日程结束时间',
  `goingDuration` INT(8) NULL,
  `comingDuration` INT(8) NULL,
  `isAllDay` TINYINT NULL DEFAULT 0 COMMENT '是否全天日程',
  `category` VARCHAR(10) NULL COMMENT '日程类型，只包含4种："milestone"（里程牌）, "task"（任务）, "allday"（全天）, "time"',
  `dueDateClass` VARCHAR(45) NULL COMMENT 'The task schedule type string(any string value is ok and mandatory if category is "task")',
  `location` VARCHAR(100) NULL COMMENT '地址',
  `attendees` VARCHAR(100) NULL COMMENT '参与人',
  `recurrenceRule` VARCHAR(45) NULL,
  `isPending` TINYINT NULL,
  `isFocused` TINYINT NULL,
  `isVisible` TINYINT NULL,
  `isReadOnly` TINYINT NULL,
  `isPrivate` TINYINT NULL,
  `color` VARCHAR(12) NULL,
  `bgColor` VARCHAR(12) NULL,
  `dragBgColor` VARCHAR(12) NULL,
  `borderColor` VARCHAR(12) NULL,
  `customStyle` VARCHAR(12) NULL,
  `raw` VARCHAR(200) NULL,
  `state` VARCHAR(12) NULL COMMENT '日程级别，比如busy,free',
  `CREATE_DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UPDATE_DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8 COMMENT='评分表';

