window.onload = function () {
    const app = new Vue({
        el: "#app",
        data: {
            msg: "dropit",
            dialogVisible: false,
            showAddNav: false,
            choseIndex: 0,
            choseNav: 1,
            content: "当前协议：",
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
            currentRule: {},
            showEditRules: false,
            currentEditRules: []
        },
        methods: {
            handleDragOver(event) {
                event.preventDefault();
                this.$el.classList.add('drag-over');
            },
            handleDragLeave(event) {
                event.preventDefault();
                this.$el.classList.remove('drag-over');
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
                e.preventDefault();
                this.$el.classList.remove('drag-over');
                
                if (e.dataTransfer && e.dataTransfer.files) {
                    const dropEffect = document.createElement('div');
                    dropEffect.className = 'drop-effect';
                    dropEffect.style.left = e.clientX + 'px';
                    dropEffect.style.top = e.clientY + 'px';
                    document.body.appendChild(dropEffect);
                    
                    dropEffect.addEventListener('animationend', () => {
                        document.body.removeChild(dropEffect);
                    });
                    
                    for (let dragFile of e.dataTransfer.files) {
                        const file = {
                            name: dragFile.name,
                            path: dragFile.path
                        };
                        window.checkDragFile(file);
                        if (!this.checkExistsFile(file)) {
                            this.filesData.push(file);
                            this.createFileAddEffect(file);
                        }
                    }
                    this.preParse();
                }
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
            editAssociationRules(index) {
                this.currentEditRules = [...this.associations[this.choseIndex].associationRules];
                this.showEditRules = true;
            },
            handleEditRulesClose() {
                this.showEditRules = false;
            },
            saveRules() {
                this.associations[this.choseIndex].associationRules = [...this.currentEditRules];
                this.showEditRules = false;
                this.preParse();
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
            },
            // 添加新规则
            addNewRule() {
                this.currentEditRules.push({
                    state: "Enabled",
                    rules: ".*",
                    action: "$4",
                    destination: ""
                });
            },
            
            // 删除规则
            deleteRule(index) {
                this.currentEditRules.splice(index, 1);
            },
            
            // 上移规则
            moveRuleUp(index) {
                if (index > 0) {
                    const temp = this.currentEditRules[index];
                    this.currentEditRules[index] = this.currentEditRules[index - 1];
                    this.currentEditRules[index - 1] = temp;
                }
            },
            
            // 下移规则
            moveRuleDown(index) {
                if (index < this.currentEditRules.length - 1) {
                    const temp = this.currentEditRules[index];
                    this.currentEditRules[index] = this.currentEditRules[index + 1];
                    this.currentEditRules[index + 1] = temp;
                }
            },
            
            // 添加新方法：创建文件添加动画
            createFileAddEffect(file) {
                const fileRow = document.createElement('div');
                fileRow.className = 'file-add-effect';
                fileRow.textContent = file.name;
                document.querySelector('.right').appendChild(fileRow);
                
                // 动画结束后移除元素
                fileRow.addEventListener('animationend', () => {
                    fileRow.remove();
                });
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