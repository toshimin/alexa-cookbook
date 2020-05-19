# Alexa Skills Management API (SMAPI) SDK のデモ (Node.js)
このデモでは、Alexa Skills Management API SDKを使ったNode.jsプロジェクトを設定し、[Alexa Skill レポートAPI](https://developer.amazon.com/ja-JP/docs/alexa/smapi/metrics-api.html/)を使って開発者(vendor ID)が保有するスキルを一覧表示したり、レポートデータを取得したりするためのAPIコールを実行する方法を紹介します。

## 前提要件
* Node.js と NPM (https://nodejs.com)
* Amazon開発者アカウント (https://developer.amazon.com)
* ASK CLI (https://www.npmjs.com/package/ask-cli)

## セットアップ
前提要件の準備が整ったら、必要な認可情報を取得します。これには以下の3つのステップがあります。

### 1. Node.js モジュールをインストールする

コマンドラインでデモファイルと同じディレクトリに移動し、`npm install` コマンドを実行します。

### 2. Webアプリ用 Login with Amazon セキュリティプロファイルを登録する

Alexaスキルの開発に使用したアカウントと同じアカウントでdeveloper.amazon.comにログインしてください。

以下のページの手順に従って、Login with Amazonのセキュリティプロファイルを作成してください。

* [新しいセキュリティプロファイルを作成する](https://developer.amazon.com/ja/docs/login-with-amazon/register-web.html#create-a-new-security-profile)

LWAのセキュリティプロファイルを作成したら、クライアントIDとクライアントシークレットの文字列をコピーし、tokens.jsファイルの該当部分に追加してください。

### 3. APIアクセストークンを取得する

ターミナルを開き、ASK CLIの `ask util generate-lwa-tokens`コマンドを実行します。コマンドを実行するとWebブラウザが開き、開発者アカウントでのログインが求められます。前のステップでクライアントIDとクライアントシークレットを入手した際に使用したアカウントでログインします。うまくブラウザが開かない場合は、`--no-browser` オプションを付けて再度試してみてください。

ログインすると、ターミナルに以下のJSONデータが返されます。ここにはアクセストークンとリフレッシュトークンが含まれます。

```javascript
{
  "access_token": "ACCESS_TOKEN",
  "refresh_token": "REFRESH_TOKEN",
  "token_type": "bearer",
  "expires_in": 3600,
  "expires_at": "2019-11-19T20:25:06.584Z"
}
```

この後のデモで利用できるように、アクセストークンとリフレッシュトークンの文字列をコピーし、tokens.js ファイルの該当部分に追加してください。

ASK CLI の generate-lwa-tokens サブコマンドの詳細についてはこちらの[技術文書](https://developer.amazon.com/ja-JP/docs/alexa/smapi/get-access-token-smapi.html#client-only))を参照してください。

## デモの実行

### 1. アカウントが保有するAlexaスキルのリストを表示する

開発者ポータルにログインした状態で、https://developer.amazon.com/mycid.html にアクセスし、ご自分の Vendor ID の情報を取得します。これもtokens.js ファイルの該当部分に追加してください。

コマンドラインで、 `node listSkills.js` コマンドを実行します。すると、あなたのスキルの一覧がJSON形式で出力されます。

### 2. レポートデータを取得する

ご自分のスキルのうちの一つを選び、スキルIDを取得します。スキルIDは、Alexaの開発者コンソールから取得できます。スキル一覧ページの各スキル名の下に小さなリンクがあります。それをクリックするとスキルIDが表示されます。

[Alexa レポートAPIの技術文書](https://developer.amazon.com/ja-JP/docs/alexa/smapi/metrics-api.html) では、APIコールで使用できる（もしくは使用しなければならない）値の解説があります。

## 関連リソース

SMAPI SDK: https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/tree/2.0.x/ask-smapi-sdk
レポートAPI: https://developer.amazon.com/ja-JP/docs/alexa/smapi/metrics-api.html
