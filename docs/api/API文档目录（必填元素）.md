# 这里是一级标题 如：APP 相关

服务端 API 接口文档示例
这里是公共内容
如：在注册为 AECORE 的开发者后，AECORE 提供与应用相关的相关接口

## 创建 APP

### 请求

方法+url，如：
POST /workbenches/{id}/apps?appName={appName}

### 说明

这里是接口说明

### 参数

至少包含

| 参数名  | 是否必选 |  类型  |   描述    |
| :-----: | :------: | :----: | :-------: |
|   id    |    是    | String | 工作台 id |
| appName |    是    | String | 应用 name |

### 响应

| HTTP 代码 |  说明   |  类型  |
| :-------: | :-----: | :----: |
|    200    |   ok    | 无内容 |
|    201    | Created | 无内容 |

### HTTP 请求示例

#### 请求 path

#### 请求 header

#### 请求体

### 返回结果

## 修改 app 名称

### 请求

方法+url，如：
PATCH /workbenches/{id}/apps/{appId}?appName={appName}

### 说明

这里是接口说明

### 参数

至少包含

| 参数名  | 是否必选 |  类型  |   描述    |
| :-----: | :------: | :----: | :-------: |
|   id    |    是    | String | 工作台 id |
|  appId  |    是    | String |  应用 id  |
| appName |    是    | String | 应用 name |

### 响应

| HTTP 代码 |  说明   |  类型  |
| :-------: | :-----: | :----: |
|    200    |   ok    | 无内容 |
|    201    | Created | 无内容 |

### HTTP 请求示例

#### 请求 path

#### 请求 header

#### 请求体

### 返回结果
