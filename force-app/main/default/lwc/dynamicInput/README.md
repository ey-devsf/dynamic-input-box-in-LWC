# Dynamic Input Component - 実装ドキュメント

## 概要

`dynamicInput` は、データ型に応じて自動的に入力UIを切り替える汎用Lightning Web Component (LWC) です。

## コンポーネント構成

### 主要コンポーネント

1. **dynamicInput** - メインの汎用入力コンポーネント
   - 6つのデータ型をサポート
   - 自動バリデーション機能
   - カスタムイベント発火

2. **dynamicInputDemo** - デモ／サンプルコンポーネント
   - 全てのデータ型の使用例
   - イベントハンドリングの実装例

## サポートするデータ型

| データ型 | 表示UI | バリデーション |
|---------|--------|--------------|
| Text | `<input type="text">` | 最大文字数チェック |
| Number | `<input type="number">` | 整数桁数・小数桁数チェック |
| Date | `<input type="date">` | 日付フォーマットチェック |
| DateTime | `<input type="datetime-local">` | 日時フォーマットチェック |
| Picklist | `<select>` | 選択必須チェック |
| Boolean | `<input type="checkbox">` | true/false のみ |

## API プロパティ

### 必須プロパティ

| プロパティ名 | 型 | 説明 |
|------------|----|----|
| `fieldType` | String | フィールド型（Text, Number, Date, DateTime, Picklist, Boolean） |

### オプショナルプロパティ

| プロパティ名 | 型 | 説明 | 適用データ型 |
|------------|----|----|------------|
| `label` | String | 入力フィールドのラベル | 全て |
| `maxLength` | Number | 最大文字数 | Text |
| `precision` | Number | 整数部の桁数 | Number |
| `scale` | Number | 小数部の桁数 | Number |
| `picklistOptions` | Array | 選択肢の配列 `[{label, value}]` | Picklist |
| `defaultValue` | Any | 初期値 | 全て |

## イベント

### valuechange イベント

入力値が変更されたときに発火します。

```javascript
event.detail = {
    value: <入力値>,
    isValid: <true/false>,
    errorMessage: <エラーメッセージ>
}
```

### error イベント

バリデーションエラーが発生したときに発火します。

```javascript
event.detail = {
    message: <エラーメッセージ>
}
```

## 使用例

### 1. テキスト入力（最大10文字）

```html
<c-dynamic-input
    field-type="Text"
    label="会社名"
    max-length="10"
    default-value="株式会社ABC"
    onvaluechange={handleValueChange}
    onerror={handleError}
></c-dynamic-input>
```

### 2. 数値入力（整数3桁、小数2桁）

```html
<c-dynamic-input
    field-type="Number"
    label="金額"
    precision="3"
    scale="2"
    default-value="123.45"
    onvaluechange={handleValueChange}
></c-dynamic-input>
```

### 3. 日付入力

```html
<c-dynamic-input
    field-type="Date"
    label="契約日"
    onvaluechange={handleValueChange}
></c-dynamic-input>
```

### 4. 日時入力

```html
<c-dynamic-input
    field-type="DateTime"
    label="イベント開始時刻"
    onvaluechange={handleValueChange}
></c-dynamic-input>
```

### 5. 選択リスト

```html
<c-dynamic-input
    field-type="Picklist"
    label="業種"
    picklist-options={industryOptions}
    onvaluechange={handleValueChange}
></c-dynamic-input>
```

JavaScript側で選択肢を定義:

```javascript
industryOptions = [
    { label: '製造業', value: 'manufacturing' },
    { label: 'IT', value: 'it' },
    { label: 'サービス業', value: 'service' }
];
```

### 6. チェックボックス

```html
<c-dynamic-input
    field-type="Boolean"
    label="メール配信を希望する"
    default-value={booleanValue}
    onvaluechange={handleValueChange}
></c-dynamic-input>
```

## イベントハンドラの実装例

```javascript
import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {
    handleValueChange(event) {
        const { value, isValid, errorMessage } = event.detail;
        
        console.log('入力値:', value);
        console.log('有効:', isValid);
        
        if (!isValid) {
            console.error('エラー:', errorMessage);
        }
        
        // 入力値を親コンポーネントの変数に保存
        this.myValue = value;
    }
    
    handleError(event) {
        const { message } = event.detail;
        console.error('バリデーションエラー:', message);
        
        // エラーメッセージを表示するなどの処理
        this.showToast('エラー', message, 'error');
    }
}
```

