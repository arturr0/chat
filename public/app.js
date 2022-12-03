let ACCOUNT;
var socket;
let inputVal;
let inputValString;
let singleReceiver;
let invitator;
let receiver;
let newDiv;
let toggle = [];
let toggleCntr = 0;
let cntr = 0;
function Groups (host,groupName)
{   
    this.host = host;
    this.groupName = groupName;
    this.members = [];
}

let group;
let groups = [];
let confParam = [];




//socket = io.connect('http://localhost:3000');
socket = io.connect();

socket.on('account', function(account, clients) {
  
  ACCOUNT = account;
  console.log("ACC" + ACCOUNT);
  console.log(clients);
  socket.emit('updateUsersReq', ACCOUNT);
  for (i=0; i < clients.length; i++)
  {
    for (j=0; j < clients[i].mess.length; j++)
    if (clients[i].mess[j] === ACCOUNT){
      $('#messanger').append(`<span class="invitation" data-value=${clients[i].Name}>${clients[i].Name}</span>`);
      $(".icon-mail").addClass("before-clicked");
    }
    for (j=0; j < clients[i].friends.length; j++)
    if (clients[i].friends[j] === ACCOUNT){
    
      if (clients[i].online)
      $('#friendsWindow').append(`<div class="fk"><div class="friend2" data-value=${clients[i].Name}>${clients[i].Name}</div><i class="icon-user" data-value=${clients[i].Name}></i></div>`);
      else if ((clients[i].online) === false)
      $('#friendsWindow').append(`<div class="fk"><div class="friend2" data-value=${clients[i].Name}>${clients[i].Name}</div><i class="icon-user" style="color: black" data-value=${clients[i].Name}></i></div>`);
      $('#group').append(`<div><input type="checkbox" class="createGr" value="${clients[i].Name}">
      <label for="scales">${clients[i].Name}</label></div>`);
      
    }
  }

  

  
});

socket.on('updateFriends', function(client) {
  
  
  let elements = document.querySelectorAll('.icon-user');
  console.log(elements);
  Array.from(elements).some((element, index) => {
      if (element.getAttribute('data-value') === client) {
        document.getElementsByClassName('icon-user')[index].style.color = 'green';
        return;}
  });
  
});


socket.on('repeat', function() {
  
  alert("THIS ACCOUNT EXISTS")
});

socket.on('Group', function(GROUPMembers, GROUP) {
  
  console.log("gr");
  console.log(GROUPMembers);
  console.log(GROUP);
});

socket.on('imTyping', function(client) {
  if (client === singleReceiver){
    $(".icon-keyboard").css("color", "red");
    function returnColor(){
      $(".icon-keyboard").css("color", "white");
      setTimeout(colorDelay(),1000)
    }
    setTimeout (returnColor, 1000);
  }
});

function colorDelay(){
  $(".icon-keyboard").toggleClass('red');
}

socket.on('newAccount', function(account) {
  
  //alert("NEW ACCOUNT CREATED");
  ACCOUNT = account;
  document.getElementById("account").style.display = "none";
  document.getElementById("accPage").style.display = "none";
  document.getElementById("wraper").style.display = "flex";
});

socket.on('passwordIncorrect', function(){
    alert("PASSWORD INCORECT");
});

socket.on('loadChat', function() {
  
  document.getElementById("passwordPage").style.display = "none";
  document.getElementById("wraper").style.display = "flex";
});
 

socket.on('sendMessage', function(inputVal, ACCOUNT) {
  console.log("rec");
  let outputVal = inputVal;

  if (document.getElementById(ACCOUNT) === null){
    newDiv = document.createElement("div");
    newDiv.id = ACCOUNT;
    newDiv.className = "chat"
    $('#chatList').append(newDiv);
  }
  //else newDiv.id = ACCOUNT;

  // if (document.getElementById("" + ACCOUNT).getElementsByClassName("messOut") === null && singleReceiver !== ACCOUNT){
  //   let newDivMess = document.createElement("span");
  //   newDivMess.id = ACCOUNT;
  //   newDivMess.className = "messOut";
  //   $(".messOut").attr('data-value', ACCOUNT); 
  //   $('#messanger').append(newDivMess);
  //   $(".icon-mail").addClass("before-clicked");
  //   console.log(newDivMess);
  // }

  if (singleReceiver !== ACCOUNT && $(".messOut").attr('data-value') !== ACCOUNT){

    $('#messanger').append(`<span class="messOut" data-value=${ACCOUNT}>${ACCOUNT}</span>`);
    $(".icon-mail").addClass("before-clicked");
  }
  let messageRec = document.getElementById(ACCOUNT);
                
  if (new Date($.now()).getMinutes() > 9) messageRec.innerHTML += (`<div class="messTime2"><div class="time">${new Date($.now()).getHours()}:${new Date($.now()).getMinutes()}</div><div class="chat_theirs" style="word-break: break-word">${inputVal}</div></div>`);
  else messageRec.innerHTML += (`<div class="messTime2"><div class="time">${new Date($.now()).getHours()}:0${new Date($.now()).getMinutes()}</div><div class="chat_theirs" style="word-break: break-word">${inputVal}</div></div>`);
  //document.querySelector(".chat").scrollTop = document.querySelector(".chat").scrollHeight;
  //scroll();
  jQuery(".chat").scrollTop(jQuery(".chat")[0].scrollHeight);
  var audio = new Audio("sounds/Ding.mp3");
  audio.volume = 0.5;
  audio.play();         
});

