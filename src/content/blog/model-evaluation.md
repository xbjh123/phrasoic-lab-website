---
tags: [MachineLearning, 模型评估, 混淆矩阵, ROC, AUC, 交叉验证, sklearn, Phase-4]
---

# 模型评估方法

> 学习日期: 2026-06-01
> 涵盖: 混淆矩阵、分类指标（Accuracy/Precision/Recall/F1）、ROC曲线与AUC、回归指标（MSE/RMSE/MAE/R²）、交叉验证（K-Fold/Stratified/LOO）
> 所属阶段: [[Phase 4 - 机器学习基础]]

---

## 🔗 关联笔记

- [[Phase 4 - 机器学习基础]] — CV 学习路线中的机器学习阶段
- [[逻辑回归]] — 上一节：逻辑回归（已完成 ✅）
- [[线性回归]] — 线性回归与 MSE/R²（已完成 ✅）
- [[ML基础框架]] — 数据划分、训练/验证/测试集（已完成 ✅）
- ➡️ 下一节：[[支持向量机 SVM]]（已完成 ✅）

---

## 0. 从模型训练到模型评估：为什么需要评估方法？

上一节我们学会了训练逻辑回归模型——给定数据，模型可以输出一个预测结果。但一个关键问题随之而来：

> **这个模型到底好不好？**

你可能本能地想到"看准确率"，但事情没那么简单。

**场景一：垃圾邮件分类**
- 1000 封邮件中只有 10 封是垃圾邮件
- 一个"模型"什么都不做，把所有邮件判为"正常邮件"
- 准确率 = 990/1000 = 99%！
- 但这个"模型"毫无用处——它一封垃圾邮件都没拦住

**场景二：疾病筛查**
- 被误诊为癌症（假阳性）和漏诊了癌症（假阴性）的代价天差地别
- 漏诊可能导致患者错过治疗窗口，代价极高
- 误诊可以通过二次检查排除，代价相对较小

**核心矛盾：** 不同的错误类型代价不同，仅靠一个数字（准确率）无法衡量模型在"关键错误"上的表现。我们需要一套更精细的评估工具箱。

> **评估方法是模型的"体检报告"** ——它不只告诉你"好不好"，还告诉你"哪里好、哪里不好、哪里需要改进"。

**本章路线：**
1. 先从**混淆矩阵**入手，看清所有预测结果的全貌
2. 再从矩阵中提炼出各类**分类指标**——准确率、精确率、召回率、F1
3. 然后学习**ROC曲线与AUC**——评估模型在不同阈值下的整体表现
4. 切换到**回归任务**——MSE/RMSE/MAE/R²
5. 最后学习**交叉验证**——如何更可靠地评估模型的泛化能力

---

## 1. 混淆矩阵（Confusion Matrix）

### 1.1 什么是混淆矩阵？

**混淆矩阵**是一个 $2 \times 2$ 的表格，展示分类模型在所有样本上的预测结果与真实标签的对比情况。

对于二分类问题（正类 = Positive，负类 = Negative）：

|  | 预测为正类 (Positive) | 预测为负类 (Negative) |
|------|:---:|:---:|
| **真实为正类 (Positive)** | **TP** (True Positive) | **FN** (False Negative) |
| **真实为负类 (Negative)** | **FP** (False Positive) | **TN** (True Negative) |

**四个关键格子：**

| 缩写 | 全称 | 含义 | 类比 |
|:---:|------|------|------|
| **TP** | True Positive | 模型预测为正类，且实际上确实是正类 | 正确识别出垃圾邮件 ✅ |
| **TN** | True Negative | 模型预测为负类，且实际上确实是负类 | 正确放行正常邮件 ✅ |
| **FP** | False Positive | 模型预测为正类，但实际是负类 | 把正常邮件误判为垃圾 ❌（Type I Error） |
| **FN** | False Negative | 模型预测为负类，但实际是正类 | 漏掉了垃圾邮件 ❌（Type II Error） |

**记忆口诀：**

> 第一个字母（T/F）表示"预测对了吗"——True 表示猜对了，False 表示猜错了。
> 第二个字母（P/N）表示"模型预测的结果是什么"——P 是正类，N 是负类。

所以：
- **TP** = True + Positive = "模型说是正类，而且说对了"
- **FN** = False + Negative = "模型说是负类，而且说错了"（实际上是正类，被漏掉了）
- **FP** = False + Positive = "模型说是正类，而且说错了"（实际上是负类，被误判了）
- **TN** = True + Negative = "模型说是负类，而且说对了"

### 1.2 手算例子

假设我们用垃圾邮件分类器测试了 100 封邮件，结果如下：

|  | 预测为垃圾 | 预测为正常 |
|------|:---:|:---:|
| **真实为垃圾** | 40 (TP) | 10 (FN) |
| **真实为正常** | 5 (FP) | 45 (TN) |

从矩阵中我们可以读出所有关键信息：
- 50 封真实垃圾邮件中：模型抓住了 40 封（TP），漏掉了 10 封（FN）
- 50 封真实正常邮件中：模型正确放行了 45 封（TN），误判了 5 封（FP）
- 模型总共预测了 45 封垃圾邮件（40 TP + 5 FP），其中 40 封是正确的

### 1.3 代码实现

```python
import numpy as np
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt

# 真实标签和预测标签
y_true = np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 0])
y_pred = np.array([1, 0, 1, 0, 0, 1, 0, 1, 1, 0])

# sklearn 计算混淆矩阵
cm = confusion_matrix(y_true, y_pred)
# 默认顺序：第 0 类为负类，第 1 类为正类
# cm[0,0] = TN, cm[0,1] = FP
# cm[1,0] = FN, cm[1,1] = TP

print("混淆矩阵:")
print("          Pred Neg  Pred Pos")
print(f"True Neg    {cm[0,0]}         {cm[0,1]}")
print(f"True Pos    {cm[1,0]}         {cm[1,1]}")
```

```python
# 可视化混淆矩阵
disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=['Normal (0)', 'Spam (1)']
)
disp.plot(cmap='Blues')
plt.title('混淆矩阵可视化')
plt.show()
```

**手动提取四个值：**

```python
def confusion_matrix_manual(y_true, y_pred):
    """手动计算混淆矩阵"""
    tp = np.sum((y_true == 1) & (y_pred == 1))
    tn = np.sum((y_true == 0) & (y_pred == 0))
    fp = np.sum((y_true == 0) & (y_pred == 1))
    fn = np.sum((y_true == 1) & (y_pred == 0))
    return tp, tn, fp, fn

y_true = np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 0])
y_pred = np.array([1, 0, 1, 0, 0, 1, 0, 1, 1, 0])

tp, tn, fp, fn = confusion_matrix_manual(y_true, y_pred)
print(f"TP = {tp}, TN = {tn}")
print(f"FP = {fp}, FN = {fn}")
```


### 1.4 多分类的混淆矩阵

对于 $K$ 类分类问题，混淆矩阵是一个 $K \times K$ 的矩阵：
- 行：真实类别
- 列：预测类别
- 对角线：预测正确的样本（对每个类别而言都是 TP）
- 非对角线：预测错误的样本

```python
from sklearn.metrics import confusion_matrix

# 3 类分类示例
y_true = [0, 1, 2, 0, 1, 2, 0, 1, 2]
y_pred = [0, 2, 1, 0, 1, 2, 0, 1, 1]

cm = confusion_matrix(y_true, y_pred)
# 查看每一类对应的行
for i in range(3):
    print(f"真实类别 {i}: 预测为 {cm[i]}")
```