## パブリックメソッド

コンポーネントは以下のパブリックメソッドを提供します:

### getValue()

現在の入力値を取得します。

```javascript
const inputComponent = this.template.querySelector('c-dynamic-input');
const currentValue = inputComponent.getValue();
```

### isValid()

現在の入力値が有効かどうかを確認します。

```javascript
const inputComponent = this.template.querySelector('c-dynamic-input');
const valid = inputComponent.isValid();
```

### reset()

入力値を初期値にリセットします。

```javascript
const inputComponent = this.template.querySelector('c-dynamic-input');
inputComponent.reset();
```

## バリデーション仕様詳細

### Text型のバリデーション

- `maxLength` プロパティで指定された文字数を超えるとエラー
- エラーメッセージ: "最大文字数は {maxLength} 文字です"

### Number型のバリデーション

- 数値以外の入力はエラー
- `precision` で整数部の桁数をチェック
- `scale` で小数部の桁数をチェック
- エラーメッセージ: 
  - "数値を入力してください"
  - "整数部は {precision} 桁以内で入力してください"
  - "小数部は {scale} 桁以内で入力してください"

### Date型のバリデーション

- 不正な日付フォーマットはエラー
- エラーメッセージ: "有効な日付を入力してください"

### DateTime型のバリデーション

- 不正な日時フォーマットはエラー
- エラーメッセージ: "有効な日時を入力してください"

### Picklist型のバリデーション

- 未選択状態（空文字列）はエラー
- エラーメッセージ: "選択肢を選んでください"

### Boolean型のバリデーション

- 常に有効（true または false のみを許可）

## CSS / スタイリング

BEM（Block Element Modifier）記法を使用しています。

### 主要クラス

- `.dynamic-input` - ブロック
- `.dynamic-input__label` - ラベル要素
- `.dynamic-input__field` - 入力フィールド要素
- `.dynamic-input__field--text` - テキスト入力の修飾子
- `.dynamic-input__field--number` - 数値入力の修飾子
- `.dynamic-input__field--date` - 日付入力の修飾子
- `.dynamic-input__field--datetime` - 日時入力の修飾子
- `.dynamic-input__field--picklist` - 選択リストの修飾子
- `.dynamic-input__field--checkbox` - チェックボックスの修飾子
- `.dynamic-input__error` - エラーメッセージ要素

### カスタマイズ

CSS変数やクラスを使用してスタイルをカスタマイズできます。

## デモコンポーネントの使用方法

`dynamicInputDemo` コンポーネントは、全ての機能を確認できるデモページです。

1. Salesforce組織にデプロイ
2. Lightning Appページ、Recordページ、またはHomeページに配置
3. 各データ型の動作とバリデーションを確認

## 想定ユースケース

### ユースケース1: 動的フォーム生成

```javascript
// オブジェクトの項目メタデータから動的にフォームを生成
fields.forEach(field => {
    // fieldのfieldTypeに応じてdynamicInputコンポーネントを表示
});
```

### ユースケース2: カスタム検索フォーム

```javascript
// 検索条件として様々なデータ型の入力を受け付ける
```

### ユースケース3: 設定画面

```javascript
// アプリケーション設定で異なるデータ型の設定項目を表示
```

## 今後の拡張予定

- 複数項目の同時表示対応
- Salesforceの項目メタデータ（describe結果）からの自動設定
- Lookup/Reference型対応
- タイムゾーン対応
- 国際化対応（i18n）
- カスタムバリデーションルールの追加

## トラブルシューティング

### エラーメッセージが表示されない

- `onerror` イベントハンドラが正しく設定されているか確認
- コンソールでエラーログを確認

### 選択リストに選択肢が表示されない

- `picklistOptions` が正しい形式の配列（`[{label, value}]`）か確認
- データバインディングが正しく行われているか確認

### バリデーションが動作しない

- 各データ型に対応したバリデーションプロパティが設定されているか確認
- `fieldType` プロパティが正しく設定されているか確認

## ライセンス

このコンポーネントはMITライセンスの元で提供されます。
