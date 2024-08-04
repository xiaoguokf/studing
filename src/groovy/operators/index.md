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

groovy关系运算在数值是表现差不多。

| 运算符 | 解释                           |
| :----- | :----------------------------- |
| `==`   | 等于                           |
| `!=`   | 不等于                         |
| <      | 小于                           |
| `<=`   | 小于或等于                     |
| `>`    | 大于                           |
| `>=`   | 大于或等于                     |
| `===`  | 全等于（自 Groovy 3.0.0 起）   |
| `!==`  | 不全等于（自 Groovy 3.0.0 起） |





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

