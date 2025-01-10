const configText = `
[Target-C40179A9D7DAD484]
Image=Default.png
SizeX=64
SizeY=64
Opacity=100

[General-C40179A9D7DAD484]

[defalut]
State=Enabled
Rules=*〔*〕*号-*.zip
Action=$0
Destination=G:\\cmft\\oa公文


`;
Associationsconfig = {
    State: ["Disabled", "Enabled"],
    Action: {
        $0: "移动", $1: "复制", $2: "压缩", $3: "提取", $4: "重命名", $5: "删除", $6: "分割", $7: "连接", $8: "加密", $9: "解密", $10: "打开方式", $11: "打印", $12: "上载", $13: "使用邮件发送", $14: "创建照片陈列室", $15: "创建清单", $16: "创建播放列表", $17: "创建快捷方式", $18: "复制到剪切板", $19: "修改属性", $20: "忽略",
    }
    ,
    env: {

    }
}

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

const configList = parseConfig(configText);
console.log(configList[2].properties.Destination);


function updateConfigProperty(configList, sectionName, propertyName, newValue) {
    const section = configList.find(item => item.name === sectionName);
    if (section) {
        section.properties[propertyName] = newValue;
    } else {
        console.error(`Section ${sectionName} not found.`);
    }
}

// Example usage:
updateConfigProperty(configList, 'defalut', 'Destination', 'C:\\new\\path');
console.log(configList[2].properties.Destination); // Should output 'C:\\new\\path'

function replaceMatchingPattern(inputString, newString) {
    // Define the regex pattern to match the rule *〔*〕*号-*.zip
    const pattern = /.*〔.*〕.*号-.*\.zip/;

    // Replace the matching pattern with the new string
    return inputString.replace(pattern, newString);
}

// Example usage:
const originalString = "example〔123〕456号-789.zip";
const replacedString = replaceMatchingPattern(originalString, "newFileName.zip");
console.log(replacedString); // Outputs: newFileName.zip

const context={
    FileName :"ss",
    CurrentYear :new Date().getFullYear(),
    CurrentMonth :new Date().getMonth()+1,
    CurrentDay : new Date().getDate(),
    FileExt:"txt"
}
function parseAndReplaceVariables(template, context) {
    return template.replace(/%(\w+)%/g, (match, variable) => {
        return context[variable] || match;
    });
}

console.log(new Date())
const template = "%FileName%V%CurrentYear%%CurrentMonth%%CurrentDay%.%FileExt%"
console.log(parseAndReplaceVariables(template, context));