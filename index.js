const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const pLimit = require("p-limit");
const TurndownService = require("turndown");
const api = require("./api");
const problemset = require("./problemset.json");

const limit = pLimit(10); // 设置并发数10
const turndownService = new TurndownService();
turndownService.keep(["pre", "sup", "sub"]);
// turndownService.addRule("pre", {
//   filter: ["pre"],
//   replacement: function (content, node, options) {
//     // console.log("node", node);
//     return (
//       "\n\n" + options.fence + "\n" + content + "\n" + options.fence + "\n\n"
//     );
//   },
// });

const jobs = problemset.data.allQuestionsBeta.map(({ questionId, titleSlug }) =>
  limit(async () => {
    const fileName = `${questionId.padStart(7, "0")}.${titleSlug}`;
    try {
      const res = await api(titleSlug);

      /**
       * 写json文件
       */
      fs.writeFileSync(
        path.join(__dirname, "problemset", `${fileName}.json`),
        prettier.format(JSON.stringify(res), { parser: "json" }) // 格式化
      );

      /**
       * 题解代码
       */
      let codeStr = "";
      const langs = [
        "MySQL",
        "Bash",
        "C",
        "Go",
        "Python3",
        "JavaScript",
        "Java",
      ];
      const question = res.data.question;
      if (question.codeSnippets) {
        codeStr += "## solution 题解\n\n";
        codeStr += langs
          .map((lang) => {
            const codeItem = question.codeSnippets.find(
              (item) => item.lang === lang
            );
            if (!codeItem) {
              return "";
            }
            return (
              `### ${lang}\n\n` +
              "```" +
              `${lang === "Python3" ? "python" : codeItem.langSlug}\n${
                codeItem.code
              }\n` +
              "```"
            );
          })
          .join("\n\n");
      }

      /**
       * 标签
       */
      let tagsStr = "";
      if (question.topicTags) {
        tagsStr = question.topicTags
          .map(
            (item) =>
              `- [${item.name} (${item.translatedName})](https://leetcode-cn.com/tag/${item.slug}/)`
          )
          .join("\n");
      }

      /**
       * 类似问题
       */
      let similarQuestions = [];
      try {
        similarQuestions = JSON.parse(question.similarQuestions);
      } catch {}
      const similarStr = similarQuestions
        .map(
          (item) =>
            `- [${item.title} (${item.translatedTitle})](https://leetcode-cn.com/problems/${item.titleSlug}/)`
        )
        .join("\n");

      /**
       * 整个md
       */
      const mdStr =
        `# ${question.title} ${question.translatedTitle}\n\n` +
        `[${question.questionId}] [${question.difficulty}]\n\n` +
        `- https://leetcode-cn.com/problems/${question.titleSlug}/\n\n` +
        `Topic Tags:\n\n` +
        `${tagsStr}\n\n` +
        `Similar Questions:\n\n` +
        `${similarStr}\n\n` +
        turndownService.turndown(question.content || "") +
        `\n\n## 翻译\n\n` +
        `${turndownService.turndown(question.translatedContent || "")}\n\n` +
        codeStr;

      /**
       * 写md文件
       */
      fs.writeFileSync(
        path.join(__dirname, "problemset_md", `${fileName}.md`),
        prettier.format(mdStr, { parser: "markdown" })
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
