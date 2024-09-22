async function dailySentenceGenerate(currentDay, customSentence) {
    console.log("当前传入的参数",currentDay, customSentence)
    // 步骤1: 生成长难句和解析
    let sentenceResult;
    if(customSentence == null || customSentence == ""){
        sentenceResult = await generateSentence();
    }else{
        sentenceResult = customSentence;
    }
    
    // 步骤2和3: 同时生成小红书首页和内容页面
    const [homepageResult, contentPageResult] = await Promise.all([
        generateHomepage(sentenceResult, currentDay),
        generateContentPage(sentenceResult)
    ]);

    // 将结果组合成一个HTML字符串
    const combinedContent = `
        <style>
            .preview-container { margin-bottom: 20px; }
            .preview-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .preview-content {  padding: 0px; }
        </style>
        <div class="preview-container">
            <div class="preview-content">${homepageResult}</div>
        </div>
        <div class="preview-container">
            <div class="preview-content">${contentPageResult}</div>
        </div>
    `;

    return combinedContent;
}

async function generateSentence() {
    const messages = [
        { role: "system", content: "你是一个专业的英语教育助手。请生成一个富有挑战性的英语长句,并提供中文翻译和语法解析。" },
        { role: "user", content: "- Role: 英语语言学家和句子结构分析师\n" +
                "- Background: 用户在阅读英语文献或学习过程中遇到复杂难解的长句子，需要深入分析句子结构以理解其含义。\n" +
                "- Goals: 帮助用户理解英语长难句的结构和含义，提高用户对英语复杂句型的分析能力。\n" +
                "- OutputFormat: 提供句子结构的详细解析，包括主干和从属结构的划分、语法功能的标注、以及可能的语义解释。看我提供example的内容\n" +
                "- Workflow:\n" +
                "  1. 生成一个英语的长难句，字数最起码在30字以上\n" +
                "  2. 确定句子的主语和谓语，识别句子的主干结构。\n" +
                "  3. 分析并标注各种从句和非谓语动词结构，解释它们在句子中的作用。\n" +
                "  4. 识别并解释任何特殊的句型结构，如倒装、强调等。\n" +
                "  5. 根据我提供的example中的格式进行输出。\n" +
                "- Examples:\n" +
                "{{\n" +
                `   长难句：\n\nAlthough the innovative project promised significant advancements in renewable energy technology and was initially met with enthusiasm from stakeholders across various sectors, it faced unforeseen challenges in securing consistent funding, which ultimately led to delays in its development, causing many of the original supporters to reconsider their involvement due to concerns about the project's sustainability and the perceived lack of tangible progress.

句子大概分成几个模块:
让步从句 (Although 引导)
结果状语从句
原因状语
让步从句 (Although 引导)
具体原文:
Although the innovative project promised significant advancements in renewable energy technology and was initially met with enthusiasm from stakeholders across various sectors...

主语是 the innovative project （创新项目），谓语1是 promised （承诺），宾语是 significant advancements in renewable energy technology （在可再生能源技术方面的重大进展），连接词是 and （并且/而且），谓语2是 was met with （遇到了），宾语是 enthusiasm from stakeholders across various sectors （来自各行各业利益相关者的热情），状语是 initially （最初）。意思：虽然这个创新项目承诺在可再生能源技术方面取得重大突破，并且最初得到了来自各个领域利益相关者的热情支持，

结果状语从句
具体原文:
which ultimately led to delays in its development

主语是 which （指代前面提到的情况），谓语是 led to （导致），宾语是 delays in its development （其发展的延误）。意思：这最终导致了其发展的延误。

原因状语
具体原文:
causing many of the original supporters to reconsider their involvement due to concerns about the project's sustainability and the perceived lack of tangible progress.

主语是 causing （导致），宾语是 many of the original supporters （许多最初的资助者），动词不定式是 to reconsider their involvement （重新考虑他们的参与），原因状语是 due to concerns about the project's sustainability and the perceived lack of tangible progress （由于对项目可持续性的担忧以及对缺乏实质性进展的看法）。意思：导致许多最初的资助者重新考虑他们的参与，因为他们担心项目的可持续性并且觉得缺乏实质性的进展。

整句意思总结:
虽然这个创新项目承诺在可再生能源技术方面取得重大突破，并且最初得到了来自各个领域利益相关者的热情支持，但在确保持续资金方面遇到了未曾预料到的挑战，这最终导致了其发展的延误，许多最初的资助者因此重新考虑他们的参与，因为他们担心项目的可持续性并且觉得缺乏实质性的进展。` +
                "}}\n" +
                "\n" +
                "- Initialization: 直接根据workflow开始生成，并按照example的要求进行分析,**你需要记住，你个成分分析都需要仔细并且用通俗易懂的表达出来，不要只说成分不说意思以及为什么这么用**" }
    ];

    const result = await callAI(messages);
    let html = result.choices[0].message.content;
    // let html = `123123`;
    return html;
}

