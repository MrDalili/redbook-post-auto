// AI 相关函数

async function callAI(messages) {
    const apiKey = '0e1ec3fdad241a16189b54ef6de10e96.P951D07Cn2Cw7lIu';
    const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "glm-4",
                messages: messages,
                max_tokens: 4095
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("调用API失败:", error);
        throw error;
    }
}

async function polishContentWithAI(content) {
    const messages = [
        { role: "system", content: "你是一个专业的文字润色助手。请对给定的文本进行润色,保持原有的格式和样式,包括HTML标签、颜色等。返回的内容应该是一个有效的JSON数组。请注意我们跟在意的是 emoji，文字的颜色和背景颜色。而不是别的样式" },
        { role: "user", content: '在改内容的时候遵循几个要点 1，每一行的开头最好加一个 emoji，2. 只给关键的内容或者是句子加颜色或者背景颜色 3. 不允许一个字句子同时拥有背景颜色和文字颜色 4. 最好给那些句子的开头的内容加上背景颜色或者是字体颜[{"type":"title","text":"奥运会的多重价值"},{"type":"content","text":"内容：奥运会作为一个全球性的体育事，不仅展示了体育竞技的魅力，更是各国文化和城市特色展示的重要平台。通过这��的国际活动，可以有效地提升一个城市的国际形象和吸引力。"},{"type":"content","text":"核心句式：The Olympic Games, as a global sporting event, not only showcase the charm of sports but also serve as a significant platform for displaying the cultures and city characteristics of various countries. Such international events effectively enhance a city\'s international image and appeal."}]' },
        { role: "assistant", content: '```json\n[\n  {\n    "type": "title",\n    "text": "🏆 奥运会的多重价值 "\n  },\n  {\n    "type": "content",\n    "text": "🌍<font color="#e57b7b">内容：</font><span style="background-color: rgb(0, 255, 204);">奥运会作为一个全球性的体育盛事</span>，更是各国文化和城市特色展示的重要平台。通过这样的国际活动，可以有效地提升一个城市的国际形象和吸引力。🌍🏙️\\n\\n核心句式：🌍<font color="#e57b7b">核心句式：</font><span style="background-color: rgb(0, 255, 204);">The Olympic Games, as a global sporting event,</span> only showcase the charm of sports but also serve as a significant platform for displaying the cultures and city characteristics of various countries. Such international events effectively enhance a city\'s international image and appeal. 🏆🌟"\n  }\n]\n```' },
        { role: "user", content: '在改内容的时候遵循几个要点 1，每一行的开头最好加一个 emoji，2. 只给关键的内容或者是句子加颜色或者背景颜色 3. 不允许一个字句子同时拥有背景颜色和文字颜色 4. 最好给那些句子的开头的内容加上背景颜色或者是字体颜色' + JSON.stringify(content) }
    ];


    try {
        const result = await callAI(messages);
        console.log("API返回的原始内容:", result.choices[0].message.content);
        
        let contentString = result.choices[0].message.content.trim();
        contentString = contentString.replace(/^```json\n/, '').replace(/\n```$/, '');
        
        return JSON.parse(contentString);
    } catch (error) {
        console.error("处理API返回内容失败:", error);
        return content;
    }
}

async function segmentContentWithAI(content) {
    const button = document.getElementById('ai-polish-button');
    const originalText = button.textContent;

    const messages = [
        { role: "system", content: "你是一个专业的小红书文字处理助手。请对给定的文本进行分段、润色和总结。返回的内容应该是一个有效的JSON数组，每个数组项包含type和text字段。" },
        { role: "user", content: `请对以下内容进行分段、润色和总结，并按照以下格式返回JSON数组：
            1. 第一项应该是type为"title"的总结标题。
            2. 接下来的项应该是type为"content"的分段内容。
            3. 每个段落都应该以emoji开头。
            4. 适当地为关键内容添加颜色或背景颜色的HTML标签。
            5. 保持原文的主要意思。
            6. 一定要避免出现小红书的违禁词，虚构体验、夸大其词、低质创作、笔记过度P图、素材搬运、诱导行为、导流行为、拉踩行为，这八点都将纳入重点监测范围。
            7. title 不允许超过 10 个字
            内容：奥运会的多重价值 奥运会作为一个全球性的体育盛事，不仅展示了体育竞技的魅力，更是各国文化和城市特色展示的重要平台。通过这样的国际活动，可以有效地提升一个城市的国际形象和吸引力。The Olympic Games, as a global sporting event, not only showcase the charm of sports but also serve as a significant platform for displaying the cultures and city characteristics of various countries. Such international events effectively enhance a city\'s international image and appeal.` },
            { role: "assistant", content: '```json\n[\n  {\n    "type": "title",\n    "text": "🏆 奥运会的多重价值 "\n  },\n  {\n    "type": "content",\n    "text": "🌍<font color="#e57b7b">内容：</font><span style="background-color: rgb(0, 255, 204);">奥运会作为一个全球性的体育盛事</span>，更是各国文化和城市特色展示的重要平台。通过这样的国际活动，可以有效地提升一个城市的国际形象和吸引力。🌍🏙️\\n\\n核心句式：🌍<font color="#e57b7b">核心句式：</font><span style="background-color: rgb(0, 255, 204);">The Olympic Games, as a global sporting event,</span> only showcase the charm of sports but also serve as a significant platform for displaying the cultures and city characteristics of various countries. Such international events effectively enhance a city\'s international image and appeal. 🏆🌟"\n  }\n]\n```' },
            { role: "user", content: `请对以下内容进行分段、润色和总结，并按照以下格式返回JSON组：
            1. 第一项应该是type为"title"的总结标题。
            2. 接下来的项应该是type为"content"的分段内容。
            3. 每个段落都应该以emoji开头。
            4. 适当地为关键内容添加颜色或背景颜色的HTML标签。
            5. 保持原文的主要意思。
            6. 一定要避免出现小红书的违禁词，虚构体验、夸大其词、低质创作、笔记过度P图、素材搬运、诱导行为、导流行为、拉踩行为，这八点都将纳入重点监测范围。
            7. title 不允许超过 10 个字
            内容：${content}` },
        ];


    try {
        // 更改按钮文本和样式
        button.textContent = '分段润色中...';
        button.disabled = true;
        button.classList.add('processing');
        const result = await callAI(messages);
        console.log("API返回的原始内容:", result.choices[0].message.content);
        
        let contentString = result.choices[0].message.content.trim();
        contentString = contentString.replace(/^```json\n/, '').replace(/\n```$/, '');
        
        return JSON.parse(contentString);
    } catch (error) {
        console.error("处理API返回内容失败:", error);
        throw error;
    } finally {
        // 恢复按钮原始状态
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('processing');
    }
}


