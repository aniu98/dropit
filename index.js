
window.onload = function () {
    const app = new Vue({
        el: "#app",
        data: {
            msg: "dropit",
            dialogVisible: false,
            showAddNav: false,
            choseIndex: 0,
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
                    result: "tes"
                }
            ],
            associations: [
                {
                    id: '1',
                    name: "增加时间戳",
                    actived: true,
                    associationRules: [
                        {
                            state: "Enabled",
                            rules: ".*",
                            action: "$4",
                            destination: "%FileName%V%CurrentYear%%CurrentMonth%%CurrentDay%.%FileExt%"
                        }
                    ]
                },
                {
                    id: '2',
                    name: "oa文件移动",
                    actived: true,
                    associationRules: [
                        {
                            state: "Enabled",
                            rules: ".*zip",
                            action: "$1",
                            destination: "G:\\cmft\\oa公文"
                        },
                        {
                            state: "Enabled",
                            rules: ".*",
                            action: "$20",
                            destination: ""
                        }
                    ]
                }
            ],
            currentFolderPath: "",
            currentRule: {}

        },
        methods: {
            handleDragOver(event) {
                // 可以添加一些视觉反馈
            },
            preParse() {
                // this.associations.forEach(e => {
                //     if (e.actived) {
                //         for (let i = 0; i < this.filesData.length; i++) {
                //             matchFileAndAssociation(this.filesData[i], e.associationRules)
                //         }
                //     }
                // });
                for (let i = 0; i < this.filesData.length; i++) {
                    matchFileAndAssociation(this.filesData[i], this.associations[this.choseIndex].associationRules)
                }
                
            },
            handleDrop(e) {
                if (e.dataTransfer && e.dataTransfer.files) {
                    for (let dragFile of e.dataTransfer.files) {
                        const file = {
                            name: dragFile.name,
                            path: dragFile.path
                        };
                        window.checkDragFile(file);
                        if (!this.checkExistsFile(file)) {
                            this.filesData.push(file);
                        }
                    }
                }
                this.preParse()
            },
            checkExistsFile(file) {
                return !!this.filesData.find(existsFile => existsFile.path === file.path);
            },
            //处理文件
            dealFile() {
                console.log(this.filesData);
                this.filesData.forEach(file => {
                    const result = window.renameFile(file);
                    // TODO 填result 不为何
                    file.result = result;
                });
                utools.showNotification('处理完成');
                //TODO 如果处理失败不退出utool
                this.outCurrentPlugin();
            },
            // 退出插件
            outCurrentPlugin() {
                utools.outPlugin();
                utools.hideMainWindow();
            },
            handldRulesTankuang() {
                this.showAddNav = false
            },
            addRules() {
                console.log("新加规则");
                this.showAddNav = true,
                    this.formInfo = {
                        name: '',
                        id: ''
                    }
            },
            config() {

            },
            help() {

            },
            choseNavBtn(id, index) {
                this.choseNav = id;
                this.choseIndex = index;
                this.content = '当前协议： ' + this.associations[index].name;
                this.preParse()
            },
            addForm() {
                console.log("22", this.formInfo);
                this.associations.push(
                    {
                        id: this.formInfo.id,
                        name: this.formInfo.name
                    }
                )
                this.showAddNav = false
            },

            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => { });
            }
        },
        mounted: function () {
            // TODO 主题
            // document.documentElement.className = utools.isDarkColors() ? 'dark' : ''
            utools.onPluginEnter(({ code, type, payload, optional }) => {
                console.log('用户进入插件', code, type, payload)
                this.filesData = [];
                if (type === "files") {
                    this.filesData = payload || []
                    this.preParse()
                }
            });
            this.currentFolderPath = utools.getCurrentFolderPath()
        }
    });
}