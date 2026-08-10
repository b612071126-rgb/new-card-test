const categories = [
    { icon: "🧠", title: "情绪管理" },
    { icon: "⚡", title: "行动力" },
    { icon: "📚", title: "学习成长" },
    { icon: "🛤️", title: "人生方向" }
];

const box = document.getElementById("categories");
const header = document.querySelector("header");

// 1. 渲染分类方块
categories.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "category card" + index;
    div.innerHTML = `
        <div class="icon">${item.icon}</div>
        <div class="title">${item.title}</div>
    `;
    div.addEventListener("click", () => {
        showCards(item.title);
    });
    box.appendChild(div);
});

// 2. 展示某分类下的卡片
function showCards(categoryName) {
    const filtered = cards.filter(c => c.category === categoryName);

    if (filtered.length === 0) {
        alert("暂无卡片，敬请期待");
        return;
    }

    // 隐藏header，让卡片铺满屏幕
    header.style.display = "none";

    // 切换布局
    box.classList.remove("grid");
    box.style.display = "block";
    box.style.marginTop = "0";

    let html = `
        <div style="padding: 10px 0 20px;">
            <button onclick="goBack()" style="
                background: none; border: none; font-size: 18px;
                cursor: pointer; padding: 8px 0; color: #4CAF50;
            ">← 返回分类</button>
        </div>
        <div class="card-list-container">
    `;

    filtered.forEach((card, index) => {
        html += `
            <div class="card-item" id="card-${card.id}" style="animation-delay: ${index * 0.1}s;">
                <div class="card-inner" onclick="flipCard('card-${card.id}')">
                    <div class="card-front">
                        <div class="card-icon">${card.icon}</div>
                        <div class="card-title-small">${card.title}</div>
                        <div class="card-question">${card.front}</div>
                        <div class="tap-hint">👆 点击翻转查看行动步骤</div>
                    </div>
                    <div class="card-back">
                        <div class="card-title-small">📋 行动步骤</div>
                        <ol>
                            ${card.back.map(step => `<li>${step}</li>`).join("")}
                        </ol>
                        <button class="done-btn" id="btn-${card.id}" 
                            onclick="event.stopPropagation(); toggleDone(${card.id})">
                            ${getDoneText(card.id)}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    box.innerHTML = html;

    // 恢复已完成状态
    filtered.forEach(card => {
        updateDoneState(card.id);
    });
}

// 3. 返回分类列表
function goBack() {
    location.reload();
}

// 4. 翻转卡片
function flipCard(cardId) {
    document.getElementById(cardId).classList.toggle("flipped");
}

// 5. 切换完成状态（可重复）
function toggleDone(cardId) {
    const isDone = localStorage.getItem("card_done_" + cardId) === "true";
    if (isDone) {
        localStorage.removeItem("card_done_" + cardId);
    } else {
        localStorage.setItem("card_done_" + cardId, "true");
    }
    updateDoneState(cardId);
}

// 6. 更新按钮文字和卡片外观
function updateDoneState(cardId) {
    const card = document.getElementById("card-" + cardId);
    const btn = document.getElementById("btn-" + cardId);
    if (!card || !btn) return;

    const isDone = localStorage.getItem("card_done_" + cardId) === "true";
    if (isDone) {
        card.classList.add("done");
        btn.textContent = "🔄 再来一次";
    } else {
        card.classList.remove("done");
        btn.textContent = "✅ 标记完成";
    }
}

// 7. 获取按钮初始文字
function getDoneText(cardId) {
    return localStorage.getItem("card_done_" + cardId) === "true" ? "🔄 再来一次" : "✅ 标记完成";
}