const generationModes = [
    { id: 'daily-sentence', name: '生成每日英语长难句', file: 'daily-sentence-generator.js' },
    { id: 'xiaohongshu-content', name: '生成小红书内容', file: 'xiaohongshu-content-generator.js' },
    // 可以继续添加其他模式
];


// 填充模式选择器
        // 修改 populateModeSelector 函数
        function populateModeSelector() {
            const modeSelector = document.getElementById('mode-selector');
            generationModes.forEach(mode => {
                const option = document.createElement('option');
                option.value = mode.id;
                option.textContent = mode.name;
                modeSelector.appendChild(option);
            });
            
            // 添加模式选择变化事件监听器
            modeSelector.addEventListener('change', function() {
                updateInputVisibility(this.value);
            });

            // 设置初始选中项为第一个选项
            if (modeSelector.options.length > 0) {
                modeSelector.selectedIndex = 0;
                // 触发一次 change 事件，以更新输入框的可见性
                modeSelector.dispatchEvent(new Event('change'));
            }
        }

// 新增函数：更新输入框可见性
function updateInputVisibility(selectedMode) {
    const dailySentenceInputs = document.getElementById('daily-sentence-inputs');
    dailySentenceInputs.style.display = selectedMode === 'daily-sentence' ? 'block' : 'none';
}

// 确保在 DOM 加载完成后执行 populateModeSelector
document.addEventListener('DOMContentLoaded', populateModeSelector);

// 加载选定模式的脚本
async function loadModeScript(modeId) {
    const mode = generationModes.find(m => m.id === modeId);
    if (!mode) throw new Error('未知的生成模式');

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = mode.file;
        script.onload = () => {
            console.log(`脚本 ${mode.file} 已加载`);
            const functionName = modeId.split('-').map((part, index) => 
                index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
            ).join('') + 'Generate';
            console.log(`函数名: ${functionName}`);
            if (typeof window[functionName] === 'function') {
                console.log(`函数 ${functionName} 已找到`);
                resolve();
            } else {
                console.error(`函数 ${functionName} 未找到`);
                reject(new Error('生成器函数未定义'));
            }
        };
        script.onerror = (error) => {
            console.error(`加载脚本 ${mode.file} 失败:`, error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}

// 生成内容的主函数
// 修改 generateContent 函数
async function generateContent(mode) {
    console.log("generateContent 被调用，模式为:", mode);
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '正在生成内容...';

    try {
        await loadModeScript(mode);
        
        const functionName = mode.split('-').map((part, index) => 
            index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
        ).join('') + 'Generate';
        
        if (typeof window[functionName] !== 'function') {
            throw new Error('生成器函数未定义');
        }
        
        let content;
        if (mode === 'daily-sentence') {
            const currentDay = document.getElementById('current-day').value;
            const customSentence = document.getElementById('custom-sentence').value;
            console.log("传递给生成函数的参数:", currentDay, customSentence); // 添加这行日志
            content = await window[functionName](currentDay, customSentence);
        } else {
            content = await window[functionName]();
        }
        
        displayGeneratedContent(content);
        
        setTimeout(adjustAllIframes, 100);
    } catch (error) {
        console.error("生成内容失败:", error);
        resultDiv.innerHTML = `<p>抱歉，生成内容时出现错误：${error.message}</p>`;
    }
}

// 将函数添加到全局作用域
window.polishContentWithAI = polishContentWithAI;
window.segmentContentWithAI = segmentContentWithAI;
window.populateModeSelector = populateModeSelector;
window.generateContent = generateContent;
window.callAI = callAI;
