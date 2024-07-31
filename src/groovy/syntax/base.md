# groovy语法

## 注释

groovy注释与java一致

### 单行注释

使用`//`在所在行或者所在行右侧注释

```groovy
//注释
println "Hello Word!" //右侧注释
```

### 多行注释

```groovy
static void main(String[] args){
    println 1/*1*/*1/*2*/
    /**
     * okok
     */
    print "okok"
}
```

### groovy文本注释

groovy与java注释相同

```groovy
/**
 * 向用户打招呼
 * @param name 用户名
 */
void sayHello(String username){
    println("你好，${username}")
}
```

Groovy 从 3.0.0 开始支持**Runtime Groovydoc**即在编译后保留注释。也就是说`/**@` 开头 `*/`结尾的注释会被保留。

::: code-group

```groovy [Main.groovy]
println User.class.groovydoc.content
println User.class.getMethod('desc', new Class[0]).groovydoc.content
println User.class.getDeclaredField("username").groovydoc.content
```


```groovy [User.groovy]
/**@
 * 用户类
 */
class User {
    /**@
     * 用户名
     */
    String username;
    /**@
     * 工号
     */
    String userNo;
    /**@
     * 用户描述
     * @return 用户描述
     */
    String desc(){
        return username+userNo;
    }

}

```




```text [控制台输出]
/**@
 * 用户类
 */
/**@
     * 用户描述
     * @return 用户描述
     */
/**@
     * 用户名
     */
```



:::

::: tip 提示
需要使用jvm参数`-Dgroovy.attach.runtime.groovydoc=true`才能生效


:::

### shebang line

groovy同样支持脚本首行设定执行的解释器，如果安装了groovy 可在linux中使用

```groovy
#!/usr/bin/env groovy
println "Hello Word！"
```

## 标识符

groovy中标识符以字母、美元符号或下划线开头。不能以数字开头。这个与java相同。

### 关键字

groovy有如下保留关键字，这些关键字不能被用作标识符
| 保留关键字     | 保留关键字     | 保留关键字      | 保留关键字       |
| ------------ | ---------- | ---------- | ---------- |
| abstract     | assert     | break      | case       |
| catch        | class      | const      | continue   |
| def          | default    | do         | else       |
| enum         | extends    | final      | finally    |
| for          | goto       | if         | implements |
| import       | instanceof | interface  | native     |
| new          | null       | non-sealed | package    |
| public       | protected  | private    | return     |
| static       | strictfp   | super      | switch     |
| synchronized | this       | threadsafe | throw      |
| throws       | transient  | try        | while      |

 `const`, `goto`, `strictfp`,  `threadsafe` 目前没有被使用
::: tip 提示

这些关键字不允许使用作为标识符，如果非要作为标识符，外面可以使用双引号`""`将其括起来使用。

```groovy
def "for"() { true }
println this.for()
def "for"=2 //不能int赋值给for字符串，两个都是值
```

:::


下列是上下文关键字，他可以使用在 变量、属性和方法名。
| 上下文关键字    | 上下文关键字     | 上下文关键字 |
| ------ | ------ | ------- |
| as     | in     | permits |
| record | sealed | trait   |
| var    | yields |         |

下列是被允许的，但是不推荐
```groovy
def in=1
println in
```

下列是基元类型也不可用使用在标识符

| 基元类型           | 基元类型 | 基元类型 | 基元类型 |
| ------------------ | -------- | -------- | -------- |
| null（非基元类型） | true     | false    | boolean  |
| char               | byte     | short    | int      |
| long               | float    | double   |          |

### 引号标识符（字符串标识符）

前面中提到，对于特殊关键字，我们可以使用字符串方式访问，对于所有的内容都是支持字符串方式访问的。

::: code-group

```groovy [Main.groovy]
def user = new User("小明","001")
def key="username"
println user."username" //双引号访问
println user.'userNo' //单引号字符串
println user[key] //计算表达式访问
println user."""username""" //多行文本字符串访问
println user['username'] //计算表达式访问
```

```groovy [User.groovy]
class User {
    String username;
    String userNo;
    User(String username, String userNo) {
        this.username = username
        this.userNo = userNo
    }
}
```



