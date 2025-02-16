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

groovy类成员有两大类：方法和字段。

### 构造方法

属于方法，用于实例化类。没有返回类型（其实返回实例本身）

#### 普通构造函数

通过java风格的方法参数声明的方法。

::: code-group

```groovy [Main.groovy]
def user=new User("xm",19)
```

```groovy [User.groovy]
class User {
    String username;
    int age;

    User(String username, int age) {
        this.username = username
        this.age = age
    }
}
```

:::

上方User(String username, int age)就是方法的形参。通过输入用户名和age来构造方法。

#### 命名参数

我们构造的时候，我们通过使用类似map的方式传入。让其传入到方法内部。以下两个方法都支持构造出函数

```groovy
class User {
    String username;
    String password
}
def user = new User(username: "111", password: "111")
def user2 = new User([username: "111", password: "111"])
```

### 方法

#### 方法声明

groovy在方法中使用时有如下特性：

1. groovy方法声名中可以使用def来注明是不确定的类型，默认会被编译成Object类型。

   :::code-group

   ```groovy [Main.groovy]
   def getObj(def name){
       return "$name"
   }
   //等价于
   def getObj(name){
       return "$name"
   }
   println getObj("小明")
   ```

   ```java [编译后的java]
   public Object getObj(Object name) {
       return new GStringImpl(new Object[]{name}, new String[]{"", ""});
   }
   ```

   :::

2. groovy在重载时，根据运行时决定，优先使用运行时匹配的类型。
   下列语句在运行时，groovy会去找printType方法，更具参数在运行时的具体类型，obj具体是string时会先找出str的方法，所以会执行`printType(String str)`方法。

   ```groovy
   def printType(String str){
       println "str $str"
   }
   def printType(Object obj){
       println "obj $obj"
   }
   Object obj="111"
   Object obj2=1
   printType(obj) //str 111
   printType(obj2) //obj 1
   ```

   ::: details 优先级规则

   - 继承链上按就近原则

   - 数组比对象有更高优先级

     ```groovy
     def printO(Object o){
         println "o"
     }
     def printO(Object[] o){
         println "os"
     }
     
     printO([1,2,3]) //o
     printO([1,2,3] as int[]) //o
     printO([1,2,3] as Integer[]) //os
     printO([1,2,3] as Object[]) //os
     ```

   - 非可变参数优先于可变参数

     ```groovy
     def vag(int a,int b){
         println "ab"
     }
     def vag(int a,int ...ms){
         println "a"
     }
     vag(1,2) //ab
     ```

   - 可变参数和可变参数匹配时优先按最多的匹配

     ```groovy
     def vag(int a,int b,int ...ms){
         println "ab"
     }
     def vag(int a,int ...ms){
         println "a"
     }
     
     vag(1,2,3,4,4) //ab
     vag(1,2) //ab
     vag(1) //a
     ```

   - 接口优先级大于类继承

     ```groovy
     interface I2{}
     class P{}
     class Impl extends P  implements I2{}
     def printI(I2 i){
         println("i2")
     }
     def printI(P i){
         println("p")
     }
     printI(new Impl()) //i2
     ```

   - 对于基元类型，会匹配相同的类型或稍大的类型。

     ```groovy
     def printNum(Long l){
         println "l"
     }
     def printNum(Short s){
         println "s"
     }
     def printNum(BigInteger b){
         println "b"
     }
     printNum(55) //55是int往大的匹配
     ```

   

   如果调用时有两个相同的优先级，groovy会报错。

   ```groovy
   interface I2{}
   interface I3{}
   class Impl implements I2,I3{}
   def printI(I2 i){
       println("i2")
   }
   def printI(I3 i){
       println("i3")
   }
   printI(new Impl()) //报错
   ```

   :::

3. groovy方法如果有返回类型，总是返回最后一个语句，所以忘记返回类型时可能不会报错。

   如果返回类型与声明的返回类型不匹配时，groovy会尝试强转，如果转不了就报错了

   ```groovy
   def cal(){
       "abc"
   }
   void cal2(){
       "abc"
   }
   def cal3(name){
       "$name"
   }
   String cal4(){
       111
   }
   int cal5(){ //<=> (int)111 报错，不像string会执行tostring
       "111"
   }
   int cal6(){
       "1"
   }
   println cal() //abc
   println cal2() //null
   println cal3("def") //def
   println cal4() //111  <=> (String)111  <=> 111.toString()
   ```

#### 命名参数

groovy中方法也支持使用命名参数，他会被集成到一个map参数里去。

```groovy
def names(Map name){
    println name.a
    println name.b
}

names(a: 1,b: 2)
names([a: 1,b: 2])
```

我们可以可以混用的情况，但是map必须是第一个参数。执行时，要么参数在前面，要么map在前面

```groovy
def names(Map name,int  c,int d){
    println name.a
    println name.b
    println c
}

names(3,4,a: 1,b: 2)
names(a: 1,b: 2,3,4)
```

#### 默认参数

和js一样，可以直接等号表示默认值

```groovy
def m(int a,int b=1){
    println a+b
}
m(1)   //2
m(1,2) //3
```

#### 可变参数

groovy同样支持java风格的可变参数。

```groovy
def m(int ...a){
    println a
}

m(1,2,3)
```

groovy中`单个数组`参数也可认为可变参数

```groovy
def m(int[] a){
    println a
}

m(1,2,3)
```



#### 动态方法选择

groovy中方法的选择和java不一样，groovy在运行时对方法进行链接调用，java则在编译时对方法进行链接调用。

