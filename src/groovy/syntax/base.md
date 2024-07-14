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



## 简单数据类型





## 流程控制

