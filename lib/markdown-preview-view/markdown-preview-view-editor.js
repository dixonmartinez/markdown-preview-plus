"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const util = require("./util");
const markdown_preview_view_1 = require("./markdown-preview-view");
const util_1 = require("../util");
const markdown_preview_view_editor_remote_1 = require("./markdown-preview-view-editor-remote");
class MarkdownPreviewViewEditor extends markdown_preview_view_1.MarkdownPreviewView {
    constructor(editor) {
        super();
        this.editor = editor;
        this.handleEditorEvents();
    }
    static create(editor) {
        let mppv = MarkdownPreviewViewEditor.editorMap.get(editor);
        if (!mppv) {
            mppv = new MarkdownPreviewViewEditor(editor);
            MarkdownPreviewViewEditor.editorMap.set(editor, mppv);
        }
        return mppv;
    }
    static viewForEditor(editor) {
        return MarkdownPreviewViewEditor.editorMap.get(editor);
    }
    destroy() {
        super.destroy();
        MarkdownPreviewViewEditor.editorMap.delete(this.editor);
    }
    serialize() {
        return {
            deserializer: 'markdown-preview-plus/MarkdownPreviewView',
            editorId: this.editor && this.editor.id,
        };
    }
    getTitle() {
        return `${this.editor.getTitle()} Preview`;
    }
    getURI() {
        return `markdown-preview-plus://editor/${this.editor.id}`;
    }
    getPath() {
        return this.editor.getPath();
    }
    async getMarkdownSource() {
        return this.editor.getText();
    }
    getGrammar() {
        return this.editor.getGrammar();
    }
    didScrollPreview(min, max) {
        if (!this.shouldScrollSync('preview'))
            return;
        if (min === 0) {
            this.editor.scrollToBufferPosition([min, 0]);
        }
        else if (max >= this.editor.getLastBufferRow() - 1) {
            this.editor.scrollToBufferPosition([max, 0]);
        }
        else {
            const range = atom_1.Range.fromObject([[min, 0], [max, 0]]);
            this.editor.scrollToScreenRange(this.editor.screenRangeForBufferRange(range), { center: false });
        }
    }
    openNewWindow() {
        markdown_preview_view_editor_remote_1.MarkdownPreviewViewEditorRemote.open(this.editor);
        util.destroy(this);
    }
    openSource(initialLine) {
        if (initialLine !== undefined) {
            this.editor.setCursorBufferPosition([initialLine, 0]);
        }
        const pane = atom.workspace.paneForItem(this.editor);
        if (!pane)
            return;
        pane.activateItem(this.editor);
        pane.activate();
    }
    handleEditorEvents() {
        this.disposables.add(atom.workspace.onDidChangeActiveTextEditor((ed) => {
            if (util_1.atomConfig().previewConfig.activatePreviewWithEditor) {
                if (ed === this.editor) {
                    const pane = atom.workspace.paneForItem(this);
                    if (!pane)
                        return;
                    const edPane = atom.workspace.paneForItem(ed);
                    if (pane === edPane)
                        return;
                    pane.activateItem(this);
                }
            }
        }), this.editor.getBuffer().onDidStopChanging(() => {
            if (util_1.atomConfig().previewConfig.liveUpdate) {
                this.changeHandler();
            }
            if (util_1.atomConfig().syncConfig.syncPreviewOnChange) {
                this.syncPreviewHelper(false);
            }
        }), this.editor.onDidChangePath(() => {
            this.emitter.emit('did-change-title');
        }), this.editor.onDidDestroy(() => {
            if (util_1.atomConfig().previewConfig.closePreviewWithEditor) {
                util.destroy(this);
            }
        }), this.editor.getBuffer().onDidSave(() => {
            if (!util_1.atomConfig().previewConfig.liveUpdate) {
                this.changeHandler();
            }
        }), this.editor.getBuffer().onDidReload(() => {
            if (!util_1.atomConfig().previewConfig.liveUpdate) {
                this.changeHandler();
            }
        }), atom.views.getView(this.editor).onDidChangeScrollTop(() => {
            if (!this.shouldScrollSync('editor'))
                return;
            const [first, last] = this.editor.getVisibleRowRange();
            this.handler.scrollSync(this.editor.bufferRowForScreenRow(first), this.editor.bufferRowForScreenRow(last));
        }), atom.commands.add(atom.views.getView(this.editor), {
            'markdown-preview-plus:sync-preview': () => {
                this.syncPreviewHelper(true);
            },
        }));
    }
    syncPreviewHelper(flash) {
        const pos = this.editor.getCursorBufferPosition().row;
        this.syncPreview(pos, flash);
    }
    shouldScrollSync(whatScrolled) {
        const config = util_1.atomConfig().syncConfig;
        if (config.syncEditorOnPreviewScroll && config.syncPreviewOnEditorScroll) {
            const item = whatScrolled === 'editor' ? this.editor : this;
            const pane = atom.workspace.paneForItem(item);
            return pane && pane.isActive();
        }
        else {
            return ((config.syncEditorOnPreviewScroll && whatScrolled === 'preview') ||
                (config.syncPreviewOnEditorScroll && whatScrolled === 'editor'));
        }
    }
}
MarkdownPreviewViewEditor.editorMap = new WeakMap();
exports.MarkdownPreviewViewEditor = MarkdownPreviewViewEditor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24tcHJldmlldy12aWV3LWVkaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXJrZG93bi1wcmV2aWV3LXZpZXcvbWFya2Rvd24tcHJldmlldy12aWV3LWVkaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpRDtBQUNqRCwrQkFBOEI7QUFDOUIsbUVBQTRFO0FBQzVFLGtDQUFvQztBQUNwQywrRkFBdUY7QUFFdkYsK0JBQXVDLFNBQVEsMkNBQW1CO0lBTWhFLFlBQTRCLE1BQWtCO1FBQzVDLEtBQUssRUFBRSxDQUFBO1FBRG1CLFdBQU0sR0FBTixNQUFNLENBQVk7UUFFNUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7SUFDM0IsQ0FBQztJQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBa0I7UUFDckMsSUFBSSxJQUFJLEdBQUcseUJBQXlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUMxRCxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsSUFBSSxHQUFHLElBQUkseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUMseUJBQXlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDdEQ7UUFDRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFTSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQWtCO1FBQzVDLE9BQU8seUJBQXlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUN4RCxDQUFDO0lBRU0sT0FBTztRQUNaLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUNmLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3pELENBQUM7SUFFTSxTQUFTO1FBQ2QsT0FBTztZQUNMLFlBQVksRUFBRSwyQ0FBMkM7WUFD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QyxVQUFVLENBQUE7UUFDdEMsSUFBSSxNQUFNLENBQUMseUJBQXlCLElBQUksTUFBTSxDQUFDLHlCQUF5QixFQUFFO1lBQ3hFLE1BQU0sSUFBSSxHQUFHLFlBQVksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtZQUMzRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUM3QyxPQUFPLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7U0FDL0I7YUFBTTtZQUNMLE9BQU8sQ0FDTCxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsSUFBSSxZQUFZLEtBQUssU0FBUyxDQUFDO2dCQUNoRSxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsSUFBSSxZQUFZLEtBQUssUUFBUSxDQUFDLENBQ2hFLENBQUE7U0FDRjtJQUNILENBQUM7O0FBL0pjLG1DQUFTLEdBQUcsSUFBSSxPQUFPLEVBR25DLENBQUE7QUFKTCw4REFpS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZXh0RWRpdG9yLCBHcmFtbWFyLCBSYW5nZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcbmltcG9ydCB7IE1hcmtkb3duUHJldmlld1ZpZXcsIFNlcmlhbGl6ZWRNUFYgfSBmcm9tICcuL21hcmtkb3duLXByZXZpZXctdmlldydcbmltcG9ydCB7IGF0b21Db25maWcgfSBmcm9tICcuLi91dGlsJ1xuaW1wb3J0IHsgTWFya2Rvd25QcmV2aWV3Vmlld0VkaXRvclJlbW90ZSB9IGZyb20gJy4vbWFya2Rvd24tcHJldmlldy12aWV3LWVkaXRvci1yZW1vdGUnXG5cbmV4cG9ydCBjbGFzcyBNYXJrZG93blByZXZpZXdWaWV3RWRpdG9yIGV4dGVuZHMgTWFya2Rvd25QcmV2aWV3VmlldyB7XG4gIHByaXZhdGUgc3RhdGljIGVkaXRvck1hcCA9IG5ldyBXZWFrTWFwPFxuICAgIFRleHRFZGl0b3IsXG4gICAgTWFya2Rvd25QcmV2aWV3Vmlld0VkaXRvclxuICA+KClcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgZWRpdG9yOiBUZXh0RWRpdG9yKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuaGFuZGxlRWRpdG9yRXZlbnRzKClcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGVkaXRvcjogVGV4dEVkaXRvcikge1xuICAgIGxldCBtcHB2ID0gTWFya2Rvd25QcmV2aWV3Vmlld0VkaXRvci5lZGl0b3JNYXAuZ2V0KGVkaXRvcilcbiAgICBpZiAoIW1wcHYpIHtcbiAgICAgIG1wcHYgPSBuZXcgTWFya2Rvd25QcmV2aWV3Vmlld0VkaXRvcihlZGl0b3IpXG4gICAgICBNYXJrZG93blByZXZpZXdWaWV3RWRpdG9yLmVkaXRvck1hcC5zZXQoZWRpdG9yLCBtcHB2KVxuICAgIH1cbiAgICByZXR1cm4gbXBwdlxuICB9XG5cbiAgcHVibGljIHN0YXRpYyB2aWV3Rm9yRWRpdG9yKGVkaXRvcjogVGV4dEVkaXRvcikge1xuICAgIHJldHVybiBNYXJrZG93blByZXZpZXdWaWV3RWRpdG9yLmVkaXRvck1hcC5nZXQoZWRpdG9yKVxuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koKSB7XG4gICAgc3VwZXIuZGVzdHJveSgpXG4gICAgTWFya2Rvd25QcmV2aWV3Vmlld0VkaXRvci5lZGl0b3JNYXAuZGVsZXRlKHRoaXMuZWRpdG9yKVxuICB9XG5cbiAgcHVibGljIHNlcmlhbGl6ZSgpOiBTZXJpYWxpemVkTVBWIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzZXJpYWxpemVyOiAnbWFya2Rvd24tcHJldmlldy1wbHVzL01hcmtkb3duUHJldmlld1ZpZXcnLFxuICAgICAgZWRpdG9ySWQ6IHRoaXMuZWRpdG9yICYmIHRoaXMuZWRpdG9yLmlkLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5lZGl0b3IuZ2V0VGl0bGUoKX0gUHJldmlld2BcbiAgfVxuXG4gIHB1YmxpYyBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIGBtYXJrZG93bi1wcmV2aWV3LXBsdXM6Ly9lZGl0b3IvJHt0aGlzLmVkaXRvci5pZH1gXG4gIH1cblxuICBwdWJsaWMgZ2V0UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IuZ2V0UGF0aCgpXG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgZ2V0TWFya2Rvd25Tb3VyY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmdldFRleHQoKVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEdyYW1tYXIoKTogR3JhbW1hciB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmdldEdyYW1tYXIoKVxuICB9XG5cbiAgcHJvdGVjdGVkIGRpZFNjcm9sbFByZXZpZXcobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLnNob3VsZFNjcm9sbFN5bmMoJ3ByZXZpZXcnKSkgcmV0dXJuXG4gICAgaWYgKG1pbiA9PT0gMCkge1xuICAgICAgdGhpcy5lZGl0b3Iuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihbbWluLCAwXSlcbiAgICB9IGVsc2UgaWYgKG1heCA+PSB0aGlzLmVkaXRvci5nZXRMYXN0QnVmZmVyUm93KCkgLSAxKSB7XG4gICAgICB0aGlzLmVkaXRvci5zY3JvbGxUb0J1ZmZlclBvc2l0aW9uKFttYXgsIDBdKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb25zdCBtaWQgPSBNYXRoLmZsb29yKDAuNSAqIChtaW4gKyBtYXgpKVxuICAgICAgLy8gdGhpcy5lZGl0b3Iuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihbbWlkLCAwXSwgeyBjZW50ZXI6IHRydWUgfSlcbiAgICAgIGNvbnN0IHJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbW21pbiwgMF0sIFttYXgsIDBdXSlcbiAgICAgIHRoaXMuZWRpdG9yLnNjcm9sbFRvU2NyZWVuUmFuZ2UoXG4gICAgICAgIHRoaXMuZWRpdG9yLnNjcmVlblJhbmdlRm9yQnVmZmVyUmFuZ2UocmFuZ2UpLFxuICAgICAgICB7IGNlbnRlcjogZmFsc2UgfSxcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgb3Blbk5ld1dpbmRvdygpIHtcbiAgICBNYXJrZG93blByZXZpZXdWaWV3RWRpdG9yUmVtb3RlLm9wZW4odGhpcy5lZGl0b3IpXG4gICAgdXRpbC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICBwcm90ZWN0ZWQgb3BlblNvdXJjZShpbml0aWFsTGluZT86IG51bWJlcikge1xuICAgIGlmIChpbml0aWFsTGluZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbaW5pdGlhbExpbmUsIDBdKVxuICAgIH1cbiAgICBjb25zdCBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0odGhpcy5lZGl0b3IpXG4gICAgaWYgKCFwYW5lKSByZXR1cm5cbiAgICBwYW5lLmFjdGl2YXRlSXRlbSh0aGlzLmVkaXRvcilcbiAgICBwYW5lLmFjdGl2YXRlKClcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRWRpdG9yRXZlbnRzKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVUZXh0RWRpdG9yKChlZCkgPT4ge1xuICAgICAgICBpZiAoYXRvbUNvbmZpZygpLnByZXZpZXdDb25maWcuYWN0aXZhdGVQcmV2aWV3V2l0aEVkaXRvcikge1xuICAgICAgICAgIGlmIChlZCA9PT0gdGhpcy5lZGl0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSh0aGlzKVxuICAgICAgICAgICAgaWYgKCFwYW5lKSByZXR1cm5cbiAgICAgICAgICAgIGNvbnN0IGVkUGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGVkKVxuICAgICAgICAgICAgaWYgKHBhbmUgPT09IGVkUGFuZSkgcmV0dXJuXG4gICAgICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbSh0aGlzKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLmVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZFN0b3BDaGFuZ2luZygoKSA9PiB7XG4gICAgICAgIGlmIChhdG9tQ29uZmlnKCkucHJldmlld0NvbmZpZy5saXZlVXBkYXRlKSB7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VIYW5kbGVyKClcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXRvbUNvbmZpZygpLnN5bmNDb25maWcuc3luY1ByZXZpZXdPbkNoYW5nZSkge1xuICAgICAgICAgIHRoaXMuc3luY1ByZXZpZXdIZWxwZXIoZmFsc2UpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5lZGl0b3Iub25EaWRDaGFuZ2VQYXRoKCgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtdGl0bGUnKVxuICAgICAgfSksXG4gICAgICB0aGlzLmVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICBpZiAoYXRvbUNvbmZpZygpLnByZXZpZXdDb25maWcuY2xvc2VQcmV2aWV3V2l0aEVkaXRvcikge1xuICAgICAgICAgIHV0aWwuZGVzdHJveSh0aGlzKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRoaXMuZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU2F2ZSgoKSA9PiB7XG4gICAgICAgIGlmICghYXRvbUNvbmZpZygpLnByZXZpZXdDb25maWcubGl2ZVVwZGF0ZSkge1xuICAgICAgICAgIHRoaXMuY2hhbmdlSGFuZGxlcigpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRSZWxvYWQoKCkgPT4ge1xuICAgICAgICBpZiAoIWF0b21Db25maWcoKS5wcmV2aWV3Q29uZmlnLmxpdmVVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoYW5nZUhhbmRsZXIoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLmVkaXRvcikub25EaWRDaGFuZ2VTY3JvbGxUb3AoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc2hvdWxkU2Nyb2xsU3luYygnZWRpdG9yJykpIHJldHVyblxuICAgICAgICBjb25zdCBbZmlyc3QsIGxhc3RdID0gdGhpcy5lZGl0b3IuZ2V0VmlzaWJsZVJvd1JhbmdlKClcbiAgICAgICAgdGhpcy5oYW5kbGVyLnNjcm9sbFN5bmMoXG4gICAgICAgICAgdGhpcy5lZGl0b3IuYnVmZmVyUm93Rm9yU2NyZWVuUm93KGZpcnN0KSxcbiAgICAgICAgICB0aGlzLmVkaXRvci5idWZmZXJSb3dGb3JTY3JlZW5Sb3cobGFzdCksXG4gICAgICAgIClcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMuZWRpdG9yKSwge1xuICAgICAgICAnbWFya2Rvd24tcHJldmlldy1wbHVzOnN5bmMtcHJldmlldyc6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnN5bmNQcmV2aWV3SGVscGVyKHRydWUpXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICApXG4gIH1cblxuICBwcml2YXRlIHN5bmNQcmV2aWV3SGVscGVyKGZsYXNoOiBib29sZWFuKSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3dcbiAgICB0aGlzLnN5bmNQcmV2aWV3KHBvcywgZmxhc2gpXG4gIH1cblxuICBwcml2YXRlIHNob3VsZFNjcm9sbFN5bmMod2hhdFNjcm9sbGVkOiAnZWRpdG9yJyB8ICdwcmV2aWV3Jykge1xuICAgIGNvbnN0IGNvbmZpZyA9IGF0b21Db25maWcoKS5zeW5jQ29uZmlnXG4gICAgaWYgKGNvbmZpZy5zeW5jRWRpdG9yT25QcmV2aWV3U2Nyb2xsICYmIGNvbmZpZy5zeW5jUHJldmlld09uRWRpdG9yU2Nyb2xsKSB7XG4gICAgICBjb25zdCBpdGVtID0gd2hhdFNjcm9sbGVkID09PSAnZWRpdG9yJyA/IHRoaXMuZWRpdG9yIDogdGhpc1xuICAgICAgY29uc3QgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGl0ZW0pXG4gICAgICByZXR1cm4gcGFuZSAmJiBwYW5lLmlzQWN0aXZlKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgKGNvbmZpZy5zeW5jRWRpdG9yT25QcmV2aWV3U2Nyb2xsICYmIHdoYXRTY3JvbGxlZCA9PT0gJ3ByZXZpZXcnKSB8fFxuICAgICAgICAoY29uZmlnLnN5bmNQcmV2aWV3T25FZGl0b3JTY3JvbGwgJiYgd2hhdFNjcm9sbGVkID09PSAnZWRpdG9yJylcbiAgICAgIClcbiAgICB9XG4gIH1cbn1cbiJdfQ==