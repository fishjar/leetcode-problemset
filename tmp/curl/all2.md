```js
fetch("https://leetcode-cn.com/graphql/", {
  credentials: "include",
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "content-type": "application/json",
    "x-csrftoken":
      "U4CwiK14BqNlt1w2CeNt0kT7i5dbqcionIbup4i24TTfVMeZl3eqcE273U83uqpm",
  },
  referrer: "https://leetcode-cn.com/problems/two-sum/",
  referrerPolicy: "no-referrer-when-downgrade",
  body:
    '{"operationName":"allQuestions","variables":{},"query":"query allQuestions {\\n  allQuestionsBeta {\\n    ...questionSummaryFields\\n    __typename\\n  }\\n}\\n\\nfragment questionSummaryFields on QuestionNode {\\n  title\\n  titleSlug\\n  translatedTitle\\n  questionId\\n  questionFrontendId\\n  status\\n  difficulty\\n  isPaidOnly\\n  categoryTitle\\n  __typename\\n}\\n"}',
  method: "POST",
  mode: "cors",
});
```
