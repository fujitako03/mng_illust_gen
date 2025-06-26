# 🎨 イラスト生成アプリ (HTML版)

人物画像を分析してイラストを生成する単一HTMLファイルのWebアプリケーションです。

## ✨ 特徴

- **サーバー不要**: 静的HTMLファイルのみで動作
- **単一ファイル**: `app.html` 一つで完結  
- **OpenAI API統合**: GPT-4oで画像解析、gpt-image-1でイラスト生成
- **インメモリ処理**: YAMLファイル不要、高速処理
- **簡単デプロイ**: GitHub Pages、Netlify等で即座に公開可能

## 🚀 使用方法

### 1. セットアップ
1. `app.html` をダウンロード
2. ブラウザで開く
3. OpenAI API Keyを入力

### 2. イラスト生成手順
1. **API Key入力**: OpenAI API Keyを入力フィールドに設定
2. **画像アップロード**: 人物写真をドラッグ&ドロップまたはクリック選択
3. **画像解析**: 「📤 画像解析」ボタンをクリック
4. **イラスト生成**: 「🎨 イラスト生成」ボタンをクリック

### 3. サポート形式
- **画像**: PNG, JPG, JPEG, GIF (最大16MB)
- **ブラウザ**: Chrome, Firefox, Safari, Edge (ES6対応)

## 🔑 API Key設定

### OpenAI API Keyが必要
1. [OpenAI Platform](https://platform.openai.com/api-keys)でAPI Keyを取得
2. アプリの上部入力フィールドに `sk-...` で始まるKeyを入力

### セキュリティ
- API Keyはブラウザのメモリにのみ保存
- ページ更新で削除される
- 外部サーバーには送信されない

## 🌐 デプロイ方法

### GitHub Pages
```bash
# GitHubリポジトリに app.html をプッシュ
git add app.html
git commit -m "Add HTML version"
git push

# Settings > Pages で公開
```

### Netlify
1. `app.html` をNetlifyにドラッグ&ドロップ
2. 即座に公開URL取得

### Vercel
```bash
# app.html を public/index.html にリネーム
mv app.html public/index.html
vercel deploy
```

## 📁 ファイル構成

```
mng_illust_gen/
├── app.html                      # メインアプリ（これだけで動作）
├── README.md                     # このファイル
├── illustration_template.yaml    # 参考用テンプレート
├── template-system.js            # テンプレートシステム（参考用）
├── .env.example                  # API Key設定例
└── docs/                         # ドキュメント
```

## 🔧 技術仕様

### アーキテクチャ
```
ブラウザ (app.html)
├── HTML構造
├── CSS (組み込み)
└── JavaScript (組み込み)
    ├── IllustrationStyleGuide クラス
    ├── OpenAI Chat Completions API
    ├── OpenAI Images API
    └── インメモリテンプレート処理
```

### みん銀スタイル仕様
- **固定特徴**: 均一な細線、モノクロ、中央配置、バストアップ、白背景
- **可変特徴**: 体型、服装、アクセサリー、髪型、表情など

## 🆚 従来版との比較

| 項目 | 従来版(Flask) | HTML版 |
|------|---------------|--------|
| **ファイル数** | 25+ | 1 |
| **サーバー** | 必要 | 不要 |
| **デプロイ** | Heroku等 | 静的ホスティング |
| **処理** | ファイルI/O | インメモリ |
| **起動時間** | サーバー起動 | 即座 |

## 🐛 トラブルシューティング

**API Keyエラー**
```
解決: OpenAI API Keyが正しく設定されているか確認
```

**CORS エラー**
```
解決: ローカルファイルではなくHTTPS環境で実行
```

**画像アップロードエラー**
```
解決: ファイルサイズ16MB以下、対応形式確認
```

## 📊 パフォーマンス

- **画像解析**: 5-10秒
- **イラスト生成**: 10-20秒
- **合計**: 15-30秒

## 📄 ライセンス

MIT License

---

**🎨 シンプルで高速なイラスト生成をお楽しみください！**