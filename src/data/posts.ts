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
    cat: "SYSTEMS",
    title: "model-evaluation",
    excerpt: "",
    body: `<h2>模型评估方法</h2>
<blockquote>学习日期: 2026-06-01涵盖: 混淆矩阵、分类指标（Accuracy/Precision/Recall/F1）、ROC曲线与AUC、回归指标（MSE/RMSE/MAE/R²）、交叉验证（K-Fold/Stratified/LOO）所属阶段: [[Phase 4 - 机器学习基础]]</blockquote>
<h2>🔗 关联笔记</h2>
<ul>
<li>[[Phase 4 - 机器学习基础]] — CV 学习路线中的机器学习阶段</li>
<li>[[逻辑回归]] — 上一节：逻辑回归（已完成 ✅）</li>
<li>[[线性回归]] — 线性回归与 MSE/R²（已完成 ✅）</li>
<li>[[ML基础框架]] — 数据划分、训练/验证/测试集（已完成 ✅）</li>
<li>➡️ 下一节：[[支持向量机 SVM]]（已完成 ✅）</li>
</ul>
<h2>0. 从模型训练到模型评估：为什么需要评估方法？</h2>
<p>上一节我们学会了训练逻辑回归模型——给定数据，模型可以输出一个预测结果。但一个关键问题随之而来：</p>
<blockquote><strong>这个模型到底好不好？</strong></blockquote>
<p>你可能本能地想到"看准确率"，但事情没那么简单。</p>
<p><strong>场景一：垃圾邮件分类</strong></p>
<ul>
<li>1000 封邮件中只有 10 封是垃圾邮件</li>
<li>一个"模型"什么都不做，把所有邮件判为"正常邮件"</li>
<li>准确率 = 990/1000 = 99%！</li>
<li>但这个"模型"毫无用处——它一封垃圾邮件都没拦住</li>
</ul>
<p><strong>场景二：疾病筛查</strong></p>
<ul>
<li>被误诊为癌症（假阳性）和漏诊了癌症（假阴性）的代价天差地别</li>
<li>漏诊可能导致患者错过治疗窗口，代价极高</li>
<li>误诊可以通过二次检查排除，代价相对较小</li>
</ul>
<p><strong>核心矛盾：</strong> 不同的错误类型代价不同，仅靠一个数字（准确率）无法衡量模型在"关键错误"上的表现。我们需要一套更精细的评估工具箱。</p>
<blockquote><strong>评估方法是模型的"体检报告"</strong> ——它不只告诉你"好不好"，还告诉你"哪里好、哪里不好、哪里需要改进"。</blockquote>
<p><strong>本章路线：</strong></p>
<ol>
<li>先从<strong>混淆矩阵</strong>入手，看清所有预测结果的全貌</li>
<li>再从矩阵中提炼出各类<strong>分类指标</strong>——准确率、精确率、召回率、F1</li>
<li>然后学习<strong>ROC曲线与AUC</strong>——评估模型在不同阈值下的整体表现</li>
<li>切换到<strong>回归任务</strong>——MSE/RMSE/MAE/R²</li>
<li>最后学习<strong>交叉验证</strong>——如何更可靠地评估模型的泛化能力</li>
</ol>
<h2>1. 混淆矩阵（Confusion Matrix）</h2>
<h3>1.1 什么是混淆矩阵？</h3>
<p><strong>混淆矩阵</strong>是一个 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>2</mn><mo>×</mo><mn>2</mn></mrow><annotation encoding="application/x-tex">2 \times 2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">2</span></span></span></span> 的表格，展示分类模型在所有样本上的预测结果与真实标签的对比情况。</p>
<p>对于二分类问题（正类 = Positive，负类 = Negative）：</p>
<table>
<tr><th></th><th>预测为正类 (Positive)</th><th>预测为负类 (Negative)</th></tr>
<tr><td><strong>真实为正类 (Positive)</strong></td><td><strong>TP</strong> (True Positive)</td><td><strong>FN</strong> (False Negative)</td></tr>
<tr><td><strong>真实为负类 (Negative)</strong></td><td><strong>FP</strong> (False Positive)</td><td><strong>TN</strong> (True Negative)</td></tr>
</table>
<p><strong>四个关键格子：</strong></p>
<table>
<tr><th>缩写</th><th>全称</th><th>含义</th><th>类比</th></tr>
<tr><td><strong>TP</strong></td><td>True Positive</td><td>模型预测为正类，且实际上确实是正类</td><td>正确识别出垃圾邮件 ✅</td></tr>
<tr><td><strong>TN</strong></td><td>True Negative</td><td>模型预测为负类，且实际上确实是负类</td><td>正确放行正常邮件 ✅</td></tr>
<tr><td><strong>FP</strong></td><td>False Positive</td><td>模型预测为正类，但实际是负类</td><td>把正常邮件误判为垃圾 ❌（Type I Error）</td></tr>
<tr><td><strong>FN</strong></td><td>False Negative</td><td>模型预测为负类，但实际是正类</td><td>漏掉了垃圾邮件 ❌（Type II Error）</td></tr>
</table>
<p><strong>记忆口诀：</strong></p>
<blockquote>第一个字母（T/F）表示"预测对了吗"——True 表示猜对了，False 表示猜错了。第二个字母（P/N）表示"模型预测的结果是什么"——P 是正类，N 是负类。</blockquote>
<p>所以：</p>
<ul>
<li><strong>TP</strong> = True + Positive = "模型说是正类，而且说对了"</li>
<li><strong>FN</strong> = False + Negative = "模型说是负类，而且说错了"（实际上是正类，被漏掉了）</li>
<li><strong>FP</strong> = False + Positive = "模型说是正类，而且说错了"（实际上是负类，被误判了）</li>
<li><strong>TN</strong> = True + Negative = "模型说是负类，而且说对了"</li>
</ul>
<h3>1.2 手算例子</h3>
<p>假设我们用垃圾邮件分类器测试了 100 封邮件，结果如下：</p>
<table>
<tr><th></th><th>预测为垃圾</th><th>预测为正常</th></tr>
<tr><td><strong>真实为垃圾</strong></td><td>40 (TP)</td><td>10 (FN)</td></tr>
<tr><td><strong>真实为正常</strong></td><td>5 (FP)</td><td>45 (TN)</td></tr>
</table>
<p>从矩阵中我们可以读出所有关键信息：</p>
<ul>
<li>50 封真实垃圾邮件中：模型抓住了 40 封（TP），漏掉了 10 封（FN）</li>
<li>50 封真实正常邮件中：模型正确放行了 45 封（TN），误判了 5 封（FP）</li>
<li>模型总共预测了 45 封垃圾邮件（40 TP + 5 FP），其中 40 封是正确的</li>
</ul>
<h3>1.3 代码实现</h3>
<pre><code>
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
</code></pre>
<pre><code>
# 可视化混淆矩阵
disp = ConfusionMatrixDisplay(
confusion_matrix=cm,
display_labels=['Normal (0)', 'Spam (1)']
)
disp.plot(cmap='Blues')
plt.title('混淆矩阵可视化')
plt.show()
</code></pre>
<p><strong>手动提取四个值：</strong></p>
<pre><code>
def confusion_matrix_manual(y_true, y_pred):
"""手动计算混淆矩阵"""
tp = np.sum((y_true == 1) &amp; (y_pred == 1))
tn = np.sum((y_true == 0) &amp; (y_pred == 0))
fp = np.sum((y_true == 0) &amp; (y_pred == 1))
fn = np.sum((y_true == 1) &amp; (y_pred == 0))
return tp, tn, fp, fn
y_true = np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 0])
y_pred = np.array([1, 0, 1, 0, 0, 1, 0, 1, 1, 0])
tp, tn, fp, fn = confusion_matrix_manual(y_true, y_pred)
print(f"TP = {tp}, TN = {tn}")
print(f"FP = {fp}, FN = {fn}")
</code></pre>
<h3>1.4 多分类的混淆矩阵</h3>
<p>对于 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>K</mi></mrow><annotation encoding="application/x-tex">K</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">K</span></span></span></span> 类分类问题，混淆矩阵是一个 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>K</mi><mo>×</mo><mi>K</mi></mrow><annotation encoding="application/x-tex">K \times K</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">K</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">K</span></span></span></span> 的矩阵：</p>
<ul>
<li>行：真实类别</li>
<li>列：预测类别</li>
<li>对角线：预测正确的样本（对每个类别而言都是 TP）</li>
<li>非对角线：预测错误的样本</li>
</ul>
<pre><code>
from sklearn.metrics import confusion_matrix
# 3 类分类示例
y_true = [0, 1, 2, 0, 1, 2, 0, 1, 2]
y_pred = [0, 2, 1, 0, 1, 2, 0, 1, 1]
cm = confusion_matrix(y_true, y_pred)
# 查看每一类对应的行
for i in range(3):
print(f"真实类别 {i}: 预测为 {cm[i]}")
</code></pre>
<h2>2. 分类指标</h2>
<p>有了混淆矩阵中的四个核心值（TP, TN, FP, FN），我们就可以计算出各类分类指标了。</p>
<h3>2.1 准确率（Accuracy）</h3>
<p><strong>公式：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Accuracy</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>T</mi><mi>N</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>T</mi><mi>N</mi><mo>+</mo><mi>F</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord text"><span class="mord">Accuracy</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.1297em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">F</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">F</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>
<p><strong>含义：</strong> 所有预测中，预测正确的比例。最直观的指标。</p>
<pre><code>
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
</code></pre>
<p><strong>⚠️ 准确率的重大缺陷：数据不平衡时失效</strong></p>
<p>回到开头的例子：99% 正常邮件 vs 1% 垃圾邮件。全判为正常的"模型"准确率 99%，但毫无用处。</p>
<table>
<tr><th>场景</th><th>准确率</th><th>真实表现</th></tr>
<tr><td>平衡数据 (50/50)</td><td>90%</td><td>确实不错 ✅</td></tr>
<tr><td>极度不平衡 (1/99)</td><td>99%</td><td>但全是猜"多数类" ❌</td></tr>
</table>
<blockquote><strong>结论：</strong> 准确率只在各类别样本数量大致相等时才有意义。数据不平衡时，看精确率、召回率更有价值。</blockquote>
<h3>2.2 精确率（Precision）</h3>
<p><strong>公式：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Precision</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>P</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{Precision} = \frac{TP}{TP + FP}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">Precision</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.1297em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">F</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>
<p><strong>含义：</strong> 模型预测为"正类"的样本中，有多少是真正正确的？</p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Precision</mtext><mo>=</mo><mfrac><mtext>预测正确的正类数</mtext><mtext>模型认为的正类总数</mtext></mfrac></mrow><annotation encoding="application/x-tex">\text{Precision} = \frac{\text{预测正确的正类数}}{\text{模型认为的正类总数}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">Precision</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.0463em;vertical-align:-0.686em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord text"><span class="mord cjk_fallback">模型认为的正类总数</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord text"><span class="mord cjk_fallback">预测正确的正类数</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>
<p><strong>类比：</strong> 精确率衡量的是模型"说真话的概率"。当模型说"这是垃圾邮件"时，它有多可信？</p>
<pre><code>
# 沿用上面的例子：TP=40, FP=5
tp, fp = 40, 5
precision = tp / (tp + fp)
print(f"精确率: {precision:.2f}")  # 40/45 ≈ 0.89
</code></pre>
<p><strong>精确率关注的是"误报"（FP）</strong>——模型说"是正类"但实际不是。想让精确率高，模型就不能轻易说"是"。</p>
<p><strong>典型场景：</strong></p>
<ul>
<li><strong>垃圾邮件过滤：</strong> 宁愿漏掉几封也尽量不要把正常邮件判为垃圾（精确率重要）</li>
<li><strong>推荐系统：</strong> 推荐给用户的内容最好是用户确实感兴趣的（精确率重要）</li>
</ul>
<h3>2.3 召回率（Recall）</h3>
<p><strong>公式：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Recall</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{Recall} = \frac{TP}{TP + FN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord text"><span class="mord">Recall</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.1297em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">F</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>
<p><strong>含义：</strong> 所有真正的正类样本中，模型成功找出了多少？</p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Recall</mtext><mo>=</mo><mfrac><mtext>找出的正类数</mtext><mtext>应有的正类总数</mtext></mfrac></mrow><annotation encoding="application/x-tex">\text{Recall} = \frac{\text{找出的正类数}}{\text{应有的正类总数}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord text"><span class="mord">Recall</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.0463em;vertical-align:-0.686em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord text"><span class="mord cjk_fallback">应有的正类总数</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord text"><span class="mord cjk_fallback">找出的正类数</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>
<p><strong>类比：</strong> 召回率衡量的是模型"的搜捕能力"。所有应该被抓到的坏人中，真抓到了几个？</p>
<pre><code>
# 沿用上面的例子：TP=40, FN=10
tp, fn = 40, 10
recall = tp / (tp + fn)
print(f"召回率: {recall:.2f}")  # 40/50 = 0.80
</code></pre>
<p><strong>召回率关注的是"漏报"（FN）</strong>——本来是正类但模型没认出来。想让召回率高，模型就要尽量"不放过任何一个"。</p>
<p><strong>典型场景：</strong></p>
<ul>
<li><strong>疾病筛查：</strong> 宁可误诊也要把潜在的癌症患者全找出来（召回率重要）</li>
<li><strong>金融欺诈检测：</strong> 宁可多报可疑交易也不能漏掉任何一笔欺诈（召回率重要）</li>
</ul>
<h3>2.4 精确率与召回率的此消彼长（Trade-off）</h3>
<p>精确率和召回率是一对天生的<strong>矛盾指标</strong>——提高一个通常会降低另一个。</p>
<p><strong>理解这个矛盾：</strong></p>
<p>想象你是一个安检员，任务是找出携带危险品的乘客。</p>
<ul>
<li><strong>如果只关注召回率（不漏掉任何一个坏人）</strong>：你可能会把所有人都拦下来搜身。召回率 = 100%（所有坏人都被抓了），但精确率极低（太多好人被误拦）。</li>
<li><strong>如果只关注精确率（不冤枉任何一个好人）</strong>：你可能会非常谨慎，只有 100% 确定时才拦人。精确率 = 100%（拦的全是坏人），但召回率很低（很多坏人溜走了）。</li>
</ul>
<table>
<tr><th>策略</th><th>阈值</th><th>Precision</th><th>Recall</th><th>说明</th></tr>
<tr><td>保守</td><td>高阈值 (0.9)</td><td><strong>高</strong> → 说正类就很可能是正类</td><td><strong>低</strong> → 很多正类被放过了</td><td>宁可漏，不乱报</td></tr>
<tr><td>激进</td><td>低阈值 (0.3)</td><td><strong>低</strong> → 很多报正类的实际不是</td><td><strong>高</strong> → 几乎所有的正类都被抓住了</td><td>宁可错报，不放过</td></tr>
</table>
<p>这个矛盾在代码中一目了然：</p>
<pre><code>
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
</code></pre>
<h3>2.5 F1-Score：精确率和召回率的调和平均</h3>
<p>有没有一个指标能综合衡量精确率和召回率？<strong>F1-Score</strong> 就是为这个目的设计的。</p>
<p><strong>公式：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>F1</mtext><mo>=</mo><mn>2</mn><mo>×</mo><mfrac><mrow><mtext>Precision</mtext><mo>×</mo><mtext>Recall</mtext></mrow><mrow><mtext>Precision</mtext><mo>+</mo><mtext>Recall</mtext></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{F1} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">F1</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:2.1408em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3714em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord text"><span class="mord">Precision</span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord text"><span class="mord">Recall</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord text"><span class="mord">Precision</span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord text"><span class="mord">Recall</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>
<p><strong>为什么用调和平均而不是算术平均？</strong></p>
<p>算术平均 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>P</mi><mo>+</mo><mi>R</mi><mo stretchy="false">)</mo><mi mathvariant="normal">/</mi><mn>2</mn></mrow><annotation encoding="application/x-tex">(P + R)/2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.0077em;">R</span><span class="mclose">)</span><span class="mord">/2</span></span></span></span> 在极端情况下会"掩盖"问题。比如 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>P</mi><mo>=</mo><mn>1.0</mn></mrow><annotation encoding="application/x-tex">P = 1.0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1.0</span></span></span></span>（精确率完美）但 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>R</mi><mo>=</mo><mn>0.0</mn></mrow><annotation encoding="application/x-tex">R = 0.0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0077em;">R</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0.0</span></span></span></span>（一个都没找出来），算术平均 = 0.5——看起来还行，但实际上模型完全不可用。</p>
<p>调和平均对极端值更敏感：</p>
<ul>
<li><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mtext>F1</mtext><mo>=</mo><mn>2</mn><mo>×</mo><mfrac><mrow><mn>1.0</mn><mo>×</mo><mn>0.0</mn></mrow><mrow><mn>1.0</mn><mo>+</mo><mn>0.0</mn></mrow></mfrac><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex">\text{F1} = 2 \times \frac{1.0 \times 0.0}{1.0 + 0.0} = 0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">F1</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1.2484em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8451em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1.0</span><span class="mbin mtight">+</span><span class="mord mtight">0.0</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1.0</span><span class="mbin mtight">×</span><span class="mord mtight">0.0</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0</span></span></span></span> ✅ ——正确地反映了模型完全没用</li>
</ul>
<pre><code>
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
</code></pre>
<pre><code>
from sklearn.metrics import f1_score
y_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0]
y_pred = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0]
# sklearn 计算 F1
f1 = f1_score(y_true, y_pred)
print(f"F1-Score: {f1:.3f}")
# 完整分类报告
from sklearn.metrics import classification_report
print("&#92;n分类报告:")
print(classification_report(y_true, y_pred, target_names=['Class 0', 'Class 1']))
</code></pre>
<h3>2.6 各指标综合对比</h3>
<table>
<tr><th>指标</th><th>公式</th><th>关注点</th><th>适用场景</th><th>对不平衡数据</th></tr>
<tr><td><strong>Accuracy</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>T</mi><mi>N</mi></mrow><mrow><mi>T</mi><mi>o</mi><mi>t</mi><mi>a</mi><mi>l</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{TP+TN}{Total}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2173em;vertical-align:-0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">a</span><span class="mord mathnormal mtight" style="margin-right:0.0197em;">l</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.345em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></td><td>整体正确率</td><td>各类别平衡时</td><td>❌ 容易被多数类主导</td></tr>
<tr><td><strong>Precision</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>P</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{TP}{TP+FP}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></td><td>预测正类的可信度</td><td>误报代价高（垃圾邮件、推荐）</td><td>✅ 关注少数类质量</td></tr>
<tr><td><strong>Recall</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{TP}{TP+FN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></td><td>正类的捕获率</td><td>漏报代价高（疾病、欺诈）</td><td>✅ 关注少数类数量</td></tr>
<tr><td><strong>F1-Score</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>2</mn><mfrac><mrow><mi>P</mi><mi>R</mi></mrow><mrow><mi>P</mi><mo>+</mo><mi>R</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">2\frac{PR}{P+R}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord">2</span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.0077em;">R</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mord mathnormal mtight" style="margin-right:0.0077em;">R</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></td><td>Precision 和 Recall 的平衡</td><td>需要兼顾两者时</td><td>✅ 综合评估少数类</td></tr>
</table>
<p><strong>对比 C++：</strong> 分类指标的计算本质上是加法和除法，C++ 实现也非常直接。</p>
<pre><code>
// C++ 计算分类指标
#include &lt;vector>
#include &lt;iostream>
struct Metrics {
double accuracy, precision, recall, f1;
};
Metrics calc_metrics(const std::vector&lt;int>&amp; y_true,
const std::vector&lt;int>&amp; y_pred) {
int tp = 0, tn = 0, fp = 0, fn = 0;
for (size_t i = 0; i &lt; y_true.size(); ++i) {
if (y_true[i] == 1 &amp;&amp; y_pred[i] == 1) tp++;
else if (y_true[i] == 0 &amp;&amp; y_pred[i] == 0) tn++;
else if (y_true[i] == 0 &amp;&amp; y_pred[i] == 1) fp++;
else fn++;
}
return {
double(tp + tn) / (tp + tn + fp + fn),
double(tp) / (tp + fp),
double(tp) / (tp + fn),
2.0 * tp / (2 * tp + fp + fn)  // F1 的等价形式
};
}
</code></pre>
<h2>3. ROC 曲线与 AUC 值</h2>
<h3>3.1 为什么需要 ROC？</h3>
<p>在前面的讨论中，我们一直假设分类器输出的是<strong>离散的类别标签</strong>（0 或 1）。但实际上，分类器（如逻辑回归）先输出一个<strong>概率</strong>，然后通过一个<strong>阈值</strong>（默认 0.5）把它变成类别。</p>
<p><strong>问题来了：</strong> 阈值选 0.5 就一定是最优的吗？不一定。不同场景下可能需要不同阈值（疾病筛查用低阈值提高召回率，垃圾邮件用高阈值提高精确率）。</p>
<p><strong>ROC 曲线</strong> 回答了这个问题：</p>
<blockquote>如果我<strong>不断改变阈值</strong>，模型的性能会如何变化？</blockquote>
<p>它不依赖某个特定阈值，而是评估模型在所有可能阈值下的<strong>整体分类能力</strong>。</p>
<h3>3.2 ROC 曲线的两个坐标轴</h3>
<p><strong>ROC（Receiver Operating Characteristic，受试者工作特征）曲线</strong> 以两个关键指标为坐标：</p>
<ul>
<li><strong>X 轴：FPR（False Positive Rate，假正率）</strong> = <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>F</mi><mi>P</mi></mrow><mrow><mi>F</mi><mi>P</mi><mo>+</mo><mi>T</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{FP}{FP + TN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></li>
<li>在所有真实负类中，有多少被误判为正类了</li>
<li><strong>Y 轴：TPR（True Positive Rate，真正率）</strong> = <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{TP}{TP + FN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span> = <strong>Recall</strong></li>
<li>在所有真实正类中，有多少被正确识别</li>
</ul>
<p><strong>注意：</strong> TPR 就是召回率！ROC 曲线的 Y 轴就是召回率。</p>
<h3>3.3 绘制过程</h3>
<blockquote><strong>核心思想：</strong> 从最高概率到最低概率，逐渐降低阈值，每次计算一对 (FPR, TPR)，画一条曲线。</blockquote>
<pre><code>
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
</code></pre>
<p><strong>ROC 曲线的含义：</strong></p>
<ul>
<li><strong>左上角越近越好：</strong> (FPR=0, TPR=1) 是完美分类器——零误报，全捕获</li>
<li><strong>对角线 (y = x)：</strong> 相当于随机猜测——好坏各半，没有区分能力</li>
<li><strong>对角线以下：</strong> 比随机还差——反转预测结果就能变好</li>
</ul>
<p><strong>如何理解曲线上的每一个点？</strong></p>
<pre><code>
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
</code></pre>
<p>左边有一个接近理想点的"肩部"——说明模型在低 FPR 下就能达到高 TPR（优秀模型的特征）。</p>
<h3>3.4 AUC：曲线下面积</h3>
<p><strong>AUC（Area Under the Curve）</strong> 就是 ROC 曲线下方的面积，是一个 0 到 1 之间的数值。</p>
<table>
<tr><th>AUC 值</th><th>含义</th></tr>
<tr><td><strong>AUC = 1.0</strong></td><td>完美分类器（现实中不可能）</td></tr>
<tr><td><strong>AUC > 0.9</strong></td><td>非常优秀</td></tr>
<tr><td><strong>AUC > 0.8</strong></td><td>良好</td></tr>
<tr><td><strong>AUC > 0.7</strong></td><td>中等，有一定区分能力</td></tr>
<tr><td><strong>AUC = 0.5</strong></td><td>等于随机猜测，模型无效</td></tr>
<tr><td><strong>AUC < 0.5</strong></td><td>比随机还差（但可以翻转预测）</td></tr>
</table>
<p><strong>AUC 的另一个重要解释：</strong></p>
<blockquote>AUC = 随机抽一个正类样本和一个负类样本，模型给正类样本打分<strong>高于</strong>负类样本的概率。</blockquote>
<p>这就把 AUC 和模型的<strong>排序能力</strong>联系起来了——AUC 衡量的是模型能否把正类排在负类前面。</p>
<pre><code>
from sklearn.metrics import roc_auc_score
y_true = np.array([0, 0, 1, 1, 0, 1, 0, 1, 0, 1])
y_prob = np.array([0.1, 0.2, 0.95, 0.8, 0.3, 0.6, 0.05, 0.7, 0.15, 0.9])
auc = roc_auc_score(y_true, y_prob)
print(f"AUC = {auc:.4f}")
# 说明：随机抽一个正类和一个负类，有 {auc*100:.1f}% 的概率正类得分更高
</code></pre>
<p><strong>完整示例：用不同模型对比 AUC</strong></p>
<pre><code>
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
</code></pre>
<p><strong>ROC 与 PR 曲线的选择：</strong></p>
<table>
<tr><th>场景</th><th>推荐曲线</th><th>原因</th></tr>
<tr><td>数据平衡</td><td><strong>ROC曲线</strong></td><td>对两类样本一视同仁</td></tr>
<tr><td>数据极度不平衡</td><td><strong>PR曲线</strong> (Precision-Recall)</td><td>ROC 可能过于乐观（大量负类拉低 FPR）</td></tr>
</table>
<h3>3.5 代码：从零计算 AUC</h3>
<pre><code>
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
</code></pre>
<h2>4. 回归指标</h2>
<p>以上都是针对<strong>分类任务</strong>的评估指标。对于<strong>回归任务</strong>（预测连续值），我们需要另一套指标。</p>
<h3>4.1 均方误差 MSE（Mean Squared Error）</h3>
<p><strong>公式：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>MSE</mtext><mo>=</mo><mfrac><mn>1</mn><mi>m</mi></mfrac><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>m</mi></munderover><mo stretchy="false">(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent="true"><mi>y</mi><mo>^</mo></mover><mi>i</mi></msub><msup><mo stretchy="false">)</mo><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">\text{MSE} = \frac{1}{m} \sum_{i=1}^{m} (y_i - \hat{y}_i)^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">MSE</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.9291em;vertical-align:-1.2777em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">m</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6514em;"><span style="top:-1.8723em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.05em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∑</span></span></span><span style="top:-4.3em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">m</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.2777em;"><span></span></span></span></span></span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1.1141em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.1944em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1944em;"><span></span></span></span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>
<p>其中 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>y</mi><mi>i</mi></msub></mrow><annotation encoding="application/x-tex">y_i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 是真实值，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mover accent="true"><mi>y</mi><mo>^</mo></mover><mi>i</mi></msub></mrow><annotation encoding="application/x-tex">\hat{y}_i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.1944em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1944em;"><span></span></span></span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 是预测值，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi></mrow><annotation encoding="application/x-tex">m</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">m</span></span></span></span> 是样本数。</p>
<p><strong>含义：</strong> 预测误差的平方的平均值。数值越小越好。</p>
<p><strong>性质：</strong></p>
<ul>
<li><strong>总是非负</strong>（平方保证）</li>
<li><strong>单位是 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>y</mi></mrow><annotation encoding="application/x-tex">y</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span></span></span> 的平方</strong>——如果房价单位是"万元"，MSE 的单位是"万元²"</li>
<li><strong>对大误差惩罚重</strong>——一个误差为 10 的样本贡献的损失是误差为 1 的样本的 100 倍</li>
</ul>
<pre><code>
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
</code></pre>
<h3>4.2 均方根误差 RMSE（Root Mean Squared Error）</h3>
<p><strong>公式：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>RMSE</mtext><mo>=</mo><msqrt><mtext>MSE</mtext></msqrt><mo>=</mo><msqrt><mrow><mfrac><mn>1</mn><mi>m</mi></mfrac><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>m</mi></munderover><mo stretchy="false">(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent="true"><mi>y</mi><mo>^</mo></mover><mi>i</mi></msub><msup><mo stretchy="false">)</mo><mn>2</mn></msup></mrow></msqrt></mrow><annotation encoding="application/x-tex">\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (y_i - \hat{y}_i)^2}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">RMSE</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.04em;vertical-align:-0.0645em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.9755em;"><span class="svg-align" style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord" style="padding-left:0.833em;"><span class="mord text"><span class="mord">MSE</span></span></span></span><span style="top:-2.9355em;"><span class="pstrut" style="height:3em;"></span><span class="hide-tail" style="min-width:0.853em;height:1.08em;"><svg xmlns="http://www.w3.org/2000/svg" width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l0 -0
c5.3,-9.3,12,-14,20,-14
H400000v40H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M834 80h400000v40h-400000z"/></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.0645em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:3.1568em;vertical-align:-1.2777em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.8791em;"><span class="svg-align" style="top:-5.1168em;"><span class="pstrut" style="height:5.1168em;"></span><span class="mord" style="padding-left:1.056em;"><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">m</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6514em;"><span style="top:-1.8723em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.05em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∑</span></span></span><span style="top:-4.3em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">m</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.2777em;"><span></span></span></span></span></span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord"><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.1944em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1944em;"><span></span></span></span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7401em;"><span style="top:-2.989em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span><span style="top:-3.8391em;"><span class="pstrut" style="height:5.1168em;"></span><span class="hide-tail" style="min-width:0.742em;height:3.1968em;"><svg xmlns="http://www.w3.org/2000/svg" width="400em" height="3.1968em" viewBox="0 0 400000 3196" preserveAspectRatio="xMinYMin slice"><path d="M702 80H40000040
H742v3062l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1
h-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170
c-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667
219 661 l218 661zM702 80H400000v40H742z"/></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.2777em;"><span></span></span></span></span></span></span></span></span></span>
<p><strong>为什么需要 RMSE？</strong> 因为 MSE 把单位平方了，不好理解。RMSE 开根号之后，单位回到和 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>y</mi></mrow><annotation encoding="application/x-tex">y</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span></span></span> 相同。</p>
<ul>
<li>房价 MSE = 100（万元²）→ 不容易直观理解</li>
<li>房价 RMSE = 10（万元）→ 模型平均误差约 10 万，很直观</li>
</ul>
<pre><code>
rmse_manual = np.sqrt(mse_manual)
print(f"RMSE: {rmse_manual:.4f}")
</code></pre>
<h3>4.3 平均绝对误差 MAE（Mean Absolute Error）</h3>
<p><strong>公式：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>MAE</mtext><mo>=</mo><mfrac><mn>1</mn><mi>m</mi></mfrac><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>m</mi></munderover><mi mathvariant="normal">∣</mi><msub><mi>y</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent="true"><mi>y</mi><mo>^</mo></mover><mi>i</mi></msub><mi mathvariant="normal">∣</mi></mrow><annotation encoding="application/x-tex">\text{MAE} = \frac{1}{m} \sum_{i=1}^{m} |y_i - \hat{y}_i|</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">MAE</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.9291em;vertical-align:-1.2777em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">m</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6514em;"><span style="top:-1.8723em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.05em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∑</span></span></span><span style="top:-4.3em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">m</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.2777em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">∣</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.1944em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1944em;"><span></span></span></span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mord">∣</span></span></span></span></span>
<p><strong>MSE vs MAE 本质区别：</strong></p>
<table>
<tr><th>指标</th><th>对大误差的态度</th><th>对异常值的敏感度</th><th>数学性质</th></tr>
<tr><td><strong>MSE/RMSE</strong></td><td>平方放大，<strong>惩罚大误差</strong></td><td><strong>非常敏感</strong></td><td>处处可导（数学上友好）</td></tr>
<tr><td><strong>MAE</strong></td><td>线性计算，<strong>一视同仁</strong></td><td><strong>相对稳健</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex">x=0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0</span></span></span></span> 处不可导</td></tr>
</table>
<p><strong>如何选择？</strong></p>
<ul>
<li><strong>MSE/RMSE：</strong> 正常场景，大误差不应该出现时使用</li>
<li><strong>MAE：</strong> 数据中有异常值，不想让它们扭曲评估结果时使用</li>
</ul>
<pre><code>
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
print("&#92;n加入异常值后（真实 100, 预测 10）:")
print(f"MSE: {mean_squared_error(y_true_with_outlier, y_pred_with_outlier):.2f}")
print(f"MAE: {mean_absolute_error(y_true_with_outlier, y_pred_with_outlier):.2f}")
# MSE 被异常值严重拉高，MAE 受影响小得多
</code></pre>
<h3>4.4 R² 决定系数</h3>
<p>R² 我们已经在线性回归中学习过，这里做一个复习和补充。</p>
<p><strong>公式：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msup><mi>R</mi><mn>2</mn></msup><mo>=</mo><mn>1</mn><mo>−</mo><mfrac><mrow><mi>S</mi><msub><mi>S</mi><mrow><mi>r</mi><mi>e</mi><mi>s</mi></mrow></msub></mrow><mrow><mi>S</mi><msub><mi>S</mi><mrow><mi>t</mi><mi>o</mi><mi>t</mi></mrow></msub></mrow></mfrac><mo>=</mo><mn>1</mn><mo>−</mo><mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>m</mi></munderover><mo stretchy="false">(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent="true"><mi>y</mi><mo>^</mo></mover><mi>i</mi></msub><msup><mo stretchy="false">)</mo><mn>2</mn></msup></mrow><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>m</mi></munderover><mo stretchy="false">(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>−</mo><mover accent="true"><mi>y</mi><mo>ˉ</mo></mover><msup><mo stretchy="false">)</mo><mn>2</mn></msup></mrow></mfrac></mrow><annotation encoding="application/x-tex">R^2 = 1 - \frac{SS_{res}}{SS_{tot}} = 1 - \frac{\sum_{i=1}^{m}(y_i - \hat{y}_i)^2}{\sum_{i=1}^{m}(y_i - \bar{y})^2}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8641em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0077em;">R</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:2.1963em;vertical-align:-0.836em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.0576em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">t</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.1514em;"><span style="top:-2.55em;margin-left:-0.0576em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.0278em;">r</span><span class="mord mathnormal mtight">es</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.836em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:2.4978em;vertical-align:-0.994em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.5038em;"><span style="top:-2.3057em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mop"><span class="mop op-symbol small-op" style="position:relative;top:0em;">∑</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8043em;"><span style="top:-2.4003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.2029em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">m</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2997em;"><span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.5678em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.1944em;"><span class="mord">ˉ</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1944em;"><span></span></span></span></span></span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7401em;"><span style="top:-2.989em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.6897em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mop"><span class="mop op-symbol small-op" style="position:relative;top:0em;">∑</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8043em;"><span style="top:-2.4003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.2029em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">m</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2997em;"><span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord"><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.1944em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1944em;"><span></span></span></span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.994em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>
<p><strong>核心思想：</strong> 模型相比"直接用均值预测"好了多少？</p>
<ul>
<li><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>S</mi><msub><mi>S</mi><mrow><mi>r</mi><mi>e</mi><mi>s</mi></mrow></msub></mrow><annotation encoding="application/x-tex">SS_{res}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.1514em;"><span style="top:-2.55em;margin-left:-0.0576em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.0278em;">r</span><span class="mord mathnormal mtight">es</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> = 模型的预测误差</li>
<li><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>S</mi><msub><mi>S</mi><mrow><mi>t</mi><mi>o</mi><mi>t</mi></mrow></msub></mrow><annotation encoding="application/x-tex">SS_{tot}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.0576em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">t</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> = 用均值预测的误差（最"笨"的基准）</li>
<li>R² = 模型解释了多少比例的方差</li>
</ul>
<pre><code>
from sklearn.metrics import r2_score
y_true = np.array([3.0, 5.0, 2.0, 8.0, 7.0])
y_pred = np.array([2.5, 5.5, 1.8, 7.5, 7.2])
r2 = r2_score(y_true, y_pred)
print(f"R² = {r2:.4f}")
# 表示模型解释了 {r2*100:.1f}% 的数据方差
</code></pre>
<h3>4.5 回归指标对比总结</h3>
<table>
<tr><th>指标</th><th>公式</th><th>单位</th><th>范围</th><th>优点</th><th>缺点</th></tr>
<tr><td><strong>MSE</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mn>1</mn><mi>m</mi></mfrac><mo>∑</mo><mo stretchy="false">(</mo><mi>y</mi><mo>−</mo><mover accent="true"><mi>y</mi><mo>^</mo></mover><msup><mo stretchy="false">)</mo><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">\frac{1}{m}\sum(y-\hat{y})^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.1901em;vertical-align:-0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8451em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">m</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.345em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mop op-symbol small-op" style="position:relative;top:0em;">∑</span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1.0641em;vertical-align:-0.25em;"></span><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.1944em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1944em;"><span></span></span></span></span></span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>y</mi></mrow><annotation encoding="application/x-tex">y</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span></span></span> 的平方</td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mn>0</mn><mo separator="true">,</mo><mi mathvariant="normal">∞</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">[0, \infty)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">[</span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">∞</span><span class="mclose">)</span></span></span></span></td><td>数学性质好，处处可导</td><td>单位不直观，对异常值敏感</td></tr>
<tr><td><strong>RMSE</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msqrt><mrow><mi>M</mi><mi>S</mi><mi>E</mi></mrow></msqrt></mrow><annotation encoding="application/x-tex">\sqrt{MSE}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.04em;vertical-align:-0.1133em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.9267em;"><span class="svg-align" style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord" style="padding-left:0.833em;"><span class="mord mathnormal" style="margin-right:0.109em;">M</span><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="mord mathnormal" style="margin-right:0.0576em;">E</span></span></span><span style="top:-2.8867em;"><span class="pstrut" style="height:3em;"></span><span class="hide-tail" style="min-width:0.853em;height:1.08em;"><svg xmlns="http://www.w3.org/2000/svg" width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l0 -0
c5.3,-9.3,12,-14,20,-14
H400000v40H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M834 80h400000v40h-400000z"/></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1133em;"><span></span></span></span></span></span></span></span></span></td><td>同 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>y</mi></mrow><annotation encoding="application/x-tex">y</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span></span></span></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mn>0</mn><mo separator="true">,</mo><mi mathvariant="normal">∞</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">[0, \infty)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">[</span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">∞</span><span class="mclose">)</span></span></span></span></td><td>单位直观，最常用</td><td>对异常值敏感</td></tr>
<tr><td><strong>MAE</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mn>1</mn><mi>m</mi></mfrac><mo>∑</mo><mo>&lt;</mo><mi mathvariant="normal">/</mi><mi>t</mi><mi>d</mi><mo>&gt;</mo><mo>&lt;</mo><mi>t</mi><mi>d</mi><mo>&gt;</mo><mi>y</mi><mo>−</mo><mover accent="true"><mi>y</mi><mo>^</mo></mover><mo>&lt;</mo><mi mathvariant="normal">/</mi><mi>t</mi><mi>d</mi><mo>&gt;</mo><mo>&lt;</mo><mi>t</mi><mi>d</mi><mo>&gt;</mo></mrow><annotation encoding="application/x-tex">\frac{1}{m}\sum&lt;/td&gt;&lt;td&gt;y-\hat{y}&lt;/td&gt;&lt;td&gt;</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.1901em;vertical-align:-0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8451em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">m</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.345em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mop op-symbol small-op" style="position:relative;top:0em;">∑</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">/</span><span class="mord mathnormal">t</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7335em;vertical-align:-0.0391em;"></span><span class="mord mathnormal">t</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7778em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.1944em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1944em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">/</span><span class="mord mathnormal">t</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7335em;vertical-align:-0.0391em;"></span><span class="mord mathnormal">t</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;</span></span></span></span></td><td>同 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>y</mi></mrow><annotation encoding="application/x-tex">y</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span></span></span></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mn>0</mn><mo separator="true">,</mo><mi mathvariant="normal">∞</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">[0, \infty)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">[</span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">∞</span><span class="mclose">)</span></span></span></span></td><td>稳健，不受异常值过大影响</td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>y</mi><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex">y=0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0</span></span></span></span> 处不可导</td></tr>
<tr><td><strong>R²</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1</mn><mo>−</mo><mfrac><mrow><mi>S</mi><msub><mi>S</mi><mrow><mi>r</mi><mi>e</mi><mi>s</mi></mrow></msub></mrow><mrow><mi>S</mi><msub><mi>S</mi><mrow><mi>t</mi><mi>o</mi><mi>t</mi></mrow></msub></mrow></mfrac></mrow><annotation encoding="application/x-tex">1-\frac{SS_{res}}{SS_{tot}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1.3335em;vertical-align:-0.4451em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8884em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.0576em;">S</span><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.0576em;">S</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2963em;"><span style="top:-2.357em;margin-left:-0.0576em;margin-right:0.0714em;"><span class="pstrut" style="height:2.5em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">t</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.143em;"><span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.4101em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.0576em;">S</span><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.0576em;">S</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.1645em;"><span style="top:-2.357em;margin-left:-0.0576em;margin-right:0.0714em;"><span class="pstrut" style="height:2.5em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.0278em;">r</span><span class="mord mathnormal mtight">es</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.143em;"><span></span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4451em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></td><td>无量纲</td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mo>−</mo><mi mathvariant="normal">∞</mi><mo separator="true">,</mo><mn>1</mn><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">(-\infty, 1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">−</span><span class="mord">∞</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">1</span><span class="mclose">]</span></span></span></span></td><td>归一化，可跨任务对比</td><td>增加特征总会提升 R²（可用调整 R²）</td></tr>
</table>
<pre><code>
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
</code></pre>
<h2>5. 交叉验证（Cross-Validation）</h2>
<h3>5.1 为什么需要交叉验证？</h3>
<p>回想我们在[[ML基础框架]]中学过的：数据被划分为训练集、验证集、测试集。但这种方法有一个问题：</p>
<blockquote><strong>模型只在一个验证集上评估了一次</strong>——如果这次划分"运气不好"，评估结果就不靠谱。</blockquote>
<p>想象你在准备考试，但只做了一套模拟题就评估自己的水平。如果这套题刚好是你擅长的，你可能会高估自己；如果刚好是你最不擅长的，又会低估。</p>
<p><strong>交叉验证</strong> 解决了这个问题：<strong>让每个样本都有机会做一次"验证"</strong>，然后取平均评估结果。</p>
<h3>5.2 K-Fold 交叉验证（K 折交叉验证）</h3>
<p><strong>步骤：</strong></p>
<pre><code>
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
</code></pre>
<p><strong>最常用的 K 值：</strong></p>
<ul>
<li><strong>K = 5</strong>：训练 80%，验证 20% —— 平衡了偏差和方差</li>
<li><strong>K = 10</strong>：训练 90%，验证 10% —— 更稳定但更慢</li>
</ul>
<pre><code>
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
print(f"&#92;n平均准确率: {np.mean(scores):.4f} (+/- {np.std(scores):.4f})")
</code></pre>
<pre><code>
# 方法2：cross_val_score 一行搞定
cv_scores = cross_val_score(
LogisticRegression(max_iter=200, multi_class='multinomial'),
X, y, cv=5
)
print(f"5 折交叉验证得分: {cv_scores}")
print(f"平均: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
</code></pre>
<p><strong>K-Fold 关键参数：</strong></p>
<table>
<tr><th>参数</th><th>含义</th><th>说明</th></tr>
<tr><td><code>n_splits</code></td><td>折数</td><td>常用 5 或 10</td></tr>
<tr><td><code>shuffle</code></td><td>是否打乱</td><td>设为 <code>True</code> 避免数据顺序偏差</td></tr>
<tr><td><code>random_state</code></td><td>随机种子</td><td>固定后结果可复现</td></tr>
</table>
<h3>5.3 Stratified K-Fold（分层 K 折交叉验证）</h3>
<p><strong>问题：</strong> 普通 K-Fold 是随机划分，如果数据的某个类别（如正类）只占 10%，某次划分可能导致某个 Fold 完全没有正类样本。</p>
<pre><code>
普通 K-Fold 的问题：类别比例不一致
全体数据 (0 占 80%, 1 占 20%)
┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐
│0 │1 │0 │0 │1 │0 │0 │0 │0 │1 │ ...
└──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘
Fold 1     Fold 2     Fold 3     Fold 4     Fold 5
┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
│0 0 0 │   │0 0 1 │   │1 0 0 │   │0 1 1 │   │0 0 0 │ ← 没有 1！
└──────┘   └──────┘   └──────┘   └──────┘   └──────┘
</code></pre>
<p><strong>Stratified K-Fold</strong> 保证每个 Fold 中各类别比例和整体比例一致。</p>
<pre><code>
Stratified K-Fold：每个 Fold 类别比例一致
Fold 1     Fold 2     Fold 3     Fold 4     Fold 5
┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
│0 0 1 │   │0 0 1 │   │0 0 1 │   │0 0 1 │   │0 0 1 │ ← 每个都有 1
└──────┘   └──────┘   └──────┘   └──────┘   └──────┘
</code></pre>
<pre><code>
from sklearn.model_selection import StratifiedKFold
# 模拟不平衡数据（正类只占 20%）
np.random.seed(42)
y_imbalanced = np.array([0] * 80 + [1] * 20)
np.random.shuffle(y_imbalanced)
print(f"正类比例: {y_imbalanced.mean():.2f}")  # 0.20
# 普通 K-Fold
kf = KFold(n_splits=5, shuffle=True, random_state=42)
print("&#92;n普通 K-Fold 各类别 Fold 正类数量:")
for i, (_, val_idx) in enumerate(kf.split(y_imbalanced)):
val_labels = y_imbalanced[val_idx]
print(f"  Fold {i+1}: 正类 {val_labels.sum()}/{(val_labels == 0).sum()} 负类")
# Stratified K-Fold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
print("&#92;nStratified K-Fold 各类别 Fold 正类数量:")
for i, (_, val_idx) in enumerate(skf.split(y_imbalanced, y_imbalanced)):
val_labels = y_imbalanced[val_idx]
print(f"  Fold {i+1}: 正类 {val_labels.sum()}/{(val_labels == 0).sum()} 负类")
</code></pre>
<p><strong>使用建议：</strong></p>
<ul>
<li><strong>分类任务</strong> → 优先用 <code>StratifiedKFold</code>（数据不平衡时尤其重要）</li>
<li><strong>回归任务</strong> → 用 <code>KFold</code>（回归标签是连续值，无法分层）</li>
</ul>
<h3>5.4 Leave-One-Out 交叉验证（LOO）</h3>
<p><strong>LOO 是 K-Fold 的极端情况：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>K</mi><mo>=</mo><mi>m</mi></mrow><annotation encoding="application/x-tex">K = m</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">K</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">m</span></span></span></span>（样本数），每次只用 1 个样本做验证，其余 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">m-1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">m</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span> 个做训练。</p>
<pre><code>
from sklearn.model_selection import LeaveOneOut
loo = LeaveOneOut()
n_samples = 10
print(f"LOO 会训练 {n_samples} 次:")
for i, (train_idx, test_idx) in enumerate(loo.split(range(n_samples))):
print(f"  第 {i+1} 轮: 训练 {len(train_idx)} 个, 验证 {len(test_idx)} 个")
if i >= 2:  # 只显示前 3 行
print("  ...")
break
</code></pre>
<p><strong>LOO 的优缺点：</strong></p>
<table>
<tr><th>优点</th><th>缺点</th></tr>
<tr><td>利用了几乎所有数据训练（<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">m-1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">m</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span> 个）</td><td>计算量极大——训练 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi></mrow><annotation encoding="application/x-tex">m</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">m</span></span></span></span> 次</td></tr>
<tr><td>评估结果几乎无偏</td><td>方差大（每次评估只基于 1 个样本）</td></tr>
<tr><td>适合非常小的数据集（<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi><mo>&lt;</mo><mn>50</mn></mrow><annotation encoding="application/x-tex">m &lt; 50</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.5782em;vertical-align:-0.0391em;"></span><span class="mord mathnormal">m</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">50</span></span></span></span>）</td><td>大数据集不可行</td></tr>
</table>
<h3>5.5 三种交叉验证对比</h3>
<table>
<tr><th>方法</th><th>训练次数</th><th>每次训练数据</th><th>优缺点</th></tr>
<tr><td><strong>K-Fold</strong> (<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>K</mi><mo>=</mo><mn>5</mn></mrow><annotation encoding="application/x-tex">K=5</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">K</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">5</span></span></span></span>)</td><td>5 次</td><td>80%</td><td>最常用，偏差与方差平衡</td></tr>
<tr><td><strong>Stratified K-Fold</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>K</mi></mrow><annotation encoding="application/x-tex">K</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">K</span></span></span></span> 次</td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>K</mi><mo>−</mo><mn>1</mn></mrow><mi>K</mi></mfrac></mrow><annotation encoding="application/x-tex">\frac{K-1}{K}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2173em;vertical-align:-0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.0715em;">K</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.0715em;">K</span><span class="mbin mtight">−</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.345em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></td><td>分类任务首选，保持类别比例</td></tr>
<tr><td><strong>Leave-One-Out</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi></mrow><annotation encoding="application/x-tex">m</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">m</span></span></span></span> 次</td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">m-1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">m</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span> 个</td><td>几乎无偏但极慢，小数据集用</td></tr>
</table>
<p><strong>对比 C++：</strong></p>
<p>C++ 中没有 sklearn 的 <code>cross_val_score</code> 这样的高级接口，但交叉验证的逻辑本质上是一个 for 循环：</p>
<pre><code>
// C++ 中交叉验证的伪代码
#include &lt;vector>
#include &lt;algorithm>
template&lt;typename Model, typename Data>
std::vector&lt;double> cross_validate(
Model&amp; model, const Data&amp; X, const std::vector&lt;int>&amp; y, int K) {
std::vector&lt;double> scores;
int fold_size = X.size() / K;
for (int fold = 0; fold &lt; K; ++fold) {
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
</code></pre>
<h3>5.6 交叉验证的完整示例</h3>
<pre><code>
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
print("&#92;n⚠️ 如果训练集分数远高于验证集，说明存在过拟合")
</code></pre>
<h2>6. 验收标准：手动计算 Precision 和 Recall（重点展开）</h2>
<h3>6.1 三层结构拆解</h3>
<p><strong>Step 1：构建混淆矩阵</strong></p>
<p>给定分类结果，第一步永远是把结果填入 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>2</mn><mo>×</mo><mn>2</mn></mrow><annotation encoding="application/x-tex">2 \times 2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">2</span></span></span></span> 矩阵：</p>
<pre><code>
预测正类    预测负类
真实正类        ?           ?
真实负类        ?           ?
</code></pre>
<p><strong>Step 2：填入四个值</strong></p>
<p>逐行扫描真实标签和预测标签，判断每个样本属于哪个格子：</p>
<ul>
<li>真实=正类 & 预测=正类 → <strong>TP</strong> 加 1</li>
<li>真实=正类 & 预测=负类 → <strong>FN</strong> 加 1</li>
<li>真实=负类 & 预测=正类 → <strong>FP</strong> 加 1</li>
<li>真实=负类 & 预测=负类 → <strong>TN</strong> 加 1</li>
</ul>
<p><strong>Step 3：代入公式计算</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Precision</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>P</mi></mrow></mfrac><mspace width="1em"/><mtext>Recall</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{Precision} = \frac{TP}{TP + FP} \quad \text{Recall} = \frac{TP}{TP + FN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">Precision</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.1297em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">F</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:1em;"></span><span class="mord text"><span class="mord">Recall</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.1297em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">F</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>
<h3>6.2 手算演练</h3>
<p><strong>题目：</strong> 给定以下 15 个样本的真实标签和逻辑回归预测结果（阈值 0.5），计算 Precision 和 Recall。</p>
<pre><code>
样本编号: 1   2   3   4   5   6   7   8   9   10  11  12  13  14  15
真实标签: 1   0   1   1   0   1   0   0   1   0   1   1   0   1   0
预测概率: 0.9 0.3 0.7 0.8 0.6 0.4 0.2 0.1 0.95 0.8 0.55 0.65 0.3 0.85 0.4
预测类别: 1   0   1   1   1   0   0   0   1   1   1   1   0   1   0
</code></pre>
<p><strong>逐行填入混淆矩阵：</strong></p>
<table>
<tr><th>样本</th><th>真实</th><th>预测</th><th>归属</th></tr>
<tr><td>1</td><td>1</td><td>1</td><td><strong>TP</strong> ✅</td></tr>
<tr><td>2</td><td>0</td><td>0</td><td><strong>TN</strong> ✅</td></tr>
<tr><td>3</td><td>1</td><td>1</td><td><strong>TP</strong> ✅</td></tr>
<tr><td>4</td><td>1</td><td>1</td><td><strong>TP</strong> ✅</td></tr>
<tr><td>5</td><td>0</td><td>1</td><td><strong>FP</strong> ❌</td></tr>
<tr><td>6</td><td>1</td><td>0</td><td><strong>FN</strong> ❌</td></tr>
<tr><td>7</td><td>0</td><td>0</td><td><strong>TN</strong> ✅</td></tr>
<tr><td>8</td><td>0</td><td>0</td><td><strong>TN</strong> ✅</td></tr>
<tr><td>9</td><td>1</td><td>1</td><td><strong>TP</strong> ✅</td></tr>
<tr><td>10</td><td>0</td><td>1</td><td><strong>FP</strong> ❌</td></tr>
<tr><td>11</td><td>1</td><td>1</td><td><strong>TP</strong> ✅</td></tr>
<tr><td>12</td><td>1</td><td>1</td><td><strong>TP</strong> ✅</td></tr>
<tr><td>13</td><td>0</td><td>0</td><td><strong>TN</strong> ✅</td></tr>
<tr><td>14</td><td>1</td><td>1</td><td><strong>TP</strong> ✅</td></tr>
<tr><td>15</td><td>0</td><td>0</td><td><strong>TN</strong> ✅</td></tr>
</table>
<p><strong>汇总：</strong></p>
<ul>
<li>TP = 样本 1, 3, 4, 9, 11, 12, 14 = <strong>7</strong></li>
<li>TN = 样本 2, 7, 8, 13, 15 = <strong>5</strong></li>
<li>FP = 样本 5, 10 = <strong>2</strong></li>
<li>FN = 样本 6 = <strong>1</strong></li>
</ul>
<p><strong>验证：</strong></p>
<ul>
<li>总样本 = 7 + 5 + 2 + 1 = 15 ✅</li>
<li>真实正类数 = TP + FN = 7 + 1 = 8 ✅（样本中确实有 8 个 1）</li>
<li>真实负类数 = TN + FP = 5 + 2 = 7 ✅（样本中确实有 7 个 0）</li>
</ul>
<p><strong>计算：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Precision</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>P</mi></mrow></mfrac><mo>=</mo><mfrac><mn>7</mn><mrow><mn>7</mn><mo>+</mo><mn>2</mn></mrow></mfrac><mo>=</mo><mfrac><mn>7</mn><mn>9</mn></mfrac><mo>≈</mo><mn>0.778</mn></mrow><annotation encoding="application/x-tex">\text{Precision} = \frac{TP}{TP + FP} = \frac{7}{7 + 2} = \frac{7}{9} \approx 0.778</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">Precision</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.1297em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">F</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.0908em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">7</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">2</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">7</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.0074em;vertical-align:-0.686em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">9</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">7</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≈</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0.778</span></span></span></span></span>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Recall</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac><mo>=</mo><mfrac><mn>7</mn><mrow><mn>7</mn><mo>+</mo><mn>1</mn></mrow></mfrac><mo>=</mo><mfrac><mn>7</mn><mn>8</mn></mfrac><mo>=</mo><mn>0.875</mn></mrow><annotation encoding="application/x-tex">\text{Recall} = \frac{TP}{TP + FN} = \frac{7}{7 + 1} = \frac{7}{8} = 0.875</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord text"><span class="mord">Recall</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.1297em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">F</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.0908em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">7</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">1</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">7</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.0074em;vertical-align:-0.686em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">8</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">7</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0.875</span></span></span></span></span>
<p><strong>F1-Score：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>F1</mtext><mo>=</mo><mn>2</mn><mo>×</mo><mfrac><mrow><mn>0.778</mn><mo>×</mo><mn>0.875</mn></mrow><mrow><mn>0.778</mn><mo>+</mo><mn>0.875</mn></mrow></mfrac><mo>=</mo><mn>2</mn><mo>×</mo><mfrac><mn>0.681</mn><mn>1.653</mn></mfrac><mo>≈</mo><mn>0.824</mn></mrow><annotation encoding="application/x-tex">\text{F1} = 2 \times \frac{0.778 \times 0.875}{0.778 + 0.875} = 2 \times \frac{0.681}{1.653} \approx 0.824</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">F1</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:2.0908em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">0.778</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">0.875</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">0.778</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">0.875</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:2.0074em;vertical-align:-0.686em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">1.653</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">0.681</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≈</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0.824</span></span></span></span></span>
<pre><code>
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
</code></pre>
<h3>6.3 速记口诀</h3>
<blockquote><strong>Precision = 猜对了的正类 / 所有猜成正类的</strong><strong>Recall = 猜对了的正类 / 所有真实正类的</strong></blockquote>
<p>更形象地说：</p>
<ul>
<li>Precision 问的是<strong>"我说是正类的时候，我靠谱吗？"</strong></li>
<li>Recall 问的是<strong>"所有正类样本，我找回来了多少？"</strong></li>
</ul>
<h3>6.4 自问自答</h3>
<p><strong>Q：我能不能只用精确率或召回率中的一个？</strong></p>
<p>A：不能。只看精确率可以轻松做到 1.0（只预测 1 次正类，正确就好，其他全判负类），但召回率会很低。只看召回率也可以做到 1.0（全部判为正类），但精确率会很低。必须两者综合看。</p>
<p><strong>Q：怎么判断模型更看重精确率还是召回率？</strong></p>
<p>A：看应用场景。癌症筛查更看重召回率（不希望漏掉任何一个患者），垃圾邮件过滤更看重精确率（不希望正常邮件被误拦）。F1-Score 在两者之间取平衡。</p>
<p><strong>Q：Accuracy 什么时候会"骗人"？</strong></p>
<p>A：数据极度不平衡时。比如 99% 的样本是负类，1% 是正类。全判为负类的"模型"准确率 99%，但它一个正类都没认出来。这时候 Precision、Recall、F1 比 Accuracy 更有意义。</p>
<h2>核心对比表格</h2>
<h3>分类 vs 回归指标</h3>
<table>
<tr><th>维度</th><th>分类</th><th>回归</th></tr>
<tr><td><strong>任务目标</strong></td><td>预测离散类别</td><td>预测连续值</td></tr>
<tr><td><strong>核心问题</strong></td><td>哪些分对了？哪些分错了？犯了什么错？</td><td>预测值和真实值差多少？</td></tr>
<tr><td><strong>基础工具</strong></td><td>混淆矩阵（TP/TN/FP/FN）</td><td>误差平方和、绝对值</td></tr>
<tr><td><strong>主要指标</strong></td><td>Accuracy, Precision, Recall, F1</td><td>MSE, RMSE, MAE, R²</td></tr>
<tr><td><strong>阈值选择</strong></td><td>ROC 曲线 + AUC</td><td>无需阈值</td></tr>
<tr><td><strong>验证方式</strong></td><td>Stratified K-Fold（分类首选）</td><td>K-Fold（回归）</td></tr>
</table>
<h3>四种交叉验证对比</h3>
<table>
<tr><th>方法</th><th>每次训练数据</th><th>总训练次数</th><th>适用场景</th><th>偏差</th><th>方差</th><th>计算成本</th></tr>
<tr><td><strong>K-Fold (K=5)</strong></td><td>80%</td><td>5</td><td>回归任务</td><td>中等</td><td>低</td><td>低</td></tr>
<tr><td><strong>Stratified K-Fold</strong></td><td>80%</td><td>5</td><td>分类任务（尤其不平衡时）</td><td>中等</td><td>低</td><td>低</td></tr>
<tr><td><strong>K-Fold (K=10)</strong></td><td>90%</td><td>10</td><td>数据量足时更稳定</td><td>较低</td><td>更低</td><td>中等</td></tr>
<tr><td><strong>Leave-One-Out</strong></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">m-1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">m</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span></td><td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi></mrow><annotation encoding="application/x-tex">m</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">m</span></span></span></span></td><td>小数据集（<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi><mo>&lt;</mo><mn>50</mn></mrow><annotation encoding="application/x-tex">m &lt; 50</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.5782em;vertical-align:-0.0391em;"></span><span class="mord mathnormal">m</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">50</span></span></span></span>）</td><td>最低</td><td>高</td><td>极高</td></tr>
</table>
<h2>完整代码示例</h2>
<pre><code>
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
print("&#92;n混淆矩阵:")
cm = confusion_matrix(y_test, y_pred)
print(f"        Pred Neg  Pred Pos")
print(f"True Neg  {cm[0,0]:3d}       {cm[0,1]:3d}")
print(f"True Pos  {cm[1,0]:3d}       {cm[1,1]:3d}")
print("&#92;n分类报告:")
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
</code></pre>
<h2>练习题（25 道）</h2>
<p><strong>1. 混淆矩阵中 FN 代表什么？</strong></p>
<p><strong>答案：</strong> False Negative，模型预测为负类但实际是正类——<strong>漏报</strong>，本应检测出来但没有。</p>
<p><strong>2. 混淆矩阵的四个值之间有什么关系？</strong></p>
<p><strong>答案：</strong> TP + FN = 真实正类总数，TN + FP = 真实负类总数，TP + TN + FP + FN = 总样本数。</p>
<p><strong>3. 准确率 Accuracy 的公式是什么？</strong></p>
<p><strong>答案：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mtext>Accuracy</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>T</mi><mi>N</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>T</mi><mi>N</mi><mo>+</mo><mi>F</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord text"><span class="mord">Accuracy</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></p>
<p><strong>4. 什么时候准确率会误导人？</strong></p>
<p><strong>答案：</strong> 数据不平衡时。99% 负类 + 1% 正类时，全判负类就得到 99% 准确率，但模型完全没用。</p>
<p><strong>5. 精确率 Precision 的公式是什么？</strong></p>
<p><strong>答案：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mtext>Precision</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>P</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{Precision} = \frac{TP}{TP + FP}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">Precision</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></p>
<p><strong>6. 召回率 Recall 的公式是什么？</strong></p>
<p><strong>答案：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mtext>Recall</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{Recall} = \frac{TP}{TP + FN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord text"><span class="mord">Recall</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></p>
<p><strong>7. 精确率和召回率各关注什么类型的错误？</strong></p>
<p><strong>答案：</strong> 精确率关注<strong>误报（FP）</strong>——模型说"是正类"但实际不是；召回率关注<strong>漏报（FN）</strong>——模型没认出正类。</p>
<p><strong>8. 在癌症筛查场景中，应该更重视精确率还是召回率？</strong></p>
<p><strong>答案：</strong> <strong>召回率</strong>。宁可误诊（FP 多一些），也绝不能漏诊（FN 要尽量少）。</p>
<p><strong>9. 在垃圾邮件过滤场景中，应该更重视精确率还是召回率？</strong></p>
<p><strong>答案：</strong> <strong>精确率</strong>。宁可漏掉几封垃圾邮件，也不能把正常邮件关进垃圾箱。</p>
<p><strong>10. F1-Score 的公式是什么？</strong></p>
<p><strong>答案：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mtext>F1</mtext><mo>=</mo><mn>2</mn><mo>×</mo><mfrac><mrow><mi>P</mi><mo>×</mo><mi>R</mi></mrow><mrow><mi>P</mi><mo>+</mo><mi>R</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{F1} = 2 \times \frac{P \times R}{P + R}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">F1</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.0077em;">R</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">×</span><span class="mord mathnormal mtight" style="margin-right:0.0077em;">R</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span>，其中 P 是精确率，R 是召回率。</p>
<p><strong>11. 为什么 F1 用调和平均而不是算术平均？</strong></p>
<p><strong>答案：</strong> 调和平均对极端值更敏感。如果 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>P</mi><mo>=</mo><mn>1.0</mn></mrow><annotation encoding="application/x-tex">P=1.0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1.0</span></span></span></span> 但 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>R</mi><mo>=</mo><mn>0.0</mn></mrow><annotation encoding="application/x-tex">R=0.0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0077em;">R</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0.0</span></span></span></span>，算术平均 = 0.5（看起来还行），调和平均 = 0.0（正确反映模型无用）。</p>
<p><strong>12. ROC 曲线的 X 轴和 Y 轴分别是什么？</strong></p>
<p><strong>答案：</strong> X 轴 = FPR（假正率）= <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>F</mi><mi>P</mi></mrow><mrow><mi>F</mi><mi>P</mi><mo>+</mo><mi>T</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{FP}{FP+TN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span>；Y 轴 = TPR（真正率/召回率）= <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{TP}{TP+FN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></p>
<p><strong>13. AUC = 0.5 表示什么？AUC = 0.9 呢？</strong></p>
<p><strong>答案：</strong> AUC = 0.5 表示模型等于随机猜测；AUC = 0.9 表示模型有 90% 的概率把正类排到负类前面。</p>
<p><strong>14. AUC 的直观含义是什么？</strong></p>
<p><strong>答案：</strong> 随机抽一个正类样本和一个负类样本，模型给正类打分高于负类的概率。</p>
<p><strong>15. MSE 和 MAE 的主要区别是什么？</strong></p>
<p><strong>答案：</strong> MSE 平方放大误差，对大误差惩罚重，对异常值敏感；MAE 线性计算误差，更稳健。</p>
<p><strong>16. RMSE 和 MSE 是什么关系？</strong></p>
<p><strong>答案：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mtext>RMSE</mtext><mo>=</mo><msqrt><mtext>MSE</mtext></msqrt></mrow><annotation encoding="application/x-tex">\text{RMSE} = \sqrt{\text{MSE}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">RMSE</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.04em;vertical-align:-0.1133em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.9267em;"><span class="svg-align" style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord" style="padding-left:0.833em;"><span class="mord text"><span class="mord">MSE</span></span></span></span><span style="top:-2.8867em;"><span class="pstrut" style="height:3em;"></span><span class="hide-tail" style="min-width:0.853em;height:1.08em;"><svg xmlns="http://www.w3.org/2000/svg" width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l0 -0
c5.3,-9.3,12,-14,20,-14
H400000v40H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M834 80h400000v40h-400000z"/></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1133em;"><span></span></span></span></span></span></span></span></span>。RMSE 的单位和 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>y</mi></mrow><annotation encoding="application/x-tex">y</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span></span></span> 一致，比 MSE 更直观。</p>
<p><strong>17. R² 的范围是多少？R² = 0.7 表示什么？</strong></p>
<p><strong>答案：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mo>−</mo><mi mathvariant="normal">∞</mi><mo separator="true">,</mo><mn>1</mn><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">(-\infty, 1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">−</span><span class="mord">∞</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">1</span><span class="mclose">]</span></span></span></span>。R² = 0.7 表示模型解释了 70% 的数据方差，比直接用均值预测好了 70%。</p>
<p><strong>18. K-Fold 交叉验证中 K=5 表示什么？</strong></p>
<p><strong>答案：</strong> 数据分成 5 份，轮流传 4 份训练、1 份验证，共训练 5 次，取 5 次验证结果的平均值。</p>
<p><strong>19. Stratified K-Fold 和普通 K-Fold 的区别？</strong></p>
<p><strong>答案：</strong> Stratified K-Fold 确保每个 Fold 中各类别比例与整体一致，适合不平衡的分类任务。</p>
<p><strong>20. Leave-One-Out 交叉验证的优缺点？</strong></p>
<p><strong>答案：</strong> 优点：几乎无偏，利用几乎所有数据训练。缺点：要训练 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>m</mi></mrow><annotation encoding="application/x-tex">m</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">m</span></span></span></span> 次，计算量极大，方差高。</p>
<p><strong>21. 给定混淆矩阵 TP=80, TN=60, FP=10, FN=20，计算 Precision 和 Recall。</strong></p>
<p><strong>答案：</strong> Precision = 80/(80+10) = 0.889，Recall = 80/(80+20) = 0.800</p>
<p><strong>22. 在实际 ML 项目中，交叉验证通常用来做什么？</strong></p>
<p><strong>答案：</strong> ① 评估模型泛化能力（比单次划分更可靠）；② 调优超参数（网格搜索配合交叉验证）；③ 对比不同模型的性能。</p>
<p><strong>23. 如何进行交叉验证的同时计算训练集分数？有什么意义？</strong></p>
<p><strong>答案：</strong> 用 <code>cross_validate</code> 设置 <code>return_train_score=True</code>。通过对比训练集和验证集分数，可以检测是否<strong>过拟合</strong>——训练集分数远高于验证集说明过拟合。</p>
<p><strong>24. 对于多分类问题（如 10 个手写数字），怎么计算 Precision 和 Recall？</strong></p>
<p><strong>答案：</strong> 对每个类别单独计算（将该类视为正类，其他视为负类），然后取平均。有三种平均方式：Micro（全局计算）、Macro（各类等权平均）、Weighted（按样本数加权平均）。</p>
<p><strong>25. 综合题：给定 20 个样本的真实标签和预测概率（阈值 0.5），画出混淆矩阵，计算 Accuracy、Precision、Recall、F1、AUC。</strong></p>
<p><strong>答案：</strong></p>
<pre><code>
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
print("&#92;n混淆矩阵:")
print(confusion_matrix(y_true, y_pred))
</code></pre>
<p><details><summary>答案</summary></p>
<pre><code>
Accuracy:  0.8500
Precision: 0.8750
Recall:    0.8750
F1:        0.8750
AUC:       0.9562
混淆矩阵:
Pred Neg  Pred Pos
True Neg    8         1
True Pos    1         7
</code></pre>
<p></details></p>
<h2>核心记忆卡片</h2>
<ol>
<li><strong>混淆矩阵四要素：</strong> TP（猜对的正类）、TN（猜对的负类）、FP（误报）、FN（漏报）</li>
<li><strong>Accuracy：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>T</mi><mi>N</mi></mrow><mrow><mi>T</mi><mi>o</mi><mi>t</mi><mi>a</mi><mi>l</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{TP+TN}{Total}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2173em;vertical-align:-0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">a</span><span class="mord mathnormal mtight" style="margin-right:0.0197em;">l</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.345em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span>，数据平衡时有用，不平衡时会被多数类主导</li>
<li><strong>Precision：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>P</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{TP}{TP+FP}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span>，模型说正类的"可信度"，关注误报</li>
<li><strong>Recall：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{TP}{TP+FN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">F</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">N</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">T</span><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span>，模型找回正类的"捕获率"，关注漏报</li>
<li><strong>F1：</strong> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>2</mn><mo>×</mo><mfrac><mrow><mi>P</mi><mo>×</mo><mi>R</mi></mrow><mrow><mi>P</mi><mo>+</mo><mi>R</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">2 \times \frac{P \times R}{P + R}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1.2757em;vertical-align:-0.4033em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8723em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.0077em;">R</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1389em;">P</span><span class="mbin mtight">×</span><span class="mord mathnormal mtight" style="margin-right:0.0077em;">R</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4033em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span>，Precision 和 Recall 的调和平均，极端场景下不被"平庸分数"骗到</li>
<li><strong>ROC 曲线：</strong> 以 FPR 为横轴、TPR（Recall）为纵轴，展示模型在不同阈值下的表现</li>
<li><strong>AUC：</strong> ROC 曲线下面积，衡量模型<strong>排序能力</strong>，AUC = 0.5 是随机</li>
<li><strong>回归四件套：</strong> MSE（平方误差均值）、RMSE（单位同 y）、MAE（绝对值，稳健）、R²（方差解释率）</li>
<li><strong>K-Fold 交叉验证：</strong> 数据分 K 份，轮流做验证，取平均——比单次划分更可靠</li>
<li><strong>Stratified K-Fold：</strong> 保持每个 Fold 类别比例一致，分类任务首选</li>
</ol>
<h2>验收标准自测</h2>
<blockquote><strong>给定一个分类结果，能手动计算 Precision 和 Recall</strong></blockquote>
<p><strong>我的理解：</strong></p>
<p>分三步走：</p>
<p><strong>① 构建混淆矩阵：</strong> 对比每个样本的真实标签和预测标签，填入 TP / TN / FP / FN</p>
<p><strong>② 统计四值：</strong> 逐行扫描，计数</p>
<p><strong>③ 代入公式：</strong></p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Precision</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>P</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{Precision} = \frac{TP}{TP + FP}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord text"><span class="mord">Precision</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.1297em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">F</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Recall</mtext><mo>=</mo><mfrac><mrow><mi>T</mi><mi>P</mi></mrow><mrow><mi>T</mi><mi>P</mi><mo>+</mo><mi>F</mi><mi>N</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\text{Recall} = \frac{TP}{TP + FN}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord text"><span class="mord">Recall</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.1297em;vertical-align:-0.7693em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3603em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.1389em;">F</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1389em;">T</span><span class="mord mathnormal" style="margin-right:0.1389em;">P</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>
<p><strong>示例速记：</strong></p>
<pre><code>
给定 20 个样本的 (真实, 预测)：
TP: 真实=1, 预测=1  →  数
FN: 真实=1, 预测=0  →  数
FP: 真实=0, 预测=1  →  数
TN: 真实=0, 预测=0  →  数
Precision = TP / (TP + FP)   ← 分母是"预测为正类"的总数
Recall    = TP / (TP + FN)   ← 分母是"真实为正类"的总数
</code></pre>
<p><strong>常见陷阱：</strong></p>
<ul>
<li>不要把 TP 和 FP 搞混——TP 是预测对了正类，FP 是预测错了正类</li>
<li>不要把分母搞混——Precision 的分母是<strong>预测</strong>的正类数，Recall 的分母是<strong>真实</strong>的正类数</li>
</ul>
<h2>📎 参考资源</h2>
<ul>
<li>吴恩达 ML Specialization Week 2-3</li>
<li>《统计学习方法》第 1 章（模型评估部分）</li>
<li><a href="https://scikit-learn.org/stable/modules/model_evaluation.html" target="_blank">scikit-learn Model Evaluation 文档</a></li>
<li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_validate.html" target="_blank">scikit-learn cross_validate 文档</a></li>
</ul>
<h2>相关链接</h2>
<ul>
<li>[[Phase 4 - 机器学习基础]] — 本阶段任务清单</li>
<li>[[逻辑回归]] ⬅️ 上一节：逻辑回归</li>
<li>[[线性回归]] — MSE/R² 相关内容</li>
<li>[[ML基础框架]] — 数据划分与过拟合</li>
<li>➡️ 下一节：[[支持向量机 SVM]]（待学习）</li>
</ul>`,
    date: "2026.06.06 — 17:38:57",
    min: "5",
    tags: ["[MachineLearning, \u6a21\u578b\u8bc4\u4f30, \u6df7\u6dc6\u77e9\u9635, ROC, AUC, \u4ea4\u53c9\u9a8c\u8bc1, sklearn, Phase-4]"],
    slug: "model-evaluation",
    label: "LATEST TRANSMISSION",
    labelZh: "最新传输",
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
<tr><td>换行符</td><td>自动处理 <code>&#92;n</code></td><td><code>&#92;n</code> / <code>&#92;r&#92;n</code> 需手动处理</td></tr>
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
lines = f.readlines()       # ['line1&#92;n', 'line2&#92;n', ...]
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
f.write("Hello, World!&#92;n")
f.write("Second line&#92;n")
# 追加写入
with open("log.txt", "a", encoding="utf-8") as f:
f.write("New log entry&#92;n")
# 写入多行
lines = ["a&#92;n", "b&#92;n", "c&#92;n"]
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
<tr><td><code>ensure_ascii=False</code></td><td>中文不转义为 <code>&#92;uXXXX</code></td></tr>
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
<p><strong>答案：</strong> Windows 下文本模式的换行符转换会导致 CSV 写入时多出空行。<code>newline=""</code> 禁用自动转换，保证 <code>&#92;n</code> 原样写入。</p>
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
<p><strong>答案：</strong> 禁用 ASCII 转义，让中文字符直接输出为 <code>"中文"</code> 而不是 <code>"&#92;u4e2d&#92;u6587"</code>。</p>
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
<tr><td><code>&#92;d</code></td><td>数字 <code>[0-9]</code></td><td><code>&#92;d{3}</code> → <code>123</code></td></tr>
<tr><td><code>&#92;w</code></td><td>单词字符 <code>[a-zA-Z0-9_]</code></td><td><code>&#92;w+</code> → <code>hello_123</code></td></tr>
<tr><td><code>&#92;s</code></td><td>空白字符（空格、制表、换行等）</td><td><code>a&#92;s+b</code> → <code>a   b</code></td></tr>
<tr><td><code>^</code></td><td>字符串开头</td><td><code>^abc</code> → 仅匹配开头的 <code>abc</code></td></tr>
<tr><td><code><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>&lt;</mo><mi mathvariant="normal">/</mi><mi>c</mi><mi>o</mi><mi>d</mi><mi>e</mi><mo>&gt;</mo><mo>&lt;</mo><mi mathvariant="normal">/</mi><mi>t</mi><mi>d</mi><mo>&gt;</mo><mo>&lt;</mo><mi>t</mi><mi>d</mi><mo>&gt;</mo><mtext>字符串结尾</mtext><mo>&lt;</mo><mi mathvariant="normal">/</mi><mi>t</mi><mi>d</mi><mo>&gt;</mo><mo>&lt;</mo><mi>t</mi><mi>d</mi><mo>&gt;</mo><mo>&lt;</mo><mi>c</mi><mi>o</mi><mi>d</mi><mi>e</mi><mo>&gt;</mo><mi>x</mi><mi>y</mi><mi>z</mi></mrow><annotation encoding="application/x-tex">&lt;/code&gt;&lt;/td&gt;&lt;td&gt;字符串结尾&lt;/td&gt;&lt;td&gt;&lt;code&gt;xyz</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.5782em;vertical-align:-0.0391em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">/</span><span class="mord mathnormal">co</span><span class="mord mathnormal">d</span><span class="mord mathnormal">e</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">/</span><span class="mord mathnormal">t</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7335em;vertical-align:-0.0391em;"></span><span class="mord mathnormal">t</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7224em;vertical-align:-0.0391em;"></span><span class="mord cjk_fallback">字符串结尾</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">/</span><span class="mord mathnormal">t</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7335em;vertical-align:-0.0391em;"></span><span class="mord mathnormal">t</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7335em;vertical-align:-0.0391em;"></span><span class="mord mathnormal">co</span><span class="mord mathnormal">d</span><span class="mord mathnormal">e</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal">x</span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="mord mathnormal" style="margin-right:0.044em;">z</span></span></span></span></code> → 仅匹配结尾的 <code>xyz</code></td></tr>
<tr><td><code>&#92;</code></td><td>转义字符</td><td><code>&#92;.</code> 匹配真实点号</td></tr>
</table>
<h3>1.2 字符类（Character Classes）</h3>
<table>
<tr><th>语法</th><th>含义</th></tr>
<tr><td><code>[abc]</code></td><td>匹配 <code>a</code>、<code>b</code> 或 <code>c</code></td></tr>
<tr><td><code>[^abc]</code></td><td>匹配<strong>非</strong> <code>a</code>、<code>b</code>、<code>c</code> 的字符</td></tr>
<tr><td><code>[a-z]</code> / <code>[0-9]</code></td><td>范围匹配</td></tr>
<tr><td><code>&#92;D</code> / <code>&#92;W</code> / <code>&#92;S</code></td><td><code>&#92;d</code>/<code>&#92;w</code>/<code>&#92;s</code> 的反义</td></tr>
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
<tr><td><code>(abc)</code></td><td>捕获组，可通过 <code>$1</code>、<code>&#92;1</code> 引用</td></tr>
<tr><td><code>(?:abc)</code></td><td>非捕获组（不保存匹配结果，提升性能）</td></tr>
<tr><td><code>(?<name>abc)</code></td><td>命名捕获组（部分引擎支持）</td></tr>
<tr><td><code>&#92;1</code> / <code>$1</code></td><td>引用第 1 个捕获组的内容</td></tr>
</table>
<h3>1.5 断言 / 环视（Lookarounds）</h3>
<table>
<tr><th>语法</th><th>含义</th><th>示例</th></tr>
<tr><td><code>(?=abc)</code></td><td>正向先行断言：后面必须是 <code>abc</code></td><td><code>foo(?=bar)</code> → 匹配 <code>foo</code>（仅当后面是 <code>bar</code>）</td></tr>
<tr><td><code>(?!abc)</code></td><td>负向先行断言：后面不能是 <code>abc</code></td><td><code>foo(?!bar)</code></td></tr>
<tr><td><code>(?<=abc)</code></td><td>正向后行断言：前面必须是 <code>abc</code></td><td><code>(?<=@)gmail</code> → 匹配 <code>@gmail</code> 中的 <code>gmail</code></td></tr>
<tr><td><code>(?<!abc)</code></td><td>负向后行断言：前面不能是 <code>abc</code></td><td><code>(?<!&#92;$)&#92;d+</code> → 匹配非美元符号后的数字</td></tr>
</table>
<blockquote>⚠️ 后行断言 <code>(?<=)</code> / <code>(?<!)</code> 在 JavaScript (ES2018+)、Python、PCRE 中支持，旧版引擎可能报错。</blockquote>
<h2>🛠 2. 常用修饰符（Flags）</h2>
<table>
<tr><th>标志</th><th>含义</th><th>适用场景</th></tr>
<tr><td><code>i</code></td><td>忽略大小写</td><td><code>/abc/i</code> 匹配 <code>ABC</code>、<code>Abc</code></td></tr>
<tr><td><code>g</code></td><td>全局匹配</td><td>查找所有匹配项而非仅第一个</td></tr>
<tr><td><code>m</code></td><td>多行模式</td><td><code>^</code> 和 <code>$</code> 匹配每行开头/结尾</td></tr>
<tr><td><code>s</code></td><td>单行模式（DotAll）</td><td><code>.</code> 可匹配换行符 <code>&#92;n</code></td></tr>
<tr><td><code>u</code></td><td>Unicode 模式</td><td>正确处理 emoji、多字节字符</td></tr>
</table>
<h2>📝 3. 实战示例</h2>
<table>
<tr><th>需求</th><th>正则表达式</th><th>说明</th><th></th><th></th><th></th><th></th></tr>
<tr><td>中国大陆手机号</td><td><code>^1[3-9]&#92;d{9}$</code></td><td>11位，首位1，第二位3-9</td><td></td><td></td><td></td><td></td></tr>
<tr><td>邮箱（实用版）</td><td><code>^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+&#92;.[a-zA-Z]{2,}$</code></td><td>覆盖99%常见邮箱，RFC5322完整规则极复杂</td><td></td><td></td><td></td><td></td></tr>
<tr><td>强密码（≥8位，含大小写+数字）</td><td><code>^(?=.*[a-z])(?=.*[A-Z])(?=.*&#92;d)[a-zA-Z&#92;d]{8,}$</code></td><td>使用先行断言组合校验</td><td></td><td></td><td></td><td></td></tr>
<tr><td>提取 HTML 标签内容</td><td><code><([a-z]+)[^>]*>(.*?)</&#92;1></code></td><td><code>&#92;1</code> 反向引用闭合标签，<code>.*?</code> 防贪婪</td><td></td><td></td><td></td><td></td></tr>
<tr><td>匹配 IPv4 地址</td><td>\`\b(?:(?:25[0-5]</td><td>2[0-4]\d</td><td>[01]?\d\d?)\.){3}(?:25[0-5]</td><td>2[0-4]\d</td><td>[01]?\d\d?)\b\`</td><td>精确范围校验，避免 <code>999.999.999.999</code></td></tr>
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
<li><strong>注意代码中的转义</strong><br>在字符串中写正则需双转义：<code>"&#92;&#92;d+&#92;&#92;s*"</code>（Python/JS），或使用原始字符串 <code>r"&#92;d+&#92;s*"</code>（Python）。</li>
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
<li>🔄 <strong>替换语法</strong>：查找 <code>^# (.+)<span class="katex-error" title="ParseError: KaTeX parse error: Expected &#x27;EOF&#x27;, got &#x27;#&#x27; at position 18: …code&gt;，替换 &lt;code&gt;#̲#" style="color:#cc0000">&lt;/code&gt;，替换 &lt;code&gt;##</span>1</code> 可将一级标题批量转二级</li>
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
<tr><td>Unicode 属性 <code>&#92;p{L}</code></td><td>✅ (u标志)</td><td>✅</td><td>✅</td><td>✅</td></tr>
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
  since: "2026.06",
  words: `~${Math.round(POSTS.reduce((s, p) => s + p.body.replace(/<[^>]*>/g, '').split(/\s+/).length, 0) / 1000)}K`,
};
