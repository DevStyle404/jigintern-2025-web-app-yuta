// クエリパラメータから曜日情報を取得
function getDayFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("day");
}

// 現在の日付を取得 (YYYY-MM-DD形式)
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}