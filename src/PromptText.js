import { saveToLocalStorage, loadFromLocalStorage } from './utils';

/**
 * プロンプトテキストを管理するクラス
 * - テキストの保存と読み込み
 * - 履歴管理（Undo/Redo）
 */
export class PromptText {
    /**
     * コンストラクタ
     * - 初期状態の設定
     * - ローカルストレージからの復元
     */
    constructor() {
        this.text = '';
        this.history = [];
        this.currentIndex = -1;
        this.maxHistory = 50;
        
        this.loadFromLocalStorage();
    }

    /**
     * プロンプトテキストを設定
     * @param {string} text - 設定するテキスト
     */
    setText(text) {
        this.addToHistory(this.text);
        this.text = text;
        this.saveToLocalStorage();
    }

    /**
     * 現在のプロンプトテキストを取得
     * @returns {string} 現在のテキスト
     */
    getText() {
        return this.text;
    }

    /**
     * 履歴に状態を追加
     * @param {string} text - 追加するテキスト
     */
    addToHistory(text) {
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        
        this.history.push(text);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        
        this.currentIndex = this.history.length - 1;
    }

    /**
     * 直前の状態に戻す（Undo）
     * @returns {boolean} 操作が成功したかどうか
     */
    undo() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.text = this.history[this.currentIndex];
            return true;
        }
        return false;
    }

    /**
     * 次の状態に進む（Redo）
     * @returns {boolean} 操作が成功したかどうか
     */
    redo() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            this.text = this.history[this.currentIndex];
            return true;
        }
        return false;
    }

    /**
     * ファイルからテキストを読み込む
     * @param {File} file - 読み込むファイル
     * @returns {Promise<string>} 読み込んだテキスト
     */
    async loadFromFile(file) {
        try {
            const text = await file.text();
            this.setText(text);
            return text;
        } catch (error) {
            throw new Error('ファイルの読み込みに失敗しました: ' + error.message);
        }
    }

    /**
     * 現在の状態をローカルストレージに保存
     */
    saveToLocalStorage() {
        const data = {
            text: this.text,
            history: this.history,
            currentIndex: this.currentIndex
        };
        saveToLocalStorage('promptText', data);
    }

    /**
     * ローカルストレージから状態を読み込む
     */
    loadFromLocalStorage() {
        const data = loadFromLocalStorage('promptText');
        if (data) {
            this.text = data.text || '';
            this.history = data.history || [];
            this.currentIndex = data.currentIndex || -1;
        }
    }

    /**
     * プロンプトテキストをクリア
     */
    clear() {
        this.addToHistory(this.text);
        this.text = '';
        this.saveToLocalStorage();
    }
} 