socket.on('sendInv', function(ACCOUNT) {
  
        //alert(ACCOUNT);
        $('#messanger').append(`<span class="invitation" data-value=${ACCOUNT}>${ACCOUNT}</span>`);
        $(".icon-mail").addClass("before-clicked");   
});

socket.on('invGroup', function (group, GROUP) {
  
  if (ACCOUNT !== GROUP.host){
  $('#messanger').append(`<span class="invitationGroup" data-value=${GROUP.id}>${GROUP.host}</span>`);
  $(".icon-mail").addClass("before-clicked");
  }
  else socket.emit('confirmGr', ACCOUNT, GROUP.id);   
});






socket.on('newClient', function(clients, id) {
  
  
  updateUsers(clients,"newclient");


  

});
socket.on('newLogin', function(clients, id) {
  
  updateUsers(clients,"newLogin");
  

  

});

socket.on('yourInvAcc', function(invited) {
  
  //alert(invited);
  

  

});

socket.on('updateInvRes', function(client, online) {
  
  console.log(online);
  if (online) $('#friendsWindow').append(`<div class="fk"><div class="friend2" data-value=${client}>${client}</div><i class="icon-user" data-value=${client}></i></div>`);
  else $('#friendsWindow').append(`<div class="fk"><div class="friend2" data-value=${client}>${client}</div><i class="icon-user" style="color: black" data-value=${client}></i></div>`);
  $('#group').append(`<div><input type="checkbox" class="createGr" value="${client}">
  <label for="scales">${client}</label></div>`);
  socket.emit('updateUsersReq', ACCOUNT);
  
});

socket.on('friends', function(client, clients) {
  console.log(cntr);
  socket.emit('updateInvReq', ACCOUNT, client);
  socket.emit('updateUsersReq', ACCOUNT);
  cntr++;
});

socket.on('friendDisconnected', function(disconnectedRoom) {
  
  let elements = document.querySelectorAll('.icon-user');
  console.log(elements);
  Array.from(elements).some((element, index) => {
      if (element.getAttribute('data-value') === disconnectedRoom) {
        document.getElementsByClassName('icon-user')[index].style.color = 'black';
        return;}
  });
  
});

socket.on('updateUsersRes', function(clients) {
  
  updateUsers(clients, "updateUsersRes");
  
});



if (document.getElementById("text")){
document.getElementById("text")
            .addEventListener("keydown", function(e) {
              inputVal = document.getElementById("text").value;
              inputValString = String(inputVal);  
              if (e.key === 'Enter') {
              if (inputVal !== null && inputVal.trim() !== '' && typeof singleReceiver !== 'undefined') {
                
                let message = document.getElementById(singleReceiver);
                if (new Date($.now()).getMinutes() > 9) message.innerHTML += (`<div class="messTime"><div class="chat_mine" style="word-break: break-word">${inputValString}</div><div class="time">${new Date($.now()).getHours()}:${new Date($.now()).getMinutes()}</div></div>`);
                else message.innerHTML += (`<div class="messTime"><div class="chat_mine" style="word-break: break-word">${inputValString}</div><div class="time">${new Date($.now()).getHours()}:0${new Date($.now()).getMinutes()}</div></div>`);
                    //document.querySelector(".chat").scrollTop = document.querySelector(".chat").scrollHeight;
                    socket.emit('message', inputValString, singleReceiver, ACCOUNT);
                    document.getElementById("text").value="";
                    console.log(inputVal);
                    //scroll();
                    jQuery(".chat").scrollTop(jQuery(".chat")[0].scrollHeight);
                }

              }  
 
              }

            );
            
}

