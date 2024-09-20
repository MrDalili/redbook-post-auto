async function xiaohongshuContentGenerate() {
    const messages = [
        { role: "system", content: "你是一个专业的小红书内容创作助手。请生成一篇吸引人的小红书文章,包括标题、正文和标签。" },
        { role: "user", content: "请生成一篇关于健康生活方式的小红书文章,包括吸引人的标题、至少3段正文内容和5个相关标签。" }
    ];

    const result = await callAI(messages);
    return result.choices[0].message.content;
}

window.xiaohongshuContentGenerate = xiaohongshuContentGenerate;
