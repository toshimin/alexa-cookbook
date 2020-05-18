# Alexa Skills Management API (SMAPI) SDK　のデモ (Node.js) 
このデモでは、Alexa Skills Management API SDKを使ってNode.jsプロジェクトを設定し、[Alexa Skill Metrics API](https://developer.amazon.com/ja-JP/docs/alexa/smapi/metrics-api.html/)を使って開発者(vendor ID)が保有するスキルを一覧表示したり、レポートデータを取得したりするためのサンプルAPIコールを実行する方法を紹介します。

## 前提要件
* Node.js and NPM (https://nodejs.com)
* An Amazon Developer Account (https://developer.amazon.com)
* The ASK CLI (https://www.npmjs.com/package/ask-cli)

## セットアップ
前提要件のセットアップが完了したら、認可情報を取得する必要があります。これには3つのステップがあります。

### Node.js モジュールのインストール

コマンドラインでデモファイルと同じディレクトリに移動し、`npm install` コマンドを実行します。

### Webアプリ用 Login with Amazon セキュリティプロファイルの登録

Alexaスキルの開発に使用したアカウントと同じアカウントでdeveloper.amazon.comにログインしていることを確認してください。

以下のページの手順に従って、Login with Amazonのセキュリティプロファイルを作成してください。

* [新しいセキュリティプロファイルを作成する](https://developer.amazon.com/ja/docs/login-with-amazon/register-web.html#create-a-new-security-profile)

プロファイルからクライアントIDとシークレットキーを入手します。それらをtokens.jsファイルに追加します。次のステップでは、それらの情報をコピペして利用します。

### APIアクセストークンの取得

ASK CLIで、`ask util generate-lwa-tokens`コマンドを実行します。コマンドを実行すると前のステップで入手したクライアントIDとシークレットキーの入力が要求されます。

コマンドが実行されると、以下のJSONデータが返されます。リフレッシュトークンが含まれます。

```javascript
{
  "access_token": "ACCESS_TOKEN",
  "refresh_token": "REFRESH_TOKEN",
  "token_type": "bearer",
  "expires_in": 3600,
  "expires_at": "2019-11-19T20:25:06.584Z"
}
```

簡単にアクセスできるように、tokens.js にこの情報も追加します。

## デモの実行

### アカウントが保有するAlexaスキルのリスト

https://developer.amazon.com/mycid.html にアクセスし、ご自分の Vendor ID を取得します。これもtokens.js ファイルに追加します。

コマンドラインで、 `node listSkills.js` コマンドを実行します。すると、あなたのスキルの一覧がJSON形式で出力されます。

### レポートデータの取得

ご自分のスキルのうちの一つを選び、スキルIDを取得します。スキルIDは、Alexaの開発者コンソールから取得できます。スキル一覧ページの各スキル名の下に小さなリンクがあります。それをクリックするとスキルIDが表示されます。

[Alexa レポートAPIの技術文書](https://developer.amazon.com/ja-JP/docs/alexa/smapi/metrics-api.html) では、APIコールで使用できる（もしくは使用しなければならない）値の解説があります。

## 関連リソース

SMAPI SDK: https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/tree/2.0.x/ask-smapi-sdk
レポートAPI: https://developer.amazon.com/ja-JP/docs/alexa/smapi/metrics-api.html

