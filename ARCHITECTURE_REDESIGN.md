# アーキテクチャ再設計計画

## 現在の問題点
- Flask サーバーが必要（デプロイの複雑化）
- YAMLファイルの読み書き（パフォーマンス、競合リスク）
- サーバー側状態管理（スケーラビリティの問題）

## 新しい設計：HTML + JavaScript

### 1. 基本構成
```
静的HTMLファイル（単一ファイル）
├── HTML構造
├── CSS（組み込み）
└── JavaScript（組み込み）
    ├── OpenAI API直接呼び出し
    ├── インメモリテンプレート管理
    └── ブラウザベース画像処理
```

### 2. アーキテクチャ変更点

#### 現在（Flask）:
```
ブラウザ → Flask API → OpenAI API → ファイル操作 → レスポンス
```

#### 新設計（HTML + JS）:
```
ブラウザ → OpenAI API（直接）→ インメモリ処理 → 表示
```

### 3. 技術スタック変更

| 現在 | 新設計 |
|------|--------|
| Flask + Python | HTML + JavaScript |
| YAML ファイル | JavaScript オブジェクト |
| サーバー側処理 | クライアント側処理 |
| 複数ファイル | 単一HTMLファイル |

### 4. 新しいファイル構成

```
mng_illust_gen/
├── index.html                    # 統合されたWebアプリ
├── README.md                     # 使用方法
├── .env.example                  # API Key設定例
└── docs/                         # ドキュメント
    └── architecture.md
```

### 5. 実装詳細

#### 5.1 テンプレートシステム（JavaScript）
```javascript
class IllustrationStyleGuide {
    constructor() {
        this.baseStyle = {
            style: "Line art illustration with uniform thin lines...",
            composition: "centered composition, bust up framing...",
            character: {
                fixed: {
                    face: { direction: "three_quarter", nose: "protruding" },
                    rendering: "minimal detail, no shadows, flat perspective"
                },
                variable: {
                    silhouette: ["body_type", "height", "pose"],
                    clothing: ["top", "bottom"],
                    accessories: ["hat", "bag", "others"]
                }
            }
        };
    }
}
```

#### 5.2 画像解析（直接API呼び出し）
```javascript
async function analyzePersonFeatures(imageFile) {
    const base64Image = await fileToBase64(imageFile);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: analysisPrompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` }}
                ]
            }]
        })
    });
    
    return await response.json();
}
```

#### 5.3 プロンプト生成（インメモリ）
```javascript
function generateIllustrationPrompt(features) {
    const styleGuide = new IllustrationStyleGuide();
    
    return `Create a line art illustration in the "みん銀" style:
    
    STYLE: ${styleGuide.baseStyle.style}
    COMPOSITION: ${styleGuide.baseStyle.composition}
    CHARACTER: ${JSON.stringify(features)}
    
    Use uniform thin lines, monochrome black and white only, minimal detail level.`;
}
```

#### 5.4 画像生成（直接API呼び出し）
```javascript
async function generateIllustration(prompt) {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-image-1",
            prompt: prompt,
            size: "1024x1024",
            quality: "high",
            n: 1
        })
    });
    
    return await response.json();
}
```

### 6. 利点

#### 6.1 デプロイメント
- 静的ファイルホスティング（GitHub Pages、Netlify、Vercel）
- サーバー管理不要
- コスト削減

#### 6.2 パフォーマンス
- ファイルI/O削除
- サーバーレイテンシ削除
- ブラウザキャッシュ活用

#### 6.3 スケーラビリティ
- サーバー負荷なし
- 同時ユーザー制限なし
- CDN配信可能

#### 6.4 開発・保守
- 単一ファイル管理
- フロントエンド技術のみ
- デバッグ簡単化

### 7. 考慮事項

#### 7.1 セキュリティ
- API Key管理（ユーザー入力方式）
- CORS対応
- クライアント側実行

#### 7.2 制限事項
- オフライン動作不可
- ブラウザ依存
- API Key露出リスク

### 8. 移行手順

1. **新HTMLファイル作成**
   - 単一ファイル統合
   - JavaScript実装

2. **API呼び出し実装**
   - OpenAI API直接統合
   - エラーハンドリング

3. **テンプレートシステム移行**
   - YAML → JavaScript オブジェクト
   - インメモリ処理

4. **テスト・検証**
   - 機能テスト
   - パフォーマンステスト

5. **ドキュメント更新**
   - 使用方法更新
   - デプロイ手順更新

この設計により、より簡潔で効率的なアプリケーションを実現できます。