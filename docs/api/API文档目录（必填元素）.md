服务端API接口文档示例

# 这里是一级标题 如：APP相关 #

这里是公共内容
如：在注册为AECORE的开发者后，AECORE提供与应用相关的相关接口

## 创建APP ##


### 请求 ###
方法+url，如：
POST /workbenches/{id}/apps?appName={appName}

### 说明 ###
这里是接口说明

### 参数 ###

至少包含

| 参数名 | 是否必选 | 类型 | 描述 |
| :-----:| :----: | :----: | :----: |
| id | 是 | String | 工作台id |
| appName | 是 | String | 应用name|

### 响应 ###

| HTTP代码 | 说明 | 类型 | 
| :-----:| :----: | :----: | 
| 200 | ok | 无内容 | 
| 201 | Created | 无内容 | 

### HTTP请求示例 ###

#### 请求path ####
#### 请求header ####
#### 请求体 ####

### 返回结果 ###


## 修改app名称 ##


### 请求 ###
方法+url，如：
PATCH /workbenches/{id}/apps/{appId}?appName={appName}

### 说明 ###
这里是接口说明

### 参数 ###

至少包含

| 参数名 | 是否必选 | 类型 | 描述 |
| :-----:| :----: | :----: | :----: |
| id | 是 | String | 工作台id |
| appId | 是 | String | 应用id |
| appName | 是 | String | 应用name |

### 响应 ###

| HTTP代码 | 说明 | 类型 | 
| :-----:| :----: | :----: | 
| 200 | ok | 无内容 | 
| 201 | Created | 无内容 | 

### HTTP请求示例 ###

#### 请求path ####
#### 请求header ####
#### 请求体 ####

### 返回结果 ###