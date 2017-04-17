/**
 * Created by eli9 on 4/16/2017.
 */
window.onload = function () {
    var hichat = new HiChat();
    hichat.init();
}

//global variable
var HiChat = function () {
    this.socket = null;
};

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
                var msg = nickName + (type == 'login' ? ' joined' : ' left');
                var p = document.createElement('p');
                p.textContent = msg;
                document.getElementById('historyMsg').appendChild(p);
                //将在线人数显示到页面顶部
                document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
            });
        }
    }
}