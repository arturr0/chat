function Client (id, Name, online, checked)
{
    this.id = id;
    this.Name = Name;
    this.online = online;
    this.checked = checked;
    this.friends = [];
    this.inv = [];
    this.mess = [];
    this.groups = [];
}

function Groups(id,host, name){

  this.id = id;
  this.host = host;
  this.name = name;
  this.Members = [];

}

//let GROUP;

let cntr = 0;







let clients = [];
let client;

let groupId = 0;


const express = require('express');


const app = express();

const server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

const io = require('socket.io')(server);



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
    
    //console.log(socket.id);
    //let id = socket.id;
    //client = new Client(socket.id);
    //clients.push(client);
    
    //io.to(socket.id).emit('id', id);
    //io.sockets.emit('newClient', clients, id);
    socket.on('message', function(inputVal, singleReceiver, ACCOUNT) {
      
                //console.log("rec " + singleReceiver);
                //io.to(singleReceiver).emit('sendMessage', inputVal); 
                io.sockets.in(singleReceiver).emit('sendMessage', inputVal, ACCOUNT);
        
        
        
    });
    
    socket.on('newAcc', function(account) {
      let repeat;
      for (i=0; i < clients.length; i++)
            if (account !== clients[i].Name)
              repeat = false;
            else repeat = true;
      if (!repeat)
      {
        let id = socket.id;
        
        
        
        client = new Client(socket.id, account, true);
        // let gn = 'name';
        // let mem = 'mem';
        // let mem2 = 'mem2';
        
        // let GROUP = new Groups("host", gn);
        // GROUP.Members = [mem, mem2];
        // for (i = 0; i < 2; i++)
        // client.groups.push(GROUP);
         
        clients.push(client);
        socket.join(account);
        io.to(socket.id).emit('account', account, clients);
        io.to(socket.id).emit('newAccount', account);
        
        io.sockets.emit('newClient', clients, account);
        io.to(socket.id).emit('loadChat');
           
      }  
      else io.to(socket.id).emit('repeat'); 
      // console.log(clients);
      // console.log(client);
      // console.log(client.groups[0].name);
      // console.log(client.groups[0].Members[0]);
      // console.log(clients[0].groups[0].Members[0]);
      
    });

    socket.on('password', function(password) {
      let correct;
      for (i=0; i < clients.length; i++)
            if (password === clients[i].Name && !clients[i].online){
              correct = true;
              break;
            }
            else correct = false;
      if (correct)
      { 
        socket.join(password);
        for (i=0; i < clients.length; i++)
            if (password === clients[i].Name){
              //clients.splice(i,1);
              //client = new Client(socket.id, password, true);
              clients[i].id = socket.id;
              clients[i].online = true;
              //socket.join(password);
              io.to(socket.id).emit('loadChat');
              io.to(socket.id).emit('account', password, clients);
              //io.sockets.emit('newLogin', clients, password);
              for (i=0; i < clients.length; i++)
              if (password === clients[i].Name)
              for (j=0; j < clients[i].friends.length; j++){
              io.sockets.in(clients[i].friends[j]).emit('updateUsersRes', clients);
              io.sockets.in(clients[i].friends[j]).emit('updateFriends', password);
              }

            }
         
      }  
      else io.to(socket.id).emit('passwordIncorrect'); 
      console.log(password);
      console.log(clients);
      
    });
      
    socket.on('invitation', function(singleReceiver, ACCOUNT) {
      
      
      for (i=0; i < clients.length; i++)
        
        if (singleReceiver === clients[i].Name){
          clients[i].inv.push(ACCOUNT);
          //clients[i].mess.push(ACCOUNT);
        }
        else if (ACCOUNT === clients[i].Name) clients[i].mess.push(singleReceiver);

      io.sockets.in(singleReceiver).emit('sendInv', ACCOUNT, clients);
      console.log("INV");
      console.log(singleReceiver);
      console.log(clients);

      
      
    });

    socket.on('confirmInv', function(invitator, ACCOUNT) {
      
      //console.log(invitator + ACCOUNT)
      let inviting = invitator;
      let invited = ACCOUNT;
      io.sockets.in(invitator).emit('yourInvAcc', invited);
      for (i=0; i < clients.length; i++)
            if (inviting === clients[i].Name){
              clients[i].friends.push(invited);
              for (j=0; j < clients[i].mess.length; j++)
                if (clients[i].mess[j] === invited)
                  clients[i].mess.splice(j, 1)

            }
      for (i=0; i < clients.length; i++)
            if (invited === clients[i].Name){
              clients[i].friends.push(inviting);
              for (j=0; j < clients[i].inv.length; j++)
                if (clients[i].inv[j] === inviting)
                  clients[i].inv.splice(j, 1)
            }
      
      io.sockets.in(invitator).emit('friends', invited, clients);
      io.sockets.in(invited).emit('friends', invitator, clients);
      console.log(clients);
    
    });

    socket.on('updateUsersReq', function(ACCOUNT) {
      
      
      io.sockets.in(ACCOUNT).emit('updateUsersRes', clients);
      
      
      
    });

    socket.on('updateInvReq', function(ACCOUNT, client) {
      
      for (i=0; i < clients.length; i++)
        if (client === clients[i].Name)
          online = clients[i].online;
      for (i=0; i < clients.length; i++)
        if (ACCOUNT === clients[i].Name)
          io.sockets.in(ACCOUNT).emit('updateInvRes', client, online);
      // for (i=0; i < clients.length; i++)
      //   if (client === clients[i].Name)      
      //     io.sockets.in(ACCOUNT).emit('updateInvRes', client, clients[i].online);
      
      
      
    });

    socket.on('typing', function(ACCOUNT, singleReceiver) {
      
      
          io.sockets.in(singleReceiver).emit('imTyping', ACCOUNT);
      
    });

    socket.on('createGroup', function(ACCOUNT, group) {
      
      let GROUP = new Groups(groupId, ACCOUNT, group.groupName);
      GROUP.Members = group.members;
      GROUP.Members.push([ACCOUNT, 1]);
      for(i = 0; i < GROUP.Members.length; i++){
        // group.members.splice(i,1);
        // let groupTemp = group.members;
        console.log("beg" + i);
        if (i===1) //console.log(groupTemp);
        console.log(GROUP.Members);
        let memberTemp = GROUP.Members[i][0];
        for (j=0; j < clients.length; j++)
        if (clients[j].Name === memberTemp)
        break;
        console.log("gm" + i);
        console.log(GROUP.Members);
        console.log(GROUP.Members.length);

        GROUP.Members.splice(i,1);
        console.log("gm");
        console.log(GROUP.Members.length);
        console.log(GROUP.Members[i]);
        //let groupTemp = GROUP.Members;
        console.log("GROUP.Members");
        console.log(GROUP.Members);
        console.log("memberTemp");
        console.log(memberTemp);
        console.log("groupTemp");
        //console.log(groupTemp);
        io.sockets.in(memberTemp).emit('invGroup', GROUP.Members, GROUP);
        //GROUP.Members = groupTemp;
        console.log("memberTemp:");
        console.log(memberTemp);
        console.log("groupTemp:" + j + i);
        //console.log(groupTemp);
        console.log("j:" + j);
        io.sockets.in(memberTemp).emit('Group', clients[j], GROUP);
        let temp = GROUP.Members.slice();
        clients[j].groups.push([temp, GROUP.id]);
        io.sockets.in(memberTemp).emit('Group', clients[j], GROUP);
        console.log("go");
        console.log(GROUP.Members);
        console.log(clients[j]);
        io.sockets.in(memberTemp).emit('Group', GROUP.Members, GROUP);
        GROUP.Members.splice(i, 0, [memberTemp, 0]);
        io.sockets.in(memberTemp).emit('Group', GROUP.Members, GROUP);
        //console.log("le" + groupTemp.length);
        // delete GROUP.id;
        // delete GROUP.host;
        // delete GROUP.name;
        // delete GROUP.Members;
        
          
          //io.sockets.in(memberTemp).emit('invGroup', GROUP);
          cntr++;
          console.log("clients[j].Name" + j);
          console.log(clients[j].Name);
          console.log("memberTemp" + j);
          console.log(memberTemp);
          console.log("groupTemp" + j);
          //console.log(groupTemp);
          console.log(clients[j].groups);
          console.log(clients[j]);
          
          console.log(clients[j]);
          console.log("GROUP.Members2");
          console.log(GROUP.Members);
          
        
        console.log("cntr" + cntr);
        console.log("cl" + i);
        console.log(clients[0]);
        console.log(clients[1]);
        // console.log(group.members);
        // for(j = 0; j < group.members.length; j++){
          
        // }

        //io.sockets.in(group.members[i]).emit('invGroup', ACCOUNT, group);
      }
      
      
      groupId++;
      

    });

    socket.on('confirmGr', function(ACCOUNT, groupId) {
      let acc;
      socket.join(groupId);
      console.log("id:" + groupId);
      console.log("ACC:" + ACCOUNT);
      // for (i=0; i < clients.length; i++){
      // console.log("l:" + clients[i].groups.length)
      //   for (j=0; j < clients[i].length; j++)
      //     console.log("mem:" + clients[i].groups[j][0]);
      // }
      for (i=0; i < clients.length; i++)
        if (ACCOUNT === clients[i].Name){
          acc = i;
        }
      let grToUpdate = [];
      console.log(clients[acc].groups);
      console.log(clients[acc].groups[0][1]);
      console.log(clients[acc].groups.length);    
      for (i=0; i < clients[acc].groups.length; i++){
        console.log("i" + i);
        console.log(clients[acc].groups[i][1]);
        if (clients[acc].groups[i][1] == groupId){
            grToUpdate = clients[acc].groups[i].slice();
            console.log("grToUpdate");
            console.log(grToUpdate);
        }
      }

      let grToUpdateObj = [];

      for (i=0; i < grToUpdate[0].length; i++){
        console.log("groupId");
        grToUpdateObj.push(grToUpdate[0][i][0]);
      }
      console.log(grToUpdateObj);
      let accObj;
      for (i=0; i < grToUpdateObj.length; i++){
        for (j=0; j < clients.length; j++)
        if (grToUpdateObj[i] === clients[j].Name)
          accObj = j;
        let grToUpdateAccInd;
        let userToUpdateAccInd;
        for (j=0; j < clients[accObj].groups.length; j++){
          if (clients[accObj].groups[j][1] == groupId){
              grToUpdateAccInd = j;
              console.log("grToUpdateAccInd:" + grToUpdateAccInd);
            }
          }
        for (j=0; j < clients[accObj].groups[grToUpdateAccInd].length; j++){
          console.log(clients[accObj].groups[grToUpdateAccInd]);
          console.log(groupId);
          console.log(clients[accObj].groups[grToUpdateAccInd].length);
          
          //console.log(clients[accObj].groups[grToUpdateAccInd][0]);

          for (j=0; j < clients[accObj].groups[grToUpdateAccInd][0].length; j++){
            if (clients[accObj].groups[grToUpdateAccInd][0][j][0] === ACCOUNT){
              userToUpdateAccInd = j;
              console.log("userToUpdateAccInd:" + userToUpdateAccInd);
              console.log(clients[accObj].groups[grToUpdateAccInd][0][j][0]);
              console.log(clients[accObj].groups[grToUpdateAccInd][0][j]);
              clients[accObj].groups[grToUpdateAccInd][0][j][1] = 1;
              io.sockets.in(clients[accObj].Name).emit('gruopUpd', clients[accObj], groupId);
            }
          }
          // for (j=0; j < clients[accObj].groups[grToUpdateAccInd][userToUpdateAccInd].length; j++)
          //   if (clients[accObj].groups[grToUpdateAccInd][userToUpdateAccInd][0][j][0] === ACCOUNT){
          //     clients[accObj].groups[grToUpdateAccInd][userToUpdateAccInd][0][j][1] = 1;
          //     console.log(clients[accObj].groups[grToUpdateAccInd][userToUpdateAccInd][0][j]);
          //   }  
        }
          
      }
          // if (groupId === clients[acc].groups[i][j][1])
          //   console.log("groupId" + clients[acc].groups[i][j][0]);
      
      // for (i=0; i < clients[acc].groups.length; i++){
      //   console.log(clients[acc].groups[i]);
      //   for (j=0; j < clients[acc].groups[i][0].length; j++){
            
      //     // console.log("id");
      //     // console.log(clients[acc].groups[i][1]); //id
      //     // console.log(clients[acc].groups[i][0][j]); // [ 'sphere82@gmail2/_.com', 0/1 ]
      //     // console.log(clients[acc].groups[i][0][j][0]); // sphere82@gmail.com2/_
      //     // console.log(clients[acc].groups[i][0][j][1]); // 0/1
      //   }
      // }  
        
      

        // console.log("clients[i]");  
        // console.log(clients[i]);
        // console.log(clients[i].groups[0]);
        // console.log(clients[i].groups[1]);         
      

    });
    
    socket.on('disconnect', function() {
      
      let disconnectedClient;
      let disconnectedRoom;
      
      for (i=0; i < clients.length; i++)
        if (socket.id === clients[i].id){
        

        clients[i].online = false;
        console.log("undefined");
        console.log(clients[i].friends.length);
        console.log(clients);
        console.log("clients[i]");
        console.log(clients[i]);
        console.log(socket.id);
        console.log(clients[i].friends);
        let length = clients[i].friends.length;
        let friends = clients[i].friends;
        for (j = 0; j < length ; j++)
        io.sockets.in(friends[j]).emit('friendDisconnected', clients[i].Name);
        
        
      }
    
      console.log("disconnect");
      console.log(clients);
      
      
    });
    
  }
  
);


//io.sockets.in(actualRoom).emit('joinedRoom', player, message);