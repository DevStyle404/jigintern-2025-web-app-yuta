document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addItemForm");
    const itemInput = document.getElementById("item");

    // フォーム送信時の処理
    form.addEventListener("submit", (event) => {
        // ページリロードを防止
        event.preventDefault();

        const itemName = itemInput.value.trim();
        if (!itemName) {
            alert("アイテム名を入力してください");
            return;
        }

        // 現在の曜日を取得
        const params = new URLSearchParams(window.location.search);
        const currentDay = params.get("day") || "monday";

        // ローカルストレージに保存
        const items = JSON.parse(localStorage.getItem(currentDay)) || [];
        items.push(itemName);
        localStorage.setItem(currentDay, JSON.stringify(items));

        alert(`「${itemName}」を追加しました！`);

        // 入力フィールドをクリア
        itemInput.value = "";
    });
});