:::

## 简单数据类型

### 字符串

groovy中有两种字符串：`java.lang.String` 和 `groovy.lang.GString` Gstring又称插值字符串（和js中的模板字符串差不多）。

::: tip 提示

groovy中可以使用`\`来实现转义这个与java相同，例如 `\\` `\n` `\s`等转义

:::

#### 简单类型字符串

- 单引号字符串（String）

​	单引号字符串被认为是简单的String，所以不具有插值效果。

- 双引号字符串 (GString)

​	双引号字符串且具有插值$时，字符串是GString由groovy实现，是具有插值效果的字符串

#### 字符串插值

可以使用 `$变量` 和`${计算表达式}`来实现插值

```groovy
def key=[abc:2]
println "${1+1}"
println "$key.abc"
```

#### GString和String在字符串中的实现

字符串在双引号标注并且具有插值的会被实现为GString，在进行字符串拼接运算仍然是`GString`，因为是在在运行时被确定。

```groovy
println '' instanceof String //true
println "1234" instanceof String //true
println "2${1}3${2}4${44}" instanceof String //false
println '${1}' instanceof String //true
println "${1}" instanceof GString //true
println "${1}".toString() instanceof String //true
println (("${1}"+"1234") instanceof String) //false
println (("123"+"1234") instanceof String) //true
```

::: tip 提示

groovy在做==比较时，是采用`ScriptBytecodeAdapter.compareEqual()`来比较的，所以说GString和String在内容上相等是可以相等的。采用equals不行

```groovy
println "${1}"=='1' //true
println "${1}"=="1" //true
println "${1}".equals('1') //false
```

:::



#### 多行字符串

我们可以使用三单（双）来声明多行字符串。当然三双引号是具有插槽功能的字符串.

```groovy
println """
1
${1+1}
3
"""
println '''
1
${1+1}
3
'''
```

#### 闭包表达式

前面中使用$来预设插值，但是我们想要在动态的变换字符串，通过修改变量来变成不同的字符串，我们可以使用闭包表达式`${->}`来表示字符串。其中`${w->}`中接受一个StringWriter对数据进行操作。

```groovy
def num=1;
def str1="${num}"
def str2="${->num}"
def str3="${w->num}"
def str4="${w->w<<num}" //等价于添加的意思，如下方语句
def str5="${w->w.append(num.toString())}"
println "1st---------"
println str1 //1
println str2 //1
println str3 //空字符串
println str4 //1
println str5 //1
num=2;
println "2st---------"
println str1 //1
println str2 //1
println str3 //空字符串
println str4 //2
println str5 //2
```

#### GString和String的hashcode

GString中的hashcode与String中的hashcode不同，所以不能String和GString混用。GString中hashcode为String的hashcode+37

```groovy
def  num=1;
def key="${->num}"
def key2="${num}"
def map = new HashMap<>()
map.put(key,1)
println map.get(key) //1
println map.get("1") //null
println map.get(key2) //1
num=2;
println map.get(key) //null
num=1;
println map.get(key) //1
```



::: details GString源代码

```groovy
package groovy.lang;

public abstract class GString extends GroovyObjectSupport implements Comparable, CharSequence, Writable, Buildable, Serializable {

    //省略内容...
    @Override
    public int hashCode() {
        return 37 + toString().hashCode();
    }

    @Override
    public boolean equals(Object that) {
        if (this == that) return true;
        if (!(that instanceof GString)) return false;

        return equals((GString) that);
    }

    public boolean equals(GString that) {
        return toString().equals(that.toString());
    }

