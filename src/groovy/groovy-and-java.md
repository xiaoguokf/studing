# java与groovy不同之处

groovy很好的兼容方法，但是为了使开发更加便捷，groovy有着不同之处

## 默认导入

groovy默认导入比java多的多，java默认导入java.lang.* 而groovy默认导入了lang,io，net,util等，并导入了自己的lang和util包,具体的内容如下

- java.io.*
- java.lang.*
- java.math.BigDecimal
- java.math.BigInteger
- java.net.*
- java.util.*
- groovy.lang.*
- groovy.util.*



## 方法动态链接

java属于静态链接语言，执行方法在静态的时候确定（处了反射），所以在执行时根据类型执行了这些方法。而groovy是一类动态运行时语言，方法执行在调用时确定。

看一下代码分析两种语言结果

::: code-group

```java [main.java]
public class JMain {

    static int method(String a) {

        return 1;
    }
    static int method(Object a) {

        return 2;
    }
    public static void main(String[] args) {
        Object abc = "abc";
        System.out.println(method(abc));
    }
}
```

```groovy [main.groovy]

static int method(String arg) {
    return 1;
}
static int method(Object arg) {
    return 2;
}

static void main(String[] args) {
    Object obj=""
    println method(obj)
}

```


:::



如果选用java则有result如下结果：

result=2

如果使用groovy则为如下结果：

result=2

为什么呢？

上文提到，java方法在编译时确定，所以 o为`Object`类，所以选择了返回2的`method`，groovy在编译时确定，因为o为`String`类，所以最接近的是返回1的`method`。



## 数组初始化

::: code-group

```java [main.java]
int[] arr={2,3,4};
int[] arr2=new int[]{2,3,4};
```

```groovy [main.groovy]
def arr=[1,2,3,4]
int[] arr2=[1,2,3,4]
def arr3=new int[]{1,2,3,4}  //groovy 3+
```



:::



java中数组声明使用大括号，包含数字，或者使用new关键字在大括号中指定。而在groovy中，不使用大括号声明，采用通用的[]来声明。

在默认情况下，def类型推断会吧`[]`认为`ArrayList`类，如果采用int[]等修饰，就会被推断为数组。





## 可见性

groovy在声明类时，不加修饰词会被设置成私有属性。并自动为其添加getter和setter

例如：

```groovy
class User {
    String username;
    String password
}
```

编译后

```java
import groovy.lang.GroovyObject;
import groovy.lang.MetaClass;
import groovy.transform.Generated;
import groovy.transform.Internal;
import java.beans.Transient;

public class User implements GroovyObject {
    private String username;
    private String password;

    @Generated
    public User() {
        MetaClass var1 = this.$getStaticMetaClass();
        this.metaClass = var1;
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

    @Generated
    public String getUsername() {
        return this.username;
    }

    @Generated
    public void setUsername(String var1) {
        this.username = var1;
    }

    @Generated
    public String getPassword() {
        return this.password;
    }

    @Generated
    public void setPassword(String var1) {
        this.password = var1;
    }
}

```



你可以添加 `@PackageScope` 让其不设置为私有变量

```groovy
import groovy.transform.PackageScope

class User {
    @PackageScope String username;
    String password
}
```

编译结果

```java
import groovy.lang.GroovyObject;
import groovy.lang.MetaClass;
import groovy.transform.Generated;
import groovy.transform.Internal;
import java.beans.Transient;

public class User implements GroovyObject {
    String username;
    private String password;

    @Generated
    public User() {
        MetaClass var1 = this.$getStaticMetaClass();
        this.metaClass = var1;
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

    @Generated
    public String getPassword() {
        return this.password;
    }

    @Generated
    public void setPassword(String var1) {
        this.password = var1;
    }
}

```



## ARM块

ARM（Automatic Resource Management）也即是` try-with-resources`，是java中自动关闭流的语法糖
