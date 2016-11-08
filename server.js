var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto=require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config ={
  
        user: 'rohitkr2997',
        database: 'rohitkr2997',
        host : 'db.imad.hasura-app.io',
        port : '5432',
        password :process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); 
app.use(session({
    secret:'someRandomSecretValue',
    cookie: { maxAge : 1000*60*60*24*30}
    
}));
var articles={
    'article-one': {
                    title:'Article One | Rohit',
                    heading:'Article one',
                    date:'Ocrtober 30',
                    content:`Hello This is my first article
                    
                                    I like Writing articles`},
    'article-two': {
                    title:'Article Second | Rohit',
                    heading:'Article second',
                    date:'Ocrtober 30',
                    content:`Hello This is my second article
                    
                                    I like Writing articles`},              
    'article-three': {
                    title:'Article Third | Rohit',
                    heading:'Article Three',
                    date:'Ocrtober 30',
                    content:`Hello This is my Three article
                    
                                    I like Writing articles`}, 
    
};

function createTemplate(data){
    
    title=data.title;
    heading=data.heading;
    date=data.date;
    content=data.content;
    
    var htmlTemplate=`
    
           
               <html>
                    <head>
                        <title>
                            ${title}
                        </title>
                        <link href="/ui/style.css" rel="stylesheet" />
                    </head>
                    <body>
                        <div class="center">
                            <a href ='/'>Home</a>
                        </div>
                        <hr/>
                        <h3>
                            ${heading}
                        </h3>
                        <br>
                        <div>
                            ${date.toDateString()}
                        </div>
                        <div class="center text-big bold">
                           ${content}
                        </div>
                        
                    
                    </body>
                </html>
   
    
    
    `;
    
    return htmlTemplate;
    
}

var counter=0;
app.get('/counter', function(req,res){
    
    counter=counter+1;
    res.send(counter.toString());
    
    
});





var pool = new Pool(config);

app.get('/test-db', function(req,res){
    
   pool.query('SELECT * FROM test', function(err,result){
       
       if(err){
           res.status(500).send(err.toString());
       }else{
           
           res.send(JSON.stringify(result.rows));
       }
       
   });    
    
});

app.get('/submit-name',function(req,res){
    
    var name=req.query.name;
    
    names.push(name);
    
    res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function (req, res) {
    
  
    
    pool.query("SELECT * FROM article WHERE title= $1" ,[req.params.articleName], function(err,result){
        
        if(err){
            
            res.status(500).send(err.toString());
        }else{
            
            if(result.rows.length===0){
                res.status(404).send('Article not found');
            }else{
                
                var articleData=result.rows[0];
                
                 res.send(createTemplate(articleData));
            }
        }
        
    });
    
 
});





app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login/index.html'));
});

function hash (input,salt){
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512'); 
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res){
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
});

app.post('/create-user',function(req,res){
    
    var username =req.body.username;
    var password=req.body.password;
    
    var salt= crypto.randomBytes(128).toString('hex');
    var dbString = hash(password,salt);
     pool.query('INSERT INTO "user" (username,password) VALUES($1, $2)',[username,dbString],function(err,result){
        
                if(err){
            
                     res.status(500).send(err.toString());
                } else{
                      
                        res.send('User Succesfully created : '+ userrname);
                }
        
    });
    
});

app.post('/login',function(req,res){
    
    var username =req.body.username;
    var password=req.body.password;
    
  
     pool.query('SELECT * FROM "user" WHERE username=$1',[username],function(err,result){
        
                if(err){
            
                     res.status(500).send(err.toString());
                } else{
                        if(result.rows.length===0){
                            
                            res.send(403).send('username/password is invalid');
                        }
                        else{
                                var dbString = result.rows[0].password;
                                var salt=dbString.split('$')[2];
                                var hashedPassword = hash(password,salt);
                                if(hashedPassword===dbString){
                                    
                                    req.session.auth= {userId: result.rows[0].id};
                                    
                                    res.send('Credentials are correct!');
                                 
                                }else {
                                        res.send(403).send('username/password is invalid');
                                }
                                    
                        }
            
                }
        
    });
    
});

app.get('/check-login',function(req,res){
    
        if(req.session && req.session.auth && req.session.auth.userId){
            res.send('You are Logged in : ' + req.session.auth.userId.toString());
        }
        else{
        
                res.send('You are not logged in');
            
        }
    
    
});


app.get('/logout', function(req,res){
   
   delete req.session.auth;
   res.send('Logged Out');
    
});



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});


app.get('/css/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login/css/style.css'));
});

app.get('/js/index.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login/js/index.js'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var names=[];
app.get('/submit-name/:name',function(req,res){
    
    var name=req.params.name;
    
    names.push(name);
    
    res.send(JSON.stringify(names));
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
