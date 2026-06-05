---
title: "Python 文件操作与异常处理"
cat: "ENGINEERING"
tags: [Python, 文件操作, 异常处理, with, JSON, CSV, Phase-1]
min: "5"
date: "2026.06.06 — 01:18:56"
image: ""
label: "LATEST TRANSMISSION"
labelZh: "最新传输"
excerpt: "Python 文件操作与异常处理 — open/with、文件读写模式、JSON/CSV处理、异常处理详解。"
---

## 1. 文件读写基础

### 1.1 open() 与关闭文件

```python
# 传统方式（容易忘记关闭）
f = open("data.txt", "r", encoding="utf-8")
content = f.read()
f.close()

# 推荐：with 上下文管理器（自动关闭）
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
# 离开 with 块时，f.close() 自动调用
```

**对比 C++：**

| 特性 | Python | C++ |
|------|--------|-----|
| 打开文件 | `open(path, mode)` | `std::ifstream` / `std::ofstream` |
| 自动关闭 | `with` 语句（上下文管理器） | RAII（析构时关闭） |
| 编码处理 | `encoding="utf-8"` 参数 | 需手动设置 locale 或转换 |
| 换行符 | 自动处理 `\n` | `\n` / `\r\n` 需手动处理 |

### 1.2 文件模式

| 模式 | 含义 | 文件不存在 | 是否清空 |
|------|------|-----------|---------|
| `'r'` | 只读（默认） | 报错 | — |
| `'w'` | 只写 | 创建新文件 | ✅ 清空 |
| `'a'` | 追加 | 创建新文件 | ❌ 保留，尾部追加 |
| `'x'` | 独占创建 | 报错（已存在时） | — |
| `'r+'` | 读写 | 报错 | ❌ |
| `'w+'` | 读写 | 创建 | ✅ 清空 |
| `'a+'` | 读追加 | 创建 | ❌ |

**带 `b` 的模式（二进制）：** `'rb'`, `'wb'`, `'ab'` —— 用于图片、音频等非文本文件。

### 1.3 读取方式

```python
# ① 全部读取
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()          # 字符串

# ② 按行读取为列表
with open("data.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()       # ['line1\n', 'line2\n', ...]

# ③ 逐行迭代（内存友好，适合大文件）
with open("data.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())     # strip() 去掉换行符

# ④ 读取固定字节数
with open("data.bin", "rb") as f:
    chunk = f.read(1024)        # 读 1024 字节
```

### 1.4 写入方式

```python
# 覆盖写入
with open("out.txt", "w", encoding="utf-8") as f:
    f.write("Hello, World!\n")
    f.write("Second line\n")

# 追加写入
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("New log entry\n")

# 写入多行
lines = ["a\n", "b\n", "c\n"]
with open("out.txt", "w", encoding="utf-8") as f:
    f.writelines(lines)
```

---

## 2. JSON 文件处理

```python
import json
from pathlib import Path

# 读取 JSON 文件
data = json.loads(Path("data.json").read_text(encoding="utf-8"))

# 写入 JSON 文件
obj = {"name": "Alice", "scores": [90, 85, 88]}
Path("out.json").write_text(
    json.dumps(obj, ensure_ascii=False, indent=2),
    encoding="utf-8"
)
```

**`json.dumps` 常用参数：**

| 参数 | 作用 |
|------|------|
| `indent=2` | 格式化缩进 |
| `ensure_ascii=False` | 中文不转义为 `\uXXXX` |
| `sort_keys=True` | 按键排序输出 |

---

## 3. CSV 文件处理

### 3.1 使用 csv 模块

```python
import csv

# 读取 CSV
with open("data.csv", "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)       # 读取表头
    for row in reader:
        print(row)              # row 是列表

# 写入 CSV
with open("out.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "age"])
    writer.writerow(["Alice", 20])
    writer.writerows([["Bob", 25], ["Carol", 22]])
```

**注意：** 打开 CSV 文件时必须加 `newline=""`，否则 Windows 下会多出空行。

### 3.2 DictReader / DictWriter

```python
import csv

# 读取为字典（用表头作键）
with open("data.csv", "r", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])

# 写入字典
with open("out.csv", "w", encoding="utf-8", newline="") as f:
    fieldnames = ["name", "age"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow({"name": "Alice", "age": 20})
```

---

## 4. 异常处理

### 4.1 try / except / else / finally

```python
try:
    x = int(input("请输入数字: "))
    result = 10 / x
except ValueError:
    print("输入不是有效数字")
except ZeroDivisionError:
    print("不能除以零")
else:
    print(f"结果是 {result}")      # 没有异常时才执行
finally:
    print("清理工作完成")          # 无论有无异常都执行
```

**执行逻辑：**

| 情况 | try | except | else | finally |
|------|-----|--------|------|---------|
| 无异常 | ✅ | 跳过 | ✅ | ✅ |
| 有异常且捕获 | ✅（中断） | ✅ | 跳过 | ✅ |
| 有异常未捕获 | ✅（中断） | 跳过 | 跳过 | ✅（执行后抛出） |

