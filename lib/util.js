"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handlePromise(promise) {
    if (!promise)
        return;
    promise.catch((error) => {
        console.error(error);
        atom.notifications.addFatalError(error.toString(), {
            detail: error.message,
            stack: error.stack,
            dismissable: true,
        });
    });
}
exports.handlePromise = handlePromise;
const fs_1 = require("fs");
function isFileSync(filePath) {
    if (!fs_1.existsSync(filePath))
        return false;
    return fs_1.lstatSync(filePath).isFile();
}
exports.isFileSync = isFileSync;
function pairUp(arr, option) {
    if (arr.length % 2 !== 0) {
        atom.notifications.addWarning(`Invalid math delimiter configuration${option ? `in ${option}` : ''}`, {
            detail: `Expected even number of elements, but got "${arr.join(', ')}"`,
            dismissable: true,
        });
    }
    return arr.reduce(function (result, _value, index, array) {
        if (index % 2 === 0)
            result.push([array[index], array[index + 1]]);
        return result;
    }, []);
}
exports.pairUp = pairUp;
function isElement(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}
exports.isElement = isElement;
const webview_handler_1 = require("./markdown-preview-view/webview-handler");
const renderer = require("./renderer");
async function copyHtml(text, filePath, renderLaTeX) {
    const view = new webview_handler_1.WebviewHandler(async () => {
        view.init(atom.getConfigDirPath(), atomConfig().mathConfig, 'SVG');
        view.setUseGitHubStyle(atom.config.get('markdown-preview-plus.useGitHubStyle'));
        view.setBasePath(filePath);
        const domDocument = await renderer.render({
            text,
            filePath,
            renderLaTeX,
            mode: 'copy',
        });
        const res = await view.update(domDocument.documentElement.outerHTML, renderLaTeX);
        if (res)
            atom.clipboard.write(res);
        view.destroy();
    });
    view.element.style.pointerEvents = 'none';
    view.element.style.position = 'absolute';
    view.element.style.width = '0px';
    view.element.style.height = '0px';
    const ws = atom.views.getView(atom.workspace);
    ws.appendChild(view.element);
}
exports.copyHtml = copyHtml;
function atomConfig() {
    return atom.config.get('markdown-preview-plus');
}
exports.atomConfig = atomConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUJBQThCLE9BQXFCO0lBQ2pELElBQUksQ0FBQyxPQUFPO1FBQUUsT0FBTTtJQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBWSxFQUFFLEVBQUU7UUFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNwQixJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDakQsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3JCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztZQUNsQixXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFWRCxzQ0FVQztBQUNELDJCQUEwQztBQUMxQyxvQkFBMkIsUUFBZ0I7SUFDekMsSUFBSSxDQUFDLGVBQVUsQ0FBQyxRQUFRLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQTtJQUN2QyxPQUFPLGNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUNyQyxDQUFDO0FBSEQsZ0NBR0M7QUFFRCxnQkFBMEIsR0FBUSxFQUFFLE1BQWU7SUFDakQsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQzNCLHVDQUF1QyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUNyRTtZQUNFLE1BQU0sRUFBRSw4Q0FBOEMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRztZQUN2RSxXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUNGLENBQUE7S0FDRjtJQUNELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBZ0IsVUFBUyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ3BFLElBQUksS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRSxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNSLENBQUM7QUFkRCx3QkFjQztBQUVELG1CQUEwQixJQUFVO0lBQ2xDLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFBO0FBQzVDLENBQUM7QUFGRCw4QkFFQztBQUVELDZFQUF3RTtBQUN4RSx1Q0FBc0M7QUFDL0IsS0FBSyxtQkFDVixJQUFZLEVBQ1osUUFBNEIsRUFDNUIsV0FBb0I7SUFFcEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ2xFLElBQUksQ0FBQyxpQkFBaUIsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FDeEQsQ0FBQTtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFMUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3hDLElBQUk7WUFDSixRQUFRO1lBQ1IsV0FBVztZQUNYLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUMzQixXQUFXLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFDckMsV0FBVyxDQUNaLENBQUE7UUFDRCxJQUFJLEdBQUc7WUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNsQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDaEIsQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFBO0lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUE7SUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtJQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0lBQ2pDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUM3QyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM5QixDQUFDO0FBL0JELDRCQStCQztBQUVEO0lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2pELENBQUM7QUFGRCxnQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBoYW5kbGVQcm9taXNlKHByb21pc2U6IFByb21pc2U8YW55Pik6IHZvaWQge1xuICBpZiAoIXByb21pc2UpIHJldHVyblxuICBwcm9taXNlLmNhdGNoKChlcnJvcjogRXJyb3IpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRGYXRhbEVycm9yKGVycm9yLnRvU3RyaW5nKCksIHtcbiAgICAgIGRldGFpbDogZXJyb3IubWVzc2FnZSxcbiAgICAgIHN0YWNrOiBlcnJvci5zdGFjayxcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgIH0pXG4gIH0pXG59XG5pbXBvcnQgeyBsc3RhdFN5bmMsIGV4aXN0c1N5bmMgfSBmcm9tICdmcydcbmV4cG9ydCBmdW5jdGlvbiBpc0ZpbGVTeW5jKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgaWYgKCFleGlzdHNTeW5jKGZpbGVQYXRoKSkgcmV0dXJuIGZhbHNlXG4gIHJldHVybiBsc3RhdFN5bmMoZmlsZVBhdGgpLmlzRmlsZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWlyVXA8VD4oYXJyOiBUW10sIG9wdGlvbj86IHN0cmluZyk6IEFycmF5PFtULCBUXT4ge1xuICBpZiAoYXJyLmxlbmd0aCAlIDIgIT09IDApIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgIGBJbnZhbGlkIG1hdGggZGVsaW1pdGVyIGNvbmZpZ3VyYXRpb24ke29wdGlvbiA/IGBpbiAke29wdGlvbn1gIDogJyd9YCxcbiAgICAgIHtcbiAgICAgICAgZGV0YWlsOiBgRXhwZWN0ZWQgZXZlbiBudW1iZXIgb2YgZWxlbWVudHMsIGJ1dCBnb3QgXCIke2Fyci5qb2luKCcsICcpfVwiYCxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICB9LFxuICAgIClcbiAgfVxuICByZXR1cm4gYXJyLnJlZHVjZTxBcnJheTxbVCwgVF0+PihmdW5jdGlvbihyZXN1bHQsIF92YWx1ZSwgaW5kZXgsIGFycmF5KSB7XG4gICAgaWYgKGluZGV4ICUgMiA9PT0gMCkgcmVzdWx0LnB1c2goW2FycmF5W2luZGV4XSwgYXJyYXlbaW5kZXggKyAxXV0pXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9LCBbXSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlbWVudChub2RlOiBOb2RlKTogbm9kZSBpcyBFbGVtZW50IHtcbiAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFXG59XG5cbmltcG9ydCB7IFdlYnZpZXdIYW5kbGVyIH0gZnJvbSAnLi9tYXJrZG93bi1wcmV2aWV3LXZpZXcvd2Vidmlldy1oYW5kbGVyJ1xuaW1wb3J0ICogYXMgcmVuZGVyZXIgZnJvbSAnLi9yZW5kZXJlcidcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb3B5SHRtbChcbiAgdGV4dDogc3RyaW5nLFxuICBmaWxlUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICByZW5kZXJMYVRlWDogYm9vbGVhbixcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB2aWV3ID0gbmV3IFdlYnZpZXdIYW5kbGVyKGFzeW5jICgpID0+IHtcbiAgICB2aWV3LmluaXQoYXRvbS5nZXRDb25maWdEaXJQYXRoKCksIGF0b21Db25maWcoKS5tYXRoQ29uZmlnLCAnU1ZHJylcbiAgICB2aWV3LnNldFVzZUdpdEh1YlN0eWxlKFxuICAgICAgYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1wcmV2aWV3LXBsdXMudXNlR2l0SHViU3R5bGUnKSxcbiAgICApXG4gICAgdmlldy5zZXRCYXNlUGF0aChmaWxlUGF0aClcblxuICAgIGNvbnN0IGRvbURvY3VtZW50ID0gYXdhaXQgcmVuZGVyZXIucmVuZGVyKHtcbiAgICAgIHRleHQsXG4gICAgICBmaWxlUGF0aCxcbiAgICAgIHJlbmRlckxhVGVYLFxuICAgICAgbW9kZTogJ2NvcHknLFxuICAgIH0pXG4gICAgY29uc3QgcmVzID0gYXdhaXQgdmlldy51cGRhdGUoXG4gICAgICBkb21Eb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub3V0ZXJIVE1MLFxuICAgICAgcmVuZGVyTGFUZVgsXG4gICAgKVxuICAgIGlmIChyZXMpIGF0b20uY2xpcGJvYXJkLndyaXRlKHJlcylcbiAgICB2aWV3LmRlc3Ryb3koKVxuICB9KVxuICB2aWV3LmVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJ1xuICB2aWV3LmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gIHZpZXcuZWxlbWVudC5zdHlsZS53aWR0aCA9ICcwcHgnXG4gIHZpZXcuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMHB4J1xuICBjb25zdCB3cyA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgd3MuYXBwZW5kQ2hpbGQodmlldy5lbGVtZW50KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXRvbUNvbmZpZygpIHtcbiAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbWFya2Rvd24tcHJldmlldy1wbHVzJylcbn1cbiJdfQ==