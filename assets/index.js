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
            filesData: [],
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
                for (let i = 0; i < this.filesData.length; i++) {
                    matchFileAndAssociation(this.filesData[i], this.associations[this.choseIndex].associationRules)
                }

            },
            config() { 
                // TODO 配置按键

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
                    const result = autoPerformFileOperation(file);
                    // TODO 填result 不为何
                    file.result = result;
                });
                utools.showNotification('处理完成');
                //TODO 如果处理失败不退出utool
                // this.outCurrentPlugin();
            },
            // 退出插件
            outCurrentPlugin() {
                utools.outPlugin();
                utools.hideMainWindow();
            },
            handldRulesTankuang() {
                this.showAddNav = false
            },
            editAssociationRules(index) {
                this.currentEditRules =this.associations[this.choseIndex].associationRules;
                this.showEditRules = true;
            },
            handleEditRulesClose() {
                this.showEditRules = false;
            },
            saveRules() {
                console.log("保存规则", this.associations[this.choseIndex].associationRules,this.currentEditRules);
                this.associations[this.choseIndex].associationRules = this.currentEditRules;
                this.showEditRules = false;
                this.saveAssociationTodb();
            },
            config() {
                
            },
            help() { },
            choseNavBtn(id, index) {
                this.choseNav = id;
                this.choseIndex = index;
                this.content = '当前协议： ' + this.associations[index].name;
                this.preParse()
            },
            addAssociation() {
                console.log("新增协议");
                this.showAddNav = true,
                    this.associationInfo = {
                        name: '',
                        id: ''
                    }
            },
            saveAssociation() {
                console.log("保存协议", this.associationInfo);
                this.associations.push(
                    {
                        id: this.associationInfo.id,
                        name: this.associationInfo.name,
                        actived: true,
                        associationRules: [
                            {
                                state: "Enabled",
                                rules: ".*",
                                action: "$4",
                                destination: "%FileName%V%CurrentYear%%CurrentMonth%%CurrentDay%.%FileExt%"
                            }
                        ]
                    }
                )
                this.saveAssociationTodb()
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
            },
            saveAssociationTodb(){
                utools.dbStorage.setItem("dropitConfig", this.associations);
            }
        },
        mounted: function () {
            // TODO 主题
            // document.documentElement.className = utools.isDarkColors() ? 'dark' : ''
            utools.onPluginEnter(({ code, type, payload, optional }) => {
                console.log('用户进入插件', code, type, payload);
                // utools.dbStorage.setItem("aniu", "10000");
                this.filesData = [];
                if (type === "files") {
                    this.filesData = payload || []
                    this.preParse()
                }
                const value = utools.dbStorage.getItem("dropitConfig");
                console.log("dbStorage`s valus is ", value);
                if (!value) {
                    console.log("true", this.associations);
                    this.saveAssociationTodb();
                } else {
                    this.associations = value;
                    console.log("init asso", this.associations);
                }
            });
        }
    });
}