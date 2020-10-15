const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const pLimit = require("p-limit");
const TurndownService = require("turndown");
const api = require("./api");
const problemset = require("./problemset.json");
// const problemset = require("./problemset_sample.json");

const questions = problemset.data.allQuestionsBeta;
const questionsMap = questions.reduce((obj, item) => {
  obj[item.titleSlug] = {
    ...item,
    idPad: item.questionId.padStart(7, "0"),
    fileName: `${item.questionId.padStart(7, "0")}.${item.titleSlug}`,
  };
  return obj;
}, {});

/**
 * 生成目录
 */
(() => {
  let directoryStr = "";
  directoryStr += `# 目录\n\n`;
  questions.forEach((item) => {
    directoryStr += ` - [[${
      questionsMap[item.titleSlug].idPad
    }](https://leetcode-cn.com/problems/${item.titleSlug}/)] - [${item.title} ${
      item.translatedTitle
    }](./problemset_md/${questionsMap[item.titleSlug].fileName}.md) (${
      item.difficulty
    })${item.isPaidOnly ? " xxx" : ""}\n`;
  });

  /**
   * 写目录文件
   */
  fs.writeFileSync(
    path.join(__dirname, `directory.md`),
    prettier.format(directoryStr, { parser: "markdown" })
  );
})();

/**
 * 一些配置
 */
const limit = pLimit(10); // 设置并发数10
const turndownService = new TurndownService(); // html 转 markdown
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

/**
 * 任务数组
 */
const jobs = questions.map(({ questionId, titleSlug }) =>
  limit(async () => {
    const fileName = questionsMap[titleSlug].fileName;
    try {
      const res = await api(titleSlug);
      const question = res.data.question;

      /**
       * 写json文件
       */
      fs.writeFileSync(
        path.join(__dirname, "problemset", `${fileName}.json`),
        prettier.format(JSON.stringify(res), { parser: "json" }) // 格式化
      );

      /**
       * 标签
       */
      let tagsStr = "";
      if (question.topicTags && question.topicTags.length > 0) {
        tagsStr += `Topic Tags:\n\n`;
        question.topicTags.forEach((item) => {
          tagsStr += `- [${item.name} ${item.translatedName}](https://leetcode-cn.com/tag/${item.slug}/)\n`;
        });
      }

      /**
       * 类似问题
       */
      let similarQuestions = [];
      try {
        similarQuestions = JSON.parse(question.similarQuestions);
      } catch {}
      let similarStr = "";
      if (similarQuestions.length > 0) {
        similarStr += `Similar Questions:\n\n`;
        similarQuestions.forEach((item) => {
          if (questionsMap[item.titleSlug]) {
            similarStr += `- [[${
              questionsMap[item.titleSlug].idPad
            }](https://leetcode-cn.com/problems/${item.titleSlug}/)] - [${
              item.title
            } ${item.translatedTitle}](./${
              questionsMap[item.titleSlug].fileName
            }.md) (${item.difficulty})${item.isPaidOnly ? " xxx" : ""}\n`;
          } else {
            similarStr += `- [[${
              questionsMap[item.titleSlug].idPad
            }](https://leetcode-cn.com/problems/${item.titleSlug}/)] - ${
              item.title
            } ${item.translatedTitle}\n (${item.difficulty})${
              item.isPaidOnly ? " xxx" : ""
            }`;
          }
        });
      }

      /**
       * 正文
       */
      let contStr = "";
      if (question.content) {
        contStr += turndownService.turndown(question.content);
      }

      /**
       * 翻译
       */
      let transStr = "";
      if (question.translatedContent) {
        transStr += `## 翻译\n\n`;
        transStr += turndownService.turndown(question.translatedContent || "");
      }

      /**
       * 题解代码
       */
      const langs = [
        "MySQL",
        "Bash",
        "C",
        "Go",
        "Python3",
        "JavaScript",
        "Java",
      ];
      let codeStr = "";
      if (question.codeSnippets) {
        codeStr += "## solution 题解\n\n";
        langs.forEach((lang) => {
          const codeItem = question.codeSnippets.find(
            (item) => item.lang === lang
          );
          if (codeItem) {
            codeStr +=
              `### ${lang}\n\n` +
              "```" +
              `${lang === "Python3" ? "python" : codeItem.langSlug}\n${
                codeItem.code
              }\n` +
              "```\n\n";
          }
        });
      }

      /**
       * 整个md
       */
      let mdStr = "";
      mdStr += `# ${question.title} ${question.translatedTitle}\n\n`; // 大标题
      mdStr += `[${questionsMap[titleSlug].idPad}] ${question.difficulty}\n\n`; // ID及难度
      mdStr += `- https://leetcode-cn.com/problems/${question.titleSlug}/\n\n`; // 官方链接
      mdStr += `${tagsStr}\n\n`; // 标签
      mdStr += `${similarStr}\n\n`; // 类似问题
      mdStr += `${contStr}\n\n`; // 正文
      mdStr += `${transStr}\n\n`; // 中文
      mdStr += `${codeStr}\n\n`; // 题解代码

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

/**
 * 执行爬取
 */
(async () => {
  console.log("开始。。。");
  console.time();
  await Promise.all(jobs);
  console.timeEnd();
  console.log("结束！！！");
})();