对于官网所给的例子

::: code-group

```java
public class JMain {
    public static void main(String[] args) {
        System.out.println(method(1,"2")); // i/s
        System.out.println(method("1",2)); // s/i
        System.out.println(method("1","2")); // o/o
        Object o1=1;
        Object o2="2";
        System.out.println(method(o1,o2)); // o/o
    }

   static String method(Object o1, Object o2) {
        return "o/o";
    }

   static String method(Integer i, String s) {
        return "i/s";
    }

   static String method(String s, Integer i) {
        return "s/i";
    }
}
```



```groovy
def method(Object o1, Object o2) { 'o/o' }
def method(Integer i, String  s) { 'i/s' }
def method(String  s, Integer i) { 's/i' }
println(method(1,"2")); // i/s
println(method("1",2)); // s/i
println(method("1","2")); // o/o
Object o1=1;
Object o2="2";
println(method(o1,o2)); // i/s
```

:::

##### 动态方法选择优先级

groovy方法选择是动态的，但是选择得看优先级，主要采用`最近优先`策略

- **继承实现按就近原则，同级实现大于继承**

  对于继承链上，采用最近继承原则，下方代码中的method方法由`I3`个`I1`两个实现类，但是`C1`继承链上`I3`比较近，所以优先采用参数为i3的方法。

  ```groovy
  interface I1 {}
  interface I2 extends I1 {}
  interface I3 {}
  class C1 implements I3, I2 {}
  
  }
  def method(I1 i1) { 'I1' }
  def method(I3 i3) { 'I3' }
  assert method(new C1()) == 'I3'
  ```

  如果存在同级的选择（一般是实现），则会造成报错。例如`C1`实现了`I3`和`I2`，如果多出一个参数为`I2`的方法就会导致groovy报错

  ::: code-group

  ```groovy
  interface I1 {}
  interface I2 extends I1 {}
  interface I3 {}
  interface I4 {}
  class C1 implements I3, I2 {}
  class C2 extends C1 implements I4{
  
  }
  def method(I1 i1) { 'I1' }
  def method(I2 i2) { 'I2' }
  def method(I3 i3) { 'I3' }
  
  
  
  assert method(new C1()) == 'I3'
  ```

  ```[日志]log
  Caught: groovy.lang.GroovyRuntimeException: Ambiguous method overloading for method Params#method.
  Cannot resolve which method to invoke for [class C1] due to overlapping prototypes between:
  	[interface I2]
  	[interface I3]
  groovy.lang.GroovyRuntimeException: Ambiguous method overloading for method Params#method.
  Cannot resolve which method to invoke for [class C1] due to overlapping prototypes between:
  	[interface I2]
  	[interface I3]
  	at Params.run(Params.groovy:15)
  ```

  :::

  groovy中实现大于继承，例如下方`C2`继承了`C1`实现了`I4`，但是打印了实现`I4`

  ```groovy
  interface I1 {}
  interface I2 extends I1 {}
  interface I3 {}
  interface I4 {}
  class C1 implements I3, I2 {}
  class C2 extends C1 implements I4{
  
  }
  def method(I1 i1) { 'I1' }
  def method(I3 i3) { 'I3' }
  def method(I4 i4) { 'I4' }
  def method(C1 c1) { 'C1' }
  
  assert method(new C2()) == 'I4'
  ```

- **对象数组优于对象**

  groovy，如果方法中存在**对象数组**，则**对象数组**优先于**对象**，因为**对象数组**也是**对象**，**对象数组**更加具体

  ```groovy
  def m(Object o){
      'o'
  }
  def m(Object[] os)
  {
      'os'
  }
  assert m([1,2,3] as Object[])=='os'
  assert m([1,2,3])=='o' //因为[1,2,3]是List
  ```

- **非可变参数变体优于可变参数**

  下方代码add中，1，2作为入参，优先匹配没有可变参数的实体

  ```groovy
  def add(int a, int b, int ... c) {
      'a+b+...c'
  }
  
  def add(int a, int b) {
      'a+b'
  }
  
  assert add(1, 2) == 'a+b'
  assert add(1, 2, 3) == 'a+b+...c'
  ```

- **可变参数数量最少优先**

  如果函数都是可变参数的函数，则按可变量最小的函数匹配。下方add(int a, int b, int ... c)比add(int a, int ...c)少一个可变动的因素，故会被优先匹配

  ```groovy
  def add(int a, int b, Object ... c) {
      'a+b+...c'
  }
  
  def add(int a, Object ...c) {
      'a+...c'
  }
  
  assert add(1, 2) ==  'a+b+...c'
  ```

  > [!TIP] 注意
  >
  > 若上方Object改成int则`add(int a, int ...c) `按理来说都不会被匹配上。

- **原始类型使用相同或稍大类型**

  下方代码因为没有int类型，但是在选择中有稍大一点的long，则匹配上long

  ```groovy
  def method(Long l) { 'Long' }
  def method(Short s) { 'Short' }
  def method(BigInteger bi) { 'BigInteger' }
  
  assert method(35) == 'Long'
  ```

#### 异常声明

groovy中无需try-cache编译期的异常，虽然你可以向java那样子做。

::: code-group

```groovy
new File('doesNotExist.txt').text
```

```[错误日志]log
Caught: java.io.FileNotFoundException: doesNotExist.txt (系统找不到指定的文件。)
java.io.FileNotFoundException: doesNotExist.txt (系统找不到指定的文件。)
	at Params.run(Params.groovy:1)
```

:::

### 字段



## 注解

### 注解声明

### 元注解
