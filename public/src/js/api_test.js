// 選択したファイル
let selectedFile = null;

// 画像選択時の処理
globalThis.onChange = function (event) {
    const file = event.target.files[0];
    const previewImage = document.getElementById("previewImage");
    const uploadButton = document.getElementById("uploadButton");

    if (!file) {
        alert("画像が選択されていません。");
        return;
    }

    // 画像サイズ制限（例: 1MBまで）
    if (file.size > 1024 * 1024) {
        alert("画像サイズは1MB以下にしてください。");
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
                    alert("画像の変換に失敗しました。");
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

// アップロードボタン押下時の処理
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("uploadButton").addEventListener("click", async () => {
        const responseText = document.getElementById("responseText");
        if (!selectedFile) {
            alert("アップロードする画像がありません。");
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
                throw new Error("画像のアップロードに失敗しました。");
            }

            const data = await response.json();
            responseText.textContent = `サーバーからのレスポンス: ${data.result}`;
        } catch (error) {
            responseText.textContent = `エラー: ${error.message}`;
        }
    });
});