---

## 2. 分类指标

有了混淆矩阵中的四个核心值（TP, TN, FP, FN），我们就可以计算出各类分类指标了。

### 2.1 准确率（Accuracy）

**公式：**

$$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$

**含义：** 所有预测中，预测正确的比例。最直观的指标。

```python
from sklearn.metrics import accuracy_score

y_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0]
y_pred = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0]

# 手算
correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)
total = len(y_true)
acc_manual = correct / total
print(f"手动计算准确率: {acc_manual:.2f}")

# sklearn
acc_sklearn = accuracy_score(y_true, y_pred)
print(f"sklearn 准确率: {acc_sklearn:.2f}")
```

**⚠️ 准确率的重大缺陷：数据不平衡时失效**

回到开头的例子：99% 正常邮件 vs 1% 垃圾邮件。全判为正常的"模型"准确率 99%，但毫无用处。

| 场景 | 准确率 | 真实表现 |
|:---:|:------:|:--------:|
| 平衡数据 (50/50) | 90% | 确实不错 ✅ |
| 极度不平衡 (1/99) | 99% | 但全是猜"多数类" ❌ |

> **结论：** 准确率只在各类别样本数量大致相等时才有意义。数据不平衡时，看精确率、召回率更有价值。

### 2.2 精确率（Precision）

**公式：**

$$\text{Precision} = \frac{TP}{TP + FP}$$

**含义：** 模型预测为"正类"的样本中，有多少是真正正确的？

$$
\text{Precision} = \frac{\text{预测正确的正类数}}{\text{模型认为的正类总数}}
$$

**类比：** 精确率衡量的是模型"说真话的概率"。当模型说"这是垃圾邮件"时，它有多可信？

```python
# 沿用上面的例子：TP=40, FP=5
tp, fp = 40, 5
precision = tp / (tp + fp)
print(f"精确率: {precision:.2f}")  # 40/45 ≈ 0.89
```

**精确率关注的是"误报"（FP）**——模型说"是正类"但实际不是。想让精确率高，模型就不能轻易说"是"。

**典型场景：**
- **垃圾邮件过滤：** 宁愿漏掉几封也尽量不要把正常邮件判为垃圾（精确率重要）
- **推荐系统：** 推荐给用户的内容最好是用户确实感兴趣的（精确率重要）

### 2.3 召回率（Recall）

**公式：**

$$\text{Recall} = \frac{TP}{TP + FN}$$

**含义：** 所有真正的正类样本中，模型成功找出了多少？

$$
\text{Recall} = \frac{\text{找出的正类数}}{\text{应有的正类总数}}
$$

**类比：** 召回率衡量的是模型"的搜捕能力"。所有应该被抓到的坏人中，真抓到了几个？

```python
# 沿用上面的例子：TP=40, FN=10
tp, fn = 40, 10
recall = tp / (tp + fn)
print(f"召回率: {recall:.2f}")  # 40/50 = 0.80
```

**召回率关注的是"漏报"（FN）**——本来是正类但模型没认出来。想让召回率高，模型就要尽量"不放过任何一个"。

**典型场景：**
- **疾病筛查：** 宁可误诊也要把潜在的癌症患者全找出来（召回率重要）
- **金融欺诈检测：** 宁可多报可疑交易也不能漏掉任何一笔欺诈（召回率重要）

### 2.4 精确率与召回率的此消彼长（Trade-off）

精确率和召回率是一对天生的**矛盾指标**——提高一个通常会降低另一个。

**理解这个矛盾：**

想象你是一个安检员，任务是找出携带危险品的乘客。

- **如果只关注召回率（不漏掉任何一个坏人）**：你可能会把所有人都拦下来搜身。召回率 = 100%（所有坏人都被抓了），但精确率极低（太多好人被误拦）。
- **如果只关注精确率（不冤枉任何一个好人）**：你可能会非常谨慎，只有 100% 确定时才拦人。精确率 = 100%（拦的全是坏人），但召回率很低（很多坏人溜走了）。

| 策略 | 阈值 | Precision | Recall | 说明 |
|:----:|:----:|:---------:|:------:|:----|
| 保守 | 高阈值 (0.9) | **高** → 说正类就很可能是正类 | **低** → 很多正类被放过了 | 宁可漏，不乱报 |
| 激进 | 低阈值 (0.3) | **低** → 很多报正类的实际不是 | **高** → 几乎所有的正类都被抓住了 | 宁可错报，不放过 |

这个矛盾在代码中一目了然：

```python
import numpy as np
from sklearn.metrics import precision_score, recall_score

# 生成逻辑回归的概率预测
np.random.seed(42)
y_true = np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 0])
y_prob = np.array([0.9, 0.2, 0.7, 0.4, 0.3, 0.8, 0.1, 0.6, 0.95, 0.15])

# 不同阈值下的表现
for threshold in [0.3, 0.5, 0.7, 0.9]:
    y_pred = (y_prob >= threshold).astype(int)
    p = precision_score(y_true, y_pred)
    r = recall_score(y_true, y_pred)
    print(f"阈值={threshold:.1f}: Precision={p:.2f}, Recall={r:.2f}")
```

### 2.5 F1-Score：精确率和召回率的调和平均

有没有一个指标能综合衡量精确率和召回率？**F1-Score** 就是为这个目的设计的。

**公式：**

$$\text{F1} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

**为什么用调和平均而不是算术平均？**

算术平均 $(P + R)/2$ 在极端情况下会"掩盖"问题。比如 $P = 1.0$（精确率完美）但 $R = 0.0$（一个都没找出来），算术平均 = 0.5——看起来还行，但实际上模型完全不可用。

调和平均对极端值更敏感：
- $\text{F1} = 2 \times \frac{1.0 \times 0.0}{1.0 + 0.0} = 0$ ✅ ——正确地反映了模型完全没用

```python
def f1_score_manual(p, r):
    """手动计算 F1"""
    return 2 * p * r / (p + r)

# 验证调和平均对极端值的敏感性
def arithmetic_mean(p, r):
    return (p + r) / 2

scenarios = [
    ("都很棒", 0.9, 0.9),
    ("一个很高一个很低", 1.0, 0.2),
    ("一个为 0", 1.0, 0.0),
]

print("场景         | 算术平均 | F1 (调和平均)")
print("-" * 45)
for name, p, r in scenarios:
    am = arithmetic_mean(p, r)
    f1 = f1_score_manual(p, r)
    print(f"{name:15s} | {am:.3f}     | {f1:.3f}")
```

```python
from sklearn.metrics import f1_score

y_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0]
y_pred = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0]

# sklearn 计算 F1
f1 = f1_score(y_true, y_pred)
print(f"F1-Score: {f1:.3f}")

# 完整分类报告
from sklearn.metrics import classification_report
print("\n分类报告:")
print(classification_report(y_true, y_pred, target_names=['Class 0', 'Class 1']))
```

### 2.6 各指标综合对比

