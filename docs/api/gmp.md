# 广联达算量平台接口文档

本文档适用于容器网页

- 连调环境地址：http://192.168.130.40
- 测试环境地址：http://aecore-test.glodon.com/ops
- 生产环境地址：https://aecore.glodon.com/ops

::: tip

- POST 请求体是 JSONOBJECT
- GET 请求需要`encodeURIComponent`处理参数

:::

## 登录

- URL

`POST /portal/mine/loginByToken`

- 请求头

|    参数名     | 是否必选 |  类型  |           描述            |
| :-----------: | :------: | :----: | :-----------------------: |
| Authorization |    是    | String | 产品 pcode 的 base64 编码 |

- 参数说明

|   参数名    | 是否必选 |  类型  | 描述                 |
| :---------: | :------: | :----: | :------------------- |
| accessToken |    是    | String | 用户 token，容器提供 |

- 返回结果

## 栏目

- URL

`GET /portal/category/list`

- 请求头

|    参数名     | 是否必选 |  类型  | 描述                                                                      |
| :-----------: | :------: | :----: | :------------------------------------------------------------------------ |
| Authorization |    是    | String | <li>产品 pcode 的 base64 编码</li><li>gid_pcode_token 的 base64 编码</li> |

- 参数说明

| 参数名 | 是否必选 |    类型    | 描述                                         |
| :----: | :------: | :--------: | :------------------------------------------- |
|  page  |    否    |   Number   | 页码，从 0 开始                              |
| count  |    否    |   Number   | 每页显示条数                                 |
|  sort  |    否    | JSONString | 0：倒序；1：正序<li>createdAt：创建时间</li> |
| filter |    否    | JSONString | <li>parent：父节点 ID</li>                   |

- 返回结果

## 文章列表

- URL

`GET /portal/article/list`

- 请求头

|    参数名     | 是否必选 |  类型  | 描述                                                                      |
| :-----------: | :------: | :----: | :------------------------------------------------------------------------ |
| Authorization |    是    | String | <li>产品 pcode 的 base64 编码</li><li>gid_pcode_token 的 base64 编码</li> |

- 参数说明

| 参数名 | 是否必选 |    类型    | 描述                                                                                                                                                                  |
| :----: | :------: | :--------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  page  |    否    |   Number   | 页码，从 0 开始                                                                                                                                                       |
| count  |    否    |   Number   | 每页显示条数                                                                                                                                                          |
|  sort  |    否    | JSONString | 0：倒序；1：正序<li>createdAt：创建时间</li>                                                                                                                          |
| filter |    否    | JSONString | 1.category：栏目 ID<br><li>["A","B"]: 这种方式不取栏目 A，B 下的子孙分类的文章</li><li>"A"：A 子孙下的所有文章</li><li>{"eq":["A","B"]}:同时属于栏目 A，B 的文章</li> |

- 返回结果

## 文章上报

- URL

`POST /portal/article/{action}`

- 请求头

|    参数名     | 是否必选 |  类型  | 描述                                    |
| :-----------: | :------: | :----: | :-------------------------------------- |
| Authorization |    是    | String | <li>gid_pcode_token 的 base64 编码</li> |

- 参数说明

|   参数名   | 是否必选 |  类型  | 描述                                             |
| :--------: | :------: | :----: | :----------------------------------------------- |
|   action   |    是    | String | 行为，拼接在 url 上的参数<br><li>read：已读</li> |
|   target   |    是    | String | 文章 ID                                          |
| targetName |    是    | String | 文章标题                                         |

- 返回结果
