
window.onload = function () {
    const app = new Vue({
        el: "#app",
        data: {
            msg: "dropit",
            dialogVisible: false,
            showAddNav: false,
            choseNav: 1,
            content: "文件列表",
            filesData: [
            ],
            formInfo: {
                laber: '',
                id: ''
            },
            navlist: [
                {
                    id: 1,
                    laber: 'default',
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
                this.currentRule = parseConfig(configText);
                for (let i = 0; i < this.filesData.length; i++) {
                    const file = this.filesData[i];
                    // 处理文件对象 file
                    const matchResult = matchFileAndAssociation(file, this.currentRule)
                    // if (Object.keys(matchResult) != 0) {
                    //     this.filesData.push(matchResult)
                    // }
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
                        if(!this.checkExistsFile(file)){
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
                window.renameFiles(this.filesData, ["v2025"])
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
                        laber: '',
                        id: ''
                    }
            },
            config() {

            },
            help() {

            },
            choseNavBtn(id, index) {
                this.choseNav = id
                this.content = '内容' + this.navlist[index].laber
            },
            addForm() {
                console.log("22", this.formInfo);
                this.navlist.push(
                    {
                        id: this.formInfo.id,
                        laber: this.formInfo.laber
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
                    // this.filesData = payload || []
                    for (let i = 0; i < payload.length; i++) {
                        this.preParse(payload[i])
                    }
                }
                //

            });
            this.currentFolderPath = utools.getCurrentFolderPath()
        }
    });
}