### 4.2 捕获多个异常

```python
try:
    risky_operation()
except (ValueError, TypeError) as e:
    print(f"输入错误: {e}")
except Exception as e:
    print(f"其他错误: {e}")
```

**异常继承层次（部分）：**

```
BaseException
├── SystemExit          # sys.exit()
├── KeyboardInterrupt   # Ctrl+C
└── Exception           # 所有普通异常的基类
    ├── ValueError
    ├── TypeError
    ├── IndexError
    ├── KeyError
    ├── FileNotFoundError
    ├── ZeroDivisionError
    └── ...
```

### 4.3 重新抛出与异常链

```python
try:
    process_data()
except ValueError as e:
    # 包装为业务异常，保留原始信息
    raise DataProcessingError("处理失败") from e
```

### 4.4 自定义异常

```python
class ValidationError(Exception):
    """自定义验证异常"""
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"[{field}] {message}")

# 使用
if age < 0:
    raise ValidationError("age", "不能为负数")
```

**对比 C++：**

| 特性 | Python | C++ |
|------|--------|-----|
| 异常基类 | `Exception` | `std::exception` |
| 捕获语法 | `except Type as e:` | `catch (const Type& e)` |
| 所有异常捕获 | `except:` / `except Exception:` | `catch (...)` |
| finally 块 | `finally:` | RAII + `catch` 后执行 |
| 自定义异常 | 继承 `Exception` | 继承 `std::exception` |
| 异常规范 | 无 | `noexcept`（C++11+） |

### 4.5 with 语句的本质（上下文管理器）

```python
# with 等价于：
manager = open("file.txt")
manager.__enter__()
try:
    f = manager.__enter__()
    # 执行 with 块内的代码
finally:
    manager.__exit__(*sys.exc_info())   # 关闭资源
```

**自定义上下文管理器：**

```python
class Timer:
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start
        print(f"耗时: {elapsed:.3f}s")
        return False   # 不吞掉异常

# 使用
with Timer():
    time.sleep(1)
# 输出: 耗时: 1.001s
```

---

## 5. pathlib 综合应用

```python
from pathlib import Path

# 遍历目录
for txt_file in Path("data").glob("*.txt"):
    print(txt_file.name)

# 递归遍历
for file in Path("src").rglob("*.py"):
    print(file)

# 创建目录（含父目录）
Path("output/2026/05").mkdir(parents=True, exist_ok=True)

# 复制文件
import shutil
shutil.copy("a.txt", "backup/a.txt")

# 移动/重命名
Path("old.txt").rename("new.txt")
```

---

## 练习题（25 道）

**1. 下面代码有什么问题？**

```python
f = open("data.txt", "r")
content = f.read()
```

**答案：** 没有关闭文件。如果后面代码抛出异常，`f.close()` 永远不会执行，造成资源泄漏。应使用 `with` 语句。

---

**2. `'w'` 模式和 `'a'` 模式的区别？**

**答案：**
- `'w'`：写入模式，**会清空**已有内容
- `'a'`：追加模式，**保留**已有内容，在末尾追加

---

**3. `newline=""` 在打开 CSV 文件时为什么重要？**

**答案：** Windows 下文本模式的换行符转换会导致 CSV 写入时多出空行。`newline=""` 禁用自动转换，保证 `\n` 原样写入。

---

**4. 逐行读取大文件的最佳方式是什么？**

**答案：**

```python
with open("big.txt", "r", encoding="utf-8") as f:
    for line in f:           # 迭代文件对象，内存友好
        process(line)
```

不要用 `readlines()`，它会一次性把所有行读入内存。

---

**5. `json.dump` 和 `json.dumps` 的区别？**

**答案：**
- `json.dump(obj, fp)` → 写入**文件对象**
- `json.dumps(obj)` → 返回**字符串**

---

**6. 如何用 `DictReader` 读取 CSV 并访问 `"name"` 列？**

**答案：**

```python
import csv
with open("data.csv", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"])
```

---

**7. `try/except/else/finally` 中，`else` 什么时候执行？**

**答案：** `try` 块**没有发生异常**时执行。如果有异常，跳过 `else` 直接进 `except`。

---

**8. `finally` 块什么时候**不**执行？**

**答案：** 几乎总是执行，除非：
- 程序被强制终止（`os._exit()`）
- 发生未处理的系统级错误

即使 `try` 或 `except` 中有 `return`，`finally` 也会在返回前执行。

---

**9. 下面代码输出什么？**

```python
def test():
    try:
        return "try"
    finally:
        print("finally")
print(test())
```

**答案：**
```
finally
try
```
- `finally` 在 `return` 之前执行

---

**10. 捕获所有异常的写法？推荐吗？**

**答案：**

```python
try:
    ...
except Exception as e:    # 推荐
    ...
```

```python
except:                   # 不推荐（也捕获 SystemExit、KeyboardInterrupt）
    ...
```

