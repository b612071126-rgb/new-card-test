const categories = [
    { icon: "🧠", title: "情绪管理" },
    { icon: "⚡", title: "行动力" },
    { icon: "📚", title: "学习成长" },
    { icon: "🛤️", title: "人生方向" }
];

const box = document.getElementById("categories");
const header = document.querySelector("header");

let currentCategory = "";
let currentCardIndex = 0;
let feedbackTimer = null;

// 1. 渲染主页分类方块
function renderHome() {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    header.style.display = "block";
    box.classList.add("grid");
    box.style.display = "grid";
    box.style.marginTop = "55px";
    box.innerHTML = "";

    categories.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "category card" + index;
        div.innerHTML = `
            <div class="icon">${item.icon}</div>
            <div class="title">${item.title}</div>
        `;
        div.addEventListener("click", () => {
            currentCategory = item.title;
            renderPackList(item.title);
        });
        box.appendChild(div);
    });
}

// 2. 渲染卡包列表页
function renderPackList(categoryName) {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    const filtered = cards.filter(c => c.category === categoryName);

    header.style.display = "none";
    box.classList.remove("grid");
    box.style.display = "block";
    box.style.marginTop = "10px";

    let html = `
        <div class="back-bar" onclick="goBack()">← 返回</div>
        <div class="pack-list-title">${categoryName}</div>
        <div class="pack-list-container">
    `;

    filtered.forEach((card, index) => {
        html += `
            <div class="pack-item" id="pack-${card.id}" 
                 onclick="openSteps(${card.id})"
                 style="animation-delay: ${index * 0.08}s;">
                <div class="pack-icon">${card.icon}</div>
                <div class="pack-title">${card.title}</div>
                <div class="pack-arrow">→</div>
            </div>
        `;
    });

    html += `</div>`;
    box.innerHTML = html;
}

// 3. 打开步骤序列（带旋转放大动画）
function openSteps(cardId) {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    const card = cards.find(c => c.id === cardId);
    currentCardIndex = 0;

    const packEl = document.getElementById("pack-" + cardId);
    const rect = packEl.getBoundingClientRect();

    const overlay = document.createElement("div");
    overlay.className = "step-overlay";
    overlay.style.top = rect.top + "px";
    overlay.style.left = rect.left + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.classList.add("expanded");
    });

    overlay.addEventListener("transitionend", () => {
        overlay.remove();
        renderStepPage(card);
    }, { once: true });
}

// 4. 渲染步骤页面
function renderStepPage(card) {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    header.style.display = "none";
    box.classList.remove("grid");
    box.style.display = "block";
    box.style.marginTop = "10px";

    const stepIndex = currentCardIndex;
    const step = card.steps[stepIndex];
    const isLast = stepIndex === card.steps.length - 1;

    // 渲染科学依据的结构化HTML
    let whyHtml = "";
    if (step.why) {
        whyHtml = `
            <div class="why-toggle" onclick="toggleWhy(this)">🔬 科学依据</div>
            <div class="why-detail" style="display:none;">
                <div class="why-meta">📅 ${step.why.meta}</div>
                <div class="why-finding">${step.why.finding}</div>
                <div class="why-reason"><span class="why-label">原因</span>${step.why.reason}</div>
                <div class="why-conclusion"><span class="why-label key">关键</span>${step.why.conclusion}</div>
            </div>
        `;
    }

    const html = `
        <div class="back-bar" onclick="goToPackList()">← 返回</div>
        <div class="step-container">
            <div class="step-card" id="current-step-card">
                <div class="step-counter">${stepIndex + 1} / ${card.steps.length}</div>
                <div class="step-content">${step.text}</div>
                <button class="step-btn" onclick="showStepFeedback(${card.id}, ${stepIndex})">
                    ${isLast ? '🎉 我完成了' : '✅ 我做到了'}
                </button>
                ${whyHtml}
            </div>
        </div>
    `;

    box.innerHTML = html;
}

// 切换科学依据展开/收起
function toggleWhy(el) {
    const detail = el.nextElementSibling;
    if (detail.style.display === "none") {
        detail.style.display = "block";
        el.textContent = "🔬 收起科学依据";
    } else {
        detail.style.display = "none";
        el.textContent = "🔬 科学依据";
    }
}

// 5. 显示步骤反馈（2.5秒后自动跳下一步，同时显示简短科学结论）
function showStepFeedback(cardId, stepIndex) {
    const card = cards.find(c => c.id === cardId);
    const step = card.steps[stepIndex];
    const isLast = stepIndex === card.steps.length - 1;
    const container = document.querySelector(".step-card");

    let shortWhy = "";
    if (step.why) {
        shortWhy = `${step.why.meta}：${step.why.finding}`;
    }

    container.innerHTML = `
        <div class="feedback-emoji">🎉</div>
        <div class="feedback-title">恭喜你完成第 ${stepIndex + 1} 步！</div>
        <div class="feedback-desc">你超过了 <strong>${step.percent}%</strong> 的人</div>
        ${shortWhy ? `<div class="feedback-why">${shortWhy}</div>` : ''}
        <div class="feedback-loading"></div>
    `;
    container.classList.add("feedback-mode");

    feedbackTimer = setTimeout(() => {
        feedbackTimer = null;
        if (isLast) {
            finishSteps(cardId);
        } else {
            currentCardIndex++;
            renderStepPage(card);
        }
    }, 2500);
}

// 6. 完成所有步骤
function finishSteps(cardId) {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    const card = cards.find(c => c.id === cardId);
    localStorage.setItem("card_done_" + cardId, "true");

    const html = `
        <div class="back-bar" onclick="goToPackList()">← 返回</div>
        <div class="step-container">
            <div class="step-card done-card">
                <div class="done-emoji">🎉</div>
                <div class="done-title">全部完成！</div>
                <div class="done-desc">你已经超过了大多数人，因为开始就是胜利。</div>
                <button class="step-btn" onclick="resetAndReplay(${cardId})">🔄 再来一次</button>
                <button class="step-btn secondary" onclick="goToPackList()">📋 回到卡包列表</button>
                <div class="quote-footnote">${card.quote}</div>
            </div>
        </div>
    `;
    box.innerHTML = html;
}

// 7. 重置并重新开始
function resetAndReplay(cardId) {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    localStorage.removeItem("card_done_" + cardId);
    currentCardIndex = 0;
    const card = cards.find(c => c.id === cardId);
    renderStepPage(card);
}

// 8. 回到卡包列表
function goToPackList() {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    renderPackList(currentCategory);
}

// 9. 回到主页
function goBack() {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    renderHome();
}

// 初始化
renderHome();