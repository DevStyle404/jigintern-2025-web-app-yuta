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

// localStorageからチェックリストを取得して表示
function displayCheckList(day) {
    const checkListDiv = document.querySelector(".checkList");

    // localStorageからクエリパラメータで確認できる曜日の持ち物リストを取得
    const items = JSON.parse(localStorage.getItem(day)) || [];

    // localStorageから履歴を取得(なければfalseで初期化)
    const historyKey = `${day}_history`;
    let history = JSON.parse(localStorage.getItem(historyKey)) || Array(items.length).fill(false);

    // localStorageから保存された日付の取得
    const savedDateKey = `${day}_lastSavedDate`;
    const savedDate = localStorage.getItem(savedDateKey);

    // 日付が切り替わったらリセット
    const currentDate = getCurrentDate();
    if (savedDate !== currentDate) {
        //チェック状態のリセット
        history = Array(items.length).fill(false);

        // リセット後の履歴を保存
        localStorage.setItem(historyKey, JSON.stringify(history));

        // 現在の日付を保存
        localStorage.setItem(savedDateKey, currentDate);
    }

    // 持ち物リストをチェックボックス付きで表示
    items.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "check-item";
        itemDiv.innerHTML = `
            <input type="checkbox" id="item-${index}" name="item-${index}" ${history[index] ? "checked" : ""}>
            <label for="item-${index}">${item}</label>
        `;
        checkListDiv.appendChild(itemDiv);

        // チェックボックスの変更イベントを追加
        const checkbox = itemDiv.querySelector(`#item-${index}`);
        checkbox.addEventListener("change", () => {
            // チェック状態の更新
            history[index] = checkbox.checked;
            // 履歴の保存
            localStorage.setItem(historyKey, JSON.stringify(history));
        })
    });
}

// 完了ボタンを押したときの処理
function handleComplete(day) {
    const historyKey = `${day}_history`;
    const currentDate = getCurrentDate();
    const savedDateKey = `${day}_lastSavedDate`;

    // 現在のチェック状態の保存
    const checkboxes = document.querySelectorAll(".check-item input[type='checkbox']");
    const history = Array.from(checkboxes).map(checkbox => checkbox.checked);
    localStorage.setItem(historyKey, JSON.stringify(history));
    localStorage.setItem(savedDateKey, currentDate);

    alert("チェックリストを保存しました！");
}

// DOMツリーが完全に読み込まれた後にイベントリスナーを設定
document.addEventListener("DOMContentLoaded", () => {
    const day = getDayFromQuery();

    if (day) {
        displayCheckList(day);

        // 完了ボタンのクリック時
        const completeButton = document.getElementById("completeButton");
        completeButton.addEventListener("click", () => handleComplete(day));
    } else {
        alert("曜日情報が見つかりませんでした");
    }
});