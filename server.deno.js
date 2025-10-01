import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";
import { GoogleGenAI } from "npm:@google/genai";

const apiKey = Deno.env.get("GEMINI_API_KEY");
if (!apiKey) throw new Error("GEMINI_API_KEY is not set in the environment variables.");
const ai = new GoogleGenAI({ apiKey });

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;
  console.log(pathname);

  // 画像アップロードAPI
  if (req.method === "POST" && pathname === "/generate") {
    try {
      const formData = await req.formData();
      const imageFile = formData.get("image");
      if (!imageFile || typeof imageFile !== "object") {
        return new Response("Image file is required.", { status: 400 });
      }

      // バイナリ→Base64変換
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64Image = encodeBase64(uint8Array);

      const contents = [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        { text: "この画像に写っているものをJSON形式だけで教えてください。検出された物体は日本語に翻訳して、JSONの始まりと終わりには必ず「!」をつけてください。例：!{ detected: ['犬', '猫'] }!" },
      ];

      // Gemini API呼び出し（例: 画像をテキストとして送信）
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
      });

      return new Response(JSON.stringify({ result: response.text }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new Response("Error processing request", { status: 500 });
    }
  }

  // 静的ファイル配信
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});