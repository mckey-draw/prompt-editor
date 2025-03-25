class Tag {
    constructor(text) {
        this.tag = text;
        this.translation = null;
    }

    // タグが改行コードかどうかを判定
    isNewline() {
        return this.tag === '\n';
    }

    // タグの表示用テキストを取得
    getDisplayTag() {
        return this.isNewline() ? '↵' : this.tag;
    }

    // タグの保存用テキストを取得
    getTag() {
        return this.tag;
    }

    // 翻訳テキストを設定
    setTranslation(translation) {
        this.translation = translation;
    }

    // 翻訳テキストを取得
    getTranslation() {
        return this.translation;
    }
}

class TagManager {
    constructor() {
        this.tags = [];
    }

    // テキストからタグを分割
    splitTags(text) {
        // 改行コードを特別な文字列に置換
        const processedText = text.replace(/\n/g, ',\n,');
        
        // カンマで分割
        const tags = processedText.split(/,/)
          .map(tag => {
              // 改行コードの場合はtrim()を適用しない
              return tag === '\n' ? '\n' : tag.trim();
          })
          .filter(tag => tag.length > 0) // 文字数が0のタグを除外
          .map(tag => new Tag(tag));
        
        this.tags = tags;
    }

    // タグの数を取得
    getTagCount() {
        return this.tags.length;
    }

    // タグの配列を取得
    getTags() {
        return this.tags;
    }

    // タグを更新
    updateTags(tags) {
        this.tags = tags;
    }

    // プロンプトテキストを生成
    generatePromptText() {
        return this.tags
            .map(tag => tag.getTag() === '↵' ? '\n' : tag.getTag())
            .reduce((result, tag, index, array) => {
                if (tag === '\n') {
                    return result + tag;
                }
                return result + tag + (index < array.length - 1 ? ',' : '');
            }, '');
    }
}

export { Tag, TagManager }; 