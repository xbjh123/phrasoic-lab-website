---
title: "模型评估方法"
cat: "ENGINEERING"
tags: ["machine-learning", "evaluation", "metrics"]
min: "15"
date: "2026.06.05 — 22:00:00"
image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&auto=format"
label: "INCOMING SIGNAL"
labelZh: "传入信号"
excerpt: "从混淆矩阵到交叉验证：系统掌握模型评估的核心指标与方法。"
---

# 模型评估方法

模型评估是机器学习工作流中至关重要的一环。一个好的评估方法能帮助我们准确判断模型的性能，发现潜在问题，并指导模型优化。

## 1. 混淆矩阵（Confusion Matrix）

混淆矩阵是分类问题评估的基础工具，它展示了模型预测结果与真实标签的对比情况。

### 1.1 二分类混淆矩阵

| | 预测为正类 | 预测为负类 |
|---|---|---|
| **真实为正类** | TP (True Positive) | FN (False Negative) |
| **真实为负类** | FP (False Positive) | TN (True Negative) |

**四个关键指标：**
- **TP（真正例）**：真实为正类，预测也为正类
- **TN（真负例）**：真实为负类，预测也为负类
- **FP（假正例）**：真实为负类，但预测为正类（误报）
- **FN（假负例）**：真实为正类，但预测为负类（漏报）

## 2. 分类评估指标

### 2.1 准确率（Accuracy）

$$
\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}
$$

准确率是最直观的指标，但在类别不平衡时会产生误导。例如，在 99:1 的数据集中，即使模型全部预测多数类，准确率也能达到 99%。

### 2.2 精确率（Precision）

$$
\text{Precision} = \frac{TP}{TP + FP}
$$

$$
\text{Precision} = \frac{\text{预测正确的正类数}}{\text{模型认为的正类总数}}
$$

精确率衡量的是：**模型预测为正类的样本中，有多少是真正的正类？**

**应用场景：**
- 垃圾邮件检测：误将正常邮件标记为垃圾邮件的代价很高
- 医疗诊断：误诊的代价很高

### 2.3 召回率（Recall / Sensitivity）

$$
\text{Recall} = \frac{TP}{TP + FN}
$$

$$
\text{Recall} = \frac{\text{预测正确的正类数}}{\text{实际的正类总数}}
$$

召回率衡量的是：**所有真正的正类样本中，模型找出了多少？**

**应用场景：**
- 癌症筛查：漏诊的代价很高，宁可误诊也不能漏诊
- 欺诈检测：漏掉欺诈交易的代价很高

### 2.4 F1 分数（F1-Score）

F1 是精确率和召回率的调和平均数：

$$
F1 = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}
$$

F1 分数在精确率和召回率之间取得平衡，适用于需要同时关注两者的场景。

### 2.5 Precision-Recall 权衡

精确率和召回率通常是此消彼长的关系：
- 提高阈值 → 精确率↑，召回率↓
- 降低阈值 → 精确率↓，召回率↑

选择哪个指标更重要，取决于具体的业务场景和错误成本。

## 3. ROC 曲线与 AUC

### 3.1 ROC 曲线

ROC（Receiver Operating Characteristic）曲线展示了模型在不同阈值下的表现：
- **X 轴**：假正率（FPR）= FP / (FP + TN)
- **Y 轴**：真正率（TPR）= TP / (TP + FN) = Recall

**ROC 曲线的特点：**
- 左上角越近越好
- 对角线代表随机猜测（AUC = 0.5）
- 曲线下面积越大，模型性能越好

### 3.2 AUC（Area Under Curve）

$$
\text{AUC} = \int_{0}^{1} \text{TPR}(\text{FPR}) \, d(\text{FPR})
$$

AUC 的直观解释：**随机选取一个正样本和一个负样本，模型给正样本打分高于负样本的概率。**

**AUC 值的含义：**
- AUC = 1.0：完美分类器
- AUC > 0.9：优秀
- AUC > 0.8：良好
- AUC > 0.7：可接受
- AUC = 0.5：随机猜测

## 4. 回归评估指标

### 4.1 均方误差（MSE）

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

MSE 对大误差惩罚更重，但对异常值敏感。

### 4.2 均方根误差（RMSE）

$$
\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}
$$

RMSE 与原始数据单位一致，更易解释。

### 4.3 平均绝对误差（MAE）

$$
\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|
$$

MAE 对异常值更鲁棒，但梯度不连续。

### 4.4 R² 决定系数

$$
R^2 = 1 - \frac{\sum_{i=1}^{n} (y_i - \hat{y}_i)^2}{\sum_{i=1}^{n} (y_i - \bar{y})^2}
$$

R² 表示模型解释的方差比例：
- R² = 1.0：完美预测
- R² = 0：模型等同于预测均值
- R² < 0：模型比预测均值还差

## 5. 交叉验证（Cross-Validation）

### 5.1 为什么需要交叉验证？

简单的训练集/测试集划分存在随机性问题。交叉验证通过多次划分，提供更稳健的评估。

### 5.2 K 折交叉验证（K-Fold CV）

**步骤：**
1. 将数据随机分成 K 份
2. 每次用 K-1 份训练，1 份验证
3. 重复 K 次，取平均性能

$$
\text{CV Score} = \frac{1}{K} \sum_{k=1}^{K} \text{Score}_k
$$

**常用 K 值：**
- K = 5：平衡计算成本和评估稳定性
- K = 10：更稳定但计算量更大
- K = n（留一法）：最稳定但计算量最大

### 5.3 分层 K 折交叉验证（Stratified K-Fold）

保持每个折中类别比例与整体一致，适用于类别不平衡的分类问题。

### 5.4 时间序列交叉验证

对于时间序列数据，必须保持时间顺序：
- 不能使用随机划分
- 使用滚动窗口或扩展窗口

## 6. 实践建议

### 6.1 指标选择指南

| 场景 | 推荐指标 | 原因 |
|------|---------|------|
| 类别平衡 | Accuracy | 简单直观 |
| 类别不平衡 | F1, AUC | 不受类别比例影响 |
| 误报代价高 | Precision | 关注假正例 |
| 漏报代价高 | Recall | 关注假负例 |
| 回归问题 | RMSE, MAE | 与原始单位一致 |
| 模型比较 | AUC | 阈值无关 |

### 6.2 常见陷阱

1. **数据泄露**：训练集和测试集有重叠
2. **时间穿越**：用未来数据预测过去
3. **过拟合评估指标**：针对特定指标优化而忽视其他
4. **忽视置信区间**：单次评估结果可能有较大波动

### 6.3 最佳实践

```python
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report

# 使用分层交叉验证
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=cv, scoring='f1')

print(f"F1 Score: {scores.mean():.3f} ± {scores.std():.3f}")

# 详细分类报告
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
```

## 总结

模型评估不是单一指标的游戏，而是多维度、多场景的综合判断：

1. **理解业务场景**：不同场景关注不同指标
2. **使用交叉验证**：避免随机性带来的偏差
3. **多指标综合评估**：不要只盯着一个数字
4. **关注置信区间**：评估结果的稳定性同样重要

掌握这些评估方法，你就能更准确地判断模型性能，做出更好的决策。
