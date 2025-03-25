import { Tag, TagManager } from './tags';
import { TagPanelMenu } from './TagPanelMenu';
import Sortable from 'sortablejs';
import { showNotification, logError } from './utils';

/**
 * タグパネルを管理するクラス
 */
export class TagPanel {
    /**
     * コンストラクタ
     * @param {HTMLElement} container - タグパネルのコンテナ要素
     * @param {HTMLTextAreaElement} editor - テキストエディタ要素
     */
    constructor(container, editor) {
        if (!container) {
            logError('TagPanel: container element is missing');
            throw new Error('タグパネルのコンテナ要素が見つかりません');
        }
        if (!editor) {
            logError('TagPanel: editor element is missing');
            throw new Error('エディタ要素が見つかりません');
        }

        this.container = container;
        this.container.classList.add('tags-panel');
        this.editor = editor;
        this.tagManager = new TagManager();
        this.tagPanelMenu = new TagPanelMenu(this);
        
        try {
            this.initSortable();
        } catch (error) {
            logError('Error initializing TagPanel:', error);
            showNotification('タグパネルの初期化に失敗しました', 'error');
        }
    }

    /**
     * テキストからタグを検出して更新
     */
    async detectTags() {
        try {
            const text = this.editor.value;
            this.tagManager.splitTags(text);
            this.updatePanel();
        } catch (error) {
            logError('Error detecting tags:', error);
            showNotification('タグの検出中にエラーが発生しました', 'error');
        }
    }

    /**
     * テキストからタグを検出して更新（非同期）
     */
    async detectAndUpdateTags() {
        try {
            await this.detectTags();
        } catch (error) {
            logError('Error in detectAndUpdateTags:', error);
            showNotification('タグの検出と更新中にエラーが発生しました', 'error');
        }
    }

    /**
     * SortableJSの初期化
     */
    initSortable() {
        this.sortable = new Sortable(this.container, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            onStart: (evt) => {
                this.container.classList.add('sorting');
                // ドラッグ開始時に全てのメニューを非表示
                const menus = this.container.querySelectorAll('.tag-menu');
                menus.forEach(menu => menu.style.display = 'none');
            },
            onMove: (evt) => {
                // ドラッグ中は全てのメニューを非表示に保つ
                const menus = this.container.querySelectorAll('.tag-menu');
                menus.forEach(menu => menu.style.display = 'none');
                return !evt.related.className.includes('newline');
            },
            onEnd: (evt) => {
                this.container.classList.remove('sorting');
                this.updatePromptFromTags();
            },
            // 要素の配置を制御
            onUpdate: (evt) => {
                const items = this.container.querySelectorAll('.tag-item');
                items.forEach((item, index) => {
                    if (item.classList.contains('newline')) {
                        // newlineクラスを持つ要素の後に改行を入れる
                        item.style.marginBottom = '1em';
                    } else {
                        item.style.marginBottom = '0';
                    }
                });
            }
        });
    }

    /**
     * タグ要素を作成
     */
    createTagElement(tag) {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.dataset.tag = tag.getTag();

        // 改行コードの場合、newlineクラスを追加
        if (tag.isNewline()) {
            tagElement.classList.add('newline');
        }

        // タグのテキスト要素
        const tagText = document.createElement('span');
        tagText.className = 'tag-text';
        tagText.textContent = tag.getDisplayTag();
        tagElement.appendChild(tagText);

        // 改行コード以外の場合のみメニューを追加
        if (!tag.isNewline()) {
            const menu = this.tagPanelMenu.createTagMenu(tagElement, tag);
            tagElement.appendChild(menu);
        }

        return tagElement;
    }

    /**
     * タグパネルの更新
     */
    async updatePanel() {
        try {
            this.container.innerHTML = '';
            
            const tags = this.tagManager.getTags();
            const tagElements = tags.map(tag => this.createTagElement(tag));
            
            const hasNewline = tags.some(tag => tag.isNewline());
            this.container.classList.toggle('has-newline', hasNewline);
            
            tagElements.forEach(tagElement => {
                this.container.appendChild(tagElement);
            });

            const tagCount = document.getElementById('tagCount');
            if (tagCount) {
                tagCount.textContent = this.tagManager.getTagCount();
            }
        } catch (error) {
            logError('Error updating panel:', error);
            showNotification('タグパネルの更新中にエラーが発生しました', 'error');
        }
    }

    /**
     * タグの並び順からプロンプトテキストを更新
     */
    updatePromptFromTags() {
        const tags = Array.from(this.container.children).map(tagElement => {
            const tagText = tagElement.dataset.tag;
            return new Tag(tagText);
        });
        this.tagManager.updateTags(tags);
        this.editor.value = this.tagManager.generatePromptText();
        this.editor.dispatchEvent(new Event('input'));
    }
}