# 运算符

groovy运算符相比java有所增强。例如：指数运算`**`、操作符重载、安全运算操作符、空合并操作符等等。其操作性更强。

## 算数运算符

### 普通（二元）运算符
| 操作符 | 目的   | 评论                                                     |
| :----- | :----- | :------------------------------------------------------- |
| `+`    | 加法   |                                                          |
| `-`    | 减法   |                                                          |
| `*`    | 乘法   |                                                          |
| `/`    | 除法   | 相关特性请点击[整数除法](../syntax/base.md#div-calc)查看 |
| `%`    | 取余   |                                                          |
| `**`   | 幂运算 | 相关特性请点击[幂运算](../syntax/base.md#power-calc)查看 |

::: code-group



```groovy [main.groovy]
shell = new GroovyShell()
void pv(String value) {
    def res = shell.evaluate(value)
    println  "$value = $res(${res.getClass().getS impleName()})"
}

pv "1+1"
pv "1+1f"
pv "1+1g"
pv "1+1.0g"
pv "1-1"
pv "1-1.0"
pv "1-1g"
pv "1*1"
pv "1*1.2"
pv "1/1"
pv "1/2"
pv "2/1"
pv "2%1"
pv "1**1"
pv "2**2"
pv "1.1**2"
pv "4**0.5"
pv "4.2**0.5"
```

```[打印结果]
1+1 = 2(Integer)
1+1f = 2.0(Double)
1+1g = 2(BigInteger)
1+1.0g = 2.0(BigDecimal)
1-1 = 0(Integer)
1-1.0 = 0.0(BigDecimal)
1-1g = 0(BigInteger)
1*1 = 1(Integer)
1*1.2 = 1.2(BigDecimal)
1/1 = 1(BigDecimal)
1/2 = 0.5(BigDecimal)
2/1 = 2(BigDecimal)
2%1 = 0(Integer)
1**1 = 1(Integer)
2**2 = 4(Integer)
1.1**2 = 1.21(BigDecimal)
4**0.5 = 2(Integer)
4.2**0.5 = 2.04939015319192(Double)
```


:::



### 一元运算符

简单来说就是带+负号数字或者++、--运算。运算逻辑与java相同

```groovy
def a=+1;
def b=-1;
def c=a++;
def d=b--;
def e=++a;
def f=--b;
```


### 赋值运算符

就是`+=`，`-=`等运算。与java相同，多出一个`**=`运算。

- `+=`
- `-=`
- `*=`
- `/=`
- `%=`
- `**=`

```groovy
def a=1;
a+=1;
a**=2; //a=a**2;
```

## 关系运算符

groovy关系运算在数值是表现差不多。在等于判断时

| 运算符 | 解释                                      |
| :----- | :---------------------------------------- |
| `==`   | 等于 相当于`equals()`                     |
| `!=`   | 不等于                                    |
| <      | 小于                                      |
| `<=`   | 小于或等于                                |
| `>`    | 大于                                      |
| `>=`   | 大于或等于                                |
| `===`  | 全等于（自 Groovy 3.0.0 起） 相当于`is()` |
| `!==`  | 不全等于（自 Groovy 3.0.0 起）            |



特别注意的是，groovy等等（`==`）不是java中的地址比较。而是被编码为`ScriptBytecodeAdapter.compareEqual(变量1，变量2)`

::: details ScriptBytecodeAdapter.compareEqual源码分析

```java
//ScriptBytecodeAdapter.compareEqual
public static boolean compareEqual(final Object left, final Object right) {
    if (left == right) return true;
    if (left != null && right != null) {
        Class leftClass = left.getClass();
        if (leftClass == right.getClass()) {
            if (leftClass == Integer.class) {
                return left.equals(right);
            }
            if (leftClass == BigDecimal.class) {
                return ((BigDecimal) left).compareTo((BigDecimal) right) == 0;
            }
            if (leftClass == BigInteger.class) {
                return ((BigInteger) left).compareTo((BigInteger) right) == 0;
            }
            if (leftClass == Long.class) {
                return left.equals(right);
            }
            if (leftClass == Double.class) {
                return left.equals(right);
            }
            if (leftClass == Float.class) {
                return left.equals(right);
            }
            if (leftClass == String.class) {
                return left.equals(right);
            }
            if (leftClass == GStringImpl.class) {
                return left.equals(right);
            }
        }
    }
    return DefaultTypeTransformation.compareEqual(left, right);
}
//DefaultTypeTransformation.compareEqual
public static boolean compareEqual(Object left, Object right) {
    if (left == right) return true;
    if (left == null) return right instanceof NullObject;
    if (right == null) return left instanceof NullObject;
    if (left instanceof Comparable) {
        return compareToWithEqualityCheck(left, right, true) == 0;
    }
    // handle arrays on both sides as special case for efficiency
    Class leftClass = left.getClass();
    Class rightClass = right.getClass();
    if (leftClass.isArray() && rightClass.isArray()) {
        return compareArrayEqual(left, right);
    }
    if (leftClass.isArray() && leftClass.getComponentType().isPrimitive()) {
        left = primitiveArrayToUnmodifiableList(left);
    }
    if (rightClass.isArray() && rightClass.getComponentType().isPrimitive()) {
        right = primitiveArrayToUnmodifiableList(right);
    }
    if (left instanceof Object[] && right instanceof List) {
        return DefaultGroovyMethods.equals((Object[]) left, (List) right);
    }
    if (left instanceof List && right instanceof Object[]) {
        return DefaultGroovyMethods.equals((List) left, (Object[]) right);
    }
    if (left instanceof List && right instanceof List) {
        return DefaultGroovyMethods.equals((List) left, (List) right);
    }
    if (left instanceof Map.Entry && right instanceof Map.Entry) {
        Object k1 = ((Map.Entry) left).getKey();
        Object k2 = ((Map.Entry) right).getKey();
        if (Objects.equals(k1, k2)) {
            Object v1 = ((Map.Entry) left).getValue();
            Object v2 = ((Map.Entry) right).getValue();
            return v1 == v2 || (v1 != null && DefaultTypeTransformation.compareEqual(v1, v2));
        }
        return false;
    }
    return (Boolean) InvokerHelper.invokeMethod(left, "equals", right);
}
```

观察上方代码

groovy会先判断是否是简单类型（`Integer、Long、Double`等 ）的判断，走简单逻辑。

如果都不是就会走复杂（数组，集合，Map）的类型的逻辑。如果都不是groovy处理的类型，就会走`equals`方法

:::




## 逻辑运算符

逻辑运算符：与`&&`或`||`非`!` 这些运算规则与java保持一致。

### 逻辑短路

逻辑短路就是 

- 或运算 第一个为true就直接返回true
- 与运算第一个为false就直接返回false

```groovy

res=false;

boolean setTrue(){
    res=true;
}
true || setTrue();
assert !res

res=false;
false || setTrue();
assert res;

res=false;
false && setTrue();
assert !res;

res=false;
true&&setTrue();
assert res;
```





## 位运算

groovy位运算与java一致

- `&`: 与运算 

  仅 1&1为1。
  
  <table >
      <tr>
          <td style="width:6em" >数字</td>
          <td style="width:6em">0</td>
          <td style="width:6em" >1</td>
      </tr>
      <tr>
          <td style="width:6em" >0</td>
          <td style="width:6em" >0</td>
          <td style="width:6em" >0</td>
      </tr>
      <tr>
          <td style="width:6em">1</td>
          <td style="width:6em">0</td>
          <td style="width:6em">1</td>
      </tr>
  </table>


- `|`: 或运算

  如果其中一个为1则为1。

  <table >
      <tr>
          <td style="width:6em" >数字</td>
          <td style="width:6em" >0</td>
          <td style="width:6em" >1</td>
      </tr>
      <tr>
          <td style="width:6em" >0</td>
          <td style="width:6em" >0</td>
          <td style="width:6em" >1</td>
      </tr>
      <tr>
          <td style="width:6em" >1</td>
          <td style="width:6em" >1</td>
          <td style="width:6em" >1</td>
      </tr>
  </table>

- `^`: 亦或运算 

  0^1 或者 1^0为1。

  <table >
      <tr>
          <td style="width:6em" >数字</td>
          <td style="width:6em" >0</td>
          <td style="width:6em" >1</td>
      </tr>
      <tr>
          <td style="width:6em" >0</td>
          <td style="width:6em" >0</td>
          <td style="width:6em" >1</td>
      </tr>
      <tr>
          <td style="width:6em" >1</td>
          <td style="width:6em" >1</td>
          <td style="width:6em" >0</td>
      </tr>
  </table>

- `~`: 非运算

  直接取反

计算机中运算是补码运算，为简化实验，实验中的数值采用正数，因为正数的补码是他本身。

```groovy
static def eq(def left, def right) {
    assert left == right
}

a = 0b10101010
b = 0b01010101
c = 0b11111111
d = 0b00000000

eq a & b, d
eq a & a, a
eq a | b, c
eq a | d, a
eq b | d, b
eq a ^ b, c
eq a ^ c, b
eq b ^ d, b
eq b ^ c, a
println Integer.toBinaryString(~d)
```

