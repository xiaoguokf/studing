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
    println  "$value = $res(${res.getClass().getSimpleName()})"
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

### 赋值运算符

