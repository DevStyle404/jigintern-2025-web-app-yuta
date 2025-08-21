let selectedFile = null;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addItemForm");
    const itemInput = document.getElementById("item");
    const uploadButton = document.getElementById("uploadButton");
    const modal = document.getElementById("modal");
    const detectedItemsList = document.getElementById("detectedItemsList");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");

    // 手動追加フォーム送信時の処理
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

    // アップロードボタン押下時の処理
    uploadButton.addEventListener("click", async () => {
        if (!selectedFile) {
            alert("アップロードする画像がありません");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch("/generate", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("画像のアップロードに失敗しました");
            }

            const data = await response.json();

            // JSONから検出されたアイテムを取得
            const detectedItems = JSON.parse(data.result.replace(/!/g, "")).detected;

            // モーダルに検出されたアイテムの表示
            detectedItemsList.innerHTML = "";
            detectedItems.forEach(item => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <label>
                        <input type="checkbox" value="${item}">
                        ${item}
                    </label>
                `;
                detectedItemsList.appendChild(listItem);
            });

            // モーダルを表示
            modal.style.display = "block";
        } catch (error) {
            console.error(error);
            alert("画像のアップロード中にエラーが発生しました");
        }
    });

    // モーダルの確認ボタン押下時の処理
    confirmButton.addEventListener("click", () => {
        const selectedItems = Array.from(detectedItemsList.querySelectorAll("input:checked"))
            .map((checkbox) => checkbox.value);

        if (selectedItems.length === 0) {
            alert("追加するアイテムを選択してください");
            return;
        }

        // 現在の曜日を取得
        const params = new URLSearchParams(window.location.search);
        const currentDay = params.get("day") || "monday";

        // ローカルストレージに保存
        const items = JSON.parse(localStorage.getItem(currentDay)) || [];
        selectedItems.forEach((item) => {
            items.push(item);
        });
        localStorage.setItem(currentDay, JSON.stringify(items));

        alert(`「${selectedItems.join(", ")}」を追加しました！`);

        // モーダルを閉じる
        modal.style.display = "none";
    });

    // モーダルのキャンセルボタン押下時の処理
    cancelButton.addEventListener("click", () => {
        modal.style.display = "none";
    });
});

// 画像選択時の処理
globalThis.onChange = function (event) {
    const file = event.target.files[0];
    const previewImage = document.getElementById("previewImage");
    const uploadButton = document.getElementById("uploadButton");

    if (!file) {
        alert("画像が選択されていません");
        return;
    }

    // 画像サイズ制限(1MB)
    if (file.size > 1024 * 1024) {
        alert("画像サイズは1MB以下にしてください");
        return;
    }

    // 画像リサイズ処理
    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = () => {
            // 最大幅・高さ
            const maxWidth = 512;
            const maxHeight = 512;
            let width = img.width;
            let height = img.height;

            // 縦横比を保ってリサイズ
            if (width > maxWidth || height > maxHeight) {
                if (width / maxWidth > height / maxHeight) {
                    height = Math.round(height * (maxWidth / width));
                    width = maxWidth;
                } else {
                    width = Math.round(width * (maxHeight / height));
                    height = maxHeight;
                }
            }

            // Canvasでリサイズ
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // 圧縮率0.7でJPEGに変換
            canvas.toBlob((blob) => {
                if (!blob) {
                    alert("画像の変換に失敗しました");
                    return;
                }
                selectedFile = new File([blob], file.name, { type: "image/jpeg" });

                // プレビュー表示
                previewImage.src = URL.createObjectURL(blob);
                previewImage.style.display = "block";
                uploadButton.style.display = "inline-block";
            }, "image/jpeg", 0.7);
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
};