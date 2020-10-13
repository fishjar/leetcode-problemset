const fetch = require("node-fetch");

module.exports = (titleSlug) =>
  fetch("https://leetcode-cn.com/graphql/", {
    credentials: "include",
    headers: {
      accept: "*/*",
      "accept-language": "en-US",
      "content-type": "application/json",
      "x-csrftoken":
        "U4CwiK14BqNlt1w2CeNt0kT7i5dbqcionIbup4i24TTfVMeZl3eqcE273U83uqpm",
      "x-definition-name": "question",
      "x-operation-name": "questionData",
      "x-timezone": "Asia/Shanghai",
    },
    referrer: `https://leetcode-cn.com/problems/${titleSlug}/`,
    referrerPolicy: "no-referrer-when-downgrade",
    body: `{"operationName":"questionData","variables":{"titleSlug":"${titleSlug}"},"query":"query questionData($titleSlug: String!) {\\n  question(titleSlug: $titleSlug) {\\n    questionId\\n    questionFrontendId\\n    boundTopicId\\n    title\\n    titleSlug\\n    content\\n    translatedTitle\\n    translatedContent\\n    isPaidOnly\\n    difficulty\\n    likes\\n    dislikes\\n    isLiked\\n    similarQuestions\\n    contributors {\\n      username\\n      profileUrl\\n      avatarUrl\\n      __typename\\n    }\\n    langToValidPlayground\\n    topicTags {\\n      name\\n      slug\\n      translatedName\\n      __typename\\n    }\\n    companyTagStats\\n    codeSnippets {\\n      lang\\n      langSlug\\n      code\\n      __typename\\n    }\\n    stats\\n    hints\\n    solution {\\n      id\\n      canSeeDetail\\n      __typename\\n    }\\n    status\\n    sampleTestCase\\n    metaData\\n    judgerAvailable\\n    judgeType\\n    mysqlSchemas\\n    enableRunCode\\n    envInfo\\n    book {\\n      id\\n      bookName\\n      pressName\\n      source\\n      shortDescription\\n      fullDescription\\n      bookImgUrl\\n      pressImgUrl\\n      productUrl\\n      __typename\\n    }\\n    isSubscribed\\n    isDailyQuestion\\n    dailyRecordStatus\\n    editorType\\n    ugcQuestionId\\n    style\\n    __typename\\n  }\\n}\\n"}`,
    method: "POST",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((data) => data);
