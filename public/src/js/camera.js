// DOMツリーが完全に読み込まれた後にカメラを起動
document.addEventListener("DOMContentLoaded", () => {
    startCamera();
});

// カメラを起動する関数
function startCamera() {
    const userVideo = document.getElementById("userVideo");

    // カメラの映像を取得
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            userVideo.srcObject = stream; // 映像を video タグに表示
            userVideo.play();
        })
        .catch((error) => {
            console.error("カメラの起動に失敗しました:", error);
        });
}
