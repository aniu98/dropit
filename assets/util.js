data1 = {
    msg: "dropit",
    dialogVisible: false,
    showAddNav: false,
    choseNav: 1,
    content: "文件列表",
    filesData: [
        {
            isDirectory: false,
            iisFile: true,
            name: "logo.png",
            path: "path",
            action: "$4",
            actionName: "重命名",
            destination: "",
            result:""
        }
    ],
    associations: [
        {
            id: '1',
            name: "default",
            actived: true,
            associationRules: [
                {
                    state: "Enabled",
                    rules: ".*",
                    action: "Action",
                    destination:"%FileName%V%CurrentYear%%CurrentMonth%%CurrentDay%.%FileExt%"
                }
            ]
        }
    ],
    currentFolderPath: "",
    currentRule: {}

}
config = {
    state: ["Disabled", "Enabled"],
    action: {
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

///////////////////////////////h上面删除 /////////////////////////////////////////////////

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


function parseAndReplaceVariables(file,template) {
    return template.replace(/%(\w+)%/g, (match, variable) => {
        if(match=="%FileName%"){
            return getFileName(file.name)
        }
        if(match=="%FileExt%"){
            return getExtension(file.name)
        }
        return config.context[variable] || match;
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

function matchFileAndAssociation(file, associationRules){
    for (let i = 0; i < associationRules.length; i++) {
        const regex = new RegExp(associationRules[i].rules);
        console.log(regex.test(file.name));
        if(regex.test(file.name)){  
            file.action=associationRules[i].action;
            file.actionName=config.action[associationRules[i].action];
            file.destination=parseAndReplaceVariables(file,associationRules[i].destination);
        }  
    }
}