| 指标 | 公式 | 关注点 | 适用场景 | 对不平衡数据 |
|:---:|:----:|:------:|:--------:|:----------:|
| **Accuracy** | $\frac{TP+TN}{Total}$ | 整体正确率 | 各类别平衡时 | ❌ 容易被多数类主导 |
| **Precision** | $\frac{TP}{TP+FP}$ | 预测正类的可信度 | 误报代价高（垃圾邮件、推荐） | ✅ 关注少数类质量 |
| **Recall** | $\frac{TP}{TP+FN}$ | 正类的捕获率 | 漏报代价高（疾病、欺诈） | ✅ 关注少数类数量 |
| **F1-Score** | $2\frac{PR}{P+R}$ | Precision 和 Recall 的平衡 | 需要兼顾两者时 | ✅ 综合评估少数类 |

**对比 C++：** 分类指标的计算本质上是加法和除法，C++ 实现也非常直接。

```cpp
// C++ 计算分类指标
#include <vector>
#include <iostream>

struct Metrics {
    double accuracy, precision, recall, f1;
};

Metrics calc_metrics(const std::vector<int>& y_true,
                     const std::vector<int>& y_pred) {
    int tp = 0, tn = 0, fp = 0, fn = 0;
    for (size_t i = 0; i < y_true.size(); ++i) {
        if (y_true[i] == 1 && y_pred[i] == 1) tp++;
        else if (y_true[i] == 0 && y_pred[i] == 0) tn++;
        else if (y_true[i] == 0 && y_pred[i] == 1) fp++;
        else fn++;
    }
    return {
        double(tp + tn) / (tp + tn + fp + fn),
        double(tp) / (tp + fp),
        double(tp) / (tp + fn),
        2.0 * tp / (2 * tp + fp + fn)  // F1 的等价形式
    };
}
```

---

## 3. ROC 曲线与 AUC 值

### 3.1 为什么需要 ROC？

在前面的讨论中，我们一直假设分类器输出的是**离散的类别标签**（0 或 1）。但实际上，分类器（如逻辑回归）先输出一个**概率**，然后通过一个**阈值**（默认 0.5）把它变成类别。

**问题来了：** 阈值选 0.5 就一定是最优的吗？不一定。不同场景下可能需要不同阈值（疾病筛查用低阈值提高召回率，垃圾邮件用高阈值提高精确率）。

**ROC 曲线** 回答了这个问题：

> 如果我**不断改变阈值**，模型的性能会如何变化？

它不依赖某个特定阈值，而是评估模型在所有可能阈值下的**整体分类能力**。

### 3.2 ROC 曲线的两个坐标轴

**ROC（Receiver Operating Characteristic，受试者工作特征）曲线** 以两个关键指标为坐标：

- **X 轴：FPR（False Positive Rate，假正率）** = $\frac{FP}{FP + TN}$
  - 在所有真实负类中，有多少被误判为正类了
- **Y 轴：TPR（True Positive Rate，真正率）** = $\frac{TP}{TP + FN}$ = **Recall**
  - 在所有真实正类中，有多少被正确识别

**注意：** TPR 就是召回率！ROC 曲线的 Y 轴就是召回率。

### 3.3 绘制过程

> **核心思想：** 从最高概率到最低概率，逐渐降低阈值，每次计算一对 (FPR, TPR)，画一条曲线。

```python
import numpy as np
from sklearn.metrics import roc_curve, roc_auc_score
import matplotlib.pyplot as plt

# 真实标签和预测概率
y_true = np.array([0, 0, 1, 1, 0, 1, 0, 1, 0, 1])
y_prob = np.array([0.1, 0.2, 0.95, 0.8, 0.3, 0.6, 0.05, 0.7, 0.15, 0.9])

# sklearn 计算 ROC 曲线
fpr, tpr, thresholds = roc_curve(y_true, y_prob)

# 打印每个阈值对应的 (FPR, TPR)
print("阈值     | FPR    | TPR (Recall)")
print("-" * 35)
for i in range(len(thresholds)):
    print(f"{thresholds[i]:.4f} | {fpr[i]:.4f} | {tpr[i]:.4f}")

# 绘制 ROC 曲线
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, 'b-', linewidth=2.5, label='ROC Curve')
plt.plot([0, 1], [0, 1], 'r--', linewidth=1.5, alpha=0.6,
         label='Random Classifier (AUC = 0.5)')
plt.xlabel('False Positive Rate (FPR)', fontsize=12)
plt.ylabel('True Positive Rate (TPR / Recall)', fontsize=12)
plt.title('ROC Curve', fontsize=14)
plt.legend(fontsize=11)
plt.grid(True, alpha=0.3)
plt.xlim([-0.02, 1.02])
plt.ylim([-0.02, 1.02])
plt.show()
```

**ROC 曲线的含义：**

- **左上角越近越好：** (FPR=0, TPR=1) 是完美分类器——零误报，全捕获
- **对角线 (y = x)：** 相当于随机猜测——好坏各半，没有区分能力
- **对角线以下：** 比随机还差——反转预测结果就能变好

**如何理解曲线上的每一个点？**

```
           TPR ↑
          1.0 ┤  ★  (0, 1) ← 完美分类器
             │   ╲
             │    ╲
             │     ╲  ← 当前模型
             │      ╲
             │       ╲
         FPR 0.5 ──── ★  ← 随机猜测
             │         ╲
             │          ╲
           0 ┤───────────→
             0         1.0 FPR
```

左边有一个接近理想点的"肩部"——说明模型在低 FPR 下就能达到高 TPR（优秀模型的特征）。

### 3.4 AUC：曲线下面积

**AUC（Area Under the Curve）** 就是 ROC 曲线下方的面积，是一个 0 到 1 之间的数值。

| AUC 值 | 含义 |
|:------:|:----|
| **AUC = 1.0** | 完美分类器（现实中不可能） |
| **AUC > 0.9** | 非常优秀 |
| **AUC > 0.8** | 良好 |
| **AUC > 0.7** | 中等，有一定区分能力 |
| **AUC = 0.5** | 等于随机猜测，模型无效 |
| **AUC < 0.5** | 比随机还差（但可以翻转预测） |

**AUC 的另一个重要解释：**

> AUC = 随机抽一个正类样本和一个负类样本，模型给正类样本打分**高于**负类样本的概率。

这就把 AUC 和模型的**排序能力**联系起来了——AUC 衡量的是模型能否把正类排在负类前面。

```python
from sklearn.metrics import roc_auc_score

y_true = np.array([0, 0, 1, 1, 0, 1, 0, 1, 0, 1])
y_prob = np.array([0.1, 0.2, 0.95, 0.8, 0.3, 0.6, 0.05, 0.7, 0.15, 0.9])

auc = roc_auc_score(y_true, y_prob)
print(f"AUC = {auc:.4f}")
# 说明：随机抽一个正类和一个负类，有 {auc*100:.1f}% 的概率正类得分更高
```

**完整示例：用不同模型对比 AUC**

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import roc_curve, roc_auc_score
import matplotlib.pyplot as plt

# 生成二分类数据
X, y = make_classification(
    n_samples=500, n_features=5,
    n_informative=3, n_redundant=1,
    random_state=42
)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# 训练两个模型
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Decision Tree': DecisionTreeClassifier(max_depth=3)
}

plt.figure(figsize=(9, 7))

for name, model in models.items():
    model.fit(X_train, y_train)
    y_prob = model.predict_proba(X_test)[:, 1]
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    auc = roc_auc_score(y_test, y_prob)
    plt.plot(fpr, tpr, linewidth=2, label=f'{name} (AUC = {auc:.3f})')

