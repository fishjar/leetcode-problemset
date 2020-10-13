```js
fetch("https://leetcode-cn.com/api/problems/all/", {
  credentials: "include",
  headers: {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "content-type": "application/json",
    "x-requested-with": "XMLHttpRequest",
  },
  referrer: "https://leetcode-cn.com/problemset/all/",
  referrerPolicy: "no-referrer-when-downgrade",
  body: null,
  method: "GET",
  mode: "cors",
});
```