    @Override
    public int compareTo(Object that) {
        return toString().compareTo(that.toString());
    }
    //省略内容...
}
```

:::

#### 其他字符串

##### 反斜线字符串

通过使用两个`\\`来包裹的字符串，支持**多行文本**，**插值**，在定义正则字符串的时候使用很不错。`\/`用来转义/仅此而已

```groovy
def regList=[
 /\s+/,/\/a/,/111
123${3333}
222/]
regList.forEach(this::println)
```

##### 美元斜线字符串

美元字符串是使用美元字符`$/.../$`来转义的字符串，支持**多行文本**，**插值**，

```groovy
def list=[
        $/111/$,
        $/${2}/$,
        $/$$22/$,
        $/$$2\\\///2/$,
        $/
123
456
789
/$,
]
list.forEach(this::println)
```

### 字符

groovy中使用'a'会被识别为字符串，所以我们得使用 `as`关键字来显示的指定其类型。

```groovy
println ('a' instanceof String) //true
println 'a' as char instanceof Character //true
println  (((char)'a') instanceof Character) //true
```

### 数字

groovy数字类型大致与java相同。

#### 整数字面量

groovy中有如下的整数字面量

- `byte`
- `char`
- `short`
- `int`
- `long`
- `java.math.BigInteger`

groovy与java中基元类型声明相同，但是groovy中利用强转实现；溢出会被强转。

::: code-group

```groovy [groovy]
// 基元类型
byte  b = 1000 //-24
char  c = 2
short s = 3
int   i = 4
long  l = 5
//大整数
BigInteger bi =  6
```

```java [java]
byte  b = 1000; //编译不通过
char  c = 2;
short s = 3;
int   i = 4;
long  l = 5;
BigInteger bi = BigInteger.valueOf(6);
```


```java [groovy转义后结果]
byte b = (byte)1000;
char c = (char)2;
short s = (short)3;
int i = true; //是true，难道被idea隐藏了？？？
long l = (long)5;
BigInteger bi = true.cast<invokedynamic>(6);
```

:::


##### 非十进制表示

非十进制数与java相同

- 0b：2进制数
- 0: 8进制数
- 0x: 16进制数



#### 浮点数字面量

浮点数中与java相同的

- `float`
- `double`
- `java.math.BigDecimal`

```groovy
// 基元类
float  f = 1.234
double d = 2.345

// 大精度数
BigDecimal bd =  3.456
```

groovy内部会将浮点数封装为`BigDecimal`，对于`double`和`float`会自动拆箱为具体的数值。

#### def隐式转换

使用def声明变量时，会被groovy推断成对应的类型。

```groovy
def i=1;
println i instanceof Integer

def l=2147483648; //Integer.MAX_VALUE+1
println l instanceof Long

def big=9223372036854775808; //Long.MAX_VALUE + 1
println big instanceof BigInteger

def dec=0.1; //BigDecimal
def dec2=99999999999999999999999999999999.1; //BigDecimal
```

添加后缀会指定为对应类型

| 类型       | 后缀       |
| :--------- | :--------- |
| BigInteger | `G` 或 `g` |
| Long       | `L` 或 `l` |
| Integer    | `I` 或 `i` |
| BigDecimal | `G` 或 `g` |
| Double     | `D` 或 `d` |
| Float      | `F` 或 `f` |

```groovy
def i=1;  //int
def l=1l; //long
def g=1g; //BigInteger
def dec=0.1; //BigDecimal
def f=1f; //float
def d=1d; //double
def dec2=1.0g; //BigDecimal
```



#### 运算符中的隐式类型转换

两个数操作，groovy会将结果进行隐式转换

```groovy
def a=1; //Integer
def b=2.0; //BigDecimal
def decimal = a * b //BigDecimal

