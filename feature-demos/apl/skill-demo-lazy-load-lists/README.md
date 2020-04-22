# APL 遅延読み込みリストのデモ

このサンプルスキルのコードは、US Alexa Teamが作成したコードを@toshimin が日本語で動作するよう手を加えたものです。あくまで参考程度にご利用ください。

## 必要なもの
*  [Amazon開発者アカウント](http://developer.amazon.com/alexa)

* 日本語版サンプルコード [GitHub](https://github.com/toshimin/alexa-cookbook/tree/master/feature-demos/apl/skill-demo-lazy-load-lists)

* 本家のサンプルコード [GitHub](https://github.com/alexa/alexa-cookbook/tree/master/feature-demos/apl/skill-demo-lazy-load-lists)


## サンプルスキルのセットアップ方法
Alexa Hosted-Skillsを利用する場合は、以下の手順に従ってください。

1. 新規で日本語のスキルを一つ作成します。デフォルトの言語は日本語、ホスティング方法は、Alexa-Hosted (Node.js) を選択してください。
2. models/ja-JP.json ファイルの内容をすべてコピーし、対話モデルのJSONエディターに上書きペーストしてください。
3. スキルの呼び出し名を任意に変更します。「カラーピッカー」など
4. インターフェースの設定画面で、Alexa Presentation Language を有効にしてください。
5. 対話モデルを保存しビルドを完了させてください。
6. **コードエディタ**を開きます。index.js の内容をすべてコピーし、コードエディターの既存のコードを上書きペーストしてください。(SkillCode > lambda > index.js)
7. コードエディターで、新規ファイルを作成し、次の３つのJSONドキュメントを追加し、GitHubリポジトリの中にある同じ名前のファイルからその内容をすべてコピーします。SampleData.json ファイルは除外してください（これは[APL画面ツール](https://developer.amazon.com/alexa/console/ask/displays)の出力ファイルです）

   * colors.json
   * pagerDocument.json
   * sequenceDocument.json

7. あとはコードを保存しデプロイするだけです。

## サンプルスキルの実行方法

サンプルスキルを起動するには、「アレクサ、カラーピッカーを開いて」などのように話しかけます。Echo ShowなどのAPL対応デバイスを使用している場合は、デバイスの画面にAPLドキュメントが表示されます。画面がないデバイスの場合は、画面付きデバイスでスキルを実行するように求められます。このデモを実行させるにはAPLのバージョン1.3以上が必要です。

### サンプルスキルの機能

このサンプルスキルでは、非常に数の多いアイテム（色）のセットをページャーやシーケンスコンポーネントの中に表示しています。ヘッダーで *ページャ* か *シーケンス* を選択することで、ドキュメントで使われているコンポーネントを切り替えることができます。指で画面をタッチしてスクロールすると、次々とリストの他の項目が読み込まれます。ここ部分は、 `LoadIndexListDataRequestHandler`ハンドラーの中で、新しいディレクティブ [Alexa.Presentation.APL.SendIndexListData](https://developer.amazon.com/ja-JP/docs/alexa/alexa-presentation-language/apl-interface.html#sendindexlistdata-directive) を使って実装しています。


このサンプルスキルでは、APLエラーハンドラー`APLRuntimeErrorHandler`のデモも含まれています。これは、当れ足いリクエストタイプ [Alexa.Presentation.APL.RuntimeError](https://developer.amazon.com/ja-JP/docs/alexa/alexa-presentation-language/apl-interface.html#runtimeerror-request) を実装しています。

カラーリストを変更したい場合や、対話モデルがどのように作成されているか、コードの中身や解説を知りたい場合は、build ディレクトリの中のREADMEをチェックしてください。