---

**11. 自定义异常为什么要继承 `Exception` 而不是 `BaseException`？**

**答案：** `BaseException` 包含 `SystemExit` 和 `KeyboardInterrupt`。继承它会导致 `except` 错误地捕获程序退出和用户中断信号。

---

**12. `raise ... from ...` 的作用？**

**答案：** 创建**异常链**，保留原始异常信息。

```python
try:
    int("abc")
except ValueError as e:
    raise RuntimeError("转换失败") from e
```

输出显示：`RuntimeError: 转换失败` → `caused by ValueError: ...`

---

**13. 上下文管理器的两个特殊方法是什么？**

**答案：** `__enter__()` 和 `__exit__(exc_type, exc_val, exc_tb)`

---

**14. `with` 语句能同时管理多个资源吗？**

**答案：** 可以。

```python
with open("a.txt") as f1, open("b.txt") as f2:
    ...
```

---

**15. 如何用 `pathlib` 递归查找所有 `.py` 文件？**

**答案：**

```python
from pathlib import Path
for py_file in Path("src").rglob("*.py"):
    print(py_file)
```

---

**16. 读取二进制文件和文本文件的区别？**

**答案：**
- 文本：`open("f.txt", "r", encoding="utf-8")` → 返回字符串
- 二进制：`open("f.bin", "rb")` → 返回 `bytes` 对象

---

**17. `csv.writer` 写入列表和写入字典的方法名？**

**答案：**
- `writerow([...])` / `writerows([[...], [...]])` — 列表模式
- `writerow({"key": val})` — `DictWriter` 的字典模式

---

**18. 如何安全地创建嵌套目录？**

**答案：**

```python
from pathlib import Path
Path("a/b/c").mkdir(parents=True, exist_ok=True)
```

---

**19. `json.dumps` 的 `ensure_ascii=False` 有什么作用？**

**答案：** 禁用 ASCII 转义，让中文字符直接输出为 `"中文"` 而不是 `"\u4e2d\u6587"`。

---

**20. `FileNotFoundError` 继承自哪个类？**

**答案：** `OSError` → `Exception` → `BaseException`

```python
print(FileNotFoundError.__mro__)
# (<class 'FileNotFoundError'>, <class 'OSError'>, <class 'Exception'>, <class 'BaseException'>, <class 'object'>)
```

---

**21. 下面代码有什么问题？**

```python
try:
    f = open("a.txt")
    data = f.read()
except FileNotFoundError:
    print("找不到")
f.close()
```

**答案：** 如果 `open` 失败，`f` 未定义，`f.close()` 会报 `NameError`。应使用 `with` 语句或在 `except` 和 `else` 中分别处理。

---

**22. 写一个上下文管理器，在进入时打印 "Start"，退出时打印 "End"。**

**答案：**

```python
class Logger:
    def __enter__(self):
        print("Start")
        return self
    def __exit__(self, *args):
        print("End")
        return False

with Logger():
    print("Working...")
# Start → Working... → End
```

---

**23. 如何用 `pathlib` 读取文件全部内容？**

**答案：**

```python
from pathlib import Path
content = Path("data.txt").read_text(encoding="utf-8")
```

---

**24. `csv.DictWriter` 必须先调用什么方法？**

**答案：** `writeheader()`，写入表头行。

---

**25. 综合题：写一个函数，安全地读取 JSON 文件，处理所有可能的异常，返回字典。**

**答案：**

```python
import json
from pathlib import Path

def safe_load_json(filepath):
    try:
        return json.loads(Path(filepath).read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"文件不存在: {filepath}")
        return {}
    except json.JSONDecodeError as e:
        print(f"JSON 格式错误: {e}")
        return {}
    except Exception as e:
        print(f"未知错误: {e}")
        return {}
```

---

## 核心记忆卡片

1. **`with open(...) as f`** 是标准写法，自动调用 `f.close()`，防止资源泄漏
2. **文件模式：** `r` 读、`w` 覆盖写、`a` 追加、`x` 独占创建、`b` 二进制
3. **大文件用 `for line in f`** 逐行迭代，不要用 `readlines()`
4. **CSV 必须加 `newline=""`**，否则 Windows 下多空行
5. **`json.dumps`** 返回字符串，`json.dump` 写文件；`ensure_ascii=False` 保中文
6. **`csv.DictReader`** 把每行读成字典，`DictWriter` 先 `writeheader()`
7. **`try/except/else/finally`**：else=无异常时执行，finally=总是执行
8. **自定义异常**继承 `Exception`，不要继承 `BaseException`
9. **`raise ... from ...`** 创建异常链，保留原始错误信息
10. **上下文管理器**实现 `__enter__` 和 `__exit__`，`with` 语句自动调用

---

## 相关链接

- [[Python模块与包]] ⬅️ 上一节：模块与包管理
- [[Phase 1 - Python 基础]]：Phase 1 任务清单
- [[Python学习路线]]：完整 Python 学习路线图