char c=1; //char
char d=2; //char
def res=c*d; //Integer
```

详细的表如下：

|                | byte | char | short | int  | long | BigInteger | float  | double | BigDecimal |
| :------------- | :--- | :--- | :---- | :--- | :--- | :--------- | :----- | :----- | :--------- |
| **byte**       | int  | int  | int   | int  | long | BigInteger | double | double | BigDecimal |
| **char**       |      | int  | int   | int  | long | BigInteger | double | double | BigDecimal |
| **short**      |      |      | int   | int  | long | BigInteger | double | double | BigDecimal |
| **int**        |      |      |       | int  | long | BigInteger | double | double | BigDecimal |
| **long**       |      |      |       |      | long | BigInteger | double | double | BigDecimal |
| **BigInteger** |      |      |       |      |      | BigInteger | double | double | BigDecimal |
| **float**      |      |      |       |      |      |            | double | double | double     |
| **double**     |      |      |       |      |      |            |        | double | double     |
| **BigDecimal** |      |      |       |      |      |            |        |        | BigDecimal |



对于除法`/`操作，默认会转为BigDecimal。如果有类型会再转回来。（def推断的按没有类型处理）



对于幂操作`**`有如下结果

- 如果指数是浮点数
  - 如果结果可以表示为`Integer`，则返回`Integer`
  - 否则，如果结果可以表示为`Long`，则返回`Long`
  - 否则返回`Double`
- 如果指数是正整数
  - 如果基数是  `BigDecimal`，则返回`BigDecimal`结果值
  - 如果基数是  `BigInteger`，则返回`BigInteger`结果值
  - 如果基数是`Integer`，如果结果值适合它，则返回 `Integer`，否则一个`BigInteger`
  - 如果基数为  `Long`，如果结果值适合它，则返回 `Long` ，否则返回 BigInteger`
  - 如果基数为  `Double`或Float ，返回 `Double`

- 如果指数是负整数
  - 如果基数是1，返回对应类型。（float和double返回整数1）
  - 返回double



### 布尔值

groovy中`boolean`与java相同，除了支持逻辑表达式之外，判断是使用`Truth`。可以点击到下方查看

[Groovy中的Truth](../semantics/index#heading)

```groovy
def bool=true
println (!null) instanceof Boolean
println (true) instanceof Boolean
```

### 列表

groovy使用`[]`默认表示`ArrayList`，特别指定时就会实例化为数组或其他列表。list支持括号运算和get运算

```groovy
def nums1 = [1, 2, 3] //List<Integer>
def nums2 =[1,2,3] as LinkedList; ////LinkList<Integer>
def nums3 =[1,2,3,'4'] //List<Object>def nums = [1, 2, 3] 
assert nums1[0]==1
assert nums1.get(1)==2
```

>[!TIP] 提示
>
>提示 如果存在多种类型，会被推断为他们公有的父类，直到`Object`
>
>由此可知，我们可以定义多维的列表。非同类型就是父类。
>
>```groovy
>def nums=[[1,2,3],[4,5,6]] // ArrayList<List<Integer>>
>def nums2=[[1,2,3],4] //ArrayList<Serializable>
>println nums2.get(0).get(1) //尽管这样子可行，但是不太推荐，IDE也没给我推荐
>println ((nums2.get(0) as List).get(0)) //我们如果确定第一个一定是List，就可以这样子算
>```

#### 左移（<<）运算符

list支持使用`<<`运算符来替代`add`添加元素。可以统一化处理

```groovy
def nums=[1];
nums<<1;
nums<<'2'; //编译器警告了，类型推断错误，但是能运行
println nums
```

#### 切片

groovy可以像python那样进行切片。通过 [start..end] 来进行切片

```groovy
def nums=[1,2,3,4,5,5,6,6]
print(nums[1..3])
print(nums[1..-1]) //-1表示倒数第一个
print(nums[-1..0]) //list的反序
```

#### 等号判断

groovy中list的==判断会变为元素判断。

```groovy
import org.codehaus.groovy.runtime.DefaultGroovyMethods

def nums1=[1,2,3];
def nums2=[1,2,3];
assert nums1==nums2 //1
assert nums1.equals(nums2) //2 同1
assert  DefaultGroovyMethods.equals(nums1,nums2) //3 同2
assert !(nums1===nums2)
```



### 数组

groovy使用`[]`默认表示`ArrayList`，我们可以as来告诉groovy这是一个数组。而不是List。

声明数组主要有以下方法

- as关键字转化

- 使用类型声明 

  使用类型声明会被强制转化为该类型。

- 使用java风格的数组初始化

```groovy
def nums=[1,3,4] as int[]
String[] str=[1,2,'4'] //会隐式转为["1","2","4"]
String[] str2=nums //会隐式转为["1","3","4"]
def nums2=new int[]{1,3,4};
String[] str4=nums2;//会隐式转为["1","3","4"]
println nums
```

### Map
