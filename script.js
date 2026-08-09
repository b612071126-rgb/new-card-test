const categories = [
    { icon: "🧠", title: "情绪管理" },
    { icon: "⚡", title: "行动力" },
    { icon: "📚", title: "学习成长" },
    { icon: "🛤️", title: "人生方向" }
];

const box = document.getElementById("categories");

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

    // 关键修复：把 grid 容器改成普通块级布局，防止卡片被网格挤压
    box.classList.remove("grid");
    box.style.display = "block";

    let html = `
        <div style="padding: 10px 0 20px;">
            <button onclick="goBack()" style="
                background: none; border: none; font-size: 18px;
                cursor: pointer; padding: 8px 0; color: #4CAF50;
            ">← 返回分类</button>
        </div>
        <div class="card-list-container">
    `;

    filtered.forEach(card => {
        html += `
            <div class="card-item" id="card-${card.id}">
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
                        <button class="done-btn" onclick="event.stopPropagation(); markDone(${card.id})">
                            ✅ 我完成了
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
        if (localStorage.getItem("card_done_" + card.id) === "true") {
            document.getElementById("card-" + card.id).classList.add("done");
        }
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

// 5. 标记完成
function markDone(cardId) {
    const card = document.getElementById("card-" + cardId);
    card.classList.add("done");
    localStorage.setItem("card_done_" + cardId, "true");
}