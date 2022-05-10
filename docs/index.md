


---
obsidianUIMode: preview
---


```dataviewjs

/*
1. 整理数据
2. tag2tag map，key是tag，value是它的一级子tag列表。
3. tag2page map，key是tag，values是只属于这个tag且不属于它的子tag的文档列表。
4. 打印tag
    1. 列出属于这个tag且不属于它的子tag的文档链接
    2. 递归打印这个tag的子tag
*/

function today(){
    var yourDate = new Date();
    const offset = yourDate.getTimezoneOffset();
    yourDate = new Date(yourDate.getTime() - (offset*60*1000));
    return yourDate.toISOString().split('T')[0];
}

function printTagHeader(tag,level){
    dv.header(Math.min(level,6),`${tag} <a href='obsidian://new?name=${today()}&content=---%0Atags%3A%20${encodeURIComponent(tag)}%0A---%0A'>➕</a>`);
}


var pages = dv.pages();
dv.header(1,"总文档数量: "+pages.length);

var tag2tag = {}

var tag2page = {}
var validTags = new Set();
validTags.add("#工作");
validTags.add("#生活");
validTags.add("#学习");

tag2tag["#root"] = new Set();

var pageWithoutValidTag = new Set();

function isValidTag(tag){
    var idx = tag.indexOf('/');
        
    if(idx==-1){
        return validTags.has(tag);
    }
    var rootTag = tag.substring(0,idx);

    return validTags.has(rootTag);
}

function addTag(name){
    var idx = name.lastIndexOf('/');
    if(idx==-1){
        tag2tag["#root"].add(name);
    }else{
        var parentName = name.substring(0,idx);
        if(!(parentName in tag2tag)){
            tag2tag[parentName] = new Set();
        }
        tag2tag[parentName].add(name);
        addTag(parentName);
    }
}


pages.forEach(function(page){
    if(page.file.etags.length==0){
        pageWithoutValidTag.add(page.file.link);
        return;
    }
    var pageHasValidTag = false;
    
    for(var idx=0; idx < page.file.etags.length; idx++){
        var tag = page.file.etags[idx];
        if(isValidTag(tag)){
            pageHasValidTag=true;
            addTag(tag);
            if(!(tag in tag2page)){
                tag2page[tag] = new Set();
            }
            tag2page[tag].add(page.file.link);
        }
    }
    if(!pageHasValidTag){
        pageWithoutValidTag.add(page.file.link);
    }
});

//dv.span(alltags);
/*
alltags.forEach(function(tag){
    dv.paragraph(" "+tag.substring(1));
});
*/
//dv.paragraph(Array.from(tag2tag["#root"]).join(' '));
//dv.paragraph(tag2tag);
//dv.paragraph(tag2page);

function indent(level){
    var s = "";
    for(var i=0;i<level;i++){
        s+= "----";
    }
    return s;
}
function printTagTree(tag, level){
    //dv.header(Math.min(level,6),indent(level)+" "+tag.substring(1));
    //dv.header(Math.min(level,6),tag.substring(1));
    printTagHeader(tag.substring(1),level);
    //dv.el("ul",tag.substring(1));
    if(tag in tag2page){
        dv.list(Array.from(tag2page[tag]).sort());
        //Array.from(tag2page[tag]).sort().forEach(function(pagelink){
        //    dv.el("li", pagelink);
        //});
    }
    if(tag in tag2tag){
        Array.from(tag2tag[tag]).sort().forEach(function(subTag){
            printTagTree(subTag, level+1);
        });
    }
}
printTagTree("#root",0);
dv.header(1,"无合法tag的文档");
dv.list(Array.from(pageWithoutValidTag).sort());
```