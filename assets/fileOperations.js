const fileOperations = {
    move: (file) => {
        console.log(`正在移动文件: `, file);

    },
    copy: (file) => {
        console.log(`正在复制文件: `, file);
        // 在这里添加复制文件的具体逻辑
        // 例如，调用文件系统 API 或使用 Node.js 的 fs 模块
    },
    compress: (file) => {
        console.log(`正在压缩文件: `, file);
        // 在这里添加压缩文件的具体逻辑
        // 例如，使用 zlib 模块进行文件压缩
    },
    extract: (file) => {
        console.log(`正在提取文件: `, file);
        // 在这里添加提取文件的具体逻辑
        // 例如，使用解压库解压文件
    },
    rename: (file) => {
        console.log(`正在重命名文件: `, file);
        return window.renameFile(file);
    },
    delete: (file) => {
        console.log(`正在删除文件: `, file);
        // 在这里添加删除文件的具体逻辑
        // 例如，使用文件系统 API 或 Node.js 的 fs 模块
    },
    split: (file) => {
        console.log(`正在分割文件: `, file);
        // 在这里添加分割文件的具体逻辑
        // 例如，自定义分割文件的算法
    },
    join: (files) => {
        console.log(`正在连接文件: `, files);
        // 在这里添加连接文件的具体逻辑
        // 例如，自定义连接文件的算法
    },
    encrypt: (file) => {
        console.log(`正在加密文件: `, file);
        // 在这里添加加密文件的具体逻辑
        // 例如，使用 crypto 模块进行加密
    },
    decrypt: (file) => {
        console.log(`正在解密文件: `, file);
        // 在这里添加解密文件的具体逻辑
        // 例如，使用 crypto 模块进行解密
    },
    openWith: (file) => {
        console.log(`正在以特定方式打开文件: `, file);
        // 在这里添加打开文件的具体逻辑
        // 例如，调用系统的打开文件 API 或使用 Node.js 的 child_process 模块打开文件
    },
    print: (file) => {
        console.log(`正在打印文件: `, file);
        // 在这里添加打印文件的具体逻辑
        // 例如，使用打印 API 或 Node.js 的相关打印模块
    },
    upload: (file) => {
        console.log(`正在上传文件: `, file);
        // 在这里添加上传文件的具体逻辑
        // 例如，使用 axios 或 fetch 发送文件到服务器
    },
    sendByEmail: (file) => {
        console.log(`正在使用邮件发送文件: `, file);
        // 在这里添加使用邮件发送文件的具体逻辑
        // 例如，使用 Node.js 的 nodemailer 模块
    },
    createPhotoGallery: (files) => {
        console.log(`正在创建照片陈列室，包含文件: `, files);
        // 在这里添加创建照片陈列室的具体逻辑
        // 例如，使用图像处理库组织文件
    },
    createChecklist: (files) => {
        console.log(`正在创建清单，包含文件: `, files);
        // 在这里添加创建清单的具体逻辑
        // 例如，将文件信息存储在数组或对象中
    },
    createPlaylist: (files) => {
        console.log(`正在创建播放列表，包含文件: `, files);
        // 在这里添加创建播放列表的具体逻辑
        // 例如，使用音乐播放库创建播放列表
    },
    createShortcut: (file) => {
        console.log(`正在为文件创建快捷方式: `, file);
        // 在这里添加创建快捷方式的具体逻辑
        // 例如，使用文件系统 API 创建快捷方式
    },
    copyToClipboard: (content) => {
        console.log(`正在将内容复制到剪切板: ${content}`);
        // 在这里添加复制到剪切板的具体逻辑
        // 例如，使用 clipboard API 或 Node.js 的相关模块
    },
    modifyProperties: (file) => {
        console.log(`正在修改文件属性: `, file);
        // 在这里添加修改文件属性的具体逻辑
        // 例如，使用文件系统 API 修改文件元数据
    },
    ignore: (file) => {
        console.log(`正在忽略文件: `, file);
        // 在这里添加忽略文件的具体逻辑
        // 例如，只是记录文件但不进行任何操作
    }
};

const operationMap = {
    "$0": {
        en: "move",
        cn: "移动"
    },
    "$1": {
        en: "copy",
        cn: "复制"
    },
    "$2": {
        en: "compress",
        cn: "压缩"
    },
    "$3": {
        en: "extract",
        cn: "提取"
    },
    "$4": {
        en: "rename",
        cn: "重命名"
    },
    "$5": {
        en: "delete",
        cn: "删除"
    },
    "$6": {
        en: "split",
        cn: "分割"
    },
    "$7": {
        en: "join",
        cn: "连接"
    },
    "$8": {
        en: "encrypt",
        cn: "加密"
    },
    "$9": {
        en: "decrypt",
        cn: "解密"
    },
    "$10": {
        en: "openWith",
        cn: "打开方式"
    },
    "$11": {
        en: "print",
        cn: "打印"
    },
    "$12": {
        en: "upload",
        cn: "上载"
    },
    "$13": {
        en: "sendByEmail",
        cn: "使用邮件发送"
    },
    "$14": {
        en: "createPhotoGallery",
        cn: "创建照片陈列室"
    },
    "$15": {
        en: "createChecklist",
        cn: "创建清单"
    },
    "$16": {
        en: "createPlaylist",
        cn: "创建播放列表"
    },
    "$17": {
        en: "createShortcut",
        cn: "创建快捷方式"
    },
    "$18": {
        en: "copyToClipboard",
        cn: "复制到剪切板"
    },
    "$19": {
        en: "modifyProperties",
        cn: "修改属性"
    },
    "$20": {
        en: "ignore",
        cn: "忽略"
    }
};


function performFileOperation(file) {
    const operationName = operationMap[file.action.en];
    if (!operationName) {
        throw new Error(`未定义的操作键: ${file.action}`);
    }
    const operationFunction = fileOperations[operationName];
    if (!operationFunction) {
        throw new Error(`未定义的操作: ${operationName}`);
    }
    return operationFunction(file);
}


function autoPerformFileOperation(file) {
    return performFileOperation(file);
}
