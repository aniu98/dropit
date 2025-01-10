const configText = `
[Target-C40179A9D7DAD484]
Image=Default.png
SizeX=64
SizeY=64
Opacity=100

[General-C40179A9D7DAD484]

[公文移动]
State=Enabled
Rules=*〔*〕*号-*.zip
Action=$0
Destination=G:\\cmft\\oa公文

[其他不动]
State=Disabled
Rules=*
Action=$2
Destination=-

[关于2024年度北京市工作居住证办理指标分配人选的公示附件]
State=Enabled
Rules=*.zip
Action=$0
Destination=G:\\cmft\\oa公文
`;

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
console.log(configList[2].name);