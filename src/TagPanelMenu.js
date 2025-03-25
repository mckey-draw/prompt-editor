import { Tag } from './tags';
import { showNotification } from './utils';

/**
 * タグパネルメニューを管理するクラス
 */
export class TagPanelMenu {
    /**
     * コンストラクタ
     * @param {TagPanel} tagPanel - タグパネルのインスタンス
     */
    constructor(tagPanel) {
        this.tagPanel = tagPanel;
        this.copiedTag = null;
        this.weightStep = 0.1; // 重み付けの増減ステップ
        this.maxWeight = 10.0; // 最大重み
        this.minWeight = -10.0; // 最小重み
    }

    /**
     * タグメニューを作成
     * @param {HTMLElement} tagElement - タグ要素
     * @param {Tag} tag - タグオブジェクト
     * @returns {HTMLElement} メニュー要素
     */
    createTagMenu(tagElement, tag) {
        const menu = document.createElement('div');
        menu.className = 'tag-menu';

        // 編集グループ
        const editGroup = this.createEditGroup(tagElement, tag);
        menu.appendChild(editGroup);

        // コピー＆ペーストグループ
        const copyGroup = this.createCopyPasteGroup(tagElement, tag);
        menu.appendChild(copyGroup);

        // 丸括弧グループ
        const roundBracketGroup = this.createRoundBracketGroup(tagElement, tag);
        menu.appendChild(roundBracketGroup);

        // 角括弧グループ
        const squareBracketGroup = this.createSquareBracketGroup(tagElement, tag);
        menu.appendChild(squareBracketGroup);

        // 重み付けグループ
        const weightGroup = this.createWeightGroup(tagElement, tag);
        menu.appendChild(weightGroup);

        return menu;
    }

    /**
     * 編集グループを作成
     */
    createEditGroup(tagElement, tag) {
        const group = document.createElement('div');
        group.className = 'control-group';

        const editBtn = document.createElement('button');
        editBtn.className = 'tag-menu-button edit';
        editBtn.textContent = '編集';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            this.editTag(tagElement, tag);
        };
        group.appendChild(editBtn);

