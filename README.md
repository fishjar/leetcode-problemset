# leetcode problemset 力扣题库

其实才做了几道题目，就隐约感觉有必要把力扣的题目爬下来备用。

还以为会很麻烦，需要去解析 `html`，谁知道是前后端分离的，直接调用接口就可以了。

而且官方未做任何限制，脚本设置十个并发，近两千道题大约一分钟搞定。

TODO：

- 目前仅爬了题目，题解就先不爬了。
- 保存的数据是原样的 `json` 格式，等有空可能会导入到关系数据库，方便查询、排序之类。
- 有空还需要研究下把正文内容转为 `md` 格式，或者导入到单页项目，方便阅读。

注：

- 数据来源：https://leetcode-cn.com/

```sh
yarn
node index.js

开始。。。
0000007.reverse-integer 成功!
....
....
....
default: 71746.278ms
结束！！！
```
