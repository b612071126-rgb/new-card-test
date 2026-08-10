const categories = [
    { icon: "🧠", title: "情绪管理" },
    { icon: "⚡", title: "行动力" },
    { icon: "📚", title: "学习成长" },
    { icon: "🛤️", title: "人生方向" }
];

const box = document.getElementById("categories");
const header = document.querySelector("header");

// 当前状态
let currentCategory = "";
let currentCardIndex = 0;

// 1. 渲染主页分类方块
function renderHome() {
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
    const card = cards.find(c => c.id === cardId);
    currentCardIndex = 0;

    // 找到被点击的卡包元素
    const packEl = document.getElementById("pack-" + cardId);
    const rect = packEl.getBoundingClientRect();

    // 创建一个覆盖层，从卡包位置开始
    const overlay = document.createElement("div");
    overlay.className = "step-overlay";
    overlay.style.top = rect.top + "px";
    overlay.style.left = rect.left + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";
    document.body.appendChild(overlay);

    // 触发动画：从小位置旋转放大到全屏
    requestAnimationFrame(() => {
        overlay.classList.add("expanded");
    });

    // 动画结束后，切换为步骤内容
    overlay.addEventListener("transitionend", () => {
        overlay.remove();
        renderStepPage(card);
    }, { once: true });
}

// 4. 渲染步骤页面
function renderStepPage(card) {
    header.style.display = "none";
    box.classList.remove("grid");
    box.style.display = "block";
    box.style.marginTop = "10px";

    const step = card.steps[currentCardIndex];
    const isLast = currentCardIndex === card.steps.length - 1;

    const html = `
        <div class="back-bar" onclick="goToPackList()">← 返回</div>
        <div class="step-container">
            <div class="step-card" id="current-step-card">
                <div class="step-counter">${currentCardIndex + 1} / ${card.steps.length}</div>
                <div class="step-content">${step}</div>
                <button class="step-btn" onclick="${isLast ? `finishSteps(${card.id})` : `nextStep(${card.id})`}">
                    ${isLast ? '🎉 我完成了' : '✅ 我做到了，下一步'}
                </button>
                ${!isLast ? `<div class="step-skip" onclick="skipToEnd(${card.id})">跳过剩余步骤 →</div>` : ''}
            </div>
        </div>
    `;

    box.innerHTML = html;
}

// 5. 下一步
function nextStep(cardId) {
    const card = cards.find(c => c.id === cardId);
    currentCardIndex++;
    renderStepPage(card);
}

// 6. 跳过到结束
function skipToEnd(cardId) {
    const card = cards.find(c => c.id === cardId);
    currentCardIndex = card.steps.length - 1;
    renderStepPage(card);
}

// 7. 完成所有步骤
function finishSteps(cardId) {
    localStorage.setItem("card_done_" + cardId, "true");

    const html = `
        <div class="back-bar" onclick="goToPackList()">← 返回</div>
        <div class="step-container">
            <div class="step-card done-card">
                <div class="done-emoji">🎉</div>
                <div class="done-title">太棒了！</div>
                <div class="done-desc">你已经完成了这张卡的所有步骤。</div>
                <button class="step-btn" onclick="resetAndReplay(${cardId})">🔄 再来一次</button>
                <button class="step-btn secondary" onclick="goToPackList()">📋 回到卡包列表</button>
            </div>
        </div>
    `;
    box.innerHTML = html;
}

// 8. 重置并重新开始
function resetAndReplay(cardId) {
    localStorage.removeItem("card_done_" + cardId);
    currentCardIndex = 0;
    const card = cards.find(c => c.id === cardId);
    renderStepPage(card);
}

// 9. 回到卡包列表
function goToPackList() {
    renderPackList(currentCategory);
}

// 10. 回到主页
function goBack() {
    renderHome();
}

// 初始化
renderHome();