# 程序结构

## 包名

类在文件内定义包名,指定其所处位置.默认是空包命.

```groovy
package ltd.sshine
```

## 导入

groovy同意使用import导入，这个也和java一致。

```groovy
import ltd.sshine.Test

def test = new Test()
```

默认导入，groovy默认导入了java的默认导入`java.lang`之外还有如下导入。

```groovy
import java.lang.*
import java.util.*
import java.io.*
import java.net.*
import groovy.lang.*
import groovy.util.*
import java.math.BigInteger
import java.math.BigDecimal
```

程序在运行后会自动处理这些类

::: code-group

```groovy [groovy]
def date=new Date();
```

```java [反编译的class]
import groovy.lang.Binding;
import groovy.lang.Script;
import java.util.Date;
import org.codehaus.groovy.runtime.InvokerHelper;

public class Main extends Script {
    public Main() {
    }

    public Main(Binding context) {
        super(context);
    }

    public static void main(String... args) {
        InvokerHelper.class.invoke<invokedynamic>(InvokerHelper.class, Main.class, args);
    }

    public Object run() {
        Object date = Date.class.init<invokedynamic>(Date.class);
        return date;
    }
}
```

:::

### 简单导入

直接`import 包名.类` 叫简单导入

```groovy
import ltd.sshine.Test
```

### 星号导入

导入某个包名下所有的类。

使用`import 包名.*`

例如导入ltd.sshine包下所有类如下

```groovy
import ltd.sshine.*
```

### 静态导入

对于静态方法或者枚举成员，我们可以静态导入到类中。

::: code-group

```groovy [Main.groovy]
import static ltd.sshine.TestEnum.A
import static ltd.sshine.Test.sayHello
println  A;
sayHello()
```

```groovy [Test.groovy]
package ltd.sshine

class Test {
    static void sayHello(){
        println "hello"
    }
}
```

```groovy [TestEnum.groovy]
package ltd.sshine

enum TestEnum {
    A,
    B
}
```

:::



### 静态星号导入

导入某个类的所有`静态方法`。

```groovy
import static java.lang.Math.*

println abs(-1)
println pow(2,2)
```

::: tip 注意

动态方法要有实例才能执行，显然不能静态导入。

:::

### 导入别名

我们可以给静态导入和动态导入，起别名 使用 as 关键字来实现。避免多个相同类时书写超长的包名。

```groovy
import static java.time.LocalDate.now as lNow
import java.lang.String as JString

println JString.valueOf(123)
println lNow()
```



## 脚本与类

### psvm与脚本

**psvm**(public static void main(String[]))通常作为java启动方法的入口，groovy也同样支持。

可以写在类里面，会继承GroovyObject

::: code-group

```groovy
class Main{
    static void main(String[] args) {
        println "hello-word"
    }
}
```

```java
import groovy.lang.GroovyObject;
import groovy.lang.MetaClass;
import groovy.transform.Generated;
import groovy.transform.Internal;
import java.beans.Transient;

public class Main implements GroovyObject {
    @Generated
    public Main() {
        MetaClass var1 = this.$getStaticMetaClass();
        this.metaClass = var1;
    }

    public static void main(String... args) {
        Main.class.invoke<invokedynamic>(Main.class, "hello-word");
    }

    @Generated
    @Internal
    @Transient
    public MetaClass getMetaClass() {
        MetaClass var10000 = this.metaClass;
        if (var10000 != null) {
            return var10000;
        } else {
            this.metaClass = this.$getStaticMetaClass();
            return this.metaClass;
        }
    }

    @Generated
    @Internal
    public void setMetaClass(MetaClass var1) {
        this.metaClass = var1;
    }
}

```

:::

你直接写到psvm方法。也可以是启动方法。但是你不是Groovy单纯的类。会被认为是groovy的Script类

::: code-group

```groovy [源代码]
static void main(String[] args) {
    println "hello-word"
}
```

```groovy [简化后的代码]
println "hello-word"
```

```groovy [等价groovy类代码]
import org.codehaus.groovy.runtime.InvokerHelper
class Main extends Script {
    def run() {
        println 'hello-word'
    }

    Main(Binding binding) {
        super(binding) //变量绑定的传递
    }

    static void main(String[] args) {
        InvokerHelper.runScript(Main, args)
    }
}
```

```java [反编译后代码]
import groovy.lang.Binding;
import groovy.lang.Script;
import org.codehaus.groovy.runtime.InvokerHelper;

public class Main extends Script {
    public Main() {
    }

    public Main(Binding context) {
        super(context);
    }

    public static void main(String... args) {
        InvokerHelper.class.invoke<invokedynamic>(InvokerHelper.class, Main.class, args);
    }

    public Object run() {
        return this.invoke<invokedynamic>(this, "hello-word");//会把语句编译到这里
    }
}
```

