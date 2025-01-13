
window.onload = function () {
    const app = new Vue({
        el: "#app",
        data:{
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
                            action: "$4",
                            destination:"%FileName%V%CurrentYear%%CurrentMonth%%CurrentDay%.%FileExt%"
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
                this.associations.forEach(e => {
                    if (e.actived) {
                        for (let i = 0; i < this.filesData.length; i++) {
                            matchFileAndAssociation(this.filesData[i], e.associationRules)
                        }
                    }
                });
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
                // window.renameFiles(this.filesData, ["v2025"])
                window.renameFile(this.filesData[1])
                utools.showNotification('增加时间戳完成');
                this.clearFileNames();
                this.outCurrentPlugin();
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
                this.choseNav = id
                this.content = '内容' + this.associations[index].name
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
            // utools.onPluginEnter(({ code, type, payload, optional }) => {
            //     console.log('用户进入插件', code, type, payload)
            //     this.filesData = [];
            //     if (type === "files") {
            //         this.filesData = payload || []
            //     }
            //     //

            // });
            // this.currentFolderPath = utools.getCurrentFolderPath()
        }
    });
}