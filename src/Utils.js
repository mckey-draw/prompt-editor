/**
 * 通知を表示する
 * @param {string} message - 表示するメッセージ
 * @param {string} [type='success'] - 通知の種類（'success' または 'error'）
 */
export const showNotification = (message, type = 'success') => {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.className = 'notification';
        }, 500);
    }, 2000);
};

/**
 * 関数の実行を遅延させる（デバウンス処理）
 * @param {Function} func - 実行する関数
 * @param {number} wait - 遅延時間（ミリ秒）
 * @returns {Function} デバウンス処理された関数
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * エラーをログに記録する
 * @param {string} message - エラーメッセージ
 * @param {Error|any} [error] - エラーオブジェクト（オプション）
 */
export const logError = (message, error = null) => {
    if (error) {
        console.error(message, error);
    } else {
        console.error(message);
    }
};

/**
 * データをローカルストレージに保存
 * @param {string} key - 保存するキー
 * @param {any} data - 保存するデータ
 * @returns {boolean} 保存が成功したかどうか
 */
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        logError('LocalStorage保存エラー:', error);
        return false;
    }
};

/**
 * ローカルストレージからデータを読み込む
 * @param {string} key - 読み込むキー
 * @returns {any|null} 読み込んだデータ、エラー時はnull
 */
export const loadFromLocalStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        logError('LocalStorage読み込みエラー:', error);
        return null;
    }
};

/**
 * エラーをログに記録し、ユーザーに通知する
 * @param {Error} error - エラーオブジェクト
 * @param {string} context - エラーが発生した文脈
 */
export const handleError = (error, context) => {
    logError(`${context}でエラーが発生:`, error);
    showNotification(`エラーが発生しました: ${error.message}`, 'error');
}; 