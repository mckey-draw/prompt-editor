@echo off
chcp 65001
echo プロンプトエディターを起動します...

rem npmが利用可能かチェック
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo NPMが見つかりません。Node.jsをインストールしてください。
    echo https://nodejs.org/からダウンロードできます。
    pause
    exit /b 1
)

rem node_modulesの存在チェック
if not exist node_modules\ (
    echo 依存パッケージをインストールします...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo パッケージのインストールに失敗しました。
        pause
        exit /b 1
    )
)

echo 開発サーバーを起動します...
echo ブラウザで http://localhost:3001 を開いてください。
echo 終了するには Ctrl+C を押してください。

npm start 