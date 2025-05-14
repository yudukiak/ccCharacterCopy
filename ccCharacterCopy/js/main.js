// ボタン生成（CSSで管理するためstyleは付与しない）
function createButton(id, text, onClick) {
  const btn = document.createElement('button');
  btn.id = id;
  btn.textContent = text;
  btn.addEventListener('click', onClick);
  return btn;
}

// ボタン群をまとめて追加
function appendCCCButtons(targetElm, ccc) {
  if (document.getElementById('ccc')) return;
  const outerDivElm = document.createElement('div');
  outerDivElm.id = 'ccc';

  // コピー
  outerDivElm.appendChild(createButton('ccc-chara-copy', 'コピー', () => {
    try {
      const character = ccc.getCharacter();
      console.log('[CCC] - character:', character);
      const json = JSON.stringify(character);
      navigator.clipboard.writeText(json).then(
        () => alert('[CCC] クリップボードにコピーしました👍\n\nココフォリアにペーストすることで駒を作成できます。'),
        () => alert(`[CCC] クリップボードへのコピーに失敗しました😭\n\nブラウザの再起動など試してください。`)
      );
    } catch (error) {
      console.log('[CCC] - error:', error);
      alert(`[CCC] 駒の作成に失敗しました😭\n\nerror: ${error}`);
    }
  }));

  // 更新
  outerDivElm.appendChild(createButton('ccc-chara-diff', '比較', () => {
    try {
      const character = ccc.getCharacter();
      console.log('[CCC] - character:', character);
      // モーダルの枠
      const rootElm = document.querySelector('div[role="presentation"].MuiDialog-root div.MuiPaper-root');
      // 編集枠を非表示
      rootElm.querySelector('.MuiDialogContent-root').style.display = 'none';
      // ボタン枠を非表示
      rootElm.querySelector('.MuiDialogActions-root').style.display = 'none';
      // メモ枠のクラス名を取得
      const muiDialogContentClassName = rootElm.querySelector('.MuiDialogContent-root').className;
      const muiFormControlClassName = rootElm.querySelector('.MuiFormControl-root').className;
      const muiInputBaseClassName = rootElm.querySelector('.MuiInputBase-root').className;
      const labelClassName = rootElm.querySelector('.MuiFormLabel-root').className;
      const textareaClassName = rootElm.querySelector('.MuiInputBase-input').className;
      // JSONを記入させる枠を作成＆表示
      const divElm = document.createElement('div');
      divElm.id = 'ccc-chara-diff-json';
      divElm.className = muiDialogContentClassName;
      divElm.innerHTML = `
      <div class="${muiFormControlClassName}">
        <label class="${labelClassName}">JSONを記入</label>
        <div class="${muiInputBaseClassName}">
          <textarea id="ccc-chara-diff-json" class="${textareaClassName}" rows="8" style="height: 184px;"></textarea>
        </div>
      </div>
      `;
      rootElm.appendChild(divElm);
    } catch (error) {
      console.log('[CCC] - error:', error);
      alert(`[CCC] 駒の比較に失敗しました😭\n\nerror: ${error}`);
    }
  }));

  targetElm.parentNode.insertBefore(outerDivElm, targetElm.nextSibling);
}

// ダイアログ検知
function observeDialog(ccc) {
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (
          node.nodeType === 1 &&
          node.matches &&
          node.matches('div[role="presentation"].MuiDialog-root')
        ) {
          const elm = node.querySelector('.MuiDialog-container > div > header > div > p');
          if (elm) appendCCCButtons(elm, ccc);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true });
}

// メイン
(async () => {
  // キャラクター情報を取得するJavaScriptの読み込み
  const cccjs = chrome.runtime.getURL('js/ccc.js')
  const { CCC } = await import(cccjs)
  const ccc = new CCC()
  observeDialog(ccc)
})();