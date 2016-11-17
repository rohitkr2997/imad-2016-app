

/*var img=document.getElementById('madi');

var marginLeft=0;
function moveRight(){
    
    marginLeft =marginLeft +10;
    img.style.marginLeft =marginLeft+'px';
    
    
}
img.onclick= function(){
    
     var interval =setInterval(moveRight,100);
    
    
};*/

var button = document.getElementById('counter');


button.onclick = function(){
    
    //create a request
    var request =new XMLHttpRequest();
    
    request.onreadystatechange =function(){
        
        if(request.readyState===XMLHttpRequest.DONE){
            
            if(request.status===200){
                
                var counter =request.responseText;
                 var span =document.getElementById('count');
                 span.innerHTML = counter.toString();
                
            }
        }
        
    };
    
    request.open('GET','http://rohitkr2997.imad.hasura-app.io/counter',true);
    request.send(null);
   
  
    
};


var submit =document.getElementById('submit_btn');

submit.onclick=function(){
    
    
  
    
     var request =new XMLHttpRequest();
    
    request.onreadystatechange =function(){
        
        if(request.readyState===XMLHttpRequest.DONE){
            
            if(request.status===200){
                
                 var names=request.responseText;
                 names=JSON.parse(names);
    
                var list='';
                
                for(var i=0;i<names.length;i++){
                    list+='<li>' + names[i] +  '</li>';
                }
                
                var ul=document.getElementById('namelist');
                ul.innerHTML =list;
                
            }
        }
        
    };
    
      var nameInput =document.getElementById('name');
      var name=nameInput.value;
    request.open('GET','http://rohitkr2997.imad.hasura-app.io/submit-name?name='+name,true);
    request.send(null);
    
  
};


 

var submit_login =document.getElementById('submit_login');

submit_login.onclick=function(){
    
      alert('hello.......');
  
    
     var request_login =new XMLHttpRequest();
    
    request_login.onreadystatechange =function(){
        
        if(request_login.readyState===XMLHttpRequest.DONE){
            
            if(request_login.status===200){
                
                console.log('user logged in');
                alert('Logged in successfully ');
                
            }else if(request_login.status===403){
                
                alert('Username/Password is incorrect');
            }
            else if(request_login.status===500){
                
                alert('Something went wrong on the server');
                
            }
        }
        
    }; 
    
      var username =document.getElementById('username').value;
      var password =document.getElementById('password').value;
      
    request_login.open('POST','http://rohitkr2997.imad.hasura-app.io/login',true);
    request_login.open('POST','http://rohitkr2997.imad.hasura-app.io/test',true);
    request_login.setRequestHeader('Content-Type' , 'application/json');
    request_login.send(JSON.stringify({username: username, password: password}));
    
  
};



var register =document.getElementById('reg');

alert('hello'+register);