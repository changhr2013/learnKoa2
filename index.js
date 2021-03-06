const Koa=require('koa');
const fs=require('fs');
const app=new Koa();

const Router=require('koa-router');


//const loggerAsync=require('./middleware/logger-async');

/**
 * 用promise封装异步读取文件的方法
 * @param {string} page html文件名称
 * @return {promise}
 */
function render(page){
    return new Promise((resolve,reject)=>{
        let viewUrl=`./view/${page}`;
        fs.readFile(viewUrl,'binary',(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
}

/**
 * 根据url获取HTML内容
 * @param {string} url koa2上下文的url,ctx.url
 * @return {string} 获取HTML文件内容
 */

 async function router(url){
     let view='404.html';
     switch(url){
         case '/':
         view='index.html';
         break;
         case '/index':
         view='index.html';
         break;
         case '/todo':
         view='todo.html';
         break;
         case '/404':
         view='404.html';
         break;
     }
     let html=await render(view);
     return html;
 }

// app.use(loggerAsync());

// app.use(async(ctx,next)=>{
//     let url=ctx.url;
//     let html=await router(url);
//     ctx.body=html;
//     await next();
// });

let home = new Router()

// 子路由1
home.get('/', async ( ctx )=>{
  let html = `
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `
  ctx.body = html
})

// 子路由2
let page = new Router()
page.get('/404', async ( ctx )=>{
  ctx.body = '404 page!'
}).get('/helloworld', async ( ctx )=>{
  ctx.body = 'helloworld page!'
})

// 装载所有子路由
var router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log('[demo] route-use-middleware is starting at port 3000')
})