        return group;
    }

    /**
     * コピー＆ペーストグループを作成
     */
    createCopyPasteGroup(tagElement, tag) {
        const group = document.createElement('div');
        group.className = 'control-group';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'tag-menu-button copy';
        copyBtn.textContent = 'コピー';
        copyBtn.onclick = (e) => {
            e.stopPropagation();
            this.copyTag(tag);
        };
        group.appendChild(copyBtn);

        const pasteBtn = document.createElement('button');
        pasteBtn.className = 'tag-menu-button paste';
        pasteBtn.textContent = 'ペースト';
        pasteBtn.onclick = (e) => {
            e.stopPropagation();
            this.pasteTag(tagElement);
        };
        group.appendChild(pasteBtn);

        return group;
    }

    /**
     * 重み付けグループを作成
     */
    createWeightGroup(tagElement, tag) {
        const group = document.createElement('div');
        group.className = 'control-group';

        const decrementBtn = document.createElement('button');
        decrementBtn.className = 'tag-menu-button weight-decrement';
        decrementBtn.textContent = 'ー';
        decrementBtn.onclick = (e) => {
            e.stopPropagation();
            this.decrementWeight(tagElement, tag);
        };
        group.appendChild(decrementBtn);

        const weightLabel = document.createElement('span');
        weightLabel.className = 'control-label';
        weightLabel.textContent = '重み';
        group.appendChild(weightLabel);

        const incrementBtn = document.createElement('button');
        incrementBtn.className = 'tag-menu-button weight-increment';
        incrementBtn.textContent = '＋';
        incrementBtn.onclick = (e) => {
            e.stopPropagation();
            this.incrementWeight(tagElement, tag);
        };
        group.appendChild(incrementBtn);

        const removeWeightBtn = document.createElement('button');
        removeWeightBtn.className = 'tag-menu-button weight-remove';
        removeWeightBtn.textContent = 'ｘ';
        removeWeightBtn.onclick = (e) => {
            e.stopPropagation();
            this.removeWeight(tagElement, tag);
        };
        group.appendChild(removeWeightBtn);

        return group;
    }

    /**
     * 丸括弧グループを作成
     */
    createRoundBracketGroup(tagElement, tag) {
        const group = document.createElement('div');
        group.className = 'control-group';

        const decrementBtn = document.createElement('button');
        decrementBtn.className = 'tag-menu-button bracket-decrement';
        decrementBtn.textContent = 'ー';
        decrementBtn.onclick = (e) => {
            e.stopPropagation();
            this.decrementRoundBracket(tagElement, tag);
        };
        group.appendChild(decrementBtn);

        const bracketLabel = document.createElement('span');
        bracketLabel.className = 'control-label';
        bracketLabel.textContent = '( )';
        group.appendChild(bracketLabel);

        const incrementBtn = document.createElement('button');
        incrementBtn.className = 'tag-menu-button bracket-increment';
        incrementBtn.textContent = '＋';
        incrementBtn.onclick = (e) => {
            e.stopPropagation();
            this.incrementRoundBracket(tagElement, tag);
        };
        group.appendChild(incrementBtn);

        return group;
    }

    /**
     * 角括弧グループを作成
     */
    createSquareBracketGroup(tagElement, tag) {
        const group = document.createElement('div');
        group.className = 'control-group';

        const decrementBtn = document.createElement('button');
        decrementBtn.className = 'tag-menu-button bracket-decrement';
        decrementBtn.textContent = 'ー';
        decrementBtn.onclick = (e) => {
            e.stopPropagation();
            this.decrementSquareBracket(tagElement, tag);
        };
        group.appendChild(decrementBtn);

        const bracketLabel = document.createElement('span');
        bracketLabel.className = 'control-label';
        bracketLabel.textContent = '[ ]';
        group.appendChild(bracketLabel);

        const incrementBtn = document.createElement('button');
        incrementBtn.className = 'tag-menu-button bracket-increment';
        incrementBtn.textContent = '＋';
        incrementBtn.onclick = (e) => {
            e.stopPropagation();
            this.incrementSquareBracket(tagElement, tag);
        };
        group.appendChild(incrementBtn);

        return group;
    }

    /**
     * タグを<>形式に変換
     * @param {string} text - タグのテキスト
     * @returns {string} - <>形式に変換されたタグ
     */
    convertToTagFormat(text) {
        if (text.startsWith('<') && text.endsWith('>')) {
            return text;
        }
        return `<${text}>`;
    }

    /**
     * タグに重みが設定されているかを確認
     * @param {string} text - タグのテキスト
     * @returns {boolean} - 重みが設定されている場合はtrue
     */
    hasWeight(text) {
        return /^<.*:([0-9.]+)>$/.test(text);
    }

    /**
     * タグに重みを設定
     * @param {string} text - タグのテキスト
     * @param {number} weight - 設定する重み（デフォルト: 1.0）
     * @returns {string} - 重みが設定されたタグのテキスト
     */
    setWeight(text, weight = 1.0) {
        const formattedText = this.convertToTagFormat(text);
        const innerText = formattedText.slice(1, -1);
        if (this.hasWeight(formattedText)) {
            return `<${innerText.replace(/:([0-9.]+)$/, `:${weight.toFixed(1)}`)}>`; 
        }
        return `<${innerText}:${weight.toFixed(1)}>`;
    }

    /**
     * タグの重みを削除
     * @param {HTMLElement} tagElement - タグ要素
     */
    removeWeight(tagElement) {
        const text = tagElement.dataset.tag;
        if (this.hasWeight(text)) {
            const formattedText = this.convertToTagFormat(text);
            const baseTag = formattedText.slice(1, -1).split(':')[0];
            const newTag = new Tag(baseTag);
            const tagText = tagElement.querySelector('.tag-text');
            tagText.textContent = newTag.getDisplayTag();
            tagElement.dataset.tag = newTag.getTag();
            this.tagPanel.updatePromptFromTags();
        }
    }

    /**
     * タグを編集
     */
    editTag(tagElement, tag) {
        let tagText = tagElement.querySelector('.tag-text');
        if (!tagText) {
            tagText = document.createElement('span');
            tagText.className = 'tag-text';
            tagText.textContent = tag.getDisplayTag();
            tagElement.appendChild(tagText);
        }
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'tag-edit-input';
        input.value = tag.getTag();
        
        let isFinishing = false;
        
        const finishEdit = (shouldUpdate = true) => {
            if (isFinishing) return;
            isFinishing = true;
            
            if (shouldUpdate) {
                const newTag = new Tag(input.value);
                const newTagText = document.createElement('span');
                newTagText.className = 'tag-text';
                newTagText.textContent = newTag.getDisplayTag();
                input.replaceWith(newTagText);
                tagElement.dataset.tag = newTag.getTag();
                this.tagPanel.updatePromptFromTags();
            } else {
                const newTagText = document.createElement('span');
                newTagText.className = 'tag-text';
                newTagText.textContent = tag.getDisplayTag();
                input.replaceWith(newTagText);
            }
        };
        
        input.onblur = () => {
            finishEdit(true);
        };
        
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                finishEdit(true);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                finishEdit(false);
            }
        };
        
        tagText.replaceWith(input);
        input.focus();
        input.select();
    }

    /**
     * タグをコピー
     */
    copyTag(tag) {
        this.copiedTag = tag.getTag();
        showNotification('タグをコピーしました');
    }

    /**
     * タグをペースト
     */
    pasteTag(tagElement) {
        if (this.copiedTag) {
            const newTag = new Tag(this.copiedTag);
            const tagText = tagElement.querySelector('.tag-text');
            tagText.textContent = newTag.getDisplayTag();
            tagElement.dataset.tag = newTag.getTag();
            this.tagPanel.updatePromptFromTags();
            showNotification('タグをペーストしました');
        }
    }

    /**
     * タグの重みを更新
     * @param {HTMLElement} tagElement - タグ要素
     * @param {boolean} isIncrement - 増加の場合はtrue、減少の場合はfalse
     */
    updateTagWeight(tagElement, isIncrement) {
        const text = tagElement.dataset.tag;
        if (!this.hasWeight(text)) {
            tagElement.dataset.tag = this.setWeight(text);
        }
        const newText = this.calculateWeight(tagElement.dataset.tag, this.weightStep, isIncrement);
        const newTag = new Tag(newText);
        const tagText = tagElement.querySelector('.tag-text');
        tagText.textContent = newTag.getDisplayTag();
        tagElement.dataset.tag = newTag.getTag();
        this.tagPanel.updatePromptFromTags();
    }

    /**
     * 重み付けを増加
     */
    incrementWeight(tagElement, tag) {
        this.updateTagWeight(tagElement, true);
    }

    /**
     * 重み付けを減少
     */
    decrementWeight(tagElement, tag) {
        this.updateTagWeight(tagElement, false);
    }

    /**
     * タグの重みを取得
     * @param {string} text - タグのテキスト
     * @returns {{weight: number, hasWeight: boolean}} - 重みの情報
     */
    getWeight(text) {
        const formattedText = this.convertToTagFormat(text);
        const innerText = formattedText.slice(1, -1);
        const match = innerText.match(/:([0-9.]+)$/);
        return {
            weight: match ? parseFloat(match[1]) : 1.0,
            hasWeight: !!match
        };
    }

    /**
     * タグ文字列を整形
     * @param {string} tag - タグ名
     * @param {number} weight - 重み
     * @returns {string} - 整形されたタグ文字列
     */
    formatTagWithWeight(tag, weight) {
        const formattedText = this.convertToTagFormat(tag);
        const baseTag = formattedText.slice(1, -1).split(':')[0];
        return `<${baseTag}:${weight}>`;
    }

    /**
     * タグの重みを計算
     * @param {string} text - タグのテキスト
     * @param {number} step - 増減量
     * @param {boolean} isIncrement - 増加の場合はtrue、減少の場合はfalse
     * @returns {string} - 更新されたテキスト
     */
    calculateWeight(text, step, isIncrement) {
        const { weight } = this.getWeight(text);
        const newWeight = isIncrement
            ? Math.min(weight + step, this.maxWeight).toFixed(1)
            : Math.max(weight - step, this.minWeight).toFixed(1);
        return this.formatTagWithWeight(text, newWeight);
    }

    /**
     * 重み付けを増加させる
     * @param {string} text - タグのテキスト
     * @param {number} step - 増加量（デフォルト: this.weightStep）
     * @returns {string} - 更新されたテキスト
     */
    calculateIncrementedWeight(text, step = this.weightStep) {
        return this.calculateWeight(text, step, true);
    }

    /**
     * 重み付けを減少させる
     * @param {string} text - タグのテキスト
     * @param {number} step - 減少量（デフォルト: this.weightStep）
     * @returns {string} - 更新されたテキスト
     */
    calculateDecrementedWeight(text, step = this.weightStep) {
        return this.calculateWeight(text, step, false);
    }

    /**
     * 丸括弧の数を増やす
     */
    incrementRoundBracket(tagElement, tag) {
        const text = tagElement.dataset.tag;
        const newText = this.addBrackets(text, '(', ')');
        this.updateTagElement(tagElement, newText);
    }

    /**
     * 丸括弧の数を減らす
     */
    decrementRoundBracket(tagElement, tag) {
        const text = tagElement.dataset.tag;
        const newText = this.removeBrackets(text, '(', ')');
        this.updateTagElement(tagElement, newText);
    }

    /**
     * 角括弧の数を増やす
     */
    incrementSquareBracket(tagElement, tag) {
        const text = tagElement.dataset.tag;
        const newText = this.addBrackets(text, '[', ']');
        this.updateTagElement(tagElement, newText);
    }

    /**
     * 角括弧の数を減らす
     */
    decrementSquareBracket(tagElement, tag) {
        const text = tagElement.dataset.tag;
        const newText = this.removeBrackets(text, '[', ']');
        this.updateTagElement(tagElement, newText);
    }

    /**
     * タグ要素を更新
     */
    updateTagElement(tagElement, newText) {
        const newTag = new Tag(newText);
        const tagText = tagElement.querySelector('.tag-text');
        tagText.textContent = newTag.getDisplayTag();
        tagElement.dataset.tag = newTag.getTag();
        this.tagPanel.updatePromptFromTags();
    }

    /**
     * 括弧を追加
     */
    addBrackets(text, openBracket, closeBracket) {
        return `${openBracket}${text}${closeBracket}`;
    }

    /**
     * 括弧を削除
     */
    removeBrackets(text, openBracket, closeBracket) {
        if (text.startsWith(openBracket) && text.endsWith(closeBracket)) {
            return text.slice(1, -1);
        }
        return text;
    }

} 