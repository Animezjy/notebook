## 小青蛙跳荷叶游戏
<br>
[游戏地址](https://codepip.com/games/flexbox-froggy/)

**level 18**
<br>
不好了! 所有的青蛙都被挤在一排睡莲上,使用`flex-wrap`属性将他们展开，该属性接收以下值：
- nowrap: 所有的元素都在一行
- wrap: 元素自动换成多行
- wrap-reverse: 元素自动换成逆序多行

```css
#pond {
    display: flex;
    flex-wrap: wrap;
}
```
**level 19**
<br> 
使用 flex-direction 和 flex-wrap 的组合帮助这群青蛙形成三个有序的列
```css
#pond {
  display: flex;
flex-wrap: wrap;
flex-direction: column;
}
```

**level 20**
<br>
flex-direction 和 flex-wrap 这两个属性经常一起使用，因此我们可以使用flex-flow 来将它们组合起来。 该属性性接受由空格分隔的两个属性的值。

例如，您可以使用 flex-flow:row wrap 来设置行并对其进行换行。
```css
flex-flow: column wrap;
```
**level 21**
<br>

青蛙们在池塘里到处都是，然而荷叶都在顶部。你可以使用align-content来决定行与行之间隔多远。这个属性接受这些值：

- flex-start: 多行都集中在顶部。
- flex-end: 多行都集中在底部。 center: 多行居中。
- space-between: 行与行之间保持相等距离。
- space-around: 每行的周围保持相等距离。
- stretch: 每一行都被拉伸以填满容器。

这可能有些容易混淆，但align-content决定行之间的间隔，而align-items决定元素整体在容器的什么位置。只有一行的时候align-content没有任何效果
```css
align-content: flex-start;
```

**level 22**
<br>
使用`align-content`引导青蛙到正确的睡莲
```css
align-content: flex-end;
```

**level 23**
<br>
青蛙们开了个派对，但该回家了。 使用 flex-direction 和 align-content 的组合将它们放到他们的睡莲上
```css
flex-direction: column-reverse;
align-content: center;
```

**level 24**
<br>

```css
  display: flex;
  flex-direction:column-reverse;
  flex-wrap:wrap-reverse;
  justify-content:center;
  align-content:space-between;
```