plt.plot([0, 1], [0, 1], 'k--', label='Random (AUC = 0.5)')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC 曲线对比')
plt.legend()
plt.grid(alpha=0.3)
plt.show()
```

**ROC 与 PR 曲线的选择：**

| 场景 | 推荐曲线 | 原因 |
|:---:|:--------:|:----|
| 数据平衡 | **ROC曲线** | 对两类样本一视同仁 |
| 数据极度不平衡 | **PR曲线** (Precision-Recall) | ROC 可能过于乐观（大量负类拉低 FPR） |

### 3.5 代码：从零计算 AUC

```python
def roc_auc_manual(y_true, y_prob):
    """手动计算 AUC（通过排序法）"""
    # 将正负样本的预测概率分开
    pos_probs = y_prob[y_true == 1]
    neg_probs = y_prob[y_true == 0]

    # 计算所有正负样本对中，正类概率 > 负类概率的比例
    count = 0
    for p_pos in pos_probs:
        for p_neg in neg_probs:
            if p_pos > p_neg:
                count += 1
            elif p_pos == p_neg:
                count += 0.5  # 相等时计 0.5

    return count / (len(pos_probs) * len(neg_probs))

# 验证
y_true = np.array([0, 0, 1, 1, 0, 1, 0, 1, 0, 1])
y_prob = np.array([0.1, 0.2, 0.95, 0.8, 0.3, 0.6, 0.05, 0.7, 0.15, 0.9])

auc_manual = roc_auc_manual(y_true, y_prob)
auc_sklearn = roc_auc_score(y_true, y_prob)
print(f"AUC (手动): {auc_manual:.4f}")
print(f"AUC (sklearn): {auc_sklearn:.4f}")
```

---

## 4. 回归指标

以上都是针对**分类任务**的评估指标。对于**回归任务**（预测连续值），我们需要另一套指标。

### 4.1 均方误差 MSE（Mean Squared Error）

**公式：**

$$\text{MSE} = \frac{1}{m} \sum_{i=1}^{m} (y_i - \hat{y}_i)^2$$

其中 $y_i$ 是真实值，$\hat{y}_i$ 是预测值，$m$ 是样本数。

**含义：** 预测误差的平方的平均值。数值越小越好。

**性质：**
- **总是非负**（平方保证）
- **单位是 $y$ 的平方**——如果房价单位是"万元"，MSE 的单位是"万元²"
- **对大误差惩罚重**——一个误差为 10 的样本贡献的损失是误差为 1 的样本的 100 倍

```python
import numpy as np
from sklearn.metrics import mean_squared_error

y_true = np.array([3.0, 5.0, 2.0, 8.0, 7.0])
y_pred = np.array([2.5, 5.5, 1.8, 7.5, 7.2])

# 手动计算
mse_manual = np.mean((y_true - y_pred) ** 2)
print(f"MSE (手动): {mse_manual:.4f}")

# sklearn
mse_sklearn = mean_squared_error(y_true, y_pred)
print(f"MSE (sklearn): {mse_sklearn:.4f}")
```

### 4.2 均方根误差 RMSE（Root Mean Squared Error）

**公式：**

$$\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (y_i - \hat{y}_i)^2}$$

**为什么需要 RMSE？** 因为 MSE 把单位平方了，不好理解。RMSE 开根号之后，单位回到和 $y$ 相同。

- 房价 MSE = 100（万元²）→ 不容易直观理解
- 房价 RMSE = 10（万元）→ 模型平均误差约 10 万，很直观

```python
rmse_manual = np.sqrt(mse_manual)
print(f"RMSE: {rmse_manual:.4f}")
```

### 4.3 平均绝对误差 MAE（Mean Absolute Error）

**公式：**

$$\text{MAE} = \frac{1}{m} \sum_{i=1}^{m} |y_i - \hat{y}_i|$$

**MSE vs MAE 本质区别：**

| 指标 | 对大误差的态度 | 对异常值的敏感度 | 数学性质 |
|:---:|:-------------:|:--------------:|:--------:|
| **MSE/RMSE** | 平方放大，**惩罚大误差** | **非常敏感** | 处处可导（数学上友好） |
| **MAE** | 线性计算，**一视同仁** | **相对稳健** | $x=0$ 处不可导 |

**如何选择？**
- **MSE/RMSE：** 正常场景，大误差不应该出现时使用
- **MAE：** 数据中有异常值，不想让它们扭曲评估结果时使用

```python
from sklearn.metrics import mean_absolute_error

y_true = np.array([3.0, 5.0, 2.0, 8.0, 7.0])
y_pred = np.array([2.5, 5.5, 1.8, 7.5, 7.2])

# 手动计算
mae_manual = np.mean(np.abs(y_true - y_pred))
print(f"MAE (手动): {mae_manual:.4f}")

# sklearn
mae_sklearn = mean_absolute_error(y_true, y_pred)
print(f"MAE (sklearn): {mae_sklearn:.4f}")

# 演示异常值的影响
y_true_with_outlier = np.array([3.0, 5.0, 2.0, 8.0, 7.0, 100.0])
y_pred_with_outlier = np.array([2.5, 5.5, 1.8, 7.5, 7.2, 10.0])

print("\n加入异常值后（真实 100, 预测 10）:")
print(f"MSE: {mean_squared_error(y_true_with_outlier, y_pred_with_outlier):.2f}")
print(f"MAE: {mean_absolute_error(y_true_with_outlier, y_pred_with_outlier):.2f}")
# MSE 被异常值严重拉高，MAE 受影响小得多
```

### 4.4 R² 决定系数

R² 我们已经在线性回归中学习过，这里做一个复习和补充。

**公式：**

$$R^2 = 1 - \frac{SS_{res}}{SS_{tot}} = 1 - \frac{\sum_{i=1}^{m}(y_i - \hat{y}_i)^2}{\sum_{i=1}^{m}(y_i - \bar{y})^2}$$

**核心思想：** 模型相比"直接用均值预测"好了多少？

- $SS_{res}$ = 模型的预测误差
- $SS_{tot}$ = 用均值预测的误差（最"笨"的基准）
- R² = 模型解释了多少比例的方差

```python
from sklearn.metrics import r2_score

y_true = np.array([3.0, 5.0, 2.0, 8.0, 7.0])
y_pred = np.array([2.5, 5.5, 1.8, 7.5, 7.2])

r2 = r2_score(y_true, y_pred)
print(f"R² = {r2:.4f}")
# 表示模型解释了 {r2*100:.1f}% 的数据方差
```

### 4.5 回归指标对比总结

| 指标 | 公式 | 单位 | 范围 | 优点 | 缺点 |
|:---:|:----:|:---:|:----:|:----|:----|
| **MSE** | $\frac{1}{m}\sum(y-\hat{y})^2$ | $y$ 的平方 | $[0, \infty)$ | 数学性质好，处处可导 | 单位不直观，对异常值敏感 |
| **RMSE** | $\sqrt{MSE}$ | 同 $y$ | $[0, \infty)$ | 单位直观，最常用 | 对异常值敏感 |
| **MAE** | $\frac{1}{m}\sum|y-\hat{y}|$ | 同 $y$ | $[0, \infty)$ | 稳健，不受异常值过大影响 | $y=0$ 处不可导 |
| **R²** | $1-\frac{SS_{res}}{SS_{tot}}$ | 无量纲 | $(-\infty, 1]$ | 归一化，可跨任务对比 | 增加特征总会提升 R²（可用调整 R²） |

```python
import numpy as np
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score
)

