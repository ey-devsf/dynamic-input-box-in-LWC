# Dynamic Input Field In LWC

## 背景

Salesforce のカスタム画面を作成する際、項目ごとに入力値のデータ型（文字列、数値、日付、選択リストなど）が異なる。  
しかし、標準ではデータ型に応じて自動で入力フィールドを切り替える汎用コンポーネントが存在しない。  
そのため、各データ型ごとに異なる `<lightning-input>` や `<select>` を手作業で実装する必要があり、開発工数が増える問題がある。

## 概要

LWC で **データ型に応じて入力 UI を自動切り替える汎用コンポーネント** を開発する。

- **目的**  
  任意のオブジェクト項目（例：取引先の項目）を指定すると、データ型に応じて自動で入力フィールドが変化するフォームを実現する。
- **特徴**
  - データ型に応じて HTML の input type や UI を動的に変更
  - 桁数や選択肢、初期値などを親コンポーネントからパラメータで指定
  - 入力値とエラーメッセージを親へ返却可能
  - 他の LWC に簡単に埋め込める汎用設計

---

## 機能

### パラメータ（@api）

| パラメータ名 | 型 | 必須 | 説明 |
|---------------|----|------|------|
| `dataType` | String | ✓ | 入力するデータ型（例：`Text`, `Number`, `Date`, `DateTime`, `Picklist`, `Boolean`） |
| `maxLength` | Number |  | 文字列の場合の最大桁数 |
| `precision` | Number |  | 数値の場合の整数桁数 |
| `scale` | Number |  | 数値の場合の小数桁数 |
| `picklistOptions` | Array |  | 選択リスト型の場合の選択肢 `{ label, value }` |
| `defaultValue` | Any |  | 初期表示値 |
| `label` | String |  | 入力フィールドのラベル（任意） |

---

### イベント（親へ返却）

| イベント名 | 内容 |
|-------------|------|
| `valuechange` | 入力値が変更されたときに発火。`detail` に `{ value, isValid, errorMessage }` を含む。 |
| `error` | 入力値が不正な場合に発火。`detail` に `{ message }` を含む。 |

---

### 入力フィールドの切り替え仕様

| dataType | 表示コンポーネント | 備考 |
|-----------|--------------------|------|
| `Text` | `<input type="text">` | `maxlength` を反映 |
| `Number` | `<input type="number">` | `precision`, `scale` に従ってバリデーション |
| `Date` | `<input type="date">` | 標準の HTML 日付ピッカー |
| `DateTime` | `<input type="datetime-local">` | 日付＋時間を同時に入力可能 |
| `Picklist` | `<select>` | `picklistOptions` を展開 |
| `Boolean` | `<input type="checkbox">` | チェック状態を true/false として返す |

---

### バリデーション仕様

- **Text**
  - 最大桁数超過時にエラー
- **Number**
  - 整数桁数、少数桁数をチェック
  - 数値以外の入力はエラー
- **Date**
  - 不正な日付フォーマットはエラー
- **DateTime**
  - 不正な日付・時刻フォーマットはエラー
- **Picklist**
  - 未選択状態はエラー（必須項目の場合のみ）
- **Boolean**
  - 常に true/false のみ許可

---

### デザイン仕様

- `lightning-input` は使用しない（標準の input, select, checkbox を使用）
- クラス名は BEM に準拠 (`dynamic-input__field`, `dynamic-input__label` など)
- スタイルは CSS モジュールで定義
- エラーメッセージは赤字でフィールド下に表示

---

### 想定ユースケース

1. 取引先項目をプルダウンで選択
2. 選択された項目の `dataType` を取得
3. 本コンポーネントに渡す
4. コンポーネントが自動で入力フィールドを切り替え、ユーザが入力
5. 入力値とバリデーション結果を親コンポーネントへ返す

---

### 今後の拡張予定

- 複数項目の同時表示対応
- Salesforceの項目メタデータ（`describe` 結果）からの自動設定
- Lookup／Reference型対応
- 日付＋時間型（`DateTime`）のタイムゾーン対応

