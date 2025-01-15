
config = {
    state: ["Disabled", "Enabled"],
    action: {
        $0: "移动", $1: "复制", $2: "压缩", $3: "提取", $4: "重命名", $5: "删除", $6: "分割", $7: "连接", $8: "加密", $9: "解密", $10: "打开方式", $11: "打印", $12: "上载", $13: "使用邮件发送", $14: "创建照片陈列室", $15: "创建清单", $16: "创建播放列表", $17: "创建快捷方式", $18: "复制到剪切板", $19: "修改属性", $20: "忽略",
    }
}
// 解析 配置文件 
function parseConfig(config) {
    const lines = config.trim().split('\n');
    const result = [];
    let currentSection = null;
    let currentObject = null;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('[') && line.endsWith(']')) {
            if (currentObject) {
                result.push(currentObject);
            }
            currentSection = line.slice(1, -1);
            currentObject = { name: currentSection, properties: {} };
        } else if (line && currentObject) {
            const [key, value] = line.split('=');
            currentObject.properties[key.trim()] = value ? value.trim() : '';
        }
    });

    if (currentObject) {
        result.push(currentObject);
    }

    return result;
}
//处理文件

function updateConfigProperty(configList, sectionName, propertyName, newValue) {
    const section = configList.find(item => item.name === sectionName);
    if (section) {
        section.properties[propertyName] = newValue;
    } else {
        console.error(`Section ${sectionName} not found.`);
    }
}


function matchFilesAndAssociation(files, association) {
    const actions = [];
    files.forEach(element => {
        const FileName = element.birthtimeMs;
        console.log(FileName)
        actions.push({
            action: "$0",
            Destination: ""
        });
    });
    return actions;
}
// 文件匹配规则
function matchFileAndAssociation(file, associationRules) {
    for (let i = 0; i < associationRules.length; i++) {
        const regex = new RegExp(associationRules[i].rules);
        console.log(regex.test(file.name));
        if (regex.test(file.name)) {
            file.action = associationRules[i].action;
            file.actionName = config.action[associationRules[i].action];
            file.destination = replacePlaceholders(file, associationRules[i].destination)
            // 匹配到规则 终止
            break;
        }
    }
}
