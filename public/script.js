// 初期化処理(プリセットの読み込み)
const initialPresets = {
    "monday": ["ノート", "ペン"],
    "tuesday": ["教科書", "消しゴム"],
    "wednesday": ["PC", "マウス"],
    "thursday": ["資料", "USB"],
    "friday": ["スケッチブック", "カラーペン"]
};

// 初期データをlocalStorageに保存
function setInitialPresets() {
    for (const [day, items] of Object.entries(initialPresets)) {
        if (!localStorage.getItem(day)) {
            localStorage.setItem(day, JSON.stringify(items));
        }
    }
}

// 曜日リストを表示
function displayPresets() {
    const selectListDiv = document.querySelector(".selectList");

    // 現在の曜日を取得
    const currentDay = getCurrentDay();

    // 曜日ごとボタンを作成
    for (const day of Object.keys(initialPresets)) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "preset";

        //現在の曜日をハイライト
        const isToday = day === currentDay ? "highlight" : "";

        dayDiv.innerHTML = `
            <button class="select-button ${isToday}" data-day="${day}">${day}</button>
        `;
        selectListDiv.appendChild(dayDiv);
    }

    // 曜日ボタンにクリックイベントを追加
    document.querySelectorAll(".select-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const day = event.target.getAttribute("data-day");
            // 曜日情報をクエリパラメータとして渡す
            window.location.href = `src/html/check_list.html?day=${day}`;
        })
    })
}

// 現在の曜日を取得する関数
function getCurrentDay() {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = new Date().getDay();
    return days[today];
}

// DOMが完全に読み込まれたら初期化処理を実行
document.addEventListener("DOMContentLoaded", () => {
    setInitialPresets();
    displayPresets();
});