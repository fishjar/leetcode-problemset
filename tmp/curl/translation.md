```js
fetch("https://leetcode-cn.com/graphql", {
  credentials: "include",
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "content-type": "application/json",
    "x-csrftoken":
      "8AuFkrlwhhySwZkGeuy9fmEwPCGTospQIU4I9Qv2WlUxPz4LaIusyjdJvNVwXeKQ",
  },
  referrer: "https://leetcode-cn.com/problemset/all/",
  referrerPolicy: "no-referrer-when-downgrade",
  body:
    '{"operationName":"getQuestionTranslation","variables":{},"query":"query getQuestionTranslation($lang: String) {\\n  translations: allAppliedQuestionTranslations(lang: $lang) {\\n    title\\n    questionId\\n    __typename\\n  }\\n}\\n"}',
  method: "POST",
  mode: "cors",
});
```