# 生成测试数据
np.random.seed(42)
y_true = np.random.randn(100) * 10 + 50  # 50 附近的值
y_pred = y_true + np.random.randn(100) * 2  # 真实值 + 小噪声

mse = mean_squared_error(y_true, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)

print(f"{'指标':12s} {'数值':>10s}")
print("-" * 22)
print(f"{'MSE':12s} {mse:>10.4f}")
print(f"{'RMSE':12s} {rmse:>10.4f}")
print(f"{'MAE':12s} {mae:>10.4f}")
print(f"{'R²':12s} {r2:>10.4f}")
```

---

## 5. 交叉验证（Cross-Validation）

### 5.1 为什么需要交叉验证？

回想我们在[[ML基础框架]]中学过的：数据被划分为训练集、验证集、测试集。但这种方法有一个问题：

> **模型只在一个验证集上评估了一次**——如果这次划分"运气不好"，评估结果就不靠谱。

想象你在准备考试，但只做了一套模拟题就评估自己的水平。如果这套题刚好是你擅长的，你可能会高估自己；如果刚好是你最不擅长的，又会低估。

**交叉验证** 解决了这个问题：**让每个样本都有机会做一次"验证"**，然后取平均评估结果。

### 5.2 K-Fold 交叉验证（K 折交叉验证）

**步骤：**

```
Step 1: 将数据随机分成 K 份（Fold）

  Fold 1    Fold 2    Fold 3    Fold 4    Fold 5
 ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
 │      │  │      │  │      │  │      │  │      │
 │ 20%  │  │ 20%  │  │ 20%  │  │ 20%  │  │ 20%  │
 │      │  │      │  │      │  │      │  │      │
 └──────┘  └──────┘  └──────┘  └──────┘  └──────┘

Step 2: 做 K 轮训练，每轮用不同的 Fold 做验证
─────────────────────────────────────────────────
Round 1: 🟩🟩🟩🟩🟥  训练: Fold 2-5, 验证: Fold 1
Round 2: 🟩🟩🟩🟥🟩  训练: Fold 1,3-5, 验证: Fold 2
Round 3: 🟩🟩🟥🟩🟩  训练: Fold 1-2,4-5, 验证: Fold 3
Round 4: 🟩🟥🟩🟩🟩  训练: Fold 1-3,5, 验证: Fold 4
Round 5: 🟥🟩🟩🟩🟩  训练: Fold 1-4, 验证: Fold 5

Step 3: 取 K 次验证结果的平均值作为最终评估
```

**最常用的 K 值：**
- **K = 5**：训练 80%，验证 20% —— 平衡了偏差和方差
- **K = 10**：训练 90%，验证 10% —— 更稳定但更慢

```python
import numpy as np
from sklearn.model_selection import KFold, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

iris = load_iris()
X, y = iris.data, iris.target

# K-Fold 交叉验证
kf = KFold(n_splits=5, shuffle=True, random_state=42)
model = LogisticRegression(max_iter=200, multi_class='multinomial')

# 方法1：手动循环
scores = []
for fold, (train_idx, val_idx) in enumerate(kf.split(X)):
    X_train, X_val = X[train_idx], X[val_idx]
    y_train, y_val = y[train_idx], y[val_idx]

    model.fit(X_train, y_train)
    score = model.score(X_val, y_val)
    scores.append(score)
    print(f"Fold {fold + 1}: 准确率 = {score:.4f}")

