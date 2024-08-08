# groovy语义

## Groovt中的Truth

groovy中判断可以使用Truth进行判断，是判断的语法糖，将true泛化为truth。相比js而言，groovy好像更加广泛而简洁。

::: tip 提示

js中叫Truthy，js中除了除 `false`、`0`、`-0`、`0n`、`""`、`null`、`undefined` 和 `NaN` 以外的皆为Truthy。

:::

### 布尔表达式

最基本的判断，通过true和false判断，Boolean为null按对象处理，null为falsely

```groovy
assert true;
assert !false;
Boolean res=null;
assert !res;
```

### 集合与数组

非空集合和数组为真

```groovy
def arr=[] as String[];
assert !arr
def list=[1];
assert list;
```

### <span id="reg-matcher">正则匹配</span>

正则发生匹配后产生一个`Matcher`类。内部会调用`Matcher`实例的`find()`方法。正则运算可以使用`字符串 =~ 正则字符串`来快速匹配。

```groovy
def matcher = "a" =~ /a/
if (matcher)
   assert !matcher.find()
```

如果左边不是字符串，左边会自动执行toString方法再进行匹配。

```groovy
class Obj{
    @Override
    String toString(){
       return  "ok"
    }
}
def matcher= 1=~/1/
assert  matcher
def obj = new Obj()
assert  obj=~"ok"
```

### 迭代器和枚举

groovy对于迭代器和枚举，会自动调用hasNext()方法判断迭代器是否有元素。

```groovy
def integers = [1, 2, 3, 4]
def iterator = integers.iterator()
while (iterator){
    println iterator.next()
}
def vector = [12345] as Vector
def elements = vector.elements()
while (elements){
    println elements.nextElement()
}
```

### Maps类型

非空的Map类型判断为true

```groovy
assert ![:]
assert [one:null]
assert [null:null]
```

### 字符串

非空字符串判断为true，包含计算后的GString

```groovy
assert '0';
assert  !''
def num=1;
def str3="${->num}";
assert "$num"
assert str3;
num='';
assert !str3;
assert !"$num"
```

### 数字

非零数字判断为true

```groovy
assert!0l;
assert!0g;
assert!0i;
assert!0d;
assert!0f;
assert 1l;
assert 1g;
assert 1i;
assert 1d;
assert 1f;
```

### 对象的引用

非null的对象（除去前面的类）为true

```groovy
assert new Date()
assert new Object()
assert !null
```

### 自定义对象的truth

重写`Groovy`类中的`asBoolean`方法，即可重写该类的方法。

```groovy
class Obj{
    @Override
    boolean asBoolean(){
     return false;
    }
}

def obj = new Obj()
assert !obj;
```

::: warning 提示

必须在groovy文件实现，重写的是`DefaultGroovyMethodsSupport`中`asBoolean`方法

:::
