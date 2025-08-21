// 初期値を月曜日に設定
let currentDay = "monday";
// 編集状態
let isEdited = false;

// クエリパラメータから曜日を取得
function getDayFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("day") || "monday";
}

// localStorageから持ち物リストを取得
function getItemsForDay(day) {
    return JSON.parse(localStorage.getItem(day)) || [];
}

// localStorageに持ち物リストを保存
function saveItemsForDay(day, items) {
    localStorage.setItem(day, JSON.stringify(items));
}

// 持ち物リストの表示
function displayItems(day) {
    const displayListDiv = document.querySelector(".displayList");
    displayListDiv.innerHTML = ""; // 既存のリストをクリア

    const items = getItemsForDay(day);

    // 削除ボタンの追加
    items.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";
        itemDiv.innerHTML = `
            <span>${item}</span>
            <button class="deleteButton" data-index="${index}">削除</button>
        `;
        displayListDiv.appendChild(itemDiv);

        // 削除ボタンのイベントリスナー
        const deleteButton = itemDiv.querySelector(".deleteButton");
        deleteButton.addEventListener("click", () => {
            items.splice(index, 1); // アイテムを削除
            saveItemsForDay(day, items); // 保存
            displayItems(day); // 再表示
            isEdited = true; // 編集状態を更新
        });
    });
}