:::

::: tip 注意

但是如果同时有psvm方法和外层语句，就会以外层语句优先。

::: code-group

```groovy [源代码]
static void main(String[] args) {
    println "hello-word"
}

println "out"
```

```java [反编译的代码]
import groovy.lang.Binding;
import groovy.lang.Script;
import org.codehaus.groovy.runtime.InvokerHelper;

public class Main extends Script {
    public Main() {
    }

    public Main(Binding context) {
        super(context);
    }

    public static void main(String... args) {
        InvokerHelper.class.invoke<invokedynamic>(InvokerHelper.class, Main.class, args);
    }

    public Object run() {
        return this.invoke<invokedynamic>(this, "out");
    }
}
```

:::

### 方法

groovy中，方法可以不用return。如果有返回值，会默认把最后一行返回回去。如果类型不对，会被强制转型，但并不是as关键字的类型转换。

```groovy
int getOne(){
    1
}
int getTwo(){
    "20"
}
int getThree(){
    "3" //会被认为 '3' => ASCII码 51
}
void notGet(){
    2
}
println getOne() //1
println getThree() //1
println notGet() //null
println getTwo() //报错，类型转换异常
```



### 变量

groovy定义的变量有两种。

- 带变量声明

  作用域在run方法内，run方法定义的方法编译后不在run方法。所以无法访问。

- 不带变量声明

  作用在类内，我们可以在方法内使用。

```groovy
int x = 1;
def y = 2
z=3;
println x
println y
println z

void printY() {
    println y; //报错，找不到y。因为y在run方法里。
}

void printX() {
    println x; //报错，找不到x。因为x在run方法里。
}
void printZ() {
    println z;
}
printZ()
printX()
printY()
```

#### groovy脚本变量的查找方式

1. 方法内变量

   例如上面的`def x=1`，groovy的run方法内会被使用。

2. 当前脚本文件内的变量

   例如上面`z=3`。找不到方法内变量会找到z为3的变量。同时会把变量z设置到binding.variables里

3. 全局作用域变量，binding.variables的变量

   如果当前groovy文件内没有变量。会从binding.variables里找。

::: details Script类内设置变量的方法

```java
//Script类内方法
@Override
public Object getProperty(String property) {
    try {
        return binding.getVariable(property);
    } catch (MissingPropertyException mpe) {
        return super.getProperty(property);
    }
}
@Override
public void setProperty(String property, Object newValue) {
    if ("binding".equals(property)) {
        setBinding((Binding) newValue);
    } else if ("metaClass".equals(property)) { 
        setMetaClass((MetaClass) newValue); //MetaClass getProperty，setProperty invokeMethod可能在后面会讲
    } else if (!binding.hasVariable(property)
            // GROOVY-9554: @Field adds setter
            && hasSetterMethodFor(property)) {
        super.setProperty(property, newValue);
    } else {
        binding.setVariable(property, newValue);
    }
}
```

:::

### 参数

groovy脚本输入之后会有一个args的变量。我们可以使用args变量继续传递args变量

::: code-group

```groovy [Main.groovy]
args=[]
args[0]=1;
args[1]=2
evaluate(new File('Test.groovy'))
```

```groovy [Test.groovy]
println args
a=2;
println binding.variables //当前上下文的变量
evaluate(new File('Test2.groovy'))
```

```groovy [Test2.groovy]
println a
println args
println binding.variables //当前上下文的变量
```

```[打印结果]
[1, 2]
[args:[1, 2], a:2]
2
[1, 2]
[args:[1, 2], a:2]
```

:::

原因是groovy执行evaluate时，会new一个GroovyShell会将当前的binding（上下文）加载到GroovyShell中。

```java
//Script#evaluate(java.io.File)
public Object evaluate(File file) throws CompilationFailedException, IOException {
    GroovyShell shell = new GroovyShell(getClass().getClassLoader(), binding);
    return shell.evaluate(file);
}
```

## MOP和元编程

groovy是一门动态语言，执行变量访问和方法执行控制是动态的。他全部得靠`GroovyObject`的功劳。

groovy内有如下方法：

- invokeMethod

  当找不到方法java方法时会被动态的执行。

- setProperty

  不带声明设置变量时会执行这个

- getProperty

- getMetaClass

  对象找不到方法或变量时，会getMetaClass。让元数据类来处理这个方法。MetaClassImpl是默认实现。

- setMetaClass

​		设置类的描述。

### MetaClass

groovy使用MetaClass来进行动态编程的MetaClass继承MetaObjectProtocol(MOP)接口。使用MOP协议。我们可以在运行时给类添加方法或行为。

以下内容属于深入研究项，待后面进一步开发。

### ExpandoMetaClass

### Category

### Mixin