document.getElementById("text")
            .addEventListener("keyup", function(e) {
              if (e.key !== 'Enter') 
                socket.emit('typing', ACCOUNT, singleReceiver);  
              });
        document.getElementById("text")
       // .addEventListener("keydown", function(e) {
       //   if (e.key !== 'Enter') //socket.emit('typing', ACCOUNT, singleReceiver);  
     //   });

$().ready(function(){
  $("#showHideUsers").click(function(){
    $("#users").toggle();
  });
});

  //tag friends
  $(document).on("click", ".friend", function() {
    
    
    //console.log(document.getElementById("friendsPlace"));
  
    
    //document.getElementsByClassName("friends")[$(this).index()].style.display = "none";
    singleReceiver = $(this).attr('data-value');
    document.getElementById('receiverSender').innerHTML = singleReceiver;
   
  //else newDiv.id = singleReceiver;
  changeDialog();
  
  document.getElementById('receiverSender').innerHTML = singleReceiver;
  //$(this).html($('<div>A</div>'));
  console.log(singleReceiver);
  
  

    
  });

  

  $(document).on("click", "#makeGroup", function() {
    
    document.getElementById("windowsContent").style.display = 'flex';
    document.getElementById("window").style.display = 'none';
    document.getElementById("windowGroup").style.display = 'flex';
    document.getElementById("group").style.display = 'flex';
    
    group = new Groups;
    //groups.push(group);
    console.log(groups);
    
  });
  $(document).on("click", ".createGr", function() {
    if (this.checked) {
      //console.log($(this).val() + $('.createGr').index(this));
      group.members.push([$(this).val(), 0])
      console.log("checked");
    } else {
      //console.log($(this).val() + $('.createGr').index(this));
      for ( i = 0; i < group.members.length; i++ )
      if (group.members[i] === $(this).val())
      group.members.splice(i,1);
      console.log("unchecked");
    // if (typeof groups[i].groupName === 'undefined')
    }
      console.log(group);
  })

  $(document).on("click", ".groupButtons", function() {
    
    document.getElementById("windowsContent").style.display = 'none';
    document.getElementById("windowGroup").style.display = 'none';
    
  });

  $(document).on("click", "#cancel", function() {
    
    // for ( i = 0; i < groups.length; i++ )
    // if (typeof groups[i].groupName === 'undefined')
    // groups.splice(i,1);
    delete group.host;
    delete group.groupName;
    delete group.members;
    console.log(groups, group);
    $(".createGr").prop("checked", false);
    document.getElementById("grName").value = "";
    
  });

  $(document).on("click", "#createGroup", function() {
    
    group.host = ACCOUNT;
    group.groupName = document.getElementById("grName").value;
    groups.push(group);
    console.log(groups, group);
    $(".createGr").prop("checked", false);
    document.getElementById("grName").value = "";
    socket.emit('createGroup', ACCOUNT, group );
  });

  $(document).on("click", ".messOut", function() {
    
    singleReceiver = $(this).attr('data-value');
    document.getElementById('receiverSender').innerHTML = singleReceiver;
    changeDialog();
    $(".icon-mail").removeClass("before-clicked");
    $(this).remove();
  });

  $(document).on("click", ".friend2", function() {
    
    
    //console.log(document.getElementById("friendsPlace"));
  
    
    //document.getElementsByClassName("friends")[$(this).index()].style.display = "none";
    singleReceiver = $(this).attr('data-value');
    document.getElementById('receiverSender').innerHTML = singleReceiver;
   
  //else newDiv.id = singleReceiver;
  changeDialog();
  
  document.getElementById('receiverSender').innerHTML = singleReceiver;
  //$(this).html($('<div>A</div>'));
  console.log(singleReceiver);
  
  

    
  });

  $(document).on("click", ".invitation", function() {
    
    
    
      /* do your thing */
    confParam = ["friend", 0];
    invitator = $(this).attr('data-value');
    console.log(invitator);
    document.getElementById("windowsContent").style.display = 'flex';
    document.getElementById("group").style.display = 'none';
    document.getElementById("window").style.display = 'inline';
    $(this).remove(); 
    $(".icon-mail").removeClass("before-clicked");
    
  });

  $(document).on("click", ".invitationGroup", function() {
    
    confParam = ["group", $(this).attr('data-value')];
    document.getElementById("windowsContent").style.display = 'flex';
    document.getElementById("group").style.display = 'none';
    document.getElementById("window").style.display = 'inline';
    $(this).remove(); 
    $(".icon-mail").removeClass("before-clicked");
  
  });

  $(document).on("click", ".invB", function() {
    
    console.log($(this).attr('value'));
    let elements = document.querySelectorAll('.invitation');
    let crossInv = false;
    Array.from(elements).some((element, index) => {
        if (element.getAttribute('data-value') === $(this).attr('value')) {crossInv = true; return;}
    });
  if (!crossInv){  
    socket.emit('invitation', $(this).attr('value'), ACCOUNT);
    socket.emit('updateUsersReq', ACCOUNT);
  }
  else alert("ALREADY INVITED");

    
  });

  $(document).on("click", ".blockB", function() {
    
    console.log($(this).attr('value'));
    

    
  });

  function myFunction(buttonParam) {
    document.getElementById(buttonParam).classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

////////////////////////////////////////////////////////////////////////////////////////

function scroll(){
  document.querySelector(".chat").scrollTop = document.querySelector(".chat").scrollHeight;
}

$(document).on("click", ".users", function() {
    
    
  // console.log($(this).index() + " " +     $(this).data('value'));

  // $('#option').append(`<span class="friends" data-value=${$(this).data('value')}>
  //             ${$(this).data('value')}
  //             </span>`);
  // document.getElementsByClassName("users")[$(this).index()].style.display = "none";
  // singleReceiver = $(this).data('value');
  // let receiver = document.getElementById("receiver");

  // receiver.innerHTML = singleReceiver;
  // console.log("rec " + singleReceiver);
  
  
  
  singleReceiver = $(this).attr('data-value');
  changeDialog();
  
  document.getElementById('receiverSender').innerHTML = singleReceiver;
  //$(this).html($('<div>A</div>'));
  console.log(singleReceiver);
  
  

  //document.getElementsByClassName("users")[0].remove();
});

$(document).on("click", ".invited", function() {

  singleReceiver = $(this).attr('data-value');
  changeDialog();
  
  document.getElementById('receiverSender').innerHTML = singleReceiver;
  
});

function hideMessage(){

  document.getElementById("windowsContent").style.display = 'none';

}

function confirmInv(confParam){

  if (confParam[0] === "friend") socket.emit('confirmInv', invitator, ACCOUNT);
  else if (confParam[0] === "group") socket.emit('confirmGr', ACCOUNT, confParam[1]);
}

function updateUsers(clients, param){

  $("#clients").empty();
  //$("#buttonsOpt").empty();
  for (i=0; i < clients.length; i++)
  { 
    for (j=0; j < clients[i].inv.length; j++){
    if (clients[i].inv[j] === ACCOUNT){
    $('#clients').append(`<div class="ck"><div class="invited" data-value=${clients[i].Name}>${clients[i].Name}</div><div class="sbButt"><div class="blockB" value=${clients[i].Name}><i class="icon-user-times icon-search red"></i></div></div></div>`);
    
    clients[i].checked = true;
    }}
    for (j=0; j < clients[i].friends.length; j++){
    if (clients[i].friends[j] === ACCOUNT){
    $('#clients').append(`<div class="ck"><div class="friend" data-value=${clients[i].Name}>${clients[i].Name}</div><div class="sbButt"><div class="blockB" value=${clients[i].Name}><i class="icon-user-times icon-search red"></i></div></div></div>`);
    
    clients[i].checked = true;
    }}
    if (clients[i].Name !== ACCOUNT && !clients[i].checked){
    $('#clients').append(`<div class="ck"><div class="users" data-value=${clients[i].Name}>${clients[i].Name}</div><div class="sbiButt"><div class="blockB" value=${clients[i].Name}><i class="icon-user-times icon-search red"></i></div><div class="invB" value=${clients[i].Name}><i class="icon-user-plus icon-search green"></i></div></div></div>`);
    
    }
  }

}

$('.chat').on('click', function() {
  $(this).prev().toggle();
});

function changeDialog(){

  toggle.push(singleReceiver);
  console.log(toggle);
  if (document.getElementById(singleReceiver) === null){
    newDiv = document.createElement("div");
    newDiv.id = singleReceiver;
    newDiv.className = "chat"
    $('#chatList').append(newDiv);
  }
  //else newDiv.id = singleReceiver;
  if (toggle.length > 1) document.getElementById(toggle[toggleCntr - 1]).style.display = 'none';
  document.getElementById(singleReceiver).style.display = 'flex';
  toggleCntr++;

}



