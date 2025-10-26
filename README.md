# Dynamic Input Box in LWC

Lightning Web Component (LWC) で実装した、データ型に応じて入力UIを自動切り替えする汎用コンポーネントです。

## 概要

本プロジェクトは、Salesforce のカスタム画面開発において、項目のデータ型（文字列、数値、日付、選択リストなど）に応じて自動的に適切な入力フィールドを表示する汎用的なLightning Web Componentを提供します。

## 主な機能

- **6つのデータ型をサポート**: Text, Number, Date, DateTime, Picklist, Boolean
- **自動バリデーション**: 各データ型に応じた入力チェック機能
- **カスタムイベント**: 親コンポーネントへの値変更・エラー通知
- **BEM CSS設計**: 保守性の高いスタイリング
- **標準HTML要素使用**: `lightning-input` を使わず、標準のinput/selectを使用

## コンポーネント構成

### dynamicInput

メインの汎用入力コンポーネント。データ型に応じて入力UIを動的に切り替えます。

**パス**: `force-app/main/default/lwc/dynamicInput/`

**主な機能**:
- データ型に応じた入力フィールドの自動切り替え
- 入力値のバリデーション
- カスタムイベント（valuechange, error）の発火
- パブリックメソッド（getValue, isValid, reset）

### dynamicInputDemo

dynamicInputコンポーネントの全機能を確認できるデモコンポーネント。

**パス**: `force-app/main/default/lwc/dynamicInputDemo/`

## クイックスタート

### 1. リポジトリのクローン

```bash
git clone https://github.com/ey-devsf/dynamic-input-box-in-LWC.git
cd dynamic-input-box-in-LWC
```

### 2. Salesforce組織へのデプロイ

```bash
# Salesforce CLI を使用してデプロイ
sfdx force:source:deploy -p force-app -u <your-org-alias>
```

### 3. コンポーネントの配置

1. Salesforce組織にログイン
2. Lightning App Builder を開く
3. `dynamicInputDemo` コンポーネントをページに配置
4. または、カスタムコンポーネントで `c-dynamic-input` を使用

## 使用例

### テキスト入力

```html
<c-dynamic-input
    field-type="Text"
    label="会社名"
    max-length="50"
    onvaluechange={handleValueChange}
></c-dynamic-input>
```

### 数値入力

```html
<c-dynamic-input
    field-type="Number"
    label="金額"
    precision="10"
    scale="2"
    onvaluechange={handleValueChange}
></c-dynamic-input>
```

### 選択リスト

```html
<c-dynamic-input
    field-type="Picklist"
    label="業種"
    picklist-options={options}
    onvaluechange={handleValueChange}
></c-dynamic-input>
```

詳細な使用方法は [dynamicInput/README.md](force-app/main/default/lwc/dynamicInput/README.md) を参照してください。

## ドキュメント

- [要件定義書](requirements_definition/dynamic_input_requirements.md) - 詳細な要件と仕様
- [コンポーネントドキュメント](force-app/main/default/lwc/dynamicInput/README.md) - API仕様と使用例

## プロジェクト構成

```
dynamic-input-box-in-LWC/
├── force-app/
│   └── main/
│       └── default/
│           └── lwc/
│               ├── dynamicInput/          # メインコンポーネント
│               │   ├── dynamicInput.html
│               │   ├── dynamicInput.js
│               │   ├── dynamicInput.css
│               │   ├── dynamicInput.js-meta.xml
│               │   └── README.md
│               └── dynamicInputDemo/      # デモコンポーネント
│                   ├── dynamicInputDemo.html
│                   ├── dynamicInputDemo.js
│                   ├── dynamicInputDemo.css
│                   └── dynamicInputDemo.js-meta.xml
├── config/
│   └── project-scratch-def.json
├── requirements_definition/
│   └── dynamic_input_requirements.md
├── sfdx-project.json
└── README.md
```

## 技術スタック

- **Salesforce API Version**: 65.0
- **Lightning Web Components (LWC)**
- **CSS (BEM methodology)**
- **JavaScript (ES6+)**

## サポートするデータ型

| データ型 | 入力UI | バリデーション機能 |
|---------|--------|------------------|
| Text | `<input type="text">` | 最大文字数チェック |
| Number | `<input type="number">` | 整数桁・小数桁チェック |
| Date | `<input type="date">` | 日付フォーマットチェック |
| DateTime | `<input type="datetime-local">` | 日時フォーマットチェック |
| Picklist | `<select>` | 選択必須チェック |
| Boolean | `<input type="checkbox">` | true/false のみ |

## 今後の拡張予定

- [ ] 複数項目の同時表示対応
- [ ] Salesforceの項目メタデータからの自動設定
- [ ] Lookup/Reference型対応
- [ ] タイムゾーン対応
- [ ] 国際化対応（i18n）

## ライセンス

MIT License

## 関連リソース

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
