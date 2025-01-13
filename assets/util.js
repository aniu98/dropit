const configText = `
[Target-C40179A9D7DAD484]
Image=Default.png
SizeX=64
SizeY=64
Opacity=100
[General-C40179A9D7DAD484]
[defalut]
State=Enabled
Rules=.*.txt
Action=$4
Destination=%FileName%V%CurrentYear%%CurrentMonth%%CurrentDay%.%FileExt%
`;

///////////////////////////////h上面删除 /////////////////////////////////////////////////
Associationsconfig = {
    State: ["Disabled", "Enabled"],
    Action: {
        $0: "移动", $1: "复制", $2: "压缩", $3: "提取", $4: "重命名", $5: "删除", $6: "分割", $7: "连接", $8: "加密", $9: "解密", $10: "打开方式", $11: "打印", $12: "上载", $13: "使用邮件发送", $14: "创建照片陈列室", $15: "创建清单", $16: "创建播放列表", $17: "创建快捷方式", $18: "复制到剪切板", $19: "修改属性", $20: "忽略",
    }
    ,
    context: {
        FileName: "ss",
        CurrentYear: new Date().getFullYear(),
        CurrentMonth: new Date().getMonth() + 1,
        CurrentDay: new Date().getDate(),
        FileExt: "txt"
    }
}
function getFileName(fileName) {
    return fileName.substring(0, fileName.lastIndexOf("."))
}
function getExtension (fileName) {
    return fileName.substring(fileName.lastIndexOf("."))
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

// Example usage:
// updateConfigProperty(configList, 'defalut', 'Destination', 'C:\\new\\path');
// console.log(configList[2].properties.Destination); // Should output 'C:\\new\\path'

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


function parseAndReplaceVariables(file,template) {
    return template.replace(/%(\w+)%/g, (match, variable) => {
        if(match=="%FileName%"){
            return getFileName(file.name)
        }
        if(match=="%FileExt%"){
            return getExtension(file.name)
        }
        return Associationsconfig.context[variable] || match;
    });
}

function matchFilesAndAssociation(files, association){
    const actions=[];
    files.forEach(element => {
        const FileName = element.birthtimeMs;
        console.log(FileName)
        actions.push({
            action:"$0",
            Destination:""
        });
    });
    return actions;
}

// function findFilesByPattern(pattern) {
//     // 假设有一个文件数组
//     const files = ['example.jpg', 'document.pdf', 'photo.png', 'report.docx'];
    
//     // 创建正则表达式对象
//     const regex = new RegExp(pattern);
    
//     // 使用filter方法和正则表达式进行匹配
//     const matchedFiles = files.filter(file => );
    
//     return matchedFiles;
//   }
function matchFileAndAssociation(file, association){
    for (let i = 2; i < association.length; i++) {
        const regex = new RegExp(association[i].properties.Rules);
        console.log(regex.test(file.name));
        if(regex.test(file.name)){  
            file.operate=association[i].properties.Action;
            file.target=parseAndReplaceVariables(file,association[i].properties.Destination);
        }  
    }
}

//test
// const files =[fs.readFileSync(filesPath[0])]


// const fs = require('fs');
// const filesPath = [
//     "C:\\Users\\Admin\\Desktop\\v2025.txt"
// ]

// try {
//     const files = fs.statSync(filesPath[0]); // 替换为你的文件路径

//     console.log(`文件大小: ${files.size} 字节`);
//     console.log(`创建时间: ${files.ctime}`);
//     // console.log(`修改时间: ${files.path}`);
//     const association = parseConfig(configText);
//     console.log(files);
//     matchFileAndAssociation([files], association)
//     // ... 更多属性
// } catch (err) {
//     console.error(`获取文件属性失败: ${err.message}`);
// }
// test