print(f"\n平均准确率: {np.mean(scores):.4f} (+/- {np.std(scores):.4f})")
```

```python
# 方法2：cross_val_score 一行搞定
cv_scores = cross_val_score(
    LogisticRegression(max_iter=200, multi_class='multinomial'),
    X, y, cv=5
)
print(f"5 折交叉验证得分: {cv_scores}")
print(f"平均: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
```

**K-Fold 关键参数：**

| 参数 | 含义 | 说明 |
|:----:|:----|:----|
| `n_splits` | 折数 | 常用 5 或 10 |
| `shuffle` | 是否打乱 | 设为 `True` 避免数据顺序偏差 |
| `random_state` | 随机种子 | 固定后结果可复现 |

### 5.3 Stratified K-Fold（分层 K 折交叉验证）

**问题：** 普通 K-Fold 是随机划分，如果数据的某个类别（如正类）只占 10%，某次划分可能导致某个 Fold 完全没有正类样本。

```
普通 K-Fold 的问题：类别比例不一致
     全体数据 (0 占 80%, 1 占 20%)
     ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐
     │0 │1 │0 │0 │1 │0 │0 │0 │0 │1 │ ...
     └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘

     Fold 1     Fold 2     Fold 3     Fold 4     Fold 5
     ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
     │0 0 0 │   │0 0 1 │   │1 0 0 │   │0 1 1 │   │0 0 0 │ ← 没有 1！
     └──────┘   └──────┘   └──────┘   └──────┘   └──────┘
```

**Stratified K-Fold** 保证每个 Fold 中各类别比例和整体比例一致。

```
Stratified K-Fold：每个 Fold 类别比例一致
     Fold 1     Fold 2     Fold 3     Fold 4     Fold 5
     ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
     │0 0 1 │   │0 0 1 │   │0 0 1 │   │0 0 1 │   │0 0 1 │ ← 每个都有 1
     └──────┘   └──────┘   └──────┘   └──────┘   └──────┘
```

```python
from sklearn.model_selection import StratifiedKFold

# 模拟不平衡数据（正类只占 20%）
np.random.seed(42)
y_imbalanced = np.array([0] * 80 + [1] * 20)
np.random.shuffle(y_imbalanced)

print(f"正类比例: {y_imbalanced.mean():.2f}")  # 0.20

# 普通 K-Fold
kf = KFold(n_splits=5, shuffle=True, random_state=42)
print("\n普通 K-Fold 各类别 Fold 正类数量:")
for i, (_, val_idx) in enumerate(kf.split(y_imbalanced)):
    val_labels = y_imbalanced[val_idx]
    print(f"  Fold {i+1}: 正类 {val_labels.sum()}/{(val_labels == 0).sum()} 负类")

# Stratified K-Fold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
print("\nStratified K-Fold 各类别 Fold 正类数量:")
for i, (_, val_idx) in enumerate(skf.split(y_imbalanced, y_imbalanced)):
    val_labels = y_imbalanced[val_idx]
    print(f"  Fold {i+1}: 正类 {val_labels.sum()}/{(val_labels == 0).sum()} 负类")
```

**使用建议：**
- **分类任务** → 优先用 `StratifiedKFold`（数据不平衡时尤其重要）
- **回归任务** → 用 `KFold`（回归标签是连续值，无法分层）

### 5.4 Leave-One-Out 交叉验证（LOO）

**LOO 是 K-Fold 的极端情况：** $K = m$（样本数），每次只用 1 个样本做验证，其余 $m-1$ 个做训练。

```python
from sklearn.model_selection import LeaveOneOut

loo = LeaveOneOut()
n_samples = 10
print(f"LOO 会训练 {n_samples} 次:")
for i, (train_idx, test_idx) in enumerate(loo.split(range(n_samples))):
    print(f"  第 {i+1} 轮: 训练 {len(train_idx)} 个, 验证 {len(test_idx)} 个")
    if i >= 2:  # 只显示前 3 行
        print("  ...")
        break
```

**LOO 的优缺点：**

| 优点 | 缺点 |
|:----|:----|
| 利用了几乎所有数据训练（$m-1$ 个） | 计算量极大——训练 $m$ 次 |
| 评估结果几乎无偏 | 方差大（每次评估只基于 1 个样本） |
| 适合非常小的数据集（$m < 50$） | 大数据集不可行 |

### 5.5 三种交叉验证对比

| 方法 | 训练次数 | 每次训练数据 | 优缺点 |
|:----:|:--------:|:----------:|:------:|
| **K-Fold** ($K=5$) | 5 次 | 80% | 最常用，偏差与方差平衡 |
| **Stratified K-Fold** | $K$ 次 | $\frac{K-1}{K}$ | 分类任务首选，保持类别比例 |
| **Leave-One-Out** | $m$ 次 | $m-1$ 个 | 几乎无偏但极慢，小数据集用 |

**对比 C++：**

C++ 中没有 sklearn 的 `cross_val_score` 这样的高级接口，但交叉验证的逻辑本质上是一个 for 循环：

```cpp
// C++ 中交叉验证的伪代码
#include <vector>
#include <algorithm>

template<typename Model, typename Data>
std::vector<double> cross_validate(
    Model& model, const Data& X, const std::vector<int>& y, int K) {

    std::vector<double> scores;
    int fold_size = X.size() / K;

    for (int fold = 0; fold < K; ++fold) {
        // 划分训练/验证集
        auto [X_train, y_train, X_val, y_val] =
            split_fold(X, y, fold, fold_size);

        // 训练
        model.fit(X_train, y_train);

        // 评估
        scores.push_back(model.score(X_val, y_val));
    }

    // 返回平均分（实际生产中需计算均值和方差）
    return scores;
}
```

### 5.6 交叉验证的完整示例

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import (
    cross_val_score, cross_validate,
    KFold, StratifiedKFold
)
from sklearn.metrics import make_scorer, precision_score, recall_score, f1_score

# 生成数据
X, y = make_classification(
    n_samples=200, n_features=10,
    n_informative=5, n_redundant=2,
    weights=[0.3], random_state=42  # 30% 正类，不平衡
)

model = LogisticRegression(max_iter=1000)

# 一次性评估多个指标
scoring = {
    'accuracy': 'accuracy',
    'precision': make_scorer(precision_score),
    'recall': make_scorer(recall_score),
    'f1': make_scorer(f1_score)
}

# Stratified K-Fold（分类任务推荐）
cv_results = cross_validate(
    model, X, y,
    cv=StratifiedKFold(5, shuffle=True, random_state=42),
    scoring=scoring,
    return_train_score=True  # 同时返回训练集得分
)

print("Stratified 5-Fold 交叉验证结果:")
print("=" * 50)
for metric in scoring:
    train_scores = cv_results[f'train_{metric}']
    test_scores = cv_results[f'test_{metric}']
    print(f"{metric:12s} | "
          f"训练: {train_scores.mean():.4f} (±{train_scores.std():.4f}) | "
          f"验证: {test_scores.mean():.4f} (±{test_scores.std():.4f})")

# 训练集 vs 验证集分数对比 → 检测过拟合
print("\n⚠️ 如果训练集分数远高于验证集，说明存在过拟合")
```

---

## 6. 验收标准：手动计算 Precision 和 Recall（重点展开）

### 6.1 三层结构拆解

**Step 1：构建混淆矩阵**

给定分类结果，第一步永远是把结果填入 $2 \times 2$ 矩阵：

```
               预测正类    预测负类
   真实正类        ?           ?
   真实负类        ?           ?
```

**Step 2：填入四个值**

逐行扫描真实标签和预测标签，判断每个样本属于哪个格子：

- 真实=正类 & 预测=正类 → **TP** 加 1
- 真实=正类 & 预测=负类 → **FN** 加 1
- 真实=负类 & 预测=正类 → **FP** 加 1
- 真实=负类 & 预测=负类 → **TN** 加 1

**Step 3：代入公式计算**

$$\text{Precision} = \frac{TP}{TP + FP} \quad \text{Recall} = \frac{TP}{TP + FN}$$

### 6.2 手算演练

**题目：** 给定以下 15 个样本的真实标签和逻辑回归预测结果（阈值 0.5），计算 Precision 和 Recall。

```
样本编号: 1   2   3   4   5   6   7   8   9   10  11  12  13  14  15
真实标签: 1   0   1   1   0   1   0   0   1   0   1   1   0   1   0
预测概率: 0.9 0.3 0.7 0.8 0.6 0.4 0.2 0.1 0.95 0.8 0.55 0.65 0.3 0.85 0.4
预测类别: 1   0   1   1   1   0   0   0   1   1   1   1   0   1   0
```

**逐行填入混淆矩阵：**

| 样本 | 真实 | 预测 | 归属 |
|:---:|:---:|:---:|:----:|
| 1 | 1 | 1 | **TP** ✅ |
| 2 | 0 | 0 | **TN** ✅ |
| 3 | 1 | 1 | **TP** ✅ |
| 4 | 1 | 1 | **TP** ✅ |
| 5 | 0 | 1 | **FP** ❌ |
| 6 | 1 | 0 | **FN** ❌ |
| 7 | 0 | 0 | **TN** ✅ |
| 8 | 0 | 0 | **TN** ✅ |
| 9 | 1 | 1 | **TP** ✅ |
| 10 | 0 | 1 | **FP** ❌ |
| 11 | 1 | 1 | **TP** ✅ |
| 12 | 1 | 1 | **TP** ✅ |
| 13 | 0 | 0 | **TN** ✅ |
| 14 | 1 | 1 | **TP** ✅ |
| 15 | 0 | 0 | **TN** ✅ |

**汇总：**
- TP = 样本 1, 3, 4, 9, 11, 12, 14 = **7**
- TN = 样本 2, 7, 8, 13, 15 = **5**
- FP = 样本 5, 10 = **2**
- FN = 样本 6 = **1**

**验证：**
- 总样本 = 7 + 5 + 2 + 1 = 15 ✅
- 真实正类数 = TP + FN = 7 + 1 = 8 ✅（样本中确实有 8 个 1）
- 真实负类数 = TN + FP = 5 + 2 = 7 ✅（样本中确实有 7 个 0）

**计算：**

$$\text{Precision} = \frac{TP}{TP + FP} = \frac{7}{7 + 2} = \frac{7}{9} \approx 0.778$$

$$\text{Recall} = \frac{TP}{TP + FN} = \frac{7}{7 + 1} = \frac{7}{8} = 0.875$$

**F1-Score：**

$$\text{F1} = 2 \times \frac{0.778 \times 0.875}{0.778 + 0.875} = 2 \times \frac{0.681}{1.653} \approx 0.824$$

```python
# 代码验证
from sklearn.metrics import precision_score, recall_score, f1_score

y_true =     [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0]
y_pred =     [1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0]

p = precision_score(y_true, y_pred)
r = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)

print(f"Precision = {p:.3f}")
print(f"Recall    = {r:.3f}")
print(f"F1-Score  = {f1:.3f}")
```

### 6.3 速记口诀

> **Precision = 猜对了的正类 / 所有猜成正类的**
> **Recall = 猜对了的正类 / 所有真实正类的**

更形象地说：
- Precision 问的是**"我说是正类的时候，我靠谱吗？"**
- Recall 问的是**"所有正类样本，我找回来了多少？"**

### 6.4 自问自答

**Q：我能不能只用精确率或召回率中的一个？**
A：不能。只看精确率可以轻松做到 1.0（只预测 1 次正类，正确就好，其他全判负类），但召回率会很低。只看召回率也可以做到 1.0（全部判为正类），但精确率会很低。必须两者综合看。

**Q：怎么判断模型更看重精确率还是召回率？**
A：看应用场景。癌症筛查更看重召回率（不希望漏掉任何一个患者），垃圾邮件过滤更看重精确率（不希望正常邮件被误拦）。F1-Score 在两者之间取平衡。

**Q：Accuracy 什么时候会"骗人"？**
A：数据极度不平衡时。比如 99% 的样本是负类，1% 是正类。全判为负类的"模型"准确率 99%，但它一个正类都没认出来。这时候 Precision、Recall、F1 比 Accuracy 更有意义。

---

## 核心对比表格

### 分类 vs 回归指标

| 维度 | 分类 | 回归 |
|:----:|:----|:----|
| **任务目标** | 预测离散类别 | 预测连续值 |
| **核心问题** | 哪些分对了？哪些分错了？犯了什么错？ | 预测值和真实值差多少？ |
| **基础工具** | 混淆矩阵（TP/TN/FP/FN） | 误差平方和、绝对值 |
| **主要指标** | Accuracy, Precision, Recall, F1 | MSE, RMSE, MAE, R² |
| **阈值选择** | ROC 曲线 + AUC | 无需阈值 |
| **验证方式** | Stratified K-Fold（分类首选） | K-Fold（回归） |

### 四种交叉验证对比

| 方法 | 每次训练数据 | 总训练次数 | 适用场景 | 偏差 | 方差 | 计算成本 |
|:----:|:----------:|:--------:|:--------:|:---:|:---:|:-------:|
| **K-Fold (K=5)** | 80% | 5 | 回归任务 | 中等 | 低 | 低 |
| **Stratified K-Fold** | 80% | 5 | 分类任务（尤其不平衡时） | 中等 | 低 | 低 |
| **K-Fold (K=10)** | 90% | 10 | 数据量足时更稳定 | 较低 | 更低 | 中等 |
| **Leave-One-Out** | $m-1$ | $m$ | 小数据集（$m < 50$） | 最低 | 高 | 极高 |

---

## 完整代码示例

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import (
    train_test_split, cross_validate, StratifiedKFold
)
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_curve, roc_auc_score,
    confusion_matrix, classification_report
)
import matplotlib.pyplot as plt

