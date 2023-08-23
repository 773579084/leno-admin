/*
 Navicat Premium Data Transfer

 Source Server         : 阿里云mysql
 Source Server Type    : MySQL
 Source Server Version : 80027
 Source Host           : 120.79.243.62:3306
 Source Schema         : leno_admin

 Target Server Type    : MySQL
 Target Server Version : 80027
 File Encoding         : 65001

 Date: 23/08/2023 09:20:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for leno_user
-- ----------------------------
DROP TABLE IF EXISTS `leno_user`;
CREATE TABLE `leno_user`  (
  `user_id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `dept_id` bigint NULL DEFAULT NULL COMMENT '部门ID',
  `user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户账号',
  `nick_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `user_type` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '用户类型 0 管理员 , 1 非管理员 ',
  `email` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户邮箱',
  `phonenumber` char(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手机号码',
  `sex` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '用户性别，0男，1女',
  `avatar` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像地址',
  `password` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户密码',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '账号状态: 0 正常，1 停用',
  `del_flag` bigint NULL DEFAULT 0 COMMENT '账号状态: 0 存在，1 删除',
  `login_ip` char(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '最后登录的 IP',
  `login_date` time NULL DEFAULT NULL COMMENT '最后登录的 时间',
  `create_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `update_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `remark` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC) USING BTREE,
  UNIQUE INDEX `user_name`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_2`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_3`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_4`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_5`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_6`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_7`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_8`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_9`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_10`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_11`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_12`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_13`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_14`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_15`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_16`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_17`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_18`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_19`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_20`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_21`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_22`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_23`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_24`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_25`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_26`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_27`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_28`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_29`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_30`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_31`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_32`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_33`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_34`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_35`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_36`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_37`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_38`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_39`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_40`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_41`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_42`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_43`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_44`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_45`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_46`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_47`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_48`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_49`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_50`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_51`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_52`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_53`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_54`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_55`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_56`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_57`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_58`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_59`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_60`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `user_name_61`(`user_name` ASC) USING BTREE,
  INDEX `dept_id`(`dept_id` ASC) USING BTREE,
  CONSTRAINT `leno_user_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`dept_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 56 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of leno_user
-- ----------------------------
INSERT INTO `leno_user` VALUES (1, 2, 'admin', '超级管理员账号', '0', '15013371705@163.com', '15013371705', '0', '20ebbeac3836291f45bf57c01.jpeg', '$2a$10$HsRLkY.K29kGSqkd8h5eYOzGmybsEw9RSnM0b..af3ymHfGHZ14wW', '0', 0, '', '00:00:00', '', 'admin', '', '2023-02-28 15:07:40', '2023-08-11 09:53:19');
INSERT INTO `leno_user` VALUES (52, 4, 'test', '测试', '0', NULL, NULL, '2', NULL, '$2a$10$ldA2PpxvpJlkJ4CoK6rKOOxeCGL6hshuZ8Lxu9rh0PCfYwOi4MY5u', '0', 0, NULL, NULL, 'admin', 'admin', NULL, '2023-06-05 14:48:03', '2023-07-08 16:04:47');
INSERT INTO `leno_user` VALUES (55, NULL, 'test3', 'test3', '0', NULL, '15502321434', '2', NULL, '$2a$10$Pn4uwJxdrFOu7j5hqUiGkOLHPYhS7mADIH2pdsRTDa9DRFbDrsrxu', '0', 2, NULL, NULL, 'admin', 'admin', NULL, '2023-07-08 15:43:25', '2023-07-08 16:27:28');

-- ----------------------------
-- Table structure for monitor_job
-- ----------------------------
DROP TABLE IF EXISTS `monitor_job`;
CREATE TABLE `monitor_job`  (
  `job_id` bigint NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `job_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '任务名称',
  `job_group` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'DEFAULT' COMMENT '任务组名',
  `invoke_target` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '调用目标字符串',
  `cron_expression` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'cron执行表达式',
  `misfire_policy` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '3' COMMENT '计划执行错误策略（1立即执行 2执行一次 3放弃执行）',
  `concurrent` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '是否并发执行（0允许 1禁止）',
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 1暂停）',
  `create_by` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `created_at` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `updated_at` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注信息',
  PRIMARY KEY (`job_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 44 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '定时任务调度表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of monitor_job
-- ----------------------------
INSERT INTO `monitor_job` VALUES (39, '多参数测试', 'DEFAULT', 'addEditFn(23,43,25)', '0/10 * * * * *', '1', '1', '1', 'admin', '2023-06-25 17:00:03', 'admin', '2023-06-26 11:03:17', NULL);
INSERT INTO `monitor_job` VALUES (41, '无参数测试', 'DEFAULT', 'addEditFn', '0/5 * * * * *', '1', '1', '1', 'admin', '2023-06-26 09:00:38', 'admin', '2023-06-26 09:01:55', NULL);
INSERT INTO `monitor_job` VALUES (43, '定时清理所有日志', 'DEFAULT', 'timingCleanLog', '59 59 23 20 1/3 ?', '3', '1', '1', 'admin', '2023-06-26 11:22:45', 'admin', '2023-06-26 11:29:58', NULL);

-- ----------------------------
-- Table structure for monitor_job_log
-- ----------------------------
DROP TABLE IF EXISTS `monitor_job_log`;
CREATE TABLE `monitor_job_log`  (
  `job_log_id` bigint NOT NULL AUTO_INCREMENT COMMENT '任务日志ID',
  `job_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '任务名称',
  `job_group` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '任务组名',
  `invoke_target` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '调用目标字符串',
  `job_message` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '日志信息',
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '执行状态（0正常 1失败）',
  `exception_info` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '异常信息',
  `created_at` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`job_log_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '定时任务调度日志表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of monitor_job_log
-- ----------------------------
INSERT INTO `monitor_job_log` VALUES (4, '定时清理所有日志', 'DEFAULT', 'timingCleanLog', '定时清理 log成功', '0', '', '2023-06-26 11:36:27', '2023-06-26 11:36:27');
INSERT INTO `monitor_job_log` VALUES (5, '定时清理所有日志', 'DEFAULT', 'timingCleanLog', '查询无logs文件夹', '1', '查询无logs文件夹', '2023-08-04 10:03:22', '2023-08-04 10:03:22');

-- ----------------------------
-- Table structure for sys_config
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config`  (
  `config_id` int NOT NULL AUTO_INCREMENT COMMENT '参数主键',
  `config_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '参数名称',
  `config_key` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '参数键名',
  `config_value` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '参数键值',
  `config_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N' COMMENT '系统内置（Y是 N否）',
  `create_by` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `created_at` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `updated_at` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`config_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '参数配置表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_config
-- ----------------------------
INSERT INTO `sys_config` VALUES (1, '用户管理-账号初始密码', 'sys.user.initPassword', '123456', 'Y', 'admin', '2023-05-30 15:08:37', 'admin', '2023-08-17 15:13:45', '初始化密码 123456');
INSERT INTO `sys_config` VALUES (2, '主框架页-默认皮肤样式名称', 'sys.index.skinName', '#1890ff', 'Y', 'admin', '2023-05-30 15:14:16', 'admin', '2023-08-17 16:01:20', '支持十六进制颜色值');
INSERT INTO `sys_config` VALUES (3, '主框架页-header主题', 'sys.index.headerTheme', 'darkBlue', 'Y', 'admin', '2023-05-30 15:19:10', 'admin', '2023-08-17 16:01:08', 'pink、darkGreen、cornflowerBlue、goldenrod、darkBlue');
INSERT INTO `sys_config` VALUES (4, '账号自助-是否开启用户注册功能', 'sys.account.registerUser', 'false', 'Y', 'admin', '2023-05-30 15:19:39', 'admin', '2023-08-17 14:28:09', '是否开启注册用户功能（true开启，false关闭）');

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `dept_id` bigint NOT NULL AUTO_INCREMENT COMMENT '部门id',
  `parent_id` bigint NULL DEFAULT 0 COMMENT '父部门id',
  `ancestors` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '祖级列表',
  `dept_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '部门名称',
  `order_num` bigint NULL DEFAULT 0 COMMENT '显示顺序',
  `leader` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '负责人',
  `phone` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `email` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '删除标志（0代表存在 1代表删除）',
  `create_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `update_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`dept_id`) USING BTREE,
  UNIQUE INDEX `dept_id`(`dept_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES (1, 0, '\'0\'', 'wen科技', 1, 'wen', '158888888822', '15013371705@163.com', '0', '0', 'admin', NULL, '2023-03-01 17:03:11', '2023-03-01 17:03:15');
INSERT INTO `sys_dept` VALUES (2, 1, '\'0,1\'', '深圳总公司', 1, 'wen', '158888888822', '15013371705@163.com', '0', '0', 'admin', 'admin', '2023-03-01 17:04:11', '2023-07-08 09:05:53');
INSERT INTO `sys_dept` VALUES (3, 1, '\'0,1\'', '广州总公司', 0, 'wen', '158888888822', '15013371705@163.com', '0', '0', 'admin', 'admin', '2023-03-01 17:06:03', '2023-05-29 16:45:53');
INSERT INTO `sys_dept` VALUES (4, 3, '\'0,1,3\'', '研发部门', 1, 'wen', '15013371705@163.com', '158888888822', '0', '0', 'admin', NULL, '2023-03-01 17:07:25', '2023-03-01 17:07:27');
INSERT INTO `sys_dept` VALUES (9, 2, '', '测试', 1, NULL, NULL, NULL, '0', '2', 'admin', NULL, '2023-06-27 10:35:30', '2023-06-27 10:35:32');

-- ----------------------------
-- Table structure for sys_dict_data
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_data`;
CREATE TABLE `sys_dict_data`  (
  `dict_code` bigint NOT NULL AUTO_INCREMENT COMMENT '部门id',
  `dict_sort` bigint NULL DEFAULT 0 COMMENT '字典排序',
  `dict_label` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典标签',
  `dict_value` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典键值',
  `dict_type` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典类型',
  `css_class` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '样式属性（其他样式扩展）',
  `list_class` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '表格回显样式',
  `is_default` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'N' COMMENT '是否默认（Y是 N否）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `create_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `update_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `remark` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`dict_code`) USING BTREE,
  UNIQUE INDEX `dict_code`(`dict_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 64 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_dict_data
-- ----------------------------
INSERT INTO `sys_dict_data` VALUES (1, 1, '男', '0', 'sys_user_sex', NULL, 'empty', 'Y', '0', 'admin', '性别男', NULL, '2023-04-03 15:55:59', '2023-04-21 09:10:23');
INSERT INTO `sys_dict_data` VALUES (2, 2, '女', '1', 'sys_user_sex', NULL, 'empty', 'Y', '0', 'admin', '性别女', NULL, '2023-04-03 15:55:59', '2023-04-21 09:10:27');
INSERT INTO `sys_dict_data` VALUES (3, 3, '未知', '2', 'sys_user_sex', NULL, 'empty', 'Y', '0', 'admin', '性别未知', NULL, '2023-04-03 15:55:59', '2023-04-24 09:14:14');
INSERT INTO `sys_dict_data` VALUES (6, 1, '显示', '0', 'sys_show_hide', NULL, 'processing', 'N', '0', 'admin', 'admin', '显示菜单', '2023-04-04 14:18:22', '2023-07-08 09:05:43');
INSERT INTO `sys_dict_data` VALUES (7, 2, '隐藏', '1', 'sys_show_hide', NULL, 'error', 'N', '0', 'admin', 'admin', '隐藏菜单', '2023-04-04 14:22:39', '2023-07-08 09:05:16');
INSERT INTO `sys_dict_data` VALUES (8, 1, '正常', '0', 'sys_normal_disable', NULL, 'processing', 'N', '0', 'admin', NULL, '正常状态', '2023-04-04 14:24:22', '2023-04-10 17:08:21');
INSERT INTO `sys_dict_data` VALUES (9, 2, '停用', '1', 'sys_normal_disable', NULL, 'error', 'N', '0', 'admin', NULL, '停用状态', '2023-04-04 14:25:27', '2023-04-10 17:23:27');
INSERT INTO `sys_dict_data` VALUES (41, 1, '是', 'Y', 'sys_yes_no', NULL, 'processing', 'N', '0', 'admin', NULL, '参数配置默认是', '2023-05-30 14:58:20', '2023-05-30 14:58:20');
INSERT INTO `sys_dict_data` VALUES (42, 2, '否', 'N', 'sys_yes_no', NULL, 'error', 'N', '0', 'admin', NULL, '参数配置默认否', '2023-05-30 14:58:46', '2023-05-30 14:58:46');
INSERT INTO `sys_dict_data` VALUES (43, 1, '通知', '1', 'sys_notice_type', NULL, 'warning', 'N', '0', 'admin', NULL, '通知', '2023-05-30 15:27:14', '2023-05-30 15:27:14');
INSERT INTO `sys_dict_data` VALUES (44, 2, '公告', '2', 'sys_notice_type', NULL, 'success', 'N', '0', 'admin', NULL, '公告', '2023-05-30 15:27:31', '2023-05-30 15:27:31');
INSERT INTO `sys_dict_data` VALUES (45, 1, '正常', '0', 'sys_notice_status', NULL, 'processing', 'N', '0', 'admin', NULL, '正常状态', '2023-05-30 15:29:12', '2023-05-30 15:29:12');
INSERT INTO `sys_dict_data` VALUES (46, 2, '关闭', '1', 'sys_notice_status', NULL, 'error', 'N', '0', 'admin', NULL, '关闭状态', '2023-05-30 15:29:29', '2023-05-30 15:29:29');
INSERT INTO `sys_dict_data` VALUES (47, 1, '成功', '0', 'sys_common_status', NULL, 'processing', 'N', '0', 'admin', NULL, '正常状态', '2023-05-30 16:53:09', '2023-05-30 16:53:09');
INSERT INTO `sys_dict_data` VALUES (48, 2, '失败', '1', 'sys_common_status', NULL, 'error', 'N', '0', 'admin', 'admin', '失败状态', '2023-05-30 16:53:24', '2023-06-12 14:57:40');
INSERT INTO `sys_dict_data` VALUES (49, 1, '新增', '1', 'sys_oper_type', NULL, 'default', 'N', '0', 'admin', NULL, '新增操作', '2023-05-30 16:54:41', '2023-05-30 16:54:41');
INSERT INTO `sys_dict_data` VALUES (50, 2, '修改', '2', 'sys_oper_type', NULL, 'default', 'N', '0', 'admin', NULL, '修改操作', '2023-05-30 16:55:01', '2023-05-30 16:55:01');
INSERT INTO `sys_dict_data` VALUES (51, 3, '删除', '3', 'sys_oper_type', NULL, 'error', 'N', '0', 'admin', NULL, '删除操作', '2023-05-30 16:55:17', '2023-05-30 16:55:17');
INSERT INTO `sys_dict_data` VALUES (52, 4, '授权', '4', 'sys_oper_type', NULL, 'processing', 'N', '0', 'admin', NULL, '授权操作', '2023-05-30 16:55:33', '2023-05-30 16:55:33');
INSERT INTO `sys_dict_data` VALUES (53, 5, '导出', '5', 'sys_oper_type', NULL, 'warning', 'N', '0', 'admin', 'admin', '导出操作', '2023-05-30 16:55:47', '2023-05-30 16:55:53');
INSERT INTO `sys_dict_data` VALUES (54, 6, '导入', '6', 'sys_oper_type', NULL, 'warning', 'N', '0', 'admin', NULL, '导入操作', '2023-05-30 16:56:09', '2023-05-30 16:56:09');
INSERT INTO `sys_dict_data` VALUES (55, 7, '强退', '7', 'sys_oper_type', NULL, 'error', 'N', '0', 'admin', NULL, '强退操作', '2023-05-30 16:56:30', '2023-05-30 16:56:30');
INSERT INTO `sys_dict_data` VALUES (56, 8, '生成代码', '8', 'sys_oper_type', NULL, 'warning', 'N', '0', 'admin', NULL, '生成操作', '2023-05-30 16:56:49', '2023-05-30 16:56:49');
INSERT INTO `sys_dict_data` VALUES (58, 99, '其他', '0', 'sys_oper_type', NULL, 'default', 'N', '0', 'admin', 'admin', '其他操作', '2023-05-30 16:57:33', '2023-06-14 14:39:36');
INSERT INTO `sys_dict_data` VALUES (59, 9, '清空数据', '9', 'sys_oper_type', NULL, 'error', 'N', '0', 'admin', 'admin', '清空操作', '2023-06-14 11:39:42', '2023-06-14 11:39:49');
INSERT INTO `sys_dict_data` VALUES (60, 1, '正常', '0', 'sys_job_status', NULL, 'processing', 'N', '0', 'admin', NULL, '正常状态', '2023-06-19 09:20:13', '2023-06-19 09:20:13');
INSERT INTO `sys_dict_data` VALUES (61, 2, '暂停', '1', 'sys_job_status', NULL, 'error', 'N', '0', 'admin', NULL, '停用状态', '2023-06-19 09:20:34', '2023-06-19 09:20:34');
INSERT INTO `sys_dict_data` VALUES (62, 1, '默认', 'DEFAULT', 'sys_job_group', NULL, 'processing', 'N', '0', 'admin', NULL, '默认分组', '2023-06-19 09:21:38', '2023-06-19 09:21:38');
INSERT INTO `sys_dict_data` VALUES (63, 2, '系统', 'SYSTEM', 'sys_job_group', NULL, 'success', 'N', '0', 'admin', NULL, '系统分组', '2023-06-19 09:21:58', '2023-06-19 09:21:58');

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type`  (
  `dict_id` bigint NOT NULL AUTO_INCREMENT COMMENT '字典主键',
  `dict_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典名称',
  `dict_type` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典类型',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `create_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `update_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `remark` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`dict_id`) USING BTREE,
  UNIQUE INDEX `dict_id`(`dict_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_dict_type
-- ----------------------------
INSERT INTO `sys_dict_type` VALUES (10, '菜单状态', 'sys_show_hide', '0', 'admin', 'admin', '菜单状态列表', '2023-04-03 13:44:50', '2023-06-14 14:36:47');
INSERT INTO `sys_dict_type` VALUES (11, '系统开关', 'sys_normal_disable', '0', 'admin', 'admin', '系统开关列表', '2023-04-03 15:53:07', '2023-05-26 14:16:27');
INSERT INTO `sys_dict_type` VALUES (23, '参数配置是否', 'sys_yes_no', '0', 'admin', NULL, '参数配置是否', '2023-05-30 14:57:36', '2023-05-30 14:57:36');
INSERT INTO `sys_dict_type` VALUES (24, '通知类型', 'sys_notice_type', '0', 'admin', NULL, '通知类型列表', '2023-05-30 15:26:45', '2023-05-30 15:26:45');
INSERT INTO `sys_dict_type` VALUES (25, '通知状态', 'sys_notice_status', '0', 'admin', NULL, '通知状态列表', '2023-05-30 15:28:54', '2023-05-30 15:28:54');
INSERT INTO `sys_dict_type` VALUES (26, '系统状态', 'sys_common_status', '0', 'admin', NULL, '登录状态列表', '2023-05-30 16:52:47', '2023-05-30 16:52:47');
INSERT INTO `sys_dict_type` VALUES (27, '操作类型', 'sys_oper_type', '0', 'admin', NULL, '操作类型列表', '2023-05-30 16:53:44', '2023-05-30 16:53:44');
INSERT INTO `sys_dict_type` VALUES (29, '任务状态', 'sys_job_status', '0', 'admin', NULL, '任务状态列表', '2023-06-19 09:19:31', '2023-06-19 09:19:31');
INSERT INTO `sys_dict_type` VALUES (30, '任务分组', 'sys_job_group', '0', 'admin', NULL, '任务分组列表', '2023-06-19 09:19:46', '2023-06-19 09:19:46');

-- ----------------------------
-- Table structure for sys_logininfor
-- ----------------------------
DROP TABLE IF EXISTS `sys_logininfor`;
CREATE TABLE `sys_logininfor`  (
  `info_id` int NOT NULL AUTO_INCREMENT COMMENT '访问ID',
  `user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户账号',
  `ipaddr` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登录IP地址',
  `login_location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登录地点',
  `browser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '浏览器类型',
  `os` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作系统',
  `status` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登录状态（0成功 1失败）',
  `msg` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '提示消息',
  `login_time` datetime NULL DEFAULT NULL COMMENT '访问时间',
  `created_at` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`info_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 236 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '系统访问记录' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_logininfor
-- ----------------------------
INSERT INTO `sys_logininfor` VALUES (234, 'admin', '127.0.0.1', '内网IP', 'Chrome 110', 'Windows 10', '0', '登录成功', '2023-08-17 17:28:31', '2023-08-17 17:28:31', '2023-08-17 17:28:31');
INSERT INTO `sys_logininfor` VALUES (235, 'admin', '127.0.0.1', '内网IP', 'Chrome 110', 'Windows 10', '0', '登录成功', '2023-08-18 14:47:37', '2023-08-18 14:47:37', '2023-08-18 14:47:37');
INSERT INTO `sys_logininfor` VALUES (236, 'admin', '61.144.103.62', '广东 广州市', 'Chrome 110', 'Windows 10', '0', '登录成功', '2023-08-22 09:34:06', '2023-08-22 09:34:06', '2023-08-22 09:34:06');
INSERT INTO `sys_logininfor` VALUES (237, 'admin', '61.144.103.62', '广东 广州市', 'Chrome 110', 'Windows 10', '0', '登录成功', '2023-08-22 10:47:38', '2023-08-22 10:47:38', '2023-08-22 10:47:38');
INSERT INTO `sys_logininfor` VALUES (238, 'admin', '61.144.103.62', '广东 广州市', 'Chrome 110', 'Windows 10', '0', '登录成功', '2023-08-23 09:22:28', '2023-08-23 09:22:28', '2023-08-23 09:22:28');

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `menu_id` bigint NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `menu_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '菜单名称',
  `parent_id` bigint NULL DEFAULT 0 COMMENT '父菜单ID',
  `order_num` bigint NULL DEFAULT 0 COMMENT '显示顺序',
  `path` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '路由地址',
  `component` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '组件路径',
  `query` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '路由参数',
  `is_frame` bigint NULL DEFAULT 1 COMMENT '是否为外链（0是 1否）',
  `is_cache` bigint NULL DEFAULT 0 COMMENT '是否缓存（0缓存 1不缓存）',
  `menu_type` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '菜单类型（M目录 C菜单 F按钮)',
  `visible` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '菜单状态（0显示 1隐藏）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
  `perms` char(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '权限标识',
  `icon` char(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '菜单图标',
  `create_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `update_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `remark` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`menu_id`) USING BTREE,
  UNIQUE INDEX `menu_id`(`menu_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1215 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, '首页', 0, 1, 'home', '/home', '', 1, 1, 'C', '0', '0', 'home:list', 'shouye', 'admin', 'admin', '', '2022-12-16 13:56:36', '2023-07-03 15:35:02');
INSERT INTO `sys_menu` VALUES (2, '系统管理', 0, 2, 'system', '', '', 1, 0, 'M', '0', '0', '', '设置看板', 'admin', 'admin', '', '2022-12-16 13:56:36', '2023-05-30 14:44:38');
INSERT INTO `sys_menu` VALUES (3, '用户管理', 2, 1, 'user', '/system/user', '', 1, 0, 'C', '0', '0', 'system:user:list', 'user', 'admin', 'test', '', '2022-12-16 13:56:36', '2023-06-06 11:23:45');
INSERT INTO `sys_menu` VALUES (4, '菜单管理', 2, 3, 'menu', '/system/menu', '', 1, 0, 'C', '0', '0', 'system:menu:list', 'tree-table', 'admin', 'admin', '', '2022-12-16 13:56:36', '2023-04-20 16:36:27');
INSERT INTO `sys_menu` VALUES (5, '个人中心', 0, 1, 'profile', '/user/profile', '', 1, 1, 'C', '1', '0', 'profile:list', 'user', 'admin', 'admin', '', '2022-12-16 13:56:36', '2023-07-03 15:34:59');
INSERT INTO `sys_menu` VALUES (6, '角色管理', 2, 2, 'role', '/system/role', '', 1, 0, 'C', '0', '0', 'system:role:list', '角色管理', 'admin', 'admin', '', '2022-12-16 13:56:36', '2023-04-21 09:27:28');
INSERT INTO `sys_menu` VALUES (7, '字典管理', 2, 6, 'dictType', '/system/dictType', '', 1, 0, 'C', '0', '0', 'system:dictType:list', 'dict', 'admin', 'admin', '', '2022-12-16 13:56:36', '2023-06-14 13:38:19');
INSERT INTO `sys_menu` VALUES (8, '字典数据', 2, 6, 'dictData/:dictType', '/system/dictData', '', 1, 0, 'C', '1', '0', 'system:dictData:list', 'dict', 'admin', 'admin', '', '2022-12-16 13:56:36', '2023-04-20 16:37:21');
INSERT INTO `sys_menu` VALUES (9, '新增', 3, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:user:add', '#', 'admin', 'test', '', '2022-12-16 14:01:27', '2023-06-07 09:37:13');
INSERT INTO `sys_menu` VALUES (1008, '系统工具', 0, 4, 'tool', NULL, NULL, 1, 0, 'M', '0', '0', NULL, 'table', '', 'admin', NULL, '2023-04-20 16:25:41', '2023-07-03 16:14:13');
INSERT INTO `sys_menu` VALUES (1009, '修改生成配置', 1008, 2, 'genEdit/:tableId', '/tool/genEdit', NULL, 1, 0, 'C', '1', '0', 'tool:genEdit:list', 'edit', '', '', NULL, '2023-04-20 16:27:12', '2023-05-11 15:30:33');
INSERT INTO `sys_menu` VALUES (1016, '代码生成', 1008, 1, 'gen', '/tool/gen', NULL, 1, 0, 'C', '0', '0', 'tool:gen:list', '闪电', '', 'admin', NULL, '2023-04-25 15:44:19', '2023-05-31 15:17:52');
INSERT INTO `sys_menu` VALUES (1017, '分配用户', 2, 2, 'roleUser/:roleId', '/system/role/roleUser', NULL, 1, 0, 'C', '1', '0', 'system:roleUser:list', '用户', '', 'admin', NULL, '2023-05-27 15:08:38', '2023-06-14 13:38:30');
INSERT INTO `sys_menu` VALUES (1018, '部门管理', 2, 4, 'dept', '/system/dept', NULL, 1, 0, 'C', '0', '0', 'system:dept:list', 'tree', '', 'admin', NULL, '2023-05-29 16:04:26', '2023-06-07 11:02:43');
INSERT INTO `sys_menu` VALUES (1020, '岗位管理', 2, 5, 'post', '/system/post', NULL, 1, 0, 'C', '0', '0', 'system:post:list', 'post', '', 'admin', NULL, '2023-05-30 10:28:29', '2023-05-30 11:03:16');
INSERT INTO `sys_menu` VALUES (1021, '参数设置', 2, 7, 'config', '/system/config', NULL, 1, 0, 'C', '0', '0', 'system:config:list', 'edit', '', 'admin', NULL, '2023-05-30 14:31:58', '2023-05-30 14:45:23');
INSERT INTO `sys_menu` VALUES (1026, '通知公告', 2, 8, 'notice', '/system/notice', NULL, 1, 0, 'C', '0', '0', 'system:notice:list', 'email', '', 'admin', NULL, '2023-05-30 15:48:17', '2023-05-30 15:55:10');
INSERT INTO `sys_menu` VALUES (1028, '日志管理', 2, 9, 'logMan', NULL, NULL, 1, 0, 'M', '0', '0', NULL, 'log', '', 'admin', NULL, '2023-05-30 16:28:02', '2023-08-03 09:55:02');
INSERT INTO `sys_menu` VALUES (1029, '操作日志', 1028, 1, 'operlog', '/system/logMan/operlog', NULL, 1, 0, 'C', '0', '0', 'system:operlog:list', 'form', '', 'admin', NULL, '2023-05-30 17:00:31', '2023-08-03 09:55:26');
INSERT INTO `sys_menu` VALUES (1030, '登录日志', 1028, 2, 'logininfor', '/system/logMan/logininfor', NULL, 1, 0, 'C', '0', '0', 'system:logininfor:list', 'logininfor', '', 'admin', NULL, '2023-05-31 10:34:19', '2023-08-03 09:55:40');
INSERT INTO `sys_menu` VALUES (1031, '修改', 3, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:user:edit', '', '', '', NULL, '2023-06-07 09:37:36', '2023-06-07 09:37:36');
INSERT INTO `sys_menu` VALUES (1034, '删除', 3, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:user:remove', '', '', '', NULL, '2023-06-07 09:41:27', '2023-06-07 09:41:27');
INSERT INTO `sys_menu` VALUES (1035, '导出', 3, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:user:export', '', '', '', NULL, '2023-06-07 09:41:46', '2023-06-07 09:41:46');
INSERT INTO `sys_menu` VALUES (1036, '导入', 3, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:user:import', '', '', '', NULL, '2023-06-07 09:41:57', '2023-06-07 09:41:57');
INSERT INTO `sys_menu` VALUES (1037, '重置密码', 3, 6, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:user:resetPwd', '', '', '', NULL, '2023-06-07 09:42:14', '2023-06-07 09:42:14');
INSERT INTO `sys_menu` VALUES (1038, '查询', 3, 0, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:user:query', '', '', '', NULL, '2023-06-07 10:57:46', '2023-06-07 10:57:46');
INSERT INTO `sys_menu` VALUES (1039, '查询', 6, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:role:query', '', '', '', NULL, '2023-06-07 10:58:15', '2023-06-07 10:58:15');
INSERT INTO `sys_menu` VALUES (1040, '新增', 6, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:role:add', '', '', '', NULL, '2023-06-07 10:58:30', '2023-06-07 10:58:30');
INSERT INTO `sys_menu` VALUES (1041, '修改', 6, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:role:edit', '', '', '', NULL, '2023-06-07 10:58:46', '2023-06-07 10:58:46');
INSERT INTO `sys_menu` VALUES (1042, '删除', 6, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:role:remove', '', '', 'admin', NULL, '2023-06-07 10:59:03', '2023-06-07 10:59:11');
INSERT INTO `sys_menu` VALUES (1043, '导出', 6, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:role:export', '', '', '', NULL, '2023-06-07 10:59:25', '2023-06-07 10:59:25');
INSERT INTO `sys_menu` VALUES (1044, '查询', 4, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:menu:query', '', '', '', NULL, '2023-06-07 11:01:13', '2023-06-07 11:01:13');
INSERT INTO `sys_menu` VALUES (1045, '新增', 4, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:menu:add', '', '', '', NULL, '2023-06-07 11:01:33', '2023-06-07 11:01:33');
INSERT INTO `sys_menu` VALUES (1046, '修改', 4, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:menu:edit', '', '', '', NULL, '2023-06-07 11:01:46', '2023-06-07 11:01:46');
INSERT INTO `sys_menu` VALUES (1047, '删除', 4, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:menu:remove', '', '', '', NULL, '2023-06-07 11:01:59', '2023-06-07 11:01:59');
INSERT INTO `sys_menu` VALUES (1048, '查询', 1018, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:dept:query', '', '', '', NULL, '2023-06-07 11:03:01', '2023-06-07 11:03:01');
INSERT INTO `sys_menu` VALUES (1049, '新增', 1018, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:dept:add', '', '', '', NULL, '2023-06-07 11:03:12', '2023-06-07 11:03:12');
INSERT INTO `sys_menu` VALUES (1050, '修改', 1018, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:dept:edit', '', '', '', NULL, '2023-06-07 11:03:24', '2023-06-07 11:03:24');
INSERT INTO `sys_menu` VALUES (1051, '删除', 1018, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:dept:remove', '', '', '', NULL, '2023-06-07 11:03:34', '2023-06-07 11:03:34');
INSERT INTO `sys_menu` VALUES (1052, '查询', 1020, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:post:query', '', '', '', NULL, '2023-06-07 11:03:54', '2023-06-07 11:03:54');
INSERT INTO `sys_menu` VALUES (1053, '新增', 1020, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:post:add', '', '', '', NULL, '2023-06-07 11:04:07', '2023-06-07 11:04:07');
INSERT INTO `sys_menu` VALUES (1054, '修改', 1020, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:post:edit', '', '', '', NULL, '2023-06-07 11:04:17', '2023-06-07 11:04:17');
INSERT INTO `sys_menu` VALUES (1055, '删除', 1020, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:post:remove', '', '', '', NULL, '2023-06-07 11:04:29', '2023-06-07 11:04:29');
INSERT INTO `sys_menu` VALUES (1056, '导出', 1020, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:post:export', '', '', '', NULL, '2023-06-07 11:04:39', '2023-06-07 11:04:39');
INSERT INTO `sys_menu` VALUES (1057, '查询', 7, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:dict:query', '', '', '', NULL, '2023-06-07 11:05:01', '2023-06-07 11:05:01');
INSERT INTO `sys_menu` VALUES (1058, '新增', 7, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:dict:add', '', '', '', NULL, '2023-06-07 11:05:29', '2023-06-07 11:05:29');
INSERT INTO `sys_menu` VALUES (1059, '修改', 7, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:dict:edit', '', '', '', NULL, '2023-06-07 11:05:39', '2023-06-07 11:05:39');
INSERT INTO `sys_menu` VALUES (1060, '删除', 7, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:dict:remove', '', '', '', NULL, '2023-06-07 11:05:51', '2023-06-07 11:05:51');
INSERT INTO `sys_menu` VALUES (1061, '导出', 7, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:dict:export', '', '', '', NULL, '2023-06-07 11:06:03', '2023-06-07 11:06:03');
INSERT INTO `sys_menu` VALUES (1062, '查询', 1021, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:config:query', '', '', '', NULL, '2023-06-07 11:08:09', '2023-06-07 11:08:09');
INSERT INTO `sys_menu` VALUES (1063, '新增', 1021, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:config:add', '', '', 'admin', NULL, '2023-06-07 11:08:25', '2023-06-07 11:08:43');
INSERT INTO `sys_menu` VALUES (1064, '修改', 1021, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:config:edit', '', '', '', NULL, '2023-06-07 11:08:40', '2023-06-07 11:08:40');
INSERT INTO `sys_menu` VALUES (1065, '删除', 1021, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:config:remove', '', '', '', NULL, '2023-06-07 11:09:01', '2023-06-07 11:09:01');
INSERT INTO `sys_menu` VALUES (1066, '导出', 1021, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:config:export', '', '', '', NULL, '2023-06-07 11:09:27', '2023-06-07 11:09:27');
INSERT INTO `sys_menu` VALUES (1067, '查询', 1026, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:notice:query', '', '', '', NULL, '2023-06-07 11:09:57', '2023-06-07 11:09:57');
INSERT INTO `sys_menu` VALUES (1068, '新增', 1026, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:notice:add', '', '', '', NULL, '2023-06-07 11:10:10', '2023-06-07 11:10:10');
INSERT INTO `sys_menu` VALUES (1069, '修改', 1026, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:notice:edit', '', '', '', NULL, '2023-06-07 11:10:22', '2023-06-07 11:10:22');
INSERT INTO `sys_menu` VALUES (1070, '删除', 1026, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:notice:remove', '', '', '', NULL, '2023-06-07 11:10:34', '2023-06-07 11:10:34');
INSERT INTO `sys_menu` VALUES (1071, '查询', 1029, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:operlog:query', '', '', '', NULL, '2023-06-07 11:11:01', '2023-06-07 11:11:01');
INSERT INTO `sys_menu` VALUES (1072, '删除', 1029, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:operlog:remove', '', '', '', NULL, '2023-06-07 11:11:13', '2023-06-07 11:11:13');
INSERT INTO `sys_menu` VALUES (1073, '导出', 1029, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:operlog:export', '', '', '', NULL, '2023-06-07 11:11:25', '2023-06-07 11:11:25');
INSERT INTO `sys_menu` VALUES (1074, '查询', 1030, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:logininfor:query', '', '', '', NULL, '2023-06-07 11:12:44', '2023-06-07 11:12:44');
INSERT INTO `sys_menu` VALUES (1075, '删除', 1030, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:logininfor:remove', '', '', '', NULL, '2023-06-07 11:13:00', '2023-06-07 11:13:00');
INSERT INTO `sys_menu` VALUES (1076, '导出', 1030, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:logininfor:export', '', '', '', NULL, '2023-06-07 11:13:12', '2023-06-07 11:13:12');
INSERT INTO `sys_menu` VALUES (1077, '账户解锁', 1030, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:logininfor:unlock', '', '', '', NULL, '2023-06-07 11:13:28', '2023-06-07 11:13:28');
INSERT INTO `sys_menu` VALUES (1078, '查询', 1016, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'tool:gen:query', '', '', '', NULL, '2023-06-07 11:14:00', '2023-06-07 11:14:00');
INSERT INTO `sys_menu` VALUES (1079, '修改', 1016, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'tool:gen:edit', '', '', '', NULL, '2023-06-07 11:14:15', '2023-06-07 11:14:15');
INSERT INTO `sys_menu` VALUES (1080, '删除', 1016, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'tool:gen:remove', '', '', '', NULL, '2023-06-07 11:14:26', '2023-06-07 11:14:26');
INSERT INTO `sys_menu` VALUES (1081, '导入代码', 1016, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'tool:gen:import', '', '', '', NULL, '2023-06-07 11:14:42', '2023-06-07 11:14:42');
INSERT INTO `sys_menu` VALUES (1082, '预览代码', 1016, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'tool:gen:preview', '', '', '', NULL, '2023-06-07 11:14:56', '2023-06-07 11:14:56');
INSERT INTO `sys_menu` VALUES (1083, '生成代码', 1016, 6, '', NULL, NULL, 1, 0, 'F', '0', '0', 'tool:gen:code', '', '', '', NULL, '2023-06-07 11:15:09', '2023-06-07 11:15:09');
INSERT INTO `sys_menu` VALUES (1092, '查询', 1091, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:roleUser:query', '', '', '', NULL, '2023-06-12 16:53:10', '2023-06-12 16:53:10');
INSERT INTO `sys_menu` VALUES (1093, '新增', 1091, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:roleUser:add', '', '', '', NULL, '2023-06-12 16:53:10', '2023-06-12 16:53:10');
INSERT INTO `sys_menu` VALUES (1094, '修改', 1091, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:roleUser:edit', '', '', '', NULL, '2023-06-12 16:53:10', '2023-06-12 16:53:10');
INSERT INTO `sys_menu` VALUES (1095, '删除', 1091, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:roleUser:remove', '', '', '', NULL, '2023-06-12 16:53:10', '2023-06-12 16:53:10');
INSERT INTO `sys_menu` VALUES (1096, '导出', 1091, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:roleUser:export', '', '', '', NULL, '2023-06-12 16:53:10', '2023-06-12 16:53:10');
INSERT INTO `sys_menu` VALUES (1097, '系统监控', 0, 3, 'monitor', NULL, NULL, 1, 0, 'M', '0', '0', NULL, 'monitor', '', '', NULL, '2023-06-13 15:02:19', '2023-06-13 15:02:19');
INSERT INTO `sys_menu` VALUES (1098, '在线用户', 1097, 1, 'online', '/monitor/online', NULL, 1, 0, 'C', '0', '0', 'monitor:online:list', 'online', '', 'admin', NULL, '2023-06-13 15:02:58', '2023-06-13 15:10:29');
INSERT INTO `sys_menu` VALUES (1099, '在线查询', 1098, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:online:query', '', '', '', NULL, '2023-06-13 15:03:39', '2023-06-13 15:03:39');
INSERT INTO `sys_menu` VALUES (1100, '批量强退', 1098, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:online:batchLogout', '', '', '', NULL, '2023-06-13 15:04:06', '2023-06-13 15:04:06');
INSERT INTO `sys_menu` VALUES (1101, '单条强退', 1098, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:online:forceLogout', '', '', '', NULL, '2023-06-13 15:04:30', '2023-06-13 15:04:30');
INSERT INTO `sys_menu` VALUES (1102, '服务监控', 1097, 3, 'server', '/monitor/server', NULL, 1, 1, 'C', '0', '0', 'monitor:server:list', 'server', '', 'admin', NULL, '2023-06-14 16:12:21', '2023-06-25 14:09:39');
INSERT INTO `sys_menu` VALUES (1103, '查询', 1102, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:server:query', '', '', '', NULL, '2023-06-15 13:51:55', '2023-06-15 13:51:55');
INSERT INTO `sys_menu` VALUES (1104, '缓存监控', 1097, 4, 'cache', '/monitor/cache/', NULL, 1, 1, 'C', '0', '0', 'monitor:cache:list', 'redis', '', 'admin', NULL, '2023-06-16 10:19:35', '2023-06-25 14:09:44');
INSERT INTO `sys_menu` VALUES (1105, '缓存列表', 1097, 5, 'cacheList', '/monitor/cacheList/', NULL, 1, 1, 'C', '0', '0', 'monitor:cacheList:list', 'redis-list', '', 'admin', NULL, '2023-06-16 10:20:16', '2023-06-25 14:09:48');
INSERT INTO `sys_menu` VALUES (1107, '定时任务', 1097, 2, 'job', '/monitor/job', NULL, 1, 0, 'C', '0', '0', 'monitor:job:list', 'job', '', 'admin', NULL, '2023-06-19 09:27:23', '2023-06-19 12:00:19');
INSERT INTO `sys_menu` VALUES (1108, '查询', 1107, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:job:query', '', '', '', NULL, '2023-06-19 09:27:23', '2023-06-19 09:27:23');
INSERT INTO `sys_menu` VALUES (1109, '新增', 1107, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:job:add', '', '', '', NULL, '2023-06-19 09:27:23', '2023-06-19 09:27:23');
INSERT INTO `sys_menu` VALUES (1110, '修改', 1107, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:job:edit', '', '', '', NULL, '2023-06-19 09:27:23', '2023-06-19 09:27:23');
INSERT INTO `sys_menu` VALUES (1111, '删除', 1107, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:job:remove', '', '', '', NULL, '2023-06-19 09:27:23', '2023-06-19 09:27:23');
INSERT INTO `sys_menu` VALUES (1112, '导出', 1107, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:job:export', '', '', '', NULL, '2023-06-19 09:27:23', '2023-06-19 09:27:23');
INSERT INTO `sys_menu` VALUES (1113, '调度日志', 1097, 2, 'jobLog/:jobId', '/monitor/jobLog', NULL, 1, 0, 'C', '1', '0', 'monitor:jobLog:list', 'jobLog', '', 'admin', NULL, '2023-06-19 11:35:18', '2023-06-19 12:00:24');
INSERT INTO `sys_menu` VALUES (1114, '查询', 1113, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:query', '', '', '', NULL, '2023-06-19 11:35:18', '2023-06-19 11:35:18');
INSERT INTO `sys_menu` VALUES (1117, '删除', 1113, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:remove', '', '', '', NULL, '2023-06-19 11:35:18', '2023-06-19 11:35:18');
INSERT INTO `sys_menu` VALUES (1118, '导出', 1113, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:export', '', '', '', NULL, '2023-06-19 11:35:18', '2023-06-19 11:35:18');
INSERT INTO `sys_menu` VALUES (1120, '查询', 1119, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:query', '', '', '', NULL, '2023-06-19 11:48:27', '2023-06-19 11:48:27');
INSERT INTO `sys_menu` VALUES (1121, '新增', 1119, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:add', '', '', '', NULL, '2023-06-19 11:48:27', '2023-06-19 11:48:27');
INSERT INTO `sys_menu` VALUES (1122, '修改', 1119, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:edit', '', '', '', NULL, '2023-06-19 11:48:27', '2023-06-19 11:48:27');
INSERT INTO `sys_menu` VALUES (1123, '删除', 1119, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:remove', '', '', '', NULL, '2023-06-19 11:48:27', '2023-06-19 11:48:27');
INSERT INTO `sys_menu` VALUES (1124, '导出', 1119, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:export', '', '', '', NULL, '2023-06-19 11:48:27', '2023-06-19 11:48:27');
INSERT INTO `sys_menu` VALUES (1126, '查询', 1125, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:query', '', '', '', NULL, '2023-06-19 11:49:10', '2023-06-19 11:49:10');
INSERT INTO `sys_menu` VALUES (1127, '新增', 1125, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:add', '', '', '', NULL, '2023-06-19 11:49:10', '2023-06-19 11:49:10');
INSERT INTO `sys_menu` VALUES (1128, '修改', 1125, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:edit', '', '', '', NULL, '2023-06-19 11:49:10', '2023-06-19 11:49:10');
INSERT INTO `sys_menu` VALUES (1129, '删除', 1125, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:remove', '', '', '', NULL, '2023-06-19 11:49:10', '2023-06-19 11:49:10');
INSERT INTO `sys_menu` VALUES (1130, '导出', 1125, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:export', '', '', '', NULL, '2023-06-19 11:49:10', '2023-06-19 11:49:10');
INSERT INTO `sys_menu` VALUES (1132, '查询', 1131, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:query', '', '', '', NULL, '2023-06-19 11:50:10', '2023-06-19 11:50:10');
INSERT INTO `sys_menu` VALUES (1133, '新增', 1131, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:add', '', '', '', NULL, '2023-06-19 11:50:10', '2023-06-19 11:50:10');
INSERT INTO `sys_menu` VALUES (1134, '修改', 1131, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:edit', '', '', '', NULL, '2023-06-19 11:50:10', '2023-06-19 11:50:10');
INSERT INTO `sys_menu` VALUES (1135, '删除', 1131, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:remove', '', '', '', NULL, '2023-06-19 11:50:10', '2023-06-19 11:50:10');
INSERT INTO `sys_menu` VALUES (1136, '导出', 1131, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:export', '', '', '', NULL, '2023-06-19 11:50:10', '2023-06-19 11:50:10');
INSERT INTO `sys_menu` VALUES (1138, '查询', 1137, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:query', '', '', '', NULL, '2023-06-19 14:48:28', '2023-06-19 14:48:28');
INSERT INTO `sys_menu` VALUES (1139, '新增', 1137, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:add', '', '', '', NULL, '2023-06-19 14:48:28', '2023-06-19 14:48:28');
INSERT INTO `sys_menu` VALUES (1140, '修改', 1137, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:edit', '', '', '', NULL, '2023-06-19 14:48:28', '2023-06-19 14:48:28');
INSERT INTO `sys_menu` VALUES (1141, '删除', 1137, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:remove', '', '', '', NULL, '2023-06-19 14:48:28', '2023-06-19 14:48:28');
INSERT INTO `sys_menu` VALUES (1142, '导出', 1137, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:export', '', '', '', NULL, '2023-06-19 14:48:28', '2023-06-19 14:48:28');
INSERT INTO `sys_menu` VALUES (1144, '查询', 1143, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:query', '', '', '', NULL, '2023-06-19 14:51:26', '2023-06-19 14:51:26');
INSERT INTO `sys_menu` VALUES (1145, '新增', 1143, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:add', '', '', '', NULL, '2023-06-19 14:51:26', '2023-06-19 14:51:26');
INSERT INTO `sys_menu` VALUES (1146, '修改', 1143, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:edit', '', '', '', NULL, '2023-06-19 14:51:26', '2023-06-19 14:51:26');
INSERT INTO `sys_menu` VALUES (1147, '删除', 1143, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:remove', '', '', '', NULL, '2023-06-19 14:51:26', '2023-06-19 14:51:26');
INSERT INTO `sys_menu` VALUES (1148, '导出', 1143, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'monitor:jobLog:export', '', '', '', NULL, '2023-06-19 14:51:26', '2023-06-19 14:51:26');
INSERT INTO `sys_menu` VALUES (1149, '分配角色', 2, 1, 'userAuth/:userId', '/system/user/userAuth', NULL, 1, 0, 'C', '1', '0', 'system:userAuth:list', '', '', 'admin', NULL, '2023-06-26 13:59:11', '2023-06-26 13:59:31');
INSERT INTO `sys_menu` VALUES (1151, '测试菜单', 1150, 1, 'cs', NULL, NULL, 1, 0, 'C', '0', '0', NULL, 'cascader', '', '', NULL, '2023-06-27 09:22:25', '2023-06-27 09:22:25');
INSERT INTO `sys_menu` VALUES (1152, '测试按钮', 1151, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'csan', '', '', '', NULL, '2023-06-27 09:22:39', '2023-06-27 09:22:39');
INSERT INTO `sys_menu` VALUES (1214, '通知', 1026, 5, '', NULL, NULL, 1, 0, 'F', '0', '0', 'system:notice:notice', '', '', '', NULL, '2023-08-04 10:21:16', '2023-08-04 10:21:16');

-- ----------------------------
-- Table structure for sys_notice
-- ----------------------------
DROP TABLE IF EXISTS `sys_notice`;
CREATE TABLE `sys_notice`  (
  `notice_id` int NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `notice_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公告标题',
  `notice_type` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公告类型（1通知 2公告）',
  `notice_content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '公告内容',
  `status` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '公告状态（0正常 1关闭）',
  `imgs` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '图片存储地址',
  `create_by` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `created_at` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `updated_at` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`notice_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '通知公告表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_notice
-- ----------------------------
INSERT INTO `sys_notice` VALUES (17, '测试', '1', '<p>今天我测试通知</p>', '0', '[]', 'admin', '2023-08-04 08:51:45', 'admin', '2023-08-14 17:24:25', NULL);
INSERT INTO `sys_notice` VALUES (19, '测试图片', '1', '<p>这是测试2通知<img src=\"http://zhaowenchao.top/uploads/a849a5932e6a0941fc34b1a00.jpg\" alt=\"\" data-href=\"\" style=\"width: 199.30px;height: 139.55px;\"/></p>', '0', '[\"a849a5932e6a0941fc34b1a00.jpg\"]', 'admin', '2023-08-15 09:40:21', 'admin', '2023-08-22 09:34:34', NULL);

-- ----------------------------
-- Table structure for sys_oper_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_oper_log`;
CREATE TABLE `sys_oper_log`  (
  `oper_id` int NOT NULL AUTO_INCREMENT COMMENT '日志主键',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '模块标题',
  `business_type` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '业务类型（0其它 1新增 2修改 3删除）',
  `method` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '方法名称',
  `request_method` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '请求方式',
  `operator_type` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '操作类别（0其它 1后台用户 2手机端用户）',
  `oper_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作人员',
  `dept_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '部门名称',
  `oper_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '请求URL',
  `oper_ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '主机地址',
  `oper_location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作地点',
  `oper_param` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '请求参数',
  `json_result` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '返回参数',
  `status` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '操作状态（0正常 1异常）',
  `error_msg` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '错误消息',
  `oper_time` datetime NULL DEFAULT NULL COMMENT '操作时间',
  `created_at` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`oper_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 650 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '操作日志记录' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_oper_log
-- ----------------------------
INSERT INTO `sys_oper_log` VALUES (649, '操作日志', '9', '', 'DELETE', '', 'admin', '深圳总公司', '/system/logMan/operlog/clean', '127.0.0.1', '内网IP', '{}', '{\"code\":200,\"message\":\"操作成功\"}', '0', '', '2023-08-17 17:20:27', '2023-08-17 17:20:27', '2023-08-17 17:20:27');
INSERT INTO `sys_oper_log` VALUES (650, '通用模块', '1', '', 'POST', '', 'admin', '深圳总公司', '/common/image', '61.144.103.62', '广东 广州市', '{}', '{\"code\":200,\"message\":\"图片上传成功！\"}', '0', '', '2023-08-22 09:34:29', '2023-08-22 09:34:29', '2023-08-22 09:34:29');
INSERT INTO `sys_oper_log` VALUES (651, '通用模块', '1', '', 'POST', '', 'admin', '深圳总公司', '/common/delImage', '61.144.103.62', '广东 广州市', '[]', '{\"code\":200,\"message\":\"操作成功\"}', '0', '', '2023-08-22 09:34:34', '2023-08-22 09:34:34', '2023-08-22 09:34:34');
INSERT INTO `sys_oper_log` VALUES (652, '通知公告', '2', '', 'PUT', '', 'admin', '深圳总公司', '/system/notice', '61.144.103.62', '广东 广州市', '上传数据超长，未存储到数据库', '{\"code\":200,\"message\":\"操作成功\"}', '0', '', '2023-08-22 09:34:34', '2023-08-22 09:34:34', '2023-08-22 09:34:34');

-- ----------------------------
-- Table structure for sys_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_post`;
CREATE TABLE `sys_post`  (
  `post_id` bigint NOT NULL AUTO_INCREMENT COMMENT '部门id',
  `post_code` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '岗位编码',
  `post_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '岗位名称',
  `post_sort` bigint NULL DEFAULT NULL COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '岗位状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `update_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `remark` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`post_id`) USING BTREE,
  UNIQUE INDEX `post_id`(`post_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_post
-- ----------------------------
INSERT INTO `sys_post` VALUES (1, 'ceo', '董事长', 1, '0', '0', '', 'admin', '', '2023-02-28 10:39:35', '2023-06-29 16:45:01');
INSERT INTO `sys_post` VALUES (2, 'se', '项目经理', 2, '0', '0', '', 'admin', '', '2023-02-28 10:40:18', '2023-05-30 11:13:21');
INSERT INTO `sys_post` VALUES (3, 'hr', '人力资源', 3, '0', '0', 'admin', 'admin', NULL, '2023-05-30 11:17:18', '2023-05-30 11:21:28');
INSERT INTO `sys_post` VALUES (5, 'user', '普通员工', 4, '0', '0', 'admin', 'admin', NULL, '2023-05-30 11:21:59', '2023-06-29 16:40:19');
INSERT INTO `sys_post` VALUES (6, 'cs', '测试', 5, '0', '2', 'admin', NULL, NULL, '2023-06-27 10:38:22', '2023-06-27 10:38:25');
INSERT INTO `sys_post` VALUES (7, '测试', '测试', 0, '0', '2', 'admin', NULL, NULL, '2023-08-04 09:14:26', '2023-08-04 09:16:11');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `role_id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色名称',
  `role_key` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色权限字符串',
  `role_sort` bigint NULL DEFAULT NULL COMMENT '显示顺序',
  `data_scope` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '删除标志（0代表存在 1代表删除）',
  `create_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `update_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `remark` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`role_id`) USING BTREE,
  UNIQUE INDEX `role_id`(`role_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '角色信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '超级管理员', 'admin', 0, '1', '0', '0', 'admin', NULL, NULL, '2023-05-26 11:40:15', '2023-05-26 11:40:15');
INSERT INTO `sys_role` VALUES (3, '测试角色', 'test', 1, '1', '0', '0', 'admin', 'admin', '测试', '2023-05-26 11:40:47', '2023-07-08 17:22:45');
INSERT INTO `sys_role` VALUES (12, '测试角色2', 'test2', 3, '1', '0', '0', 'admin', 'admin', '', '2023-06-26 15:39:08', '2023-06-27 09:53:47');
INSERT INTO `sys_role` VALUES (13, '测试角色3', 'cs3', 4, '1', '0', '1', 'admin', 'admin', '', '2023-06-27 10:06:48', '2023-07-08 15:39:50');

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` bigint NULL DEFAULT NULL COMMENT '角色ID',
  `menu_id` bigint NULL DEFAULT NULL COMMENT '菜单ID',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 803 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '菜单与角色关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (114, 11, 1, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (115, 11, 3, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (116, 11, 6, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (117, 11, 1017, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (118, 11, 4, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (119, 11, 1018, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (120, 11, 1020, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (121, 11, 7, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (122, 11, 8, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (123, 11, 1021, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (124, 11, 1026, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (125, 11, 9, '2023-06-06 14:55:25', '2023-06-06 14:55:25');
INSERT INTO `sys_role_menu` VALUES (476, 13, 1097, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (477, 13, 1098, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (478, 13, 1107, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (479, 13, 1113, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (480, 13, 1102, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (481, 13, 1104, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (482, 13, 1105, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (483, 13, 1099, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (484, 13, 1100, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (485, 13, 1101, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (486, 13, 1103, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (487, 13, 1108, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (488, 13, 1109, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (489, 13, 1110, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (490, 13, 1111, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (491, 13, 1112, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (492, 13, 1114, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (493, 13, 1117, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (494, 13, 1118, '2023-07-08 14:21:28', '2023-07-08 14:21:28');
INSERT INTO `sys_role_menu` VALUES (781, 3, 1, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (782, 3, 1017, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (783, 3, 9, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (784, 3, 5, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (785, 3, 1031, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (786, 3, 1149, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (787, 3, 1039, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (788, 3, 1040, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (789, 3, 1041, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (790, 3, 1042, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (791, 3, 1043, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (792, 3, 1038, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (793, 3, 1044, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (794, 3, 1045, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (795, 3, 1046, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (796, 3, 1047, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (797, 3, 1057, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (798, 3, 1058, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (799, 3, 1059, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (800, 3, 1060, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (801, 3, 1061, '2023-07-08 17:22:45', '2023-07-08 17:22:45');
INSERT INTO `sys_role_menu` VALUES (802, 3, 8, '2023-07-08 17:22:45', '2023-07-08 17:22:45');

-- ----------------------------
-- Table structure for sys_user_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_post`;
CREATE TABLE `sys_user_post`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint NULL DEFAULT NULL COMMENT '用户ID',
  `post_id` bigint NULL DEFAULT NULL COMMENT '岗位ID',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user_post
-- ----------------------------
INSERT INTO `sys_user_post` VALUES (1, 3, 2, '2023-03-01 14:09:43', '2023-03-01 14:09:43');
INSERT INTO `sys_user_post` VALUES (2, 3, 1, '2023-03-01 14:09:43', '2023-03-01 14:09:43');
INSERT INTO `sys_user_post` VALUES (7, 2, 2, '2023-03-01 17:10:25', '2023-03-01 17:10:25');
INSERT INTO `sys_user_post` VALUES (8, 5, 2, '2023-03-02 15:12:30', '2023-03-02 15:12:30');
INSERT INTO `sys_user_post` VALUES (12, 40, 1, '2023-05-26 14:01:50', '2023-05-26 14:01:50');
INSERT INTO `sys_user_post` VALUES (36, 52, 5, '2023-07-08 15:25:34', '2023-07-08 15:25:34');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint NULL DEFAULT NULL COMMENT '用户ID',
  `role_id` bigint NULL DEFAULT NULL COMMENT '角色ID',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 80 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (1, 1, 1, '2023-06-05 16:33:19', '2023-06-05 16:33:22');

-- ----------------------------
-- Table structure for tool_gen
-- ----------------------------
DROP TABLE IF EXISTS `tool_gen`;
CREATE TABLE `tool_gen`  (
  `table_id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  `table_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '表名称',
  `table_comment` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '表描述',
  `sub_table_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '关联子表的表名',
  `sub_table_fk_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '子表关联的外键名',
  `class_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '实体类名称',
  `tpl_category` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'crud' COMMENT '使用的模板（crud单表操作 tree树表操作 sub主子表）',
  `package_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '生成包路径',
  `module_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '生成模块名',
  `business_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '生成业务名',
  `function_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '生成功能名',
  `function_author` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '生成功能作者',
  `gen_type` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '生成代码方式（0zip压缩包 1自定义路径）',
  `is_import` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '数据库表是否导入（0导入，1未导入）',
  `gen_path` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '/' COMMENT '生成路径（不填默认项目路径）',
  `options` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '其它生成选项',
  `tree_code` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '树编码字段',
  `tree_parent_code` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '树父编码字段',
  `tree_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '树名称字段',
  `parent_id` bigint NULL DEFAULT NULL COMMENT '上级菜单Id',
  `remark` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '备注',
  `create_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `update_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`table_id`) USING BTREE,
  UNIQUE INDEX `table_id`(`table_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 149 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '代码生成表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tool_gen
-- ----------------------------
INSERT INTO `tool_gen` VALUES (131, 'leno_user', '用户信息表', '', '', 'LenoUser', 'crud', 'business.middleware.tool', 'system', 'user', '用户信息', 'wen', '1', '0', '/home/devEnv/leno-admin/src/business/middleware/tool/', '0', '', '', '', 2, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 17:26:08');
INSERT INTO `tool_gen` VALUES (132, 'monitor_job', '定时任务调度表', '', '', 'MonitorJob', 'crud', '', '', '', '', 'wen', '0', '0', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 17:26:08');
INSERT INTO `tool_gen` VALUES (133, 'monitor_job_log', '定时任务调度日志表', '', '', 'MonitorJobLog', 'crud', '', '', '', '', 'wen', '0', '0', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 17:26:08');
INSERT INTO `tool_gen` VALUES (134, 'sys_config', '参数配置表', '', '', 'SysConfig', 'crud', '', '', '', '', 'wen', '0', '0', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 17:26:08');
INSERT INTO `tool_gen` VALUES (135, 'sys_dept', '', '', '', 'SysDept', 'crud', '', '', '', '', 'wen', '0', '0', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 17:26:08');
INSERT INTO `tool_gen` VALUES (136, 'sys_dict_data', '', '', '', 'SysDictData', 'crud', '', '', '', '', 'wen', '0', '0', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 17:26:08');
INSERT INTO `tool_gen` VALUES (137, 'sys_dict_type', '', '', '', 'SysDictType', 'crud', '', '', '', '', 'wen', '0', '0', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 17:26:08');
INSERT INTO `tool_gen` VALUES (138, 'sys_logininfor', '系统访问记录', '', '', 'SysLogininfor', 'crud', '', '', '', '', 'wen', '0', '0', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 17:26:08');
INSERT INTO `tool_gen` VALUES (139, 'sys_menu', '', '', '', 'SysMenu', 'crud', '', '', '', '', 'wen', '0', '0', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 17:26:08');
INSERT INTO `tool_gen` VALUES (140, 'sys_notice', '通知公告表', '', '', 'SysNotice', 'crud', '', '', '', '', 'wen', '0', '0', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 17:26:08');
INSERT INTO `tool_gen` VALUES (141, 'sys_oper_log', '操作日志记录', '', '', 'SysOperLog', 'crud', '', '', '', '', 'wen', '0', '1', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 16:46:38');
INSERT INTO `tool_gen` VALUES (142, 'sys_post', '', '', '', 'SysPost', 'crud', '', '', '', '', 'wen', '0', '1', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 16:46:38');
INSERT INTO `tool_gen` VALUES (143, 'sys_role', '角色信息表', '', '', 'SysRole', 'crud', '', '', '', '', 'wen', '0', '1', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 16:46:38');
INSERT INTO `tool_gen` VALUES (144, 'sys_role_menu', '菜单与角色关联表', '', '', 'SysRoleMenu', 'crud', '', '', '', '', 'wen', '0', '1', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 16:46:38');
INSERT INTO `tool_gen` VALUES (145, 'sys_user_post', '', '', '', 'SysUserPost', 'crud', '', '', '', '', 'wen', '0', '1', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 16:46:38');
INSERT INTO `tool_gen` VALUES (146, 'sys_user_role', '', '', '', 'SysUserRole', 'crud', '', '', '', '', 'wen', '0', '1', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 16:46:38');
INSERT INTO `tool_gen` VALUES (147, 'tool_gen', '代码生成表', '', '', 'ToolGen', 'crud', '', '', '', '', 'wen', '0', '1', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 16:46:38');
INSERT INTO `tool_gen` VALUES (148, 'tool_gen_column', '代码生成字段表', '', '', 'ToolGenColumn', 'crud', '', '', '', '', 'wen', '0', '1', '/', '0', '', '', '', NULL, '', NULL, 'admin', '2023-07-05 15:37:47', '2023-08-16 16:46:38');

-- ----------------------------
-- Table structure for tool_gen_column
-- ----------------------------
DROP TABLE IF EXISTS `tool_gen_column`;
CREATE TABLE `tool_gen_column`  (
  `column_id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  `table_id` bigint NULL DEFAULT NULL COMMENT '归属表编号',
  `column_name` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '列名称',
  `column_comment` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '列描述',
  `column_type` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '列类型',
  `column_default_value` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字段默认值',
  `ts_type` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT 'ts类型',
  `ts_field` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT 'ts字段名',
  `is_pk` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '是否主键（0是）',
  `is_increment` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '是否自增（0是）',
  `is_required` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '是否必填（0是）',
  `is_insert` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '是否为新增字段（0是）',
  `is_edit` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '是否编辑字段（0是）',
  `is_list` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '是否列表字段（0是）',
  `is_query` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '是否查询字段（0是）',
  `query_type` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'eq' COMMENT '查询方式（等于、不等于、大于、小于、范围）',
  `html_type` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）',
  `dict_type` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典类型',
  `sort` bigint NULL DEFAULT 0 COMMENT '排序',
  `create_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `update_by` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`column_id`) USING BTREE,
  UNIQUE INDEX `column_id`(`column_id` ASC) USING BTREE,
  INDEX `table_id`(`table_id` ASC) USING BTREE,
  CONSTRAINT `tool_gen_column_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tool_gen` (`table_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1471 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '代码生成字段表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tool_gen_column
-- ----------------------------
INSERT INTO `tool_gen_column` VALUES (1238, 131, 'user_id', '用户id', 'BIGINT', NULL, 'number', 'userId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1239, 131, 'dept_id', '部门ID', 'BIGINT', NULL, 'number', 'deptId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1240, 131, 'user_name', '用户账号', 'VARCHAR', NULL, 'string', 'userName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1241, 131, 'nick_name', '用户昵称', 'VARCHAR', NULL, 'string', 'nickName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1242, 131, 'user_type', '用户类型 0 管理员 , 1 非管理员', 'CHAR', '0', 'string', 'userType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1243, 131, 'email', '用户邮箱', 'CHAR', NULL, 'string', 'email', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1244, 131, 'phonenumber', '手机号码', 'CHAR', NULL, 'string', 'phonenumber', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1245, 131, 'sex', '用户性别，0男，1女', 'CHAR', '0', 'string', 'sex', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1246, 131, 'avatar', '头像地址', 'CHAR', NULL, 'string', 'avatar', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1247, 131, 'password', '用户密码', 'CHAR', NULL, 'string', 'password', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1248, 131, 'status', '账号状态: 0 正常，1 停用', 'CHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1249, 131, 'del_flag', '账号状态: 0 存在，1 删除', 'BIGINT', '0', 'number', 'delFlag', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1250, 131, 'login_ip', '最后登录的 IP', 'CHAR', NULL, 'string', 'loginIp', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1251, 131, 'login_date', '最后登录的 时间', 'TIME', NULL, 'string', 'loginDate', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1252, 131, 'create_by', '创建者', 'CHAR', NULL, 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1253, 131, 'update_by', '更新者', 'CHAR', NULL, 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1254, 131, 'remark', '备注', 'CHAR', NULL, 'string', 'remark', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1255, 131, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1256, 131, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', 'admin', '2023-07-05 15:37:47', '2023-08-03 15:08:39');
INSERT INTO `tool_gen_column` VALUES (1257, 132, 'job_id', '任务ID', 'BIGINT', NULL, 'number', 'jobId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1258, 132, 'job_name', '任务名称', 'VARCHAR', NULL, 'string', 'jobName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1259, 132, 'job_group', '任务组名', 'VARCHAR', 'DEFAULT', 'string', 'jobGroup', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1260, 132, 'invoke_target', '调用目标字符串', 'VARCHAR', NULL, 'string', 'invokeTarget', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1261, 132, 'cron_expression', 'cron执行表达式', 'VARCHAR', NULL, 'string', 'cronExpression', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1262, 132, 'misfire_policy', '计划执行错误策略（1立即执行 2执行一次 3放弃执行）', 'VARCHAR', '3', 'string', 'misfirePolicy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1263, 132, 'concurrent', '是否并发执行（0允许 1禁止）', 'VARCHAR', '1', 'string', 'concurrent', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1264, 132, 'status', '状态（0正常 1暂停）', 'VARCHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1265, 132, 'create_by', '创建者', 'VARCHAR', NULL, 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1266, 132, 'created_at', '创建时间', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1267, 132, 'update_by', '更新者', 'VARCHAR', NULL, 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1268, 132, 'updated_at', '更新时间', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1269, 132, 'remark', '备注信息', 'VARCHAR', NULL, 'string', 'remark', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1270, 133, 'job_log_id', '任务日志ID', 'BIGINT', NULL, 'number', 'jobLogId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1271, 133, 'job_name', '任务名称', 'VARCHAR', NULL, 'string', 'jobName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1272, 133, 'job_group', '任务组名', 'VARCHAR', NULL, 'string', 'jobGroup', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1273, 133, 'invoke_target', '调用目标字符串', 'VARCHAR', NULL, 'string', 'invokeTarget', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1274, 133, 'job_message', '日志信息', 'VARCHAR', NULL, 'string', 'jobMessage', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1275, 133, 'status', '执行状态（0正常 1失败）', 'VARCHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1276, 133, 'exception_info', '异常信息', 'TEXT', NULL, 'string', 'exceptionInfo', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1277, 133, 'created_at', '创建时间', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1278, 133, 'updated_at', '修改时间', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1279, 134, 'config_id', '参数主键', 'INT', NULL, 'number', 'configId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1280, 134, 'config_name', '参数名称', 'VARCHAR', NULL, 'string', 'configName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1281, 134, 'config_key', '参数键名', 'VARCHAR', NULL, 'string', 'configKey', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1282, 134, 'config_value', '参数键值', 'VARCHAR', NULL, 'string', 'configValue', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1283, 134, 'config_type', '系统内置（Y是 N否）', 'VARCHAR', 'N', 'string', 'configType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1284, 134, 'create_by', '创建者', 'VARCHAR', NULL, 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1285, 134, 'created_at', '创建时间', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1286, 134, 'update_by', '更新者', 'VARCHAR', NULL, 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1287, 134, 'updated_at', '更新时间', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1288, 134, 'remark', '备注', 'VARCHAR', NULL, 'string', 'remark', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1289, 135, 'dept_id', '部门id', 'BIGINT', NULL, 'number', 'deptId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1290, 135, 'parent_id', '父部门id', 'BIGINT', '0', 'number', 'parentId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1291, 135, 'ancestors', '祖级列表', 'CHAR', '', 'string', 'ancestors', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1292, 135, 'dept_name', '部门名称', 'CHAR', NULL, 'string', 'deptName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1293, 135, 'order_num', '显示顺序', 'BIGINT', '0', 'number', 'orderNum', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1294, 135, 'leader', '负责人', 'CHAR', NULL, 'string', 'leader', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1295, 135, 'phone', '联系电话', 'CHAR', NULL, 'string', 'phone', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1296, 135, 'email', '邮箱', 'CHAR', NULL, 'string', 'email', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1297, 135, 'status', '部门状态（0正常 1停用）', 'CHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1298, 135, 'del_flag', '删除标志（0代表存在 1代表删除）', 'CHAR', '0', 'string', 'delFlag', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1299, 135, 'create_by', '创建者', 'CHAR', NULL, 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1300, 135, 'update_by', '更新者', 'CHAR', NULL, 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1301, 135, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1302, 135, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1303, 136, 'dict_code', '部门id', 'BIGINT', NULL, 'number', 'dictCode', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1304, 136, 'dict_sort', '字典排序', 'BIGINT', '0', 'number', 'dictSort', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1305, 136, 'dict_label', '字典标签', 'CHAR', '', 'string', 'dictLabel', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1306, 136, 'dict_value', '字典键值', 'CHAR', '', 'string', 'dictValue', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1307, 136, 'dict_type', '字典类型', 'CHAR', '', 'string', 'dictType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1308, 136, 'css_class', '样式属性（其他样式扩展）', 'CHAR', NULL, 'string', 'cssClass', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1309, 136, 'list_class', '表格回显样式', 'CHAR', NULL, 'string', 'listClass', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1310, 136, 'is_default', '是否默认（Y是 N否）', 'CHAR', 'N', 'string', 'isDefault', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1311, 136, 'status', '状态（0正常 1停用）', 'CHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1312, 136, 'create_by', '创建者', 'CHAR', NULL, 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1313, 136, 'update_by', '更新者', 'CHAR', NULL, 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1314, 136, 'remark', '备注', 'CHAR', NULL, 'string', 'remark', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1315, 136, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1316, 136, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1317, 137, 'dict_id', '字典主键', 'BIGINT', NULL, 'number', 'dictId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1318, 137, 'dict_name', '字典名称', 'CHAR', '', 'string', 'dictName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1319, 137, 'dict_type', '字典类型', 'CHAR', '', 'string', 'dictType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1320, 137, 'status', '状态（0正常 1停用）', 'CHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1321, 137, 'create_by', '创建者', 'CHAR', NULL, 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1322, 137, 'update_by', '更新者', 'CHAR', NULL, 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1323, 137, 'remark', '备注', 'CHAR', NULL, 'string', 'remark', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1324, 137, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1325, 137, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1326, 138, 'info_id', '访问ID', 'INT', NULL, 'number', 'infoId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1327, 138, 'user_name', '用户账号', 'VARCHAR', NULL, 'string', 'userName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1328, 138, 'ipaddr', '登录IP地址', 'VARCHAR', NULL, 'string', 'ipaddr', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1329, 138, 'login_location', '登录地点', 'VARCHAR', NULL, 'string', 'loginLocation', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1330, 138, 'browser', '浏览器类型', 'VARCHAR', NULL, 'string', 'browser', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1331, 138, 'os', '操作系统', 'VARCHAR', NULL, 'string', 'os', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1332, 138, 'status', '登录状态（0成功 1失败）', 'VARCHAR', NULL, 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1333, 138, 'msg', '提示消息', 'VARCHAR', NULL, 'string', 'msg', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1334, 138, 'login_time', '访问时间', 'DATETIME', NULL, 'string', 'loginTime', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1335, 138, 'created_at', '创建时间', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1336, 138, 'updated_at', '修改时间', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1337, 139, 'menu_id', '菜单ID', 'BIGINT', NULL, 'number', 'menuId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1338, 139, 'menu_name', '菜单名称', 'VARCHAR', NULL, 'string', 'menuName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1339, 139, 'parent_id', '父菜单ID', 'BIGINT', '0', 'number', 'parentId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1340, 139, 'order_num', '显示顺序', 'BIGINT', '0', 'number', 'orderNum', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1341, 139, 'path', '路由地址', 'CHAR', '', 'string', 'path', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1342, 139, 'component', '组件路径', 'CHAR', NULL, 'string', 'component', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1343, 139, 'query', '路由参数', 'CHAR', NULL, 'string', 'query', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1344, 139, 'is_frame', '是否为外链（0是 1否）', 'BIGINT', '1', 'number', 'isFrame', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1345, 139, 'is_cache', '是否缓存（0缓存 1不缓存）', 'BIGINT', '0', 'number', 'isCache', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1346, 139, 'menu_type', '菜单类型（M目录 C菜单 F按钮)', 'CHAR', '', 'string', 'menuType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1347, 139, 'visible', '菜单状态（0显示 1隐藏）', 'CHAR', '0', 'string', 'visible', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1348, 139, 'status', '菜单状态（0正常 1停用）', 'CHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1349, 139, 'perms', '权限标识', 'CHAR', NULL, 'string', 'perms', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1350, 139, 'icon', '菜单图标', 'CHAR', '', 'string', 'icon', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1351, 139, 'create_by', '创建者', 'CHAR', '', 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1352, 139, 'update_by', '更新者', 'CHAR', '', 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1353, 139, 'remark', '备注', 'CHAR', NULL, 'string', 'remark', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1354, 139, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1355, 139, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1356, 140, 'notice_id', '公告ID', 'INT', NULL, 'number', 'noticeId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1357, 140, 'notice_title', '公告标题', 'VARCHAR', NULL, 'string', 'noticeTitle', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1358, 140, 'notice_type', '公告类型（1通知 2公告）', 'VARCHAR', NULL, 'string', 'noticeType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1359, 140, 'notice_content', '公告内容', 'LONGTEXT', NULL, '', 'noticeContent', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1360, 140, 'status', '公告状态（0正常 1关闭）', 'VARCHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1361, 140, 'imgs', '图片存储地址', 'TEXT', NULL, 'string', 'imgs', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1362, 140, 'create_by', '创建者', 'VARCHAR', NULL, 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1363, 140, 'created_at', '创建时间', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1364, 140, 'update_by', '更新者', 'VARCHAR', NULL, 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1365, 140, 'updated_at', '更新时间', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1366, 140, 'remark', '备注', 'VARCHAR', NULL, 'string', 'remark', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1367, 141, 'oper_id', '日志主键', 'INT', NULL, 'number', 'operId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1368, 141, 'title', '模块标题', 'VARCHAR', NULL, 'string', 'title', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1369, 141, 'business_type', '业务类型（0其它 1新增 2修改 3删除）', 'VARCHAR', '0', 'string', 'businessType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1370, 141, 'method', '方法名称', 'VARCHAR', NULL, 'string', 'method', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1371, 141, 'request_method', '请求方式', 'VARCHAR', NULL, 'string', 'requestMethod', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1372, 141, 'operator_type', '操作类别（0其它 1后台用户 2手机端用户）', 'VARCHAR', '0', 'string', 'operatorType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1373, 141, 'oper_name', '操作人员', 'VARCHAR', NULL, 'string', 'operName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1374, 141, 'dept_name', '部门名称', 'VARCHAR', NULL, 'string', 'deptName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1375, 141, 'oper_url', '请求URL', 'VARCHAR', NULL, 'string', 'operUrl', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1376, 141, 'oper_ip', '主机地址', 'VARCHAR', NULL, 'string', 'operIp', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1377, 141, 'oper_location', '操作地点', 'VARCHAR', NULL, 'string', 'operLocation', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1378, 141, 'oper_param', '请求参数', 'VARCHAR', NULL, 'string', 'operParam', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1379, 141, 'json_result', '返回参数', 'VARCHAR', NULL, 'string', 'jsonResult', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1380, 141, 'status', '操作状态（0正常 1异常）', 'VARCHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1381, 141, 'error_msg', '错误消息', 'VARCHAR', NULL, 'string', 'errorMsg', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1382, 141, 'oper_time', '操作时间', 'DATETIME', NULL, 'string', 'operTime', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1383, 141, 'created_at', '创建时间', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1384, 141, 'updated_at', '修改时间', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1385, 142, 'post_id', '部门id', 'BIGINT', NULL, 'number', 'postId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1386, 142, 'post_code', '岗位编码', 'CHAR', NULL, 'string', 'postCode', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1387, 142, 'post_name', '岗位名称', 'CHAR', NULL, 'string', 'postName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1388, 142, 'post_sort', '显示顺序', 'BIGINT', NULL, 'number', 'postSort', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1389, 142, 'status', '岗位状态（0正常 1停用）', 'CHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1390, 142, 'del_flag', '删除标志（0代表存在 2代表删除）', 'CHAR', '0', 'string', 'delFlag', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1391, 142, 'create_by', '创建者', 'CHAR', NULL, 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1392, 142, 'update_by', '更新者', 'CHAR', NULL, 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1393, 142, 'remark', '备注', 'CHAR', NULL, 'string', 'remark', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1394, 142, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1395, 142, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1396, 143, 'role_id', '角色ID', 'BIGINT', NULL, 'number', 'roleId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1397, 143, 'role_name', '角色名称', 'CHAR', NULL, 'string', 'roleName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1398, 143, 'role_key', '角色权限字符串', 'CHAR', NULL, 'string', 'roleKey', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1399, 143, 'role_sort', '显示顺序', 'BIGINT', NULL, 'number', 'roleSort', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1400, 143, 'data_scope', '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）', 'CHAR', '1', 'string', 'dataScope', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1401, 143, 'status', '部门状态（0正常 1停用）', 'CHAR', '0', 'string', 'status', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1402, 143, 'del_flag', '删除标志（0代表存在 1代表删除）', 'CHAR', '0', 'string', 'delFlag', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1403, 143, 'create_by', '创建者', 'CHAR', NULL, 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1404, 143, 'update_by', '更新者', 'CHAR', NULL, 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1405, 143, 'remark', '备注', 'CHAR', NULL, 'string', 'remark', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1406, 143, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1407, 143, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1408, 144, 'id', '', 'INT', NULL, 'number', 'id', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1409, 144, 'role_id', '角色ID', 'BIGINT', NULL, 'number', 'roleId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1410, 144, 'menu_id', '菜单ID', 'BIGINT', NULL, 'number', 'menuId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1411, 144, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1412, 144, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1413, 145, 'id', '', 'INT', NULL, 'number', 'id', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1414, 145, 'user_id', '用户ID', 'BIGINT', NULL, 'number', 'userId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1415, 145, 'post_id', '岗位ID', 'BIGINT', NULL, 'number', 'postId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1416, 145, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1417, 145, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1418, 146, 'id', '', 'INT', NULL, 'number', 'id', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1419, 146, 'user_id', '用户ID', 'BIGINT', NULL, 'number', 'userId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1420, 146, 'role_id', '角色ID', 'BIGINT', NULL, 'number', 'roleId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1421, 146, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1422, 146, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1423, 147, 'table_id', '编号', 'BIGINT', NULL, 'number', 'tableId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1424, 147, 'table_name', '表名称', 'CHAR', '', 'string', 'tableName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1425, 147, 'table_comment', '表描述', 'CHAR', '', 'string', 'tableComment', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1426, 147, 'sub_table_name', '关联子表的表名', 'CHAR', '', 'string', 'subTableName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1427, 147, 'sub_table_fk_name', '子表关联的外键名', 'CHAR', '', 'string', 'subTableFkName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1428, 147, 'class_name', '实体类名称', 'CHAR', '', 'string', 'className', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1429, 147, 'tpl_category', '使用的模板（crud单表操作 tree树表操作 sub主子表）', 'CHAR', 'crud', 'string', 'tplCategory', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1430, 147, 'package_name', '生成包路径', 'CHAR', '', 'string', 'packageName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1431, 147, 'module_name', '生成模块名', 'CHAR', '', 'string', 'moduleName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1432, 147, 'business_name', '生成业务名', 'CHAR', '', 'string', 'businessName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1433, 147, 'function_name', '生成功能名', 'CHAR', '', 'string', 'functionName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1434, 147, 'function_author', '生成功能作者', 'CHAR', '', 'string', 'functionAuthor', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1435, 147, 'gen_type', '生成代码方式（0zip压缩包 1自定义路径）', 'CHAR', '0', 'string', 'genType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1436, 147, 'is_import', '数据库表是否导入（0导入，1未导入）', 'CHAR', '1', 'string', 'isImport', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1437, 147, 'gen_path', '生成路径（不填默认项目路径）', 'CHAR', '/', 'string', 'genPath', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1438, 147, 'options', '其它生成选项', 'CHAR', '0', 'string', 'options', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1439, 147, 'tree_code', '树编码字段', 'CHAR', '', 'string', 'treeCode', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1440, 147, 'tree_parent_code', '树父编码字段', 'CHAR', '', 'string', 'treeParentCode', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1441, 147, 'tree_name', '树名称字段', 'CHAR', '', 'string', 'treeName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1442, 147, 'parent_id', '上级菜单Id', 'BIGINT', NULL, 'number', 'parentId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1443, 147, 'remark', '备注', 'CHAR', '', 'string', 'remark', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1444, 147, 'create_by', '创建者', 'CHAR', NULL, 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1445, 147, 'update_by', '更新者', 'CHAR', NULL, 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1446, 147, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1447, 147, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1448, 148, 'column_id', '编号', 'BIGINT', NULL, 'number', 'columnId', '0', '0', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1449, 148, 'table_id', '归属表编号', 'BIGINT', NULL, 'number', 'tableId', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1450, 148, 'column_name', '列名称', 'CHAR', '', 'string', 'columnName', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1451, 148, 'column_comment', '列描述', 'CHAR', '', 'string', 'columnComment', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1452, 148, 'column_type', '列类型', 'CHAR', '', 'string', 'columnType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1453, 148, 'column_default_value', '字段默认值', 'CHAR', '', 'string', 'columnDefaultValue', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1454, 148, 'ts_type', 'ts类型', 'CHAR', '', 'string', 'tsType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1455, 148, 'ts_field', 'ts字段名', 'CHAR', '', 'string', 'tsField', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1456, 148, 'is_pk', '是否主键（0是）', 'CHAR', '1', 'string', 'isPk', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1457, 148, 'is_increment', '是否自增（0是）', 'CHAR', '1', 'string', 'isIncrement', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1458, 148, 'is_required', '是否必填（0是）', 'CHAR', '1', 'string', 'isRequired', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1459, 148, 'is_insert', '是否为新增字段（0是）', 'CHAR', '1', 'string', 'isInsert', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1460, 148, 'is_edit', '是否编辑字段（0是）', 'CHAR', '1', 'string', 'isEdit', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1461, 148, 'is_list', '是否列表字段（0是）', 'CHAR', '1', 'string', 'isList', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1462, 148, 'is_query', '是否查询字段（0是）', 'CHAR', '1', 'string', 'isQuery', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1463, 148, 'query_type', '查询方式（等于、不等于、大于、小于、范围）', 'CHAR', 'eq', 'string', 'queryType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1464, 148, 'html_type', '显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）', 'CHAR', '', 'string', 'htmlType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1465, 148, 'dict_type', '字典类型', 'CHAR', '', 'string', 'dictType', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1466, 148, 'sort', '排序', 'BIGINT', '0', 'number', 'sort', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1467, 148, 'create_by', '创建者', 'CHAR', '', 'string', 'createBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1468, 148, 'update_by', '更新者', 'CHAR', '', 'string', 'updateBy', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1469, 148, 'created_at', '', 'DATETIME', NULL, 'string', 'createdAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');
INSERT INTO `tool_gen_column` VALUES (1470, 148, 'updated_at', '', 'DATETIME', NULL, 'string', 'updatedAt', '1', '1', '1', '1', '1', '1', '1', 'eq', '', '', 0, '', '', '2023-07-05 15:37:47', '2023-07-05 15:37:47');

SET FOREIGN_KEY_CHECKS = 1;
