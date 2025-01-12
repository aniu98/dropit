
window.onload = function () {
    const app = new Vue({
        el: "#app",
        data: {
            msg: "Hello World",
            dialogVisible: false,
            showAddNav:false,
            choseNav: 1,
            content: "右侧标题1",
            tableList:[
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
            filesData: []
        },
        methods: {
            handleDragOver(event) {
                // 可以添加一些视觉反馈
            },
            handleDrop(event) {
                const files = event.dataTransfer.files;
                // 处理拖入的文件
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    // 处理文件对象 file
                    const matchResult=matchFileAndAssociation(file,parseConfig(configText))
                    console.log(file);
                    this.tableList.push(matchResult)
                }
            },
            handldRulesTankuang(){
                this.showAddNav=false
            },
            addRules(){
               console.log("新加规则");
               this.showAddNav=true,
               this.formInfo= {
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
            renameFiles() {
                console.log(this.filesData);

                window.renameFiles(this.filesData, ["v2025"])
                utools.showNotification('增加时间戳完成');
                this.clearFileNames();
                this.outCurrentPlugin();
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