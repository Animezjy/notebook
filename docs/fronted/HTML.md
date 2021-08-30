# **HTML学习**
## HTML介绍
HTML(超文本标记语言)不是一门编程语言，而是一种用来高速浏览器如何组织页面的标记语言。
我们可以使用HTML语言来建立自己的WEB站点
## HTML示例
HTML文档以`.html`结尾
示例
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>第一个HTML页面</title>
        </head>
    <body>
        <h1> 第一个html标题</h1> 
        <p> 第一个html段落</p>
    </body>
</html>
```
- `<!DOCTYPE html>` 声明为HTML5文档
- `<html>`是一个html文档的开始元素，所有的元素都包含在一对`html`标签中
- `<head>`元素包含了文档的元数据
> head元素内部的内容不会在浏览器上展示给用户
- `<title>`元素定义了文档的标题
- `<body>` 元素包含了文档页面等内容
- `<h1>` 元素定义了一个一级标题
- `<p>` 元素定义一个段落
## HTML基础
### head标签
示例中已经提到，head标签里的内容，在页面加载完毕之后是不会在页面上显示出来的。它包含的页面的`<title>`（标题）CSS（样式）等其他描述HTML的元数据

head中的常用标签
- `<title>` 定义网站标题，前面已经介绍过
- `<link>` 这个标签允许我们为当前的html文档引入外部的[CSS](fronted/CSS)样式文件
- `<style>` 我们可以在style标签中直接书写CSS代码来渲染HTML文档
- `<script>` 这个标签允许我们引入该html文档中使用的外部[JS](fronted/Javascript)脚本，当然我们也可以在其内部书写Javascript代码
- `<meta>`&nbsp;meta那标签描述了一些基本的元数据。通常用于指定网页的描述、关键词、文件的最后修改时间、作者等其他元数据
示例:
```html
<!--定义关键词--> 

<meta name="keywords" content="HTML CSS">
<!--
如果在浏览器中输入keywords中的关键词，可以在百度等搜索引擎中搜索到（有一定的seo功能）
-->
<!--定义网页描述内容-->
<meta name="description" content="描述内容">
<!--定义作者-->
<meta name="author" content="zhangjiyou">
<!--每三十秒刷新当前页-->
<meta http-equiv="refresh" content="30">
```
### body标签
body标签中的内容经过浏览器处理最终会呈现给用户，使我们平时打交道的主要对象

body中的常用标签
- 标题（h1-h6）
示例：
```html
<!--一级标题-->
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```
![html标题](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20210830163947.png)
- 段落
```html
<p>这是一个段落</p>
```
- 超链接
```html 
<a href="https:www.luvyw.com"></a>
```