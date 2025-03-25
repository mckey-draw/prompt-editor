import './styles.css';
import { PromptText } from './PromptText';
import { TagPanel } from './TagPanel';
import { showNotification } from './utils';

/**
 * DOMの読み込み完了後に実行される初期化処理
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const promptEditor = document.getElementById('promptEditor');
    const saveBtn = document.getElementById('saveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const openBtn = document.getElementById('openBtn');
    const undoBtn = document.getElementById('undoBtn');
    const tagsPanel = document.getElementById('tagsPanel');

    // PromptTextのインスタンスを作成
    const promptText = new PromptText();

    // TagPanelのインスタンスを作成
    const tagPanel = new TagPanel(tagsPanel, promptEditor);

    // 初期状態の設定
    promptEditor.value = promptText.getText();
    tagPanel.detectAndUpdateTags();

    // テキストエリアのフォーカスが外れた時の処理
    promptEditor.addEventListener('blur', () => {
        promptText.setText(promptEditor.value);
        tagPanel.detectAndUpdateTags();
    });

    // テキストエリアの入力時の処理
    promptEditor.addEventListener('input', () => {
        promptText.setText(promptEditor.value);
    });

    // ファイルを開くボタンの処理
    openBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const content = await promptText.loadFromFile(file);
                    promptEditor.value = content;
                    tagPanel.detectAndUpdateTags();
                    showNotification('ファイルを読み込みました');
                } catch (error) {
                    showNotification(error.message, 'error');
                }
            }
        };
        
        input.click();
    });

    // 保存ボタンの処理
    saveBtn.addEventListener('click', () => {
        promptText.setText(promptEditor.value);
        promptText.saveToLocalStorage();
        showNotification('保存しました');
    });

    // クリアボタンの処理
    clearBtn.addEventListener('click', () => {
        if (confirm('エディターの内容をクリアしてもよろしいですか？')) {
            promptText.clear();
            promptEditor.value = '';
            tagPanel.detectAndUpdateTags();
            showNotification('エディターをクリアしました');
        }
    });

    // 元に戻すボタンの処理
    undoBtn.addEventListener('click', () => {
        if (promptText.undo()) {
            promptEditor.value = promptText.getText();
            tagPanel.detectAndUpdateTags();
            showNotification('操作を元に戻しました');
        } else {
            showNotification('これ以上元に戻せません', 'error');
        }
    });

    // キーボードショートカットの設定
    // Ctrl+S (Command+S) で保存
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveBtn.click();
        }
    });

    // Ctrl+Z (Command+Z) で元に戻す
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            undoBtn.click();
        }
    });
}); 