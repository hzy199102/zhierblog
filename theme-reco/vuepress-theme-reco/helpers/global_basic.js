/**
 * global
 *
 * 通过webpack.ProvidePlugin
 *
 * global moment Chance chance（实例化的Chance） jquery
 *
 * 不通过webpack.ProvidePlugin的常规写法：
 *
 * 使用chance：
 * window.global = window;
 * export var chance = new Chance();
 *
 * 使用moment：
 * import * as moment from "../Page/Calendar/js/moment.min.js";
 * import * as moment from "moment";
 *
 * 使用jquery
 * 注意：jquery是很多第三方库的基础组成部分，比如bootstrap，所以要通过require引用，保持引用顺序
 * var $ = require("../Page/Calendar/js/jquery-3.5.1.js");
 * window.$ = $;
 * window.jQuery = $;
 * require("../Page/Calendar/js/bootstrap.min.js");
 */

export var global = typeof window !== "undefined" ? window : this;
