document.addEventListener('DOMContentLoaded', () => {
    const promptEditor = document.getElementById('promptEditor');
    const saveBtn = document.getElementById('saveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const openBtn = document.getElementById('openBtn');
    const tagCount = document.getElementById('tagCount');
    const tagsPanel = document.getElementById('tagsPanel');

    // タグマネージャーのインスタンスを作成
    const tagManager = new TagManager();

    // タグパネルを更新する関数
    function updateTagsPanel(text) {
        tagManager.splitTags(text);
        tagsPanel.innerHTML = '';
        tagManager.getTags().forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-item';
            tagElement.textContent = tag.getDisplayTag();
            tagsPanel.appendChild(tagElement);
        });
        // タグ数を更新
        tagCount.textContent = tagManager.getTagCount();
    }

    // プロンプトテキストを更新する関数
    function updatePromptText() {
        const tags = Array.from(tagsPanel.children).map(tagElement => {
            const tag = new Tag(tagElement.textContent);
            tag.setName(tagElement.textContent);
            return tag;
        });
        tagManager.updateTags(tags);
        promptEditor.value = tagManager.generatePromptText();
    }

    // SortableJSの初期化
    new Sortable(tagsPanel, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: updatePromptText
    });

    // テキストエリアの変更を監視
    promptEditor.addEventListener('blur', () => {
        updateTagsPanel(promptEditor.value);
    });

    // ファイルを開くボタンの処理
    openBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    promptEditor.value = e.target.result;
                    updateTagsPanel(e.target.result);
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    });

    // 保存ボタンの処理
    saveBtn.addEventListener('click', () => {
        const prompt = promptEditor.value;
        localStorage.setItem('savedPrompt', prompt);
        
        // 保存完了のフィードバック
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '保存しました！';
        saveBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.backgroundColor = '';
        }, 1500);
    });

    // クリアボタンの処理
    clearBtn.addEventListener('click', () => {
        if (confirm('エディターの内容をクリアしてもよろしいですか？')) {
            promptEditor.value = '';
            localStorage.removeItem('savedPrompt');
            updateTagsPanel('');
        }
    });

    // Ctrl+S (Command+S) で保存
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveBtn.click();
        }
    });

    // ローカルストレージからデータを読み込む
    const savedPrompt = localStorage.getItem('savedPrompt');
    if (savedPrompt) {
        promptEditor.value = savedPrompt;
        updateTagsPanel(savedPrompt);
    }
}); 