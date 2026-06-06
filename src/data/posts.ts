// ============================================================
// PHRASOIC LAB · Blog Posts Data
// Auto-generated from src/content/blog/
// ============================================================
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  cat: string;
  tags: string[];
  min: string;
  docId: string;
  image?: string;
  label?: string;
  labelZh?: string;
}

export const POSTS: Post[] = [
  {
    docId: "DOC-0001",
    cat: "ENGINEERING",
    title: "模型评估方法",
    excerpt: "从混淆矩阵到交叉验证：系统掌握模型评估的核心指标与方法。",
    body: `<h2>模型评估方法</h2>
<p>模型评估是机器学习工作流中至关重要的一环。一个好的评估方法能帮助我们准确判断模型的性能，发现潜在问题，并指导模型优化。</p>
<h2>1. 混淆矩阵（Confusion Matrix）</h2>
<p>混淆矩阵是分类问题评估的基础工具，它展示了模型预测结果与真实标签的对比情况。</p>
<h3>1.1 二分类混淆矩阵</h3>
<table>
<tr><th></th><th>预测为正类</th><th>预测为负类</th></tr>
<tr><td><strong>真实为正类</strong></td><td>TP (True Positive)</td><td>FN (False Negative)</td></tr>
<tr><td><strong>真实为负类</strong></td><td>FP (False Positive)</td><td>TN (True Negative)</td></tr>
</table>
<p><strong>四个关键指标：</strong></p>
<ul>
<li><strong>TP（真正例）</strong>：真实为正类，预测也为正类</li>
<li><strong>TN（真负例）</strong>：真实为负类，预测也为负类</li>
<li><strong>FP（假正例）</strong>：真实为负类，但预测为正类（误报）</li>
<li><strong>FN（假负例）</strong>：真实为正类，但预测为负类（漏报）</li>
</ul>
<h2>2. 分类评估指标</h2>
<h3>2.1 准确率（Accuracy）</h3>
$$
\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}
$$
<p>准确率是最直观的指标，但在类别不平衡时会产生误导。例如，在 99:1 的数据集中，即使模型全部预测多数类，准确率也能达到 99%。</p>
<h3>2.2 精确率（Precision）</h3>
$$
\\text{Precision} = \\frac{TP}{TP + FP}
$$
$$
\\text{Precision} = \\frac{\\text{预测正确的正类数}}{\\text{模型认为的正类总数}}
$$
<p>精确率衡量的是：<strong>模型预测为正类的样本中，有多少是真正的正类？</strong></p>
<p><strong>应用场景：</strong></p>
<ul>
<li>垃圾邮件检测：误将正常邮件标记为垃圾邮件的代价很高</li>
<li>医疗诊断：误诊的代价很高</li>
</ul>
<h3>2.3 召回率（Recall / Sensitivity）</h3>
$$
\\text{Recall} = \\frac{TP}{TP + FN}
$$
$$
\\text{Recall} = \\frac{\\text{预测正确的正类数}}{\\text{实际的正类总数}}
$$
<p>召回率衡量的是：<strong>所有真正的正类样本中，模型找出了多少？</strong></p>
<p><strong>应用场景：</strong></p>
<ul>
<li>癌症筛查：漏诊的代价很高，宁可误诊也不能漏诊</li>
<li>欺诈检测：漏掉欺诈交易的代价很高</li>
</ul>
<h3>2.4 F1 分数（F1-Score）</h3>
<p>F1 是精确率和召回率的调和平均数：</p>
$$
F1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}
$$
<p>F1 分数在精确率和召回率之间取得平衡，适用于需要同时关注两者的场景。</p>
<h3>2.5 Precision-Recall 权衡</h3>
<p>精确率和召回率通常是此消彼长的关系：</p>
<ul>
<li>提高阈值 → 精确率↑，召回率↓</li>
<li>降低阈值 → 精确率↓，召回率↑</li>
</ul>
<p>选择哪个指标更重要，取决于具体的业务场景和错误成本。</p>
<h2>3. ROC 曲线与 AUC</h2>
<h3>3.1 ROC 曲线</h3>
<p>ROC（Receiver Operating Characteristic）曲线展示了模型在不同阈值下的表现：</p>
<ul>
<li><strong>X 轴</strong>：假正率（FPR）= FP / (FP + TN)</li>
<li><strong>Y 轴</strong>：真正率（TPR）= TP / (TP + FN) = Recall</li>
</ul>
<p><strong>ROC 曲线的特点：</strong></p>
<ul>
<li>左上角越近越好</li>
<li>对角线代表随机猜测（AUC = 0.5）</li>
<li>曲线下面积越大，模型性能越好</li>
</ul>
<h3>3.2 AUC（Area Under Curve）</h3>
$$
\\text{AUC} = \\int_{0}^{1} \\text{TPR}(\\text{FPR}) \\, d(\\text{FPR})
$$
<p>AUC 的直观解释：<strong>随机选取一个正样本和一个负样本，模型给正样本打分高于负样本的概率。</strong></p>
<p><strong>AUC 值的含义：</strong></p>
<ul>
<li>AUC = 1.0：完美分类器</li>
<li>AUC > 0.9：优秀</li>
<li>AUC > 0.8：良好</li>
<li>AUC > 0.7：可接受</li>
<li>AUC = 0.5：随机猜测</li>
</ul>
<h2>4. 回归评估指标</h2>
<h3>4.1 均方误差（MSE）</h3>
$$
\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2
$$
<p>MSE 对大误差惩罚更重，但对异常值敏感。</p>
<h3>4.2 均方根误差（RMSE）</h3>
$$
\\text{RMSE} = \\sqrt{\\text{MSE}} = \\sqrt{\\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2}
$$
<p>RMSE 与原始数据单位一致，更易解释。</p>
<h3>4.3 平均绝对误差（MAE）</h3>
$$
\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |y_i - \\hat{y}_i|
$$
<p>MAE 对异常值更鲁棒，但梯度不连续。</p>
<h3>4.4 R² 决定系数</h3>
$$
R^2 = 1 - \\frac{\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^{n} (y_i - \\bar{y})^2}
$$
<p>R² 表示模型解释的方差比例：</p>
<ul>
<li>R² = 1.0：完美预测</li>
<li>R² = 0：模型等同于预测均值</li>
<li>R² < 0：模型比预测均值还差</li>
</ul>
<h2>5. 交叉验证（Cross-Validation）</h2>
<h3>5.1 为什么需要交叉验证？</h3>
<p>简单的训练集/测试集划分存在随机性问题。交叉验证通过多次划分，提供更稳健的评估。</p>
<h3>5.2 K 折交叉验证（K-Fold CV）</h3>
<p><strong>步骤：</strong></p>
<ol>
<li>将数据随机分成 K 份</li>
<li>每次用 K-1 份训练，1 份验证</li>
<li>重复 K 次，取平均性能</li>
</ol>
$$
\\text{CV Score} = \\frac{1}{K} \\sum_{k=1}^{K} \\text{Score}_k
$$
<p><strong>常用 K 值：</strong></p>
<ul>
<li>K = 5：平衡计算成本和评估稳定性</li>
<li>K = 10：更稳定但计算量更大</li>
<li>K = n（留一法）：最稳定但计算量最大</li>
</ul>
<h3>5.3 分层 K 折交叉验证（Stratified K-Fold）</h3>
<p>保持每个折中类别比例与整体一致，适用于类别不平衡的分类问题。</p>
<h3>5.4 时间序列交叉验证</h3>
<p>对于时间序列数据，必须保持时间顺序：</p>
<ul>
<li>不能使用随机划分</li>
<li>使用滚动窗口或扩展窗口</li>
</ul>
<h2>6. 实践建议</h2>
<h3>6.1 指标选择指南</h3>
<table>
<tr><th>场景</th><th>推荐指标</th><th>原因</th></tr>
<tr><td>类别平衡</td><td>Accuracy</td><td>简单直观</td></tr>
<tr><td>类别不平衡</td><td>F1, AUC</td><td>不受类别比例影响</td></tr>
<tr><td>误报代价高</td><td>Precision</td><td>关注假正例</td></tr>
<tr><td>漏报代价高</td><td>Recall</td><td>关注假负例</td></tr>
<tr><td>回归问题</td><td>RMSE, MAE</td><td>与原始单位一致</td></tr>
<tr><td>模型比较</td><td>AUC</td><td>阈值无关</td></tr>
</table>
<h3>6.2 常见陷阱</h3>
<ol>
<li><strong>数据泄露</strong>：训练集和测试集有重叠</li>
<li><strong>时间穿越</strong>：用未来数据预测过去</li>
<li><strong>过拟合评估指标</strong>：针对特定指标优化而忽视其他</li>
<li><strong>忽视置信区间</strong>：单次评估结果可能有较大波动</li>
</ol>
<h3>6.3 最佳实践</h3>
<pre><code>
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report
# 使用分层交叉验证
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=cv, scoring='f1')
print(f"F1 Score: {scores.mean():.3f} ± {scores.std():.3f}")
# 详细分类报告
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
</code></pre>
<h2>总结</h2>
<p>模型评估不是单一指标的游戏，而是多维度、多场景的综合判断：</p>
<ol>
<li><strong>理解业务场景</strong>：不同场景关注不同指标</li>
<li><strong>使用交叉验证</strong>：避免随机性带来的偏差</li>
<li><strong>多指标综合评估</strong>：不要只盯着一个数字</li>
<li><strong>关注置信区间</strong>：评估结果的稳定性同样重要</li>
</ol>
<p>掌握这些评估方法，你就能更准确地判断模型性能，做出更好的决策。</p>`,
    date: "2026.06.05 — 22:00:00",
    min: "15",
    tags: ["machine-learning", "evaluation", "metrics"],
    slug: "model-evaluation",
    label: "INCOMING SIGNAL",
    labelZh: "传入信号",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&auto=format",
  },
  {
    docId: "DOC-0002",
    cat: "ENGINEERING",
    title: "Python 文件操作与异常处理",
    excerpt: "Python 文件操作与异常处理 — open/with、文件读写模式、JSON/CSV处理、异常处理详解。",
    body: `<h2>1. 文件读写基础</h2>
<h3>1.1 open() 与关闭文件</h3>
<pre><code>
# 传统方式（容易忘记关闭）
f = open("data.txt", "r", encoding="utf-8")
content = f.read()
f.close()
# 推荐：with 上下文管理器（自动关闭）
with open("data.txt", "r", encoding="utf-8") as f:
content = f.read()
# 离开 with 块时，f.close() 自动调用
</code></pre>
<p><strong>对比 C++：</strong></p>
<table>
<tr><th>特性</th><th>Python</th><th>C++</th></tr>
<tr><td>打开文件</td><td><code>open(path, mode)</code></td><td><code>std::ifstream</code> / <code>std::ofstream</code></td></tr>
<tr><td>自动关闭</td><td><code>with</code> 语句（上下文管理器）</td><td>RAII（析构时关闭）</td></tr>
<tr><td>编码处理</td><td><code>encoding="utf-8"</code> 参数</td><td>需手动设置 locale 或转换</td></tr>
<tr><td>换行符</td><td>自动处理 <code>\\n</code></td><td><code>\\n</code> / <code>\\r\\n</code> 需手动处理</td></tr>
</table>
<h3>1.2 文件模式</h3>
<table>
<tr><th>模式</th><th>含义</th><th>文件不存在</th><th>是否清空</th></tr>
<tr><td><code>'r'</code></td><td>只读（默认）</td><td>报错</td><td>—</td></tr>
<tr><td><code>'w'</code></td><td>只写</td><td>创建新文件</td><td>✅ 清空</td></tr>
<tr><td><code>'a'</code></td><td>追加</td><td>创建新文件</td><td>❌ 保留，尾部追加</td></tr>
<tr><td><code>'x'</code></td><td>独占创建</td><td>报错（已存在时）</td><td>—</td></tr>
<tr><td><code>'r+'</code></td><td>读写</td><td>报错</td><td>❌</td></tr>
<tr><td><code>'w+'</code></td><td>读写</td><td>创建</td><td>✅ 清空</td></tr>
<tr><td><code>'a+'</code></td><td>读追加</td><td>创建</td><td>❌</td></tr>
</table>
<p><strong>带 <code>b</code> 的模式（二进制）：</strong> <code>'rb'</code>, <code>'wb'</code>, <code>'ab'</code> —— 用于图片、音频等非文本文件。</p>
<h3>1.3 读取方式</h3>
<pre><code>
# ① 全部读取
with open("data.txt", "r", encoding="utf-8") as f:
content = f.read()          # 字符串
# ② 按行读取为列表
with open("data.txt", "r", encoding="utf-8") as f:
lines = f.readlines()       # ['line1\\n', 'line2\\n', ...]
# ③ 逐行迭代（内存友好，适合大文件）
with open("data.txt", "r", encoding="utf-8") as f:
for line in f:
print(line.strip())     # strip() 去掉换行符
# ④ 读取固定字节数
with open("data.bin", "rb") as f:
chunk = f.read(1024)        # 读 1024 字节
</code></pre>
<h3>1.4 写入方式</h3>
<pre><code>
# 覆盖写入
with open("out.txt", "w", encoding="utf-8") as f:
f.write("Hello, World!\\n")
f.write("Second line\\n")
# 追加写入
with open("log.txt", "a", encoding="utf-8") as f:
f.write("New log entry\\n")
# 写入多行
lines = ["a\\n", "b\\n", "c\\n"]
with open("out.txt", "w", encoding="utf-8") as f:
f.writelines(lines)
</code></pre>
<h2>2. JSON 文件处理</h2>
<pre><code>
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
</code></pre>
<p><strong><code>json.dumps</code> 常用参数：</strong></p>
<table>
<tr><th>参数</th><th>作用</th></tr>
<tr><td><code>indent=2</code></td><td>格式化缩进</td></tr>
<tr><td><code>ensure_ascii=False</code></td><td>中文不转义为 <code>\\uXXXX</code></td></tr>
<tr><td><code>sort_keys=True</code></td><td>按键排序输出</td></tr>
</table>
<h2>3. CSV 文件处理</h2>
<h3>3.1 使用 csv 模块</h3>
<pre><code>
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
</code></pre>
<p><strong>注意：</strong> 打开 CSV 文件时必须加 <code>newline=""</code>，否则 Windows 下会多出空行。</p>
<h3>3.2 DictReader / DictWriter</h3>
<pre><code>
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
</code></pre>
<h2>4. 异常处理</h2>
<h3>4.1 try / except / else / finally</h3>
<pre><code>
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
</code></pre>
<p><strong>执行逻辑：</strong></p>
<table>
<tr><th>情况</th><th>try</th><th>except</th><th>else</th><th>finally</th></tr>
<tr><td>无异常</td><td>✅</td><td>跳过</td><td>✅</td><td>✅</td></tr>
<tr><td>有异常且捕获</td><td>✅（中断）</td><td>✅</td><td>跳过</td><td>✅</td></tr>
<tr><td>有异常未捕获</td><td>✅（中断）</td><td>跳过</td><td>跳过</td><td>✅（执行后抛出）</td></tr>
</table>
<h3>4.2 捕获多个异常</h3>
<pre><code>
try:
risky_operation()
except (ValueError, TypeError) as e:
print(f"输入错误: {e}")
except Exception as e:
print(f"其他错误: {e}")
</code></pre>
<p><strong>异常继承层次（部分）：</strong></p>
<pre><code>
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
</code></pre>
<h3>4.3 重新抛出与异常链</h3>
<pre><code>
try:
process_data()
except ValueError as e:
# 包装为业务异常，保留原始信息
raise DataProcessingError("处理失败") from e
</code></pre>
<h3>4.4 自定义异常</h3>
<pre><code>
class ValidationError(Exception):
"""自定义验证异常"""
def __init__(self, field, message):
self.field = field
self.message = message
super().__init__(f"[{field}] {message}")
# 使用
if age &lt; 0:
raise ValidationError("age", "不能为负数")
</code></pre>
<p><strong>对比 C++：</strong></p>
<table>
<tr><th>特性</th><th>Python</th><th>C++</th></tr>
<tr><td>异常基类</td><td><code>Exception</code></td><td><code>std::exception</code></td></tr>
<tr><td>捕获语法</td><td><code>except Type as e:</code></td><td><code>catch (const Type& e)</code></td></tr>
<tr><td>所有异常捕获</td><td><code>except:</code> / <code>except Exception:</code></td><td><code>catch (...)</code></td></tr>
<tr><td>finally 块</td><td><code>finally:</code></td><td>RAII + <code>catch</code> 后执行</td></tr>
<tr><td>自定义异常</td><td>继承 <code>Exception</code></td><td>继承 <code>std::exception</code></td></tr>
<tr><td>异常规范</td><td>无</td><td><code>noexcept</code>（C++11+）</td></tr>
</table>
<h3>4.5 with 语句的本质（上下文管理器）</h3>
<pre><code>
# with 等价于：
manager = open("file.txt")
manager.__enter__()
try:
f = manager.__enter__()
# 执行 with 块内的代码
finally:
manager.__exit__(*sys.exc_info())   # 关闭资源
</code></pre>
<p><strong>自定义上下文管理器：</strong></p>
<pre><code>
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
</code></pre>
<h2>5. pathlib 综合应用</h2>
<pre><code>
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
</code></pre>
<h2>练习题（25 道）</h2>
<p><strong>1. 下面代码有什么问题？</strong></p>
<pre><code>
f = open("data.txt", "r")
content = f.read()
</code></pre>
<p><strong>答案：</strong> 没有关闭文件。如果后面代码抛出异常，<code>f.close()</code> 永远不会执行，造成资源泄漏。应使用 <code>with</code> 语句。</p>
<p><strong>2. <code>'w'</code> 模式和 <code>'a'</code> 模式的区别？</strong></p>
<p><strong>答案：</strong></p>
<ul>
<li><code>'w'</code>：写入模式，<strong>会清空</strong>已有内容</li>
<li><code>'a'</code>：追加模式，<strong>保留</strong>已有内容，在末尾追加</li>
</ul>
<p><strong>3. <code>newline=""</code> 在打开 CSV 文件时为什么重要？</strong></p>
<p><strong>答案：</strong> Windows 下文本模式的换行符转换会导致 CSV 写入时多出空行。<code>newline=""</code> 禁用自动转换，保证 <code>\\n</code> 原样写入。</p>
<p><strong>4. 逐行读取大文件的最佳方式是什么？</strong></p>
<p><strong>答案：</strong></p>
<pre><code>
with open("big.txt", "r", encoding="utf-8") as f:
for line in f:           # 迭代文件对象，内存友好
process(line)
</code></pre>
<p>不要用 <code>readlines()</code>，它会一次性把所有行读入内存。</p>
<p><strong>5. <code>json.dump</code> 和 <code>json.dumps</code> 的区别？</strong></p>
<p><strong>答案：</strong></p>
<ul>
<li><code>json.dump(obj, fp)</code> → 写入<strong>文件对象</strong></li>
<li><code>json.dumps(obj)</code> → 返回<strong>字符串</strong></li>
</ul>
<p><strong>6. 如何用 <code>DictReader</code> 读取 CSV 并访问 <code>"name"</code> 列？</strong></p>
<p><strong>答案：</strong></p>
<pre><code>
import csv
with open("data.csv", newline="") as f:
reader = csv.DictReader(f)
for row in reader:
print(row["name"])
</code></pre>
<p><strong>7. <code>try/except/else/finally</code> 中，<code>else</code> 什么时候执行？</strong></p>
<p><strong>答案：</strong> <code>try</code> 块<strong>没有发生异常</strong>时执行。如果有异常，跳过 <code>else</code> 直接进 <code>except</code>。</p>
<p><strong>8. <code>finally</code> 块什么时候</strong>不<strong>执行？</strong></p>
<p><strong>答案：</strong> 几乎总是执行，除非：</p>
<ul>
<li>程序被强制终止（<code>os._exit()</code>）</li>
<li>发生未处理的系统级错误</li>
</ul>
<p>即使 <code>try</code> 或 <code>except</code> 中有 <code>return</code>，<code>finally</code> 也会在返回前执行。</p>
<p><strong>9. 下面代码输出什么？</strong></p>
<pre><code>
def test():
try:
return "try"
finally:
print("finally")
print(test())
</code></pre>
<p><strong>答案：</strong></p>
<pre><code>
finally
try
</code></pre>
<ul>
<li><code>finally</code> 在 <code>return</code> 之前执行</li>
</ul>
<p><strong>10. 捕获所有异常的写法？推荐吗？</strong></p>
<p><strong>答案：</strong></p>
<pre><code>
try:
...
except Exception as e:    # 推荐
...
</code></pre>
<pre><code>
except:                   # 不推荐（也捕获 SystemExit、KeyboardInterrupt）
...
</code></pre>
<p><strong>11. 自定义异常为什么要继承 <code>Exception</code> 而不是 <code>BaseException</code>？</strong></p>
<p><strong>答案：</strong> <code>BaseException</code> 包含 <code>SystemExit</code> 和 <code>KeyboardInterrupt</code>。继承它会导致 <code>except</code> 错误地捕获程序退出和用户中断信号。</p>
<p><strong>12. <code>raise ... from ...</code> 的作用？</strong></p>
<p><strong>答案：</strong> 创建<strong>异常链</strong>，保留原始异常信息。</p>
<pre><code>
try:
int("abc")
except ValueError as e:
raise RuntimeError("转换失败") from e
</code></pre>
<p>输出显示：<code>RuntimeError: 转换失败</code> → <code>caused by ValueError: ...</code></p>
<p><strong>13. 上下文管理器的两个特殊方法是什么？</strong></p>
<p><strong>答案：</strong> <code>__enter__()</code> 和 <code>__exit__(exc_type, exc_val, exc_tb)</code></p>
<p><strong>14. <code>with</code> 语句能同时管理多个资源吗？</strong></p>
<p><strong>答案：</strong> 可以。</p>
<pre><code>
with open("a.txt") as f1, open("b.txt") as f2:
...
</code></pre>
<p><strong>15. 如何用 <code>pathlib</code> 递归查找所有 <code>.py</code> 文件？</strong></p>
<p><strong>答案：</strong></p>
<pre><code>
from pathlib import Path
for py_file in Path("src").rglob("*.py"):
print(py_file)
</code></pre>
<p><strong>16. 读取二进制文件和文本文件的区别？</strong></p>
<p><strong>答案：</strong></p>
<ul>
<li>文本：<code>open("f.txt", "r", encoding="utf-8")</code> → 返回字符串</li>
<li>二进制：<code>open("f.bin", "rb")</code> → 返回 <code>bytes</code> 对象</li>
</ul>
<p><strong>17. <code>csv.writer</code> 写入列表和写入字典的方法名？</strong></p>
<p><strong>答案：</strong></p>
<ul>
<li><code>writerow([...])</code> / <code>writerows([[...], [...]])</code> — 列表模式</li>
<li><code>writerow({"key": val})</code> — <code>DictWriter</code> 的字典模式</li>
</ul>
<p><strong>18. 如何安全地创建嵌套目录？</strong></p>
<p><strong>答案：</strong></p>
<pre><code>
from pathlib import Path
Path("a/b/c").mkdir(parents=True, exist_ok=True)
</code></pre>
<p><strong>19. <code>json.dumps</code> 的 <code>ensure_ascii=False</code> 有什么作用？</strong></p>
<p><strong>答案：</strong> 禁用 ASCII 转义，让中文字符直接输出为 <code>"中文"</code> 而不是 <code>"\\u4e2d\\u6587"</code>。</p>
<p><strong>20. <code>FileNotFoundError</code> 继承自哪个类？</strong></p>
<p><strong>答案：</strong> <code>OSError</code> → <code>Exception</code> → <code>BaseException</code></p>
<pre><code>
print(FileNotFoundError.__mro__)
# (&lt;class 'FileNotFoundError'>, &lt;class 'OSError'>, &lt;class 'Exception'>, &lt;class 'BaseException'>, &lt;class 'object'>)
</code></pre>
<p><strong>21. 下面代码有什么问题？</strong></p>
<pre><code>
try:
f = open("a.txt")
data = f.read()
except FileNotFoundError:
print("找不到")
f.close()
</code></pre>
<p><strong>答案：</strong> 如果 <code>open</code> 失败，<code>f</code> 未定义，<code>f.close()</code> 会报 <code>NameError</code>。应使用 <code>with</code> 语句或在 <code>except</code> 和 <code>else</code> 中分别处理。</p>
<p><strong>22. 写一个上下文管理器，在进入时打印 "Start"，退出时打印 "End"。</strong></p>
<p><strong>答案：</strong></p>
<pre><code>
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
</code></pre>
<p><strong>23. 如何用 <code>pathlib</code> 读取文件全部内容？</strong></p>
<p><strong>答案：</strong></p>
<pre><code>
from pathlib import Path
content = Path("data.txt").read_text(encoding="utf-8")
</code></pre>
<p><strong>24. <code>csv.DictWriter</code> 必须先调用什么方法？</strong></p>
<p><strong>答案：</strong> <code>writeheader()</code>，写入表头行。</p>
<p><strong>25. 综合题：写一个函数，安全地读取 JSON 文件，处理所有可能的异常，返回字典。</strong></p>
<p><strong>答案：</strong></p>
<pre><code>
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
</code></pre>
<h2>核心记忆卡片</h2>
<ol>
<li><strong><code>with open(...) as f</code></strong> 是标准写法，自动调用 <code>f.close()</code>，防止资源泄漏</li>
<li><strong>文件模式：</strong> <code>r</code> 读、<code>w</code> 覆盖写、<code>a</code> 追加、<code>x</code> 独占创建、<code>b</code> 二进制</li>
<li><strong>大文件用 <code>for line in f</code></strong> 逐行迭代，不要用 <code>readlines()</code></li>
<li><strong>CSV 必须加 <code>newline=""</code></strong>，否则 Windows 下多空行</li>
<li><strong><code>json.dumps</code></strong> 返回字符串，<code>json.dump</code> 写文件；<code>ensure_ascii=False</code> 保中文</li>
<li><strong><code>csv.DictReader</code></strong> 把每行读成字典，<code>DictWriter</code> 先 <code>writeheader()</code></li>
<li><strong><code>try/except/else/finally</code></strong>：else=无异常时执行，finally=总是执行</li>
<li><strong>自定义异常</strong>继承 <code>Exception</code>，不要继承 <code>BaseException</code></li>
<li><strong><code>raise ... from ...</code></strong> 创建异常链，保留原始错误信息</li>
<li><strong>上下文管理器</strong>实现 <code>__enter__</code> 和 <code>__exit__</code>，<code>with</code> 语句自动调用</li>
</ol>
<h2>相关链接</h2>
<ul>
<li>[[Python模块与包]] ⬅️ 上一节：模块与包管理</li>
<li>[[Phase 1 - Python 基础]]：Phase 1 任务清单</li>
<li>[[Python学习路线]]：完整 Python 学习路线图</li>
</ul>`,
    date: "2026.06.06 — 01:18:56",
    min: "5",
    tags: ["[Python, \u6587\u4ef6\u64cd\u4f5c, \u5f02\u5e38\u5904\u7406, with, JSON, CSV, Phase-1]"],
    slug: "python-file-exception",
    label: "LATEST TRANSMISSION",
    labelZh: "最新传输",
  },
  {
    docId: "DOC-0003",
    cat: "ENGINEERING",
    title: "正则表达式（Regex）使用指南",
    excerpt: "A practical guide to regular expressions — syntax reference, real-world examples, best practices, and cross-engine compatibility notes.",
    body: `<p>正则表达式（Regular Expression）是一种用于<strong>匹配、查找、替换、提取</strong>文本的强大模式语言。掌握它可大幅提升数据处理、日志分析、代码重构与自动化脚本的效率。</p>
<h2>🔍 1. 核心语法速查表</h2>
<h3>1.1 元字符（Metacharacters）</h3>
<table>
<tr><th>符号</th><th>含义</th><th>示例</th></tr>
<tr><td><code>.</code></td><td>匹配任意单个字符（除换行符）</td><td><code>a.c</code> → <code>abc</code>, <code>a c</code></td></tr>
<tr><td><code>\\d</code></td><td>数字 <code>[0-9]</code></td><td><code>\\d{3}</code> → <code>123</code></td></tr>
<tr><td><code>\\w</code></td><td>单词字符 <code>[a-zA-Z0-9_]</code></td><td><code>\\w+</code> → <code>hello_123</code></td></tr>
<tr><td><code>\\s</code></td><td>空白字符（空格、制表、换行等）</td><td><code>a\\s+b</code> → <code>a   b</code></td></tr>
<tr><td><code>^</code></td><td>字符串开头</td><td><code>^abc</code> → 仅匹配开头的 <code>abc</code></td></tr>
<tr><td><code>$</code></td><td>字符串结尾</td><td><code>xyz$</code> → 仅匹配结尾的 <code>xyz</code></td></tr>
<tr><td><code>\\</code></td><td>转义字符</td><td><code>\\.</code> 匹配真实点号</td></tr>
</table>
<h3>1.2 字符类（Character Classes）</h3>
<table>
<tr><th>语法</th><th>含义</th></tr>
<tr><td><code>[abc]</code></td><td>匹配 <code>a</code>、<code>b</code> 或 <code>c</code></td></tr>
<tr><td><code>[^abc]</code></td><td>匹配<strong>非</strong> <code>a</code>、<code>b</code>、<code>c</code> 的字符</td></tr>
<tr><td><code>[a-z]</code> / <code>[0-9]</code></td><td>范围匹配</td></tr>
<tr><td><code>\\D</code> / <code>\\W</code> / <code>\\S</code></td><td><code>\\d</code>/<code>\\w</code>/<code>\\s</code> 的反义</td></tr>
</table>
<h3>1.3 量词（Quantifiers）</h3>
<table>
<tr><th>符号</th><th>含义</th><th>贪婪/非贪婪</th></tr>
<tr><td><code>*</code></td><td>0 次或多次</td><td><code>*?</code> 非贪婪</td></tr>
<tr><td><code>+</code></td><td>1 次或多次</td><td><code>+?</code> 非贪婪</td></tr>
<tr><td><code>?</code></td><td>0 次或 1 次</td><td><code>??</code> 非贪婪</td></tr>
<tr><td><code>{n}</code></td><td>恰好 n 次</td><td></td></tr>
<tr><td><code>{n,}</code></td><td>至少 n 次</td><td></td></tr>
<tr><td><code>{n,m}</code></td><td>n 到 m 次</td><td></td></tr>
</table>
<blockquote>💡 <strong>贪婪 vs 非贪婪</strong>：默认贪婪（尽可能多匹配），加 <code>?</code> 变为非贪婪（尽可能少匹配）。例：<code><.*></code> 匹配 <code><div>text</div></code> 整个字符串；<code><.*?></code> 仅匹配 <code><div></code>。</blockquote>
<h3>1.4 分组与捕获</h3>
<table>
<tr><th>语法</th><th>含义</th></tr>
<tr><td><code>(abc)</code></td><td>捕获组，可通过 <code>$1</code>、<code>\\1</code> 引用</td></tr>
<tr><td><code>(?:abc)</code></td><td>非捕获组（不保存匹配结果，提升性能）</td></tr>
<tr><td><code>(?<name>abc)</code></td><td>命名捕获组（部分引擎支持）</td></tr>
<tr><td><code>\\1</code> / <code>$1</code></td><td>引用第 1 个捕获组的内容</td></tr>
</table>
<h3>1.5 断言 / 环视（Lookarounds）</h3>
<table>
<tr><th>语法</th><th>含义</th><th>示例</th></tr>
<tr><td><code>(?=abc)</code></td><td>正向先行断言：后面必须是 <code>abc</code></td><td><code>foo(?=bar)</code> → 匹配 <code>foo</code>（仅当后面是 <code>bar</code>）</td></tr>
<tr><td><code>(?!abc)</code></td><td>负向先行断言：后面不能是 <code>abc</code></td><td><code>foo(?!bar)</code></td></tr>
<tr><td><code>(?<=abc)</code></td><td>正向后行断言：前面必须是 <code>abc</code></td><td><code>(?<=@)gmail</code> → 匹配 <code>@gmail</code> 中的 <code>gmail</code></td></tr>
<tr><td><code>(?<!abc)</code></td><td>负向后行断言：前面不能是 <code>abc</code></td><td><code>(?<!\\$)\\d+</code> → 匹配非美元符号后的数字</td></tr>
</table>
<blockquote>⚠️ 后行断言 <code>(?<=)</code> / <code>(?<!)</code> 在 JavaScript (ES2018+)、Python、PCRE 中支持，旧版引擎可能报错。</blockquote>
<h2>🛠 2. 常用修饰符（Flags）</h2>
<table>
<tr><th>标志</th><th>含义</th><th>适用场景</th></tr>
<tr><td><code>i</code></td><td>忽略大小写</td><td><code>/abc/i</code> 匹配 <code>ABC</code>、<code>Abc</code></td></tr>
<tr><td><code>g</code></td><td>全局匹配</td><td>查找所有匹配项而非仅第一个</td></tr>
<tr><td><code>m</code></td><td>多行模式</td><td><code>^</code> 和 <code>$</code> 匹配每行开头/结尾</td></tr>
<tr><td><code>s</code></td><td>单行模式（DotAll）</td><td><code>.</code> 可匹配换行符 <code>\\n</code></td></tr>
<tr><td><code>u</code></td><td>Unicode 模式</td><td>正确处理 emoji、多字节字符</td></tr>
</table>
<h2>📝 3. 实战示例</h2>
<table>
<tr><th>需求</th><th>正则表达式</th><th>说明</th><th></th><th></th><th></th><th></th></tr>
<tr><td>中国大陆手机号</td><td><code>^1[3-9]\\d{9}$</code></td><td>11位，首位1，第二位3-9</td><td></td><td></td><td></td><td></td></tr>
<tr><td>邮箱（实用版）</td><td><code>^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$</code></td><td>覆盖99%常见邮箱，RFC5322完整规则极复杂</td><td></td><td></td><td></td><td></td></tr>
<tr><td>强密码（≥8位，含大小写+数字）</td><td><code>^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$</code></td><td>使用先行断言组合校验</td><td></td><td></td><td></td><td></td></tr>
<tr><td>提取 HTML 标签内容</td><td><code><([a-z]+)[^>]*>(.*?)</\\1></code></td><td><code>\\1</code> 反向引用闭合标签，<code>.*?</code> 防贪婪</td><td></td><td></td><td></td><td></td></tr>
<tr><td>匹配 IPv4 地址</td><td>\`\\b(?:(?:25[0-5]</td><td>2[0-4]\\d</td><td>[01]?\\d\\d?)\\.){3}(?:25[0-5]</td><td>2[0-4]\\d</td><td>[01]?\\d\\d?)\\b\`</td><td>精确范围校验，避免 <code>999.999.999.999</code></td></tr>
</table>
<h2>🚫 4. 最佳实践与避坑指南</h2>
<ol>
<li><strong>避免灾难性回溯（Catastrophic Backtracking）</strong><br>❌ <code>(a+)+b</code> 在长字符串 <code>aaaaaaaa...</code> 上会指数级卡顿。<br>✅ 改用具体字符类或原子组：<code>[a]+b</code> 或 <code>(?>a+)b</code>（PCRE/Java支持）。</li>
</ol>
<ol>
<li><strong>明确使用锚点</strong><br>验证类正则务必加 <code>^</code> 和 <code>$</code>，否则 <code>abc</code> 会匹配 <code>xabc y</code>。</li>
</ol>
<ol>
<li><strong>优先非捕获组 <code>(?:)</code></strong><br>不需要提取内容时，用 <code>(?:)</code> 替代 <code>()</code>，减少内存开销。</li>
</ol>
<ol>
<li><strong>复杂逻辑拆分为多步</strong><br>不要试图用一个正则解决所有问题。先用正则粗筛，再用代码精处理。</li>
</ol>
<ol>
<li><strong>注意代码中的转义</strong><br>在字符串中写正则需双转义：<code>"\\\\d+\\\\s*"</code>（Python/JS），或使用原始字符串 <code>r"\\d+\\s*"</code>（Python）。</li>
</ol>
<h2>🧪 5. 推荐测试工具</h2>
<table>
<tr><th>工具</th><th>特点</th></tr>
<tr><td><a href="https://regex101.com/" target="_blank">Regex101</a></td><td>支持 PCRE/JS/Python 引擎，实时解释、高亮、生成代码</td></tr>
<tr><td><a href="https://regexr.com/" target="_blank">RegExr</a></td><td>界面简洁，支持离线使用</td></tr>
<tr><td>VS Code / JetBrains</td><td>内置正则搜索替换（<code>Ctrl+H</code> 开启 <code>.*</code> 按钮）</td></tr>
<tr><td>命令行</td><td><code>grep -P</code>、<code>sed -E</code>、<code>awk</code> 支持正则</td></tr>
</table>
<h2>📓 6. 在 Obsidian 中的使用技巧</h2>
<p>Obsidian 的搜索与替换默认使用 <strong>JavaScript 正则引擎</strong>：</p>
<ul>
<li>🔍 <strong>全局搜索</strong>：<code>Ctrl/Cmd + Shift + F</code> → 点击 <code>.*</code> 图标启用正则</li>
<li>🔄 <strong>替换语法</strong>：查找 <code>^# (.+)$</code>，替换 <code>## $1</code> 可将一级标题批量转二级</li>
<li>📊 <strong>Dataview 查询</strong>：支持 <code>regexmatch()</code> 函数过滤文件</li>
<li>🧩 <strong>Templater 脚本</strong>：可用 <code>tp.file.content.replace(/pattern/g, "replacement")</code> 自动化处理</li>
</ul>
<blockquote>💡 Obsidian 不支持后行断言 <code>(?<=)</code> 的旧版本引擎，若需复杂环视，建议先用外部工具处理再导入。</blockquote>
<h2>🌐 附录：常见引擎差异速览</h2>
<table>
<tr><th>特性</th><th>JavaScript</th><th>Python (<code>re</code>)</th><th>PCRE (PHP/grep)</th><th>Java</th></tr>
<tr><td>后行断言 <code>(?<=)</code></td><td>✅ ES2018+</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>命名捕获 <code>(?<name>)</code></td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>原子组 <code>(?>)</code></td><td>❌</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>占有量词 <code>++</code>/<code>*+</code></td><td>❌</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>Unicode 属性 <code>\\p{L}</code></td><td>✅ (u标志)</td><td>✅</td><td>✅</td><td>✅</td></tr>
</table>
<p>📌 <strong>学习建议</strong>：正则不是“背”出来的，而是“练”出来的。遇到需求时，先拆解目标文本结构，再逐步拼接模式，配合 Regex101 实时调试，1~2 周即可熟练上手。</p>
<p>需要针对某个具体场景（如日志解析、Markdown 批量替换、数据清洗）定制正则模板，可告诉我你的原始文本与目标格式，我为你生成并逐段解释。</p>`,
    date: "2026.06.05 — 21:00:00",
    min: "7",
    tags: ["regex", "tools", "programming"],
    slug: "regex-guide",
    label: "LATEST TRANSMISSION",
    labelZh: "最新传输",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop&auto=format",
  },
];

export const SITE = {
  name: "PHRASOIC LAB",
  tagline: "Research & Records",
  description: "个人知识库 · 设计笔记 · 技术档案",
  entries: POSTS.length,
  since: "2021.03",
  words: "~92K",
};
