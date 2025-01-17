
config = {
    state: ["Disabled", "Enabled"],
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
            file.actionName = operationMap[associationRules[i].action].cn;
            file.destination = replacePlaceholders(file, associationRules[i].destination)
            // 匹配到规则 终止
            break;
        }
    }
}
