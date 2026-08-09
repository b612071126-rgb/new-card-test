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
    
    // 点击分类跳转到卡片列表
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
    
    // 构建卡片列表HTML
    let html = `
        <div style="padding: 10px 0 20px;">
            <button onclick="goBack()" style="
                background: none; border: none; font-size: 18px;
                cursor: pointer; padding: 8px 0; color: #4CAF50;
            ">← 返回分类</button>
        </div>
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

/* ========== 卡片列表样式 ========== */

.card-item {
    perspective: 1000px;
    margin-bottom: 22px;
    height: 280px;
}

.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.5s;
    transform-style: preserve-3d;
}

.card-item.flipped .card-inner {
    transform: rotateY(180deg);
}

.card-front,
.card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 22px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.card-front {
    background: linear-gradient(145deg, #ffffff, #f5faf7);
    box-shadow: 0 10px 30px rgba(40, 80, 60, 0.08);
}

.card-back {
    background: linear-gradient(145deg, #f0faf5, #e8f5ed);
    transform: rotateY(180deg);
    align-items: flex-start;
    text-align: left;
    box-shadow: 0 10px 30px rgba(40, 80, 60, 0.08);
}

.card-icon {
    font-size: 38px;
    margin-bottom: 10px;
}

.card-title-small {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
}

.card-question {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
    line-height: 1.5;
}

.tap-hint {
    font-size: 12px;
    color: #aaa;
    margin-top: 10px;
}

.card-back ol {
    padding-left: 20px;
    margin: 10px 0 16px;
}

.card-back li {
    margin-bottom: 8px;
    font-size: 15px;
    line-height: 1.5;
}

.done-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 10px 28px;
    border-radius: 20px;
    font-size: 15px;
    cursor: pointer;
    align-self: center;
    margin-top: auto;
}

/* 已完成状态 */
.card-item.done {
    opacity: 0.55;
    filter: grayscale(30%);
}

.card-item.done .done-btn {
    background: #999;
}