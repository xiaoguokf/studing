# 面向对象

从面向对象的角度讲groovy

## 类型

### 基元类型

groovy和java基元类一致

| 基元类  | 包装类    |
| ------- | --------- |
| boolean | Boolean   |
| char    | Character |
| short   | Short     |
| int     | Integer   |
| long    | Long      |
| float   | Float     |
| double  | Double    |

### 引用类型

非基元类型就为引用类型

```groovy
def str="123"
```

### 泛型

groovy泛型与java相同。

```groovy
List<String> roles = ['Trinity', 'Morpheus']
```

## 类

groovy中与java中的类十分相似。类具有相同的可见性修饰符（public、protected、private、static ），但是类中无default关键字，只在接口中生效。

Groovy 类和 Java 类之间的主要区别：

- 没有可见性修饰符(类，字段，方法等)自动是公共的。

  字段会自动生成private的字段，并生成getter和setter

  方法就会自动公共的。

  如果不想要自动公共，使用修饰符`@PackageScope`

  ```groovy
  import groovy.transform.PackageScope
  
  class Test {
      @PackageScope
      String str = "2";
  
      @PackageScope
      void sayHello() {
  
      }
  }
  ```

- groovy中类访问是动态反射的，即使超出了访问权限也能访问。

- 一个源文件可能包含一个或多个类，并且类名不一定是源文件名

  当多个非内部类的时候，会被统一编译当相同包下，并且为public static类。如果存在非类内的代码，就会被识别为脚本类。

  ::: warning 注意

  我们应该推荐一个类文件一个类，这样子方便类的查找。只是在代码量很少的时候推荐使用，多的话就不要这样子使用。

  :::

一个类示例

```groovy
class Test {
    String name;
    void sayHello() {
        println "hello ${name}"
    }
}
```

### 通用类

```groovy
def p = new Person()
```

### 内部类

groovy同样支持类内定义类。内部类同样使用父类$子类来编译。

下列代码中，groovy构造非静态内部类时，groovy可以直接构造，但是java必须先生成外部类才能生成内部类。

::: code-group

```groovy [Main.groovy]
def test = new Test.innerTest()
```

```groovy [Test.groovy]
class Test {
    String name;

    void sayHello() {
        println "hello ${name}"
    }

    class InnerTest {

    }
}
```


```java [JMain.java]
public class JMain {
    public static void main(String[] args) {
        var test=new Test().new InnerTest();
    }
}
```

:::

#### 静态内部类

groovy中也可以声明静态内部类。加`static`关键字即可。

```groovy
class Test {
   static class InnerTest {

    }
}
```

#### 匿名内部类

类或者接口实例化时，使用new 类(){}来实例化。

```groovy
def runner=new Runnable() {
    @Override
    void run() {
        println 111
    }
}
```

### 抽象类

使用abstract关键字修饰的类就是抽象类。

```groovy
abstract class Animal {
    abstract def eat()

    abstract void say()

    void self() {
        eat()
        say()
    }
}
```

### 继承

groovy同样可以使用继承来服用父类的某些特征。

继承有两大类

- 实现继承`extends`

  就是继承了已经实现的类的属性，类继承之后就可以使用。

- 契约继承`implements`

  要按照规定实现特定方法的具体内容，例如抽象方法或者接口方法。



::: tip 注意

我们extends，implements只是主要特征，并不只代表单一特性，只是extends主要实现是实现继承，implements主要实现的是契约继承。

:::

### 接口

接口定义了类需要遵守的契约。在普通方法中，接口仅定义需要实现的方法列表，但不定义方法的实现。

我们使用`interface`关键字声明接口

```groovy
interface IA { }
```

接口定义的成员有如下情况。

- 定义的字段默认为static变量
- 接口可以定义无法定义static方法
- groovy4中方法可见性声明只能用`public，不写，default`。不能使用`protected，private`修饰符
- 子类重写default方法时，使用 `接口类.super.方法` 访问

### 超(super)类

超类简单来说就是父类。

对于继承的类，如果具有重写的方法，我们就要特别指定超类的方法。

::: code-group

```groovy [Main.groovy]
def c = new C()

c.iM()
c.aM()
c.dM()
```

```groovy [C.groovy]
interface IA {

    default void dM() {
        println "dM"
    }

    void iM();

}

abstract class BAbstract {
    void aM() {
        println "aM"
    }
}

class C extends BAbstract implements IA {

    @Override
    void aM() {
        super.aM()
    }

    @Override
    void dM() {
        IA.super.dM()
    }

    @Override
    void iM() {
        println "im"
    }
}
```

:::

## 类的成员

### 构造器

### 方法

## 注解

### 注解声明

### 元注解
