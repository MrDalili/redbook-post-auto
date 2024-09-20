/**
 * Emoji 表情工具类
 */
const EmojiUtil = {
    /**
     * 使用正则表达式检测emoji
     * @param {string} input 输入字符串
     * @return {boolean} 是否包含emoji
     */
    containsEmoji(input) {
        if (!input) return false;
        console.log(`检查是否为 Emoji: "${input}", Unicode: ${input.codePointAt(0).toString(16)}`);
        const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
        const result = emojiRegex.test(input);
        console.log(`Emoji 检测结果: ${result}`);
        return result;
    },

    /**
     * 使用正则表达式过滤emoji
     * @param {string} input 输入字符串
     * @return {string} 过滤后的字符串
     */
    filterEmoji(input) {
        if (!input) return input;
        const emojiRegex = /[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27FF}]|[\u{2300}-\u{23FF}]|[\u{2500}-\u{25FF}]|[\u{2100}-\u{21FF}]|[\u{0000}-\u{FFFF}]|[\u{2B00}-\u{2BFF}]|[\u{2D06}]|[\u{3030}]/gu;
        return input.replace(emojiRegex, '');
    },

    /**
     * 测试特定符号是否为emoji
     * @param {string} symbol 要测试的符号
     */
    testSymbol(symbol) {
        console.log(`测试符号: "${symbol}"`);
        console.log(`是否包含emoji: ${this.containsEmoji(symbol)}`);
        console.log(`过滤后的结果: "${this.filterEmoji(symbol)}"`);
    }
};

// 测试👌符号
console.log("准备测试emoji（使用正则表达式）");
EmojiUtil.testSymbol("👌");
console.log("emoji测试完成");