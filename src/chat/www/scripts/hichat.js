/**
 * Created by eli9 on 4/16/2017.
 */
window.onload = function () {
    var hichat = new HiChat();
    hichat.init();
}
//一个class
//global variable
var HiChat = function () {
    this.socket = null;
};
//方法
HiChat.prototype = {
    init:function () {//init program
        var that = this;
        //建立到服务器的socket连接
        this.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已经建立
        if (this.socket == null) {
            document.getElementById('info').textContent = 'socket is null ';
        }else{
            this.socket.on('connect', function () {
                //连接到服务器后，显示昵称输入框
                document.getElementById('info').textContent = 'get yourself a nickname: ';
                document.getElementById('nickWrapper').style.display = 'block';
                document.getElementById('nicknameInput').focus();
            })

            document.getElementById('loginBtn').addEventListener('click', function(){
                var nickName = document.getElementById('nicknameInput').value;

                if(nickName.trim().length != 0){
                    that.socket.emit('login', nickName);
                }else{
                    document.getElementById('nicknameInput').focus();
                }
            }, false);

            this.socket.on('nickExisted', function() {
                document.getElementById('info').textContent = '!nickname is taken, choose another pls'; //显示昵称被占用的提示
            });

            this.socket.on('loginSuccess', function () {
                document.title = 'hichat | '+document.getElementById('nicknameInput').value;
                document.getElementById('loginWrapper').style.display = 'none';//隐藏遮罩层显聊天界面
                document.getElementById('messageInput').focus();//让消息输入框获得焦点
            });

            this.socket.on('system', function(nickName, userCount, type) {
                //判断用户是连接还是离开以显示不同的信息
                if(nickName != null) {
                    var msg = nickName + (type == 'login' ? ' joined' : ' left');
                    //指定系统消息显示为红色
                    that._displayNewMsg('system ', msg, 'red');
                    document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
                }
            });

            this.socket.on('newMsg', function (user, msg, color) {
                that._displayNewMsg(user, msg, color);
            });

            document.getElementById('sendBtn').addEventListener('click', function () {
                var messageInput = document.getElementById('messageInput'),
                    msg = messageInput.value,
                    color = document.getElementById('colorStyle').value;
                messageInput.value = '';
                messageInput.focus();
                if(msg.trim().length!=0){
                    //This 和 That是不一样的
                    that.socket.emit('postMsg', msg, color);//发送消息到服务器
                    that._displayNewMsg('me',msg,color);//把自己的消息显示到自己的窗口中
                }
            },false);

            document.getElementById('sendImage').addEventListener('change', function () {
                //检查是否有文件被选中
                if(this.files.length != 0){
                    var file = this.files[0],
                    reader = new FileReader();
                    if(!reader){
                        that._displayNewMsg('system','!your browser does\'nt support H5','red');
                        this.value = '';
                        return;
                    };
                    reader.onload = function(e){
                        //读取成功,显示到页面并发送到服务器
                        this.value = '';
                        //e是事件对象 e.target.result是文件的内容
                        that.socket.emit('img', e.target.result);
                        that._displayImage('me',e.target.result);
                    }
                    // 读取结果是一个基于Base64编码的 data-uri 对象。
                    reader.readAsDataURL(file);
                }
            },false);

            //接收 newImg事件
            this.socket.on('newImg', function (user, imgData) {
                that._displayImage(user,imgData);
            });

            this._initialEmoji();

            //为emoji button添加click事件，点击时，显示emoji列表。
            document.getElementById('emoji').addEventListener('click', function (e) {
                var emojiwrapper = document.getElementById('emojiWrapper');
                emojiwrapper.style.display = 'block';
                e.stopPropagation();
            },false);

            //添加click事件，为body
            document.body.addEventListener('click', function (e) {
                var emojiwrapper = document.getElementById('emojiWrapper');
                if(e.target != emojiwrapper){ //不是点击emojiwrapper
                    emojiwrapper.style.display = 'none';
                };
            });

            document.getElementById('emojiWrapper').addEventListener('click', function(e) {
                //获取被点击的表情
                var target = e.target;
                if (target.nodeName.toLowerCase() == 'img') {
                    var messageInput = document.getElementById('messageInput');
                    messageInput.focus();
                    messageInput.value = messageInput.value + '[emoji:'+target.title+']';
                };
            },false);

            //添加enter键发送设置 在输出昵称框
            document.getElementById('nicknameInput').addEventListener('keyup',function (e) {
                if(e.keyCode == 13){
                    var nickname = document.getElementById('nicknameInput').value;
                    if(nickname.trim().length != 0){
                        that.socket.emit('login', nickname);
                    };
                };
            }, false);

            //添加enter键发送设置 在发送消息框
            document.getElementById('messageInput').addEventListener('keyup',function (e) {
                var messageInput = document.getElementById('messageInput'),
                    msg = messageInput.value,
                    color = document.getElementById('colorStyle').value;
                if(e.keyCode == 13 && msg.trim().length != 0){
                    messageInput.value = '';
                    that.socket.emit('postMsg', msg, color);
                    that._displayNewMsg('me', msg, color);
                };
            }, false);
        }
    },

    //发送消息
    _displayNewMsg:function(user, msg, color){
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0,8),
            msg = this._showEmoji(msg); //这里有返回值的接收

        var userMsg = document.getElementById('usersMsg');
        var test = document.createElement('t');

        msgToDisplay.style.color = color||'#00';
        msgToDisplay.innerHTML = user + '<span class = "timespan">('+date+'):</span>'+msg;

        test.style.color = 'green';
        test.innerHTML='test';

        container.appendChild(msgToDisplay);
        userMsg.appendChild(test);

        container.scrollTop = container.scrollHeight;
    },

    //发送图片
    _displayImage: function(user, imgData, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },

    //初始化Emoji到页面中
    _initialEmoji: function () {
        var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();//创建文档碎片节点
        for(var i=69; i>0; i--){
            var emojiItem = document.createElement('img');// 创建的node的nodeName是 img
            emojiItem.src = '../content/emoji/'+i+'.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    },

    //处理msg中的Emoji，并把Emoji代码转换为<img />标签
    _showEmoji:function (msg) {
        var match,
            result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        //reg.exec(msg)会返回匹配的Emoji代码，每次返回一个，直到msg中没有匹配的。
        while(match = reg.exec(msg)){
            var math = match[0];
            //slice() 方法可从已有的数组中返回选定的元素。 match[0]:此数组的第 0 个元素是与正则表达式相匹配的文本
            emojiIndex = match[0].slice(7,-1);//从0是起始位置，位置7开始。 -1表示从末尾开始
            if(emojiIndex > totalEmojiNum){
                result = result.replace(match[0],'[X]');
            }else{
                //通过替换result里面的对应的Emoji代码
                result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />');
            };
        };
        return result;
    }
};