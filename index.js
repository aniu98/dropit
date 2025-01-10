window.onload = function () {
    const app = new Vue({
        el: "#app",
        data: {
            msg: "Hello World",
            count: 6666,
            dialogVisible: false,
            choseNav: 1,
            content: "右侧标题1",
            formInfo: {
                laber: '',
                id: ''
            },
            navlist: [
                {
                    id: 1,
                    laber: '标题1',
                }
            ],
            filesData: []
        },
        methods: {
            addHandle() {
                console.log("新增");
                this.dialogVisible = true
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
                this.dialogVisible = false
            },
            renameFiles() {
                console.log(this.filesData);

                window.renameFiles(this.filesData, ["v2025"])
                utools.showNotification('增加时间戳完成');
                this.clearFileNames();
                this.outCurrentPlugin();
            },
            dragFiles(e) {
                console.log("sss");
                if (e.dataTransfer && e.dataTransfer.files) {
                    for (let dragFile of e.dataTransfer.files) {
                        const file = {
                            name: dragFile.name,
                            path: dragFile.path
                        };
                        // window.checkDragFile(file);
                        if (!this.checkExistsFile(file)) {
                            this.filesData.push(file);
                        }
                    }
                }
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => { });
            }
        }
    });
}