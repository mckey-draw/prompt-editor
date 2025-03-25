#!/bin/bash

# UTF-8の設定
export LANG=ja_JP.UTF-8

echo "プロンプトエディターを起動します..."

# npmが利用可能かチェック
if ! command -v npm &> /dev/null; then
    echo "NPMが見つかりません。Node.jsをインストールしてください。"
    echo "https://nodejs.org/からダウンロードできます。"
    read -p "Enterキーを押して終了..."
    exit 1
fi

# node_modulesの存在チェック
if [ ! -d "node_modules" ]; then
    echo "依存パッケージをインストールします..."
    npm install
    if [ $? -ne 0 ]; then
        echo "パッケージのインストールに失敗しました。"
        read -p "Enterキーを押して終了..."
        exit 1
    fi
fi

echo "開発サーバーを起動します..."
echo "ブラウザで http://localhost:3001 を開いてください。"
echo "終了するには Ctrl+C を押してください。"

npm start 