const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const pLimit = require("p-limit");
const api = require("./api");
const problemset = require("./problemset.json");

const limit = pLimit(10); // 设置并发数10

const jobs = problemset.data.allQuestionsBeta.map(({ questionId, titleSlug }) =>
  limit(async () => {
    const fileName = `${questionId.padStart(7, "0")}.${titleSlug}`;
    try {
      const res = await api(titleSlug);
      fs.writeFileSync(
        path.join(__dirname, "problemset", `${fileName}.json`),
        prettier.format(JSON.stringify(res), { parser: "json" }) // 格式化
      );
      console.log(`${fileName} 成功!`);
    } catch (err) {
      console.log(`${fileName} 失败！`, err.message);
    }
  })
);

(async () => {
  console.log("开始。。。");
  console.time();
  await Promise.all(jobs);
  console.timeEnd();
  console.log("结束！！！");
})();