async function generateHomepage(sentenceContent, currentDay) {
    const messages = [
        { role: "system", content: "你是一个专业的小红书内容创作助手。请根据给定的英语长句和解析,生成一个吸引人的小红书首页内容。" },
        { role: "user", content: `"这个是个html，你帮我下面的内容 填充到这个html里面去，确保页面不要变形, 并且按照正常的比例把内容展示出来，天数和句子都放进去\n" +
                "**请注意将{{}}中的内容都按照我的要求进行替换了，一个是第几天，一个是具体的长难句的内容，不要添加其它没用的内容**\n" +
                "今天是第{{${currentDay}}}天\n" +
                "下面是具体的长难句的内容\n" +
                "{{\n" +
                ${sentenceContent} + 
                "}}\n" +
                "\n" +
                "\n" +
                "<!DOCTYPE html>\n" +
                "<html lang=\"zh\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>每日长难句卡片</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            display: flex;\n" +
                "            justify-content: center;\n" +
                "            align-items: center;\n" +
                "            height: 100vh;\n" +
                "            margin: 0;\n" +
                "            font-family: Arial, sans-serif;\n" +
                "        }\n" +
                "        .arrow-left {\n" +
                "            width: 0;\n" +
                "            height: 0;\n" +
                "            border-top: 6px solid transparent;\n" +
                "            border-bottom: 6px solid transparent;\n" +
                "            border-right: 10px solid #666;\n" +
                "            display: inline-block;\n" +
                "            margin-right: 5px;\n" +
                "        }\n" +
                "        .sentence-box {\n" +
                "            background-color: #f0f8ff;\n" +
                "            border: 1px solid #b0d4ff;\n" +
                "            border-radius: 8px;\n" +
                "            padding: 15px;\n" +
                "            margin-bottom: 20px;\n" +
                "            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n" +
                "            flex-grow: 1;\n" +
                "            display: flex;\n" +
                "            align-items: center;\n" +
                "        }\n" +
                "        .card {
    background-color: white;
    border-radius: 10px;
    overflow: visible; /* 改为 visible 以显示伪元素 */
    display: flex;
    flex-direction: column;
    border: 4px solid #4fd1c5;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    margin: 0 auto;
    position: relative; /* 添加相对定位 */
}" +
                "        .card-content {\n" +
                "            flex-grow: 1;\n" +
                "            padding: 0 15px;\n" +
                "            display: flex;\n" +
                "            flex-direction: column;\n" +
                "            justify-content: center;\n" +
                "        }\n" +
                "        .card-footer {\n" +
                "            padding: 15px;\n" +
                "            text-align: center;\n" +
                "            display: flex;\n" +
                "            justify-content: center;\n" +
                "            align-items: center;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"card\" id=\"card\">\n" +
                "        <div style=\"position: relative; height: 60px; display: flex; justify-content: center; align-items: center;\">\n" +
                "            <div style=\"position: absolute; top: 15px; background-color: #4fd1c5; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold;\">\n" +
                "                DAY20\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        <div class=\"card-content\">\n" +
                "            <h2 style=\"text-align: center; font-size: 1.5rem; margin: 0 0 20px; line-height: 1.2;\">每天拆解一个长难句</h2>\n" +
                "            <div class=\"sentence-box\">\n" +
                "                <p style=\"font-size: 1rem; line-height: 1.5; text-align: justify; margin: 0; color: #333;\">\n" +
                "                    <strong>Despite the fact that the new policy has been widely criticized by both environmentalists and economists for its potential negative impact on the local ecosystem and the overall economy, the government remains steadfast in its commitment to implement it, citing the urgent need to address the growing energy crisis and the long-term benefits it believes will outweigh the short-term costs.</strong>\n" +
                "                </p>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        <div class=\"card-footer\">\n" +
                "            <div class=\"arrow-left\"></div>\n" +
                "            <span style=\"font-size: 0.9rem; color: #666;\">左滑查看长难句拆解</span>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "\n" +
                "    <script>\n" +
                "        function resizeCard() {\n" +
                "            const card = document.getElementById('card');\n" +
                "            const sentenceBox = document.querySelector('.sentence-box p');\n" +
                "            const sentenceLength = sentenceBox.textContent.length;\n" +
                "\n" +
                "            let cardWidth;\n" +
                "\n" +
                "            if (sentenceLength > 200) {\n" +
                "                cardWidth = 400;\n" +
                "            } else if (sentenceLength > 100) {\n" +
                "                cardWidth = 350;\n" +
                "            } else {\n" +
                "                cardWidth = 300;\n" +
                "            }\n" +
                "\n" +
                "            // 计算高度以保持3比4的比例\n" +
                "            const cardHeight = cardWidth * (4 / 3);\n" +
                "\n" +
                "            card.style.width = \`\${cardWidth}px\`;\n" +
                "            card.style.height = \'\${cardHeight}px\`;\n" +
                "        }\n" +
                "\n" +
                "        // Initial resize\n" +
                "        resizeCard();\n" +
                "\n" +
                "        // Resize on window resize\n" +
                "        window.addEventListener('resize', resizeCard);\n" +
                "\n" +
                "        // Resize on content change (if needed)\n" +
                "        const sentenceBox = document.querySelector('.sentence-box');\n" +
                "        const observer = new MutationObserver(resizeCard);\n" +
                "        observer.observe(sentenceBox, { childList: true, subtree: true });\n" +
                "    </script>\n" +
                "</body>\n" +
                "</html>"\n +
                "直接开始输出html, 并且只输出html即可，不要输出任何多余的内容，内容只包含具体的天数，长难句的英文以及下方的左滑，不要添加其他的内容进去"` }
    ];

    const result = await callAI(messages);
    let html = result.choices[0].message.content;
    // let html = "```html\n<!DOCTYPE html>\n<html lang=\"zh\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>改进的小红书风格长难句解析卡片 - 3:4比例</title>\n    <style>\n        body {\n            margin: 0;\n            padding: 0;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            min-height: 100vh;\n            background-color: #f5f5f5;\n            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n        }\n        .card {\n            width: 75vw; /* 75% of viewport width */\n            max-width: 450px; /* Maximum width */\n            aspect-ratio: 3 / 4; /* 3:4 aspect ratio */\n            background-color: white;\n            border-radius: 20px;\n            box-shadow: 0 10px 30px rgba(0,0,0,0.1);\n            overflow: hidden;\n            display: flex;\n            flex-direction: column;\n            margin: 0;\n        }\n        .header {\n            background-color: #ff2442;\n            color: white;\n            padding: 15px;\n            text-align: center;\n            font-size: 22px;\n            font-weight: bold;\n        }\n        .content {\n            flex-grow: 1;\n            padding: 20px;\n            display: flex;\n            flex-direction: column;\n            justify-content: space-between;\n            overflow-y: auto;\n        }\n        .sentence {\n            background-color: #fff5f5;\n            padding: 15px;\n            border-radius: 10px;\n            margin-bottom: 15px;\n            font-size: 18px;\n            line-height: 1.6;\n            text-align: justify;\n            font-weight: bold;\n            border: 1px solid #ffcccb;\n        }\n        .analysis {\n            display: grid;\n            gap: 12px;\n        }\n        .analysis-item {\n            background-color: #f8f8f8;\n            padding: 12px;\n            border-radius: 10px;\n            border: 1px solid #e0e0e0;\n        }\n        .analysis-title {\n            font-weight: bold;\n            margin-bottom: 8px;\n            color: #ff2442;\n            font-size: 16px;\n        }\n        .analysis-content {\n            font-weight: bold;\n            margin-bottom: 5px;\n        }\n        .highlight-1 { color: #ff2442; }\n        .highlight-2 { color: #ff9f1a; }\n        .highlight-3 { color: #17c964; }\n        .highlight-4 { color: #5271ff; }\n        .underline { border-bottom: 2px solid currentColor; }\n    </style>\n</head>\n<body>\n    <div class=\"card\">\n        <div class=\"header\">📚 每日英语长难句精析</div>\n        <div class=\"content\">\n            <div class=\"sentence\">\n                <span class=\"highlight-1\">Although many experts argue that the rapid advancement of artificial intelligence could potentially lead to widespread unemployment and exacerbate social inequalities,</span> \n                <span class=\"highlight-2\">policymakers, who are under increasing pressure to foster economic growth,</span> \n                <span class=\"highlight-3\">continue to advocate for its integration into various sectors,</span> \n                <span class=\"highlight-4 underline\">asserting that the long-term benefits, such as enhanced productivity and innovation, will ultimately outweigh the immediate challenges.</span>\n            </div>\n            <div class=\"analysis\">\n                <div class=\"analysis-item\" style=\"background-color: #ffebeb;\">\n                    <div class=\"analysis-title\">1️⃣ 让步状语从句</div>\n                    <div class=\"analysis-content\"><span class=\"highlight-1\">Although many experts argue that the rapid advancement of artificial intelligence could potentially lead to widespread unemployment and exacerbate social inequalities</span></div>\n                    <div>\"Although\" 引导让步状语从句，表示尽管许多专家认为人工智能的快速进步可能会导致大规模失业并加剧社会不平等。</div>\n                </div>\n                <div class=\"analysis-item\" style=\"background-color: #fff5e6;\">\n                    <div class=\"analysis-title\">2️⃣ 主句与定语从句</div>\n                    <div class=\"analysis-content\"><span class=\"highlight-2\">policymakers, who are under increasing pressure to foster economic growth</span></div>\n                    <div>主句为 \"policymakers continue to advocate for its integration into various sectors\"，其中 \"who\" 引导定语从句，修饰 \"policymakers\"，说明政策制定者面临促进经济增长的压力。</div>\n                </div>\n                <div class=\"analysis-item\" style=\"background-color: #e6fff2;\">\n                    <div class=\"analysis-title\">3️⃣ 伴随状语</div>\n                    <div class=\"analysis-content\"><span class=\"highlight-3\">continue to advocate for its integration into various sectors</span></div>\n                    <div>政策制定者继续倡导将人工智能融入各个领域，\"continue\" 是谓语，\"to advocate for its integration into various sectors\" 是宾语。</div>\n                </div>\n                <div class=\"analysis-item\" style=\"background-color: #e6f2ff;\">\n                    <div class=\"analysis-title\">4️⃣ 伴随状语中的宾语从句</div>\n                    <div class=\"analysis-content\"><span class=\"highlight-4 underline\">asserting that the long-term benefits, such as enhanced productivity and innovation, will ultimately outweigh the immediate challenges</span></div>\n                    <div>\"asserting\" 是现在分词短语作伴随状语，\"that\" 引导宾语从句，说明长期利益（如提高生产力和创新）最终将超过眼前的挑战。</div>\n                </div>\n            </div>\n        </div>\n    </div>\n</body>\n</html>\n```"
    html = html.replace("```html", "").replace("```", "")
    return html;
}

