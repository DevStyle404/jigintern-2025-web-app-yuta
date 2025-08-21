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