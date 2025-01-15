
function getFileName(file) {
    return file.name.substring(0, file.name.lastIndexOf("."))
}
function getFileExtension(file) {
    return file.name.substring(file.name.lastIndexOf(".") + 1)
}

function getDirectoryInfo(file) {
    if (!file.isFile) return {
        fullPath: '',
        dirName: ''
    };

    // 获取文件所在目录的路径
    const fullPath = file.path || '';
    const pathParts = fullPath.split('/');
    const dirName = pathParts[pathParts.length - 2] || ''; // 获取最后一个目录名
    return {
        fullPath,
        dirName
    };
}

function getDroppedFileInfo(file) {
    if (!file) return {
        dirPath: '',
        dirName: ''
    };

    // 获取拖放文件的目录信息
    const dirPath = file.dropPath || '';
    const pathParts = dirPath.split('/');
    const dirName = pathParts[pathParts.length - 1] || '';

    return {
        dirPath,
        dirName
    };
}

function getCurrentDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function getCurrentTime() {
    let now = new Date();
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
function getCurrentWeek() {
    let today = new Date();
    let firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    let pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7).toString();
}
function getPhotoMetadata(file) {
    if (!file) return {
        dateTaken: '',
        yearTaken: ''
    };

    // 从文件中读取EXIF信息
    const metadata = file.metadata || {};
    const dateTaken = metadata.dateTaken || '';
    const yearTaken = dateTaken ? dateTaken.split('-')[0] : '';

    return {
        dateTaken,
        yearTaken
    };
}

function getUserInputValue() {
    // 这里应该是获取用户输入的逻辑
    return 'example input';
}

function getCounter() {
    // 这里应该是管理计数器的逻辑   
    let count = 9;
    return (++count).toString();
}

function replacePlaceholders(file,inputString,handlers) {
    if (!handlers) {
        handlers = myHandlers;
    }
    let result = inputString;
    for (let placeholder in handlers) {
        if (handlers.hasOwnProperty(placeholder)) {
            result = result.replace(placeholder, handlers[placeholder](file));
        }
    }
    return result;
}

// 示例的自定义 Handlers
let myHandlers = {
    // 文件相关
    '%FileNameExt%': (file) => file.name,
    '%FileName%': (file) => getFileName(file),
    '%FileExt%': (file) => getFileExtension(file),

    // 目录相关
    '%ParentDir%': (file) => getDirectoryInfo(file).fullPath,
    '%ParentDirName%': (file) => getDirectoryInfo(file).dirName,

    // 拖放目录相关
    '%DroppedDir%': (file) => getDroppedFileInfo(file).dirPath,
    '%DroppedDirName%': (file) => getDroppedFileInfo(file).dirName,

    // 当前日期时间相关（保持原样，因为已经是函数形式）
    '%CurrentDate%': () => getCurrentDate(),
    '%CurrentYear%': () => new Date().getFullYear().toString(),
    '%CurrentMonth%': () => String(new Date().getMonth() + 1).padStart(2, '0'),
    '%CurrentWeek%': () => getCurrentWeek(),
    '%CurrentDay%': () => String(new Date().getDate()).padStart(2, '0'),
    '%CurrentTime%': () => getCurrentTime(),
    '%CurrentHour%': () => String(new Date().getHours()).padStart(2, '0'),
    '%CurrentMinute%': () => String(new Date().getMinutes()).padStart(2, '0'),
    '%CurrentSecond%': () => String(new Date().getSeconds()).padStart(2, '0'),
    '%CurrentMonthName%': () => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date()),
    '%CurrentMonthShort%': () => new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date()),
    '%CurrentDayName%': () => new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()),
    '%CurrentDayShort%': () => new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date()),

    // 照片元数据相关
    '%DateTaken%': (file) => getPhotoMetadata(file).dateTaken,
    '%YearTaken%': (file) => getPhotoMetadata(file).yearTaken,

    // 用户输入和计数器
    '%UserInput%': () => getUserInputValue(),
    '%Counter%': () => getCounter()
};

// 示例使用
const file = {
    name: "example.txt",
    path: "path/to/example.txt",
    isFile: true,
    isDirectory: false,
    metadata: {
        dateTaken: "2024-01-01",
        yearTaken: "2024"
    }
};

let input = "%FileNameExt%%FileName%%FileExt%%ParentDir%%ParentDirName%%DroppedDir%%DroppedDirName%%CurrentDate%%CurrentYear%%CurrentMonth%%CurrentWeek%%CurrentDay%%CurrentTime%%CurrentHour%%CurrentMinute%%CurrentSecond%%CurrentMonthName%%CurrentMonthShort%%CurrentDayName%%CurrentDayShort%%DateTaken%%UserInput%%Counter%%YearTaken%";
input = "%FileNameExt%-%FileName%-%FileExt%-%ParentDir%-%ParentDirName%-%DroppedDir%-%DroppedDirName%-%CurrentDate%-%CurrentYear%-%CurrentMonth%-%CurrentWeek%-%CurrentDay%-%CurrentTime%-%CurrentHour%-%CurrentMinute%-%CurrentSecond%-%CurrentMonthName%-%CurrentMonthShort%-%CurrentDayName%-%CurrentDayShort%-%DateTaken%-%UserInput%-%Counter%-%YearTaken%"
console.log(replacePlaceholders(file,input));