async function generateContentPage(sentenceContent) {
    const messages = [
        { role: "system", content: "你是一个专业的小红书内容创作助手。请根据给定的英语长句和解析,生成一个详细的小红书内容页面。" },
        { role: "user", content: `这个是个html，你帮我下面的内容 填充到这个html里面去，确保页面不要变形，并且如果有其他的长难句分析的模块，你也要一起分析了

下面是具体的长难句的内容
{{
                    ${sentenceContent} + 

}}
你需要根据我输入的长难句解析内容，对内容进行分块和分颜色，并且填入到各个{{}}中去，并且需要确保内容讲解的清晰，学生看了之后可以理解
除此之外，你必须要要满足，生成的卡片的内容可以正常铺满这个 html，不要有多余的空白，或者内容超出这个 html，如果会出现，请提前调整页面卡片的大小。
其中：
**{{解析 1}}这些代表具体可以被解析的标题或者内容，比如说这里写“主语”，“谓语”，“让步状语”，“定语”等等代表我们需要去解释的内容的一个小的标题，这个在我传图的长难句的内容中有展示**
**{{这里是需要解释的具体的内容}}是我们需要具体去展示的内容，从长难句的内容直接提取**
analysis-item这个item可能会有很多，请根据我给你的sentencecontent中的内容进行迭代，一般来说会有5-8个需要你迭代展示的。所以你需要把握好具体的长难句的展示和解析
最后生成的内容，需要把{{}}括号删除。

<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>改进的小红书风格长难句解析卡片 - 3:4比例</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .card {
             width: 100%;
            max-width: 450px; /* 确保与 JavaScript 中的最大宽度一致 */
            aspect-ratio: 3 / 4; /* 3:4 aspect ratio */
            background-color: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            margin: 0;
        }
        .header {
            background-color: #ff2442;
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 22px;
            font-weight: bold;
        }
        .content {
            flex-grow: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow-y: auto;
        }
        .sentence {
            background-color: #fff5f5;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
            font-size: 18px;
            line-height: 1.6;
            text-align: justify;
            font-weight: bold;
            border: 1px solid #ffcccb;
        }
        .analysis {
            display: grid;
            gap: 12px;
        }
        .analysis-item {
            background-color: #f8f8f8;
            padding: 12px;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
        }
        .analysis-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #ff2442;
            font-size: 16px;
        }
        .analysis-content {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .highlight-1 { color: #ff2442; }
        .highlight-2 { color: #ff9f1a; }
        .highlight-3 { color: #17c964; }
        .highlight-4 { color: #5271ff; }
        .underline { border-bottom: 2px solid currentColor; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">📚 每日英语长难句精析</div>
        <div class="content">
            <div class="sentence">
                <span class="highlight-1">Even during the thousands of years</span> 
                <span class="highlight-2">cats have spent in the company of people</span>, 
                <span class="highlight-3">we have had little influence on</span> 
                <span class="highlight-4 underline">when and with whom they have mated</span>.
            </div>
            <div class="analysis">
                <div class="analysis-item" style="background-color: #ffebeb;">
                    <div class="analysis-title">1️⃣ {{解析 1}}</div>
                    <div class="analysis-content"><span class="highlight-1">{{需要解析的内容}}</span></div>
                    <div>{{这里是需要解释的具体的内容}}</div>
                </div>
                <div class="analysis-item" style="background-color: #fff5e6;">
                    <div class="analysis-title">2️⃣ {{解析 2}}</div>
                    <div class="analysis-content"><span class="highlight-2">{{需要解析的内容}}</span></div>
                    <div>{{这里是需要解释的具体的内容}}</div>
                </div>
                <div class="analysis-item" style="background-color: #e6fff2;">
                    <div class="analysis-title">3️⃣ {{解析 3}}</div>
                    <div class="analysis-content"><span class="highlight-3">{{需要解析的内容}}</span></div>
                    <div>{{这里是需要解释的具体的内容}}</div>
                </div>
                <div class="analysis-item" style="background-color: #e6f2ff;">
                    <div class="analysis-title">4️⃣ {{让步状语}}</div>
                    <div class="analysis-content"><span class="highlight-4 underline">{{the innovative approach to renewable energy production proposed by the research team has garnered significant attention from international stakeholders and promises a breakthrough in sustainable development}}</span></div>
                    <div>{{这个句子由主语"the innovative approach to renewable energy production proposed by the research team"（研究团队提出的创新可再生能源生产方法）开始，接着使用并列谓语结构，第一部分是"has garnered significant attention from international stakeholders"（已经获得了国际利益相关者的重要关注），通过连接词"and"与第二部分"promises a breakthrough in sustainable development"（承诺在可持续发展方面取得突破）相连，形成一个完整的复合句，传达了这种创新方法既已引起广泛关注又有望带来重大突破的信息。}}</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
直接输出最终的html**如果出现长难句解析和html内容对应不上的情况，请不要自动调整，就按照我的格式要求做一下改动即可，但是不要输出与html无关的信息** 除此之外记得将{{}}中的内容进行合理性的替换，不要原样输出` }
    ];

    const result = await callAI(messages);
    let html =  result.choices[0].message.content;
    // let html =  "```html\n<!DOCTYPE html>\n<html lang=\"zh\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>改进的小红书风格长难句解析卡片 - 3:4比例</title>\n    <style>\n        body {\n            margin: 0;\n            padding: 0;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            min-height: 100vh;\n            background-color: #f5f5f5;\n            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n        }\n        .card {\n             width: 100%;\n            max-width: 450px; /* 确保与 JavaScript 中的最大宽度一致 */\n            aspect-ratio: 3 / 4; /* 3:4 aspect ratio */\n            background-color: white;\n            border-radius: 20px;\n            box-shadow: 0 10px 30px rgba(0,0,0,0.1);\n            overflow: hidden;\n            display: flex;\n            flex-direction: column;\n            margin: 0;\n        }\n        .header {\n            background-color: #ff2442;\n            color: white;\n            padding: 15px;\n            text-align: center;\n            font-size: 22px;\n            font-weight: bold;\n        }\n        .content {\n            flex-grow: 1;\n            padding: 20px;\n            display: flex;\n            flex-direction: column;\n            justify-content: space-between;\n            overflow-y: auto;\n        }\n        .sentence {\n            background-color: #fff5f5;\n            padding: 15px;\n            border-radius: 10px;\n            margin-bottom: 15px;\n            font-size: 18px;\n            line-height: 1.6;\n            text-align: justify;\n            font-weight: bold;\n            border: 1px solid #ffcccb;\n        }\n        .analysis {\n            display: grid;\n            gap: 12px;\n        }\n        .analysis-item {\n            background-color: #f8f8f8;\n            padding: 12px;\n            border-radius: 10px;\n            border: 1px solid #e0e0e0;\n        }\n        .analysis-title {\n            font-weight: bold;\n            margin-bottom: 8px;\n            color: #ff2442;\n            font-size: 16px;\n        }\n        .analysis-content {\n            font-weight: bold;\n            margin-bottom: 5px;\n        }\n        .highlight-1 { color: #ff2442; }\n        .highlight-2 { color: #ff9f1a; }\n        .highlight-3 { color: #17c964; }\n        .highlight-4 { color: #5271ff; }\n        .underline { border-bottom: 2px solid currentColor; }\n    </style>\n</head>\n<body>\n    <div class=\"card\">\n        <div class=\"header\">📚 每日英语长难句精析</div>\n        <div class=\"content\">\n            <div class=\"sentence\">\n                <span class=\"highlight-1\">Although many experts argue that the integration of advanced artificial intelligence into various sectors of the economy could potentially lead to widespread job displacement</span>, \n                <span class=\"highlight-2\">the tech industry's relentless pursuit of innovation</span>, \n                <span class=\"highlight-3\">driven by the insatiable demand for efficiency and profitability</span>, \n                <span class=\"highlight-4 underline\">continues to push the boundaries of what is technologically feasible, despite the ethical and social implications that such advancements might entail</span>.\n            </div>\n            <div class=\"analysis\">\n                <div class=\"analysis-item\" style=\"background-color: #ffebeb;\">\n                    <div class=\"analysis-title\">1️⃣ 让步状语从句</div>\n                    <div class=\"analysis-content\"><span class=\"highlight-1\">Although many experts argue that the integration of advanced artificial intelligence into various sectors of the economy could potentially lead to widespread job displacement</span></div>\n                    <div>引导词 \"Although\" 引导的让步状语从句，表示尽管许多专家认为将先进的人工智能整合到经济各个领域可能会引发大规模的就业替代。</div>\n                </div>\n                <div class=\"analysis-item\" style=\"background-color: #fff5e6;\">\n                    <div class=\"analysis-title\">2️⃣ 主句</div>\n                    <div class=\"analysis-content\"><span class=\"highlight-2\">the tech industry's relentless pursuit of innovation</span></div>\n                    <div>主句的主语部分，描述科技行业在追求创新方面的不懈努力。</div>\n                </div>\n                <div class=\"analysis-item\" style=\"background-color: #e6fff2;\">\n                    <div class=\"analysis-title\">3️⃣ 原因状语从句</div>\n                    <div class=\"analysis-content\"><span class=\"highlight-3\">driven by the insatiable demand for efficiency and profitability</span></div>\n                    <div>引导词 \"driven by\" 引导的原因状语从句，解释科技行业追求创新背后的驱动力是对效率和盈利能力的无止境需求。</div>\n                </div>\n                <div class=\"analysis-item\" style=\"background-color: #e6f2ff;\">\n                    <div class=\"analysis-title\">4️⃣ 让步状语从句</div>\n                    <div class=\"analysis-content\"><span class=\"highlight-4 underline\">continues to push the boundaries of what is technologically feasible, despite the ethical and social implications that such advancements might entail</span></div>\n                    <div>引导词 \"despite\" 引导的让步状语从句，表示尽管此类进步可能带来伦理和社会上的影响，科技行业仍然持续推动技术可行性的边界。</div>\n                </div>\n            </div>\n        </div>\n    </div>\n</body>\n</html>\n```"
    html = html.replace("```html", "").replace("```", "")
    return html;
}

// 确保 dailySentenceGenerate 函数可以被外部访问
window.dailySentenceGenerate = dailySentenceGenerate;