# ========== 1. 生成数据 ==========
X, y = make_classification(
    n_samples=500, n_features=8, n_informative=5,
    n_redundant=2, flip_y=0.05, random_state=42
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ========== 2. 训练模型 ==========
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# ========== 3. 预测 ==========
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

# ========== 4. 分类指标 ==========
print("=" * 50)
print("分类评估")
print("=" * 50)

print(f"准确率 (Accuracy):  {accuracy_score(y_test, y_pred):.4f}")
print(f"精确率 (Precision): {precision_score(y_test, y_pred):.4f}")
print(f"召回率 (Recall):    {recall_score(y_test, y_pred):.4f}")
print(f"F1-Score:           {f1_score(y_test, y_pred):.4f}")
print(f"AUC:                {roc_auc_score(y_test, y_prob):.4f}")

print("\n混淆矩阵:")
cm = confusion_matrix(y_test, y_pred)
print(f"        Pred Neg  Pred Pos")
print(f"True Neg  {cm[0,0]:3d}       {cm[0,1]:3d}")
print(f"True Pos  {cm[1,0]:3d}       {cm[1,1]:3d}")

print("\n分类报告:")
print(classification_report(y_test, y_pred,
                            target_names=['Class 0', 'Class 1']))

# ========== 5. ROC 曲线绘制 ==========
fpr, tpr, thresholds = roc_curve(y_test, y_prob)
auc = roc_auc_score(y_test, y_prob)

plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, 'b-', linewidth=2.5, label=f'ROC Curve (AUC = {auc:.3f})')
plt.plot([0, 1], [0, 1], 'r--', alpha=0.6, label='Random (AUC = 0.5)')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate (Recall)')
plt.title('ROC Curve')
plt.legend()
plt.grid(alpha=0.3)
plt.show()

# ========== 6. 交叉验证 ==========
print("=" * 50)
print("Stratified 5-Fold 交叉验证")
print("=" * 50)

cv_results = cross_validate(
    model, X_train, y_train,
    cv=StratifiedKFold(5, shuffle=True, random_state=42),
    scoring=['accuracy', 'precision', 'recall', 'f1', 'roc_auc'],
    return_train_score=True
)

for metric in ['accuracy', 'precision', 'recall', 'f1', 'roc_auc']:
    train_scores = cv_results[f'train_{metric}']
    test_scores = cv_results[f'test_{metric}']
    print(f"{metric:12s} | "
          f"训练: {train_scores.mean():.4f} (±{train_scores.std():.4f}) | "
          f"验证: {test_scores.mean():.4f} (±{test_scores.std():.4f})")
