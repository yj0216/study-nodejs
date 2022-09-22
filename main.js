//모듈 불러오기
var http = require('http');
var fs = require('fs');
var _url = require('url');
var qs = require('querystring');
//refactoring 동작은 똑같으나 내부 코드를 개선하는 것
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');//입력 부분에서 명령어들 차단

// function templateHTML(title, list, body, control) {
//   return ` 
//       <!doctype html>
//     <html>
//     <head>
//     <title>WEB1 - ${title}</title>
//     <meta charset="utf-8">
//     </head>
//     <body>
//     <h1><a href="/">WEB</a></h1>
//     ${list}
//     ${control}
//     ${body}
//     </body>
//     </html>
//     `;
// }
// function templateList(filelist) {
//   var list = '<ul>';

//   var i = 0;

//   while (i < filelist.length) {
//     list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
//     i = i + 1;
//   }
//   list += '</ul>';
//   return list;
// }
var app = http.createServer(function (request, response) {
  var url = request.url;
  var queryData = _url.parse(url, true).query;
  var pathname = _url.parse(url, true).pathname;
  if (pathname === '/') {//id가 존재 하지 않을때(처음 웹 페이지)
    if (queryData.id === undefined) {

      fs.readdir('./data', function (error, filelist) {
        var title = 'Welcome';//처음 기본 제목
        var description = 'Hello, Node.js'; //처음 내용

        // var list = templateList(filelist);//data파일 출력 함수
        // var template = templateHTML(title, list,
        //   `<h2>${title}</h2><p>${description}</p>`,
        //   `<a href="/create">create</a>`);//웹 페이지 생성 함수
        // response.writeHead(200);
        // response.end(template);

        var list = template.list(filelist);//data파일 출력 함수
        var html = template.HTML(title, list,
          `<h2>${title}</h2><p>${description}</p>`,
          `<a href="/create">create</a>`
        );//웹 페이지 생성 함수
        response.writeHead(200);
        response.end(html);

      })

    } else {
      fs.readdir('./data', function (error, filelist) {
        var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1','s']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data', function (error, filelist) {
      var title = 'WEB-craete';//처음 기본 제목
      var list = template.list(filelist);//data파일 출력 함수
      var html = template.HTML(title, list, `<form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
        </form>
        `, '');
      response.writeHead(200);
      response.end(html);//웹 페이지 생성 함수
    })

  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function (data) {//데이터 수신
      body += data;
    });
    request.on('end', function () {//데이터 수신 끝
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function (error) {
        response.writeHead(302, { Location: `/?id=${title}` });//내가 바꾼 페이지로 이동
        response.end('success');
      })
    });

  } else if (pathname === '/update') {
    fs.readdir('./data', function (error, filelist) {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function (error, description) {
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.HTML(title, list,
          `
              <form action="/update_process" method="post">
                <input type="hidden" name = "id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
              </form>  
              `,
          `<a href="/create">create</a> <a href = "/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function (data) {//데이터 수신
      body += data;
    });
    request.on('end', function () {//데이터 수신 끝
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, `utf8`, function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });//내가 바꾼 페이지로 이동
          response.end('success');
        })
      });
    });
    // fs.writeFile(`data/${title}`,description,'utf8',function(err){
    //   response.writeHead(302,{Location:`/?id=${title}`});//내가 쓴 페이지로 이동
    //   response.end('success');
    // })
  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function (data) {//데이터 수신
      body += data;
    });
    request.on('end', function () {//데이터 수신 끝
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function (error) {
        response.writeHead(302, { Location: `/` });//내가 바꾼 페이지로 이동
        response.end();
      })
    });
  } else {
    response.writeHead(404);//존재 하지 않은 웹페이지를 대처하는 웹페이지
    response.end('Not found');
  };
})
app.listen(3000);

