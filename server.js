var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));
var articleOne={
  
    title:'Article One | Rohit',
    heading:'Article one',
    date:'Ocrtober 30',
    content:`Hello This is my first article
    
                    I like Writing articles`
    
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
                            ${date}
                        </div>
                        <div class="center text-big bold">
                           ${content}
                        </div>
                        
                    
                    </body>
                </html>
   
    
    
    `;
    
    return htmlTemplate;
    
}

app.get('/article-one', function (req, res) {
  res.send(createTemplate(articleOne));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