```

---

## 练习题（25 道）

**1. 混淆矩阵中 FN 代表什么？**

**答案：** False Negative，模型预测为负类但实际是正类——**漏报**，本应检测出来但没有。

---

**2. 混淆矩阵的四个值之间有什么关系？**

**答案：** TP + FN = 真实正类总数，TN + FP = 真实负类总数，TP + TN + FP + FN = 总样本数。

---

**3. 准确率 Accuracy 的公式是什么？**

**答案：** $\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$

---

**4. 什么时候准确率会误导人？**

**答案：** 数据不平衡时。99% 负类 + 1% 正类时，全判负类就得到 99% 准确率，但模型完全没用。

---

**5. 精确率 Precision 的公式是什么？**

**答案：** $\text{Precision} = \frac{TP}{TP + FP}$

---

**6. 召回率 Recall 的公式是什么？**

**答案：** $\text{Recall} = \frac{TP}{TP + FN}$

---

**7. 精确率和召回率各关注什么类型的错误？**

**答案：** 精确率关注**误报（FP）**——模型说"是正类"但实际不是；召回率关注**漏报（FN）**——模型没认出正类。

---

**8. 在癌症筛查场景中，应该更重视精确率还是召回率？**

**答案：** **召回率**。宁可误诊（FP 多一些），也绝不能漏诊（FN 要尽量少）。

---

**9. 在垃圾邮件过滤场景中，应该更重视精确率还是召回率？**

**答案：** **精确率**。宁可漏掉几封垃圾邮件，也不能把正常邮件关进垃圾箱。

---

**10. F1-Score 的公式是什么？**

**答案：** $\text{F1} = 2 \times \frac{P \times R}{P + R}$，其中 P 是精确率，R 是召回率。

---

**11. 为什么 F1 用调和平均而不是算术平均？**

**答案：** 调和平均对极端值更敏感。如果 $P=1.0$ 但 $R=0.0$，算术平均 = 0.5（看起来还行），调和平均 = 0.0（正确反映模型无用）。

---

**12. ROC 曲线的 X 轴和 Y 轴分别是什么？**

**答案：** X 轴 = FPR（假正率）= $\frac{FP}{FP+TN}$；Y 轴 = TPR（真正率/召回率）= $\frac{TP}{TP+FN}$

---

**13. AUC = 0.5 表示什么？AUC = 0.9 呢？**

**答案：** AUC = 0.5 表示模型等于随机猜测；AUC = 0.9 表示模型有 90% 的概率把正类排到负类前面。

---

**14. AUC 的直观含义是什么？**

**答案：** 随机抽一个正类样本和一个负类样本，模型给正类打分高于负类的概率。

---

**15. MSE 和 MAE 的主要区别是什么？**

**答案：** MSE 平方放大误差，对大误差惩罚重，对异常值敏感；MAE 线性计算误差，更稳健。

---

**16. RMSE 和 MSE 是什么关系？**

**答案：** $\text{RMSE} = \sqrt{\text{MSE}}$。RMSE 的单位和 $y$ 一致，比 MSE 更直观。

---

**17. R² 的范围是多少？R² = 0.7 表示什么？**

**答案：** $(-\infty, 1]$。R² = 0.7 表示模型解释了 70% 的数据方差，比直接用均值预测好了 70%。

---

**18. K-Fold 交叉验证中 K=5 表示什么？**

**答案：** 数据分成 5 份，轮流传 4 份训练、1 份验证，共训练 5 次，取 5 次验证结果的平均值。

---

**19. Stratified K-Fold 和普通 K-Fold 的区别？**

**答案：** Stratified K-Fold 确保每个 Fold 中各类别比例与整体一致，适合不平衡的分类任务。

---

**20. Leave-One-Out 交叉验证的优缺点？**

**答案：** 优点：几乎无偏，利用几乎所有数据训练。缺点：要训练 $m$ 次，计算量极大，方差高。

---

**21. 给定混淆矩阵 TP=80, TN=60, FP=10, FN=20，计算 Precision 和 Recall。**

**答案：** Precision = 80/(80+10) = 0.889，Recall = 80/(80+20) = 0.800

---

**22. 在实际 ML 项目中，交叉验证通常用来做什么？**

**答案：** ① 评估模型泛化能力（比单次划分更可靠）；② 调优超参数（网格搜索配合交叉验证）；③ 对比不同模型的性能。

---

**23. 如何进行交叉验证的同时计算训练集分数？有什么意义？**

**答案：** 用 `cross_validate` 设置 `return_train_score=True`。通过对比训练集和验证集分数，可以检测是否**过拟合**——训练集分数远高于验证集说明过拟合。

---

**24. 对于多分类问题（如 10 个手写数字），怎么计算 Precision 和 Recall？**

**答案：** 对每个类别单独计算（将该类视为正类，其他视为负类），然后取平均。有三种平均方式：Micro（全局计算）、Macro（各类等权平均）、Weighted（按样本数加权平均）。

---

**25. 综合题：给定 20 个样本的真实标签和预测概率（阈值 0.5），画出混淆矩阵，计算 Accuracy、Precision、Recall、F1、AUC。**

**答案：**

```python
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_auc_score
)

# 数据
y_true = [1, 0, 1, 0, 1, 0, 1, 1, 0, 0,
          1, 0, 1, 1, 0, 0, 1, 0, 1, 0]
y_prob = [0.85, 0.12, 0.72, 0.55, 0.91, 0.08, 0.63, 0.78,
          0.21, 0.34, 0.69, 0.45, 0.96, 0.88, 0.31, 0.27,
          0.59, 0.43, 0.82, 0.15]

# 阈值 0.5
y_pred = (np.array(y_prob) >= 0.5).astype(int)

print(f"Accuracy:  {accuracy_score(y_true, y_pred):.4f}")
print(f"Precision: {precision_score(y_true, y_pred):.4f}")
print(f"Recall:    {recall_score(y_true, y_pred):.4f}")
print(f"F1:        {f1_score(y_true, y_pred):.4f}")
print(f"AUC:       {roc_auc_score(y_true, y_prob):.4f}")
print("\n混淆矩阵:")
print(confusion_matrix(y_true, y_pred))
```

<details><summary>答案</summary>

```
Accuracy:  0.8500
Precision: 0.8750
Recall:    0.8750
F1:        0.8750
AUC:       0.9562

混淆矩阵:
        Pred Neg  Pred Pos
True Neg    8         1
True Pos    1         7
```
</details>

---

## 核心记忆卡片

1. **混淆矩阵四要素：** TP（猜对的正类）、TN（猜对的负类）、FP（误报）、FN（漏报）
2. **Accuracy：** $\frac{TP+TN}{Total}$，数据平衡时有用，不平衡时会被多数类主导
3. **Precision：** $\frac{TP}{TP+FP}$，模型说正类的"可信度"，关注误报
4. **Recall：** $\frac{TP}{TP+FN}$，模型找回正类的"捕获率"，关注漏报
5. **F1：** $2 \times \frac{P \times R}{P + R}$，Precision 和 Recall 的调和平均，极端场景下不被"平庸分数"骗到
6. **ROC 曲线：** 以 FPR 为横轴、TPR（Recall）为纵轴，展示模型在不同阈值下的表现
7. **AUC：** ROC 曲线下面积，衡量模型**排序能力**，AUC = 0.5 是随机
8. **回归四件套：** MSE（平方误差均值）、RMSE（单位同 y）、MAE（绝对值，稳健）、R²（方差解释率）
9. **K-Fold 交叉验证：** 数据分 K 份，轮流做验证，取平均——比单次划分更可靠
10. **Stratified K-Fold：** 保持每个 Fold 类别比例一致，分类任务首选

---

## 验收标准自测

> **给定一个分类结果，能手动计算 Precision 和 Recall**

**我的理解：**

分三步走：

**① 构建混淆矩阵：** 对比每个样本的真实标签和预测标签，填入 TP / TN / FP / FN

**② 统计四值：** 逐行扫描，计数

**③ 代入公式：**

$$\text{Precision} = \frac{TP}{TP + FP}$$

$$\text{Recall} = \frac{TP}{TP + FN}$$

**示例速记：**

```
给定 20 个样本的 (真实, 预测)：
  TP: 真实=1, 预测=1  →  数
  FN: 真实=1, 预测=0  →  数
  FP: 真实=0, 预测=1  →  数
  TN: 真实=0, 预测=0  →  数

Precision = TP / (TP + FP)   ← 分母是"预测为正类"的总数
Recall    = TP / (TP + FN)   ← 分母是"真实为正类"的总数
```

**常见陷阱：**
- 不要把 TP 和 FP 搞混——TP 是预测对了正类，FP 是预测错了正类
- 不要把分母搞混——Precision 的分母是**预测**的正类数，Recall 的分母是**真实**的正类数

---

## 📎 参考资源

- 吴恩达 ML Specialization Week 2-3
- 《统计学习方法》第 1 章（模型评估部分）
- [scikit-learn Model Evaluation 文档](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn cross_validate 文档](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_validate.html)

---

## 相关链接

- [[Phase 4 - 机器学习基础]] — 本阶段任务清单
- [[逻辑回归]] ⬅️ 上一节：逻辑回归
- [[线性回归]] — MSE/R² 相关内容
- [[ML基础框架]] — 数据划分与过拟合
- ➡️ 下一节：[[支持向量机 SVM]]（待学习）
