let isLogin=true;
const socket=io();
const notification=new Audio("sounds/notification.mp3");

let username="";
document.getElementById("chat-container")
.style.display="none";

 // loadMessages();  will implement it later for more security annd privcy

function loadMessages(){
    fetch("/messages")
    .then(res=>res.json())
    .then(messages=>{
        const box=document.getElementById("chat-box");
        box.innerHTML="";
        messages.forEach(msg=>{
            const time=new Date(msg.createdAt)
            .toLocaleTimeString([],{
                hour:"2-digit",
                minute:"2-digit"
            });
            const name=msg.username||"Anonymous";
            const className=name===username
            ?"message my-message"
            :"message other-message";

            box.innerHTML+=`
                <div
                class="${className}"
                id="msg-${msg._id}">

                    <strong>${name}</strong>
                    <small>${time}</small>
                    <div>${msg.message}</div>

                    ${
                    name===username
                    ?`
                    <div
                        class="seen-info"
                        id="seen-${msg._id}"
                        onclick="showSeenUsers('${msg._id}')">
                        👁 ${msg.seenBy.length}
                    </div>
                    `
                    :""
                    }

                </div>
            `;

            if(name!==username){
                socket.emit("messageSeen",{
                    messageId:msg._id,
                    username:username
                });
            }
        });
        box.scrollTop=box.scrollHeight;
    });
}

function sendMessage(){
    const input=document.getElementById("message");
    const msg=input.value;
    if(msg.trim()==="")return;
    socket.emit("sendMessage",{
        username:username,
        message:msg
    });
    input.value="";
    input.focus();
}

socket.on("receiveMessage",(data)=>{
    if(data.username!==username){
        notification.play().catch(()=>{});
    }
    const box=document.getElementById("chat-box");
    const time=new Date(data.createdAt)
    .toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });
    const name=data.username||"Anonymous";
    const className=name===username
    ?"message my-message"
    :"message other-message";
    box.innerHTML+=`
    <div
    class="${className}"
    id="msg-${data._id}">
        <strong>${name}</strong>
        <small>${time}</small>
        <div>${data.message}</div>
        ${
        name===username
        ?`
       <div
            class="seen-info"
            id="seen-${data._id}"
            onclick="showSeenUsers('${data._id}')">
            👁 0
        </div>
        `
        :""
        }

    </div>
`;

if(name!==username){
    socket.emit("messageSeen",{
        messageId:data._id,
        username:username
    });
}

    box.scrollTop=box.scrollHeight;
});

socket.on("systemMessage",(msg)=>{
    const box=document.getElementById("chat-box");
    box.innerHTML+=`
        <div class="system-message">
            ${msg}
        </div>
    `;
    box.scrollTop=box.scrollHeight;
});

socket.on("userCount",(count)=>{
    document.getElementById("online-users")
    .innerText=`Online Users: ${count}`;
});

socket.on("members",(members)=>{
    console.log("Members received:", members);
    console.log("Current username:", username);
    const list=document.getElementById("members");
    list.innerHTML="";
    members.forEach(member=>{
        console.log("Checking:", member);
        if(member===username){
            return;
        }
        list.innerHTML+=`
            <li>
                🟢 ${member}
            </li>
        `;
    });
});

socket.on("showTyping",(name)=>{
    if(name!==username){
        document.getElementById("typing")
        .innerText=`${name} is typing...`;
    }
});

socket.on("hideTyping",()=>{
    document.getElementById("typing").innerText="";
});

const loginTab=document.getElementById("login-tab");
const registerTab=document.getElementById("register-tab");
const authBtn=document.getElementById("auth-btn");

loginTab.addEventListener("click",()=>{
    isLogin=true;
    authBtn.innerText="Login";

});

registerTab.addEventListener("click",()=>{
    isLogin=false;
    authBtn.innerText="Register";

});

authBtn.addEventListener("click",async()=>{
    const enteredUsername=
    document.getElementById("username-input").value.trim();
    const password=document.getElementById("password-input").value.trim();
    const url=isLogin
    ?"/login"
    :"/register";
    const res=await fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username:enteredUsername,
            password
        })
    });

    const data=await res.json();
    if(!res.ok){
       const msg= document.getElementById("auth-message")
        msg.className="error-message";
        msg.innerText=data.message;
        return;
    }

    if(isLogin){
        const msg=document.getElementById("auth-message");
        msg.innerText="";
        localStorage.setItem(
            "token",
            data.token
        );
        username=enteredUsername;
        document.getElementById("auth-screen").style.display="none";
        document.getElementById("chat-container").style.display="flex";
        socket.emit("join",username);
        document.getElementById("avatar")
        .innerText=username.charAt(0)
        .toUpperCase();
        document.getElementById("current-user")
        .innerText=username;

    }
    else{
       const msg= document.getElementById("auth-message")
        msg.className="success-message";
        msg.innerText="Registration successful. Login now.";
        document.getElementById("password-input")
        .value="";
        isLogin=true;
        authBtn.innerText="Login";
    }

});
let typingTimer;
document.getElementById("message")
.addEventListener("input",()=>{
    if(username==="")return;
    socket.emit("typing",username);
    clearTimeout(typingTimer);
    typingTimer=setTimeout(()=>{
        socket.emit("stopTyping");
    },1000);
});

document.getElementById("message")
.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        sendMessage();
    }
});

const themeBtn=document.getElementById("theme-btn");
if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click",()=>{
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
    }
    else{
        localStorage.setItem("theme","light");
    }
});

const seenUsers={};
socket.on("seenUpdated",(data)=>{
    seenUsers[data.messageId]=data.seenBy;
    const seen=document.getElementById(
        `seen-${data.messageId}`
    );
    if(seen){
        seen.innerText=
        `👁 ${data.seenBy.length}`;
    }

});

function showSeenUsers(messageId){
    const users=seenUsers[messageId]||[];
    const list=document.getElementById("seen-list");
    list.innerHTML="";
    users.forEach(user=>{
        list.innerHTML+=`
            <li>🟢 ${user}</li>
        `;
    });
    document.getElementById("seen-modal")
    .style.display="flex";
}

function closeSeenModal(){
    document.getElementById("seen-modal")
    .style.display="none";
}

