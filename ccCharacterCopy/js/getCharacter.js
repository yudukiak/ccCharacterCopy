// 共通化ユーティリティ関数
function getInputValue(selector) {
  const el = document.querySelector(selector);
  return el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) ? el.value : '';
}

function getNumberValue(selector) {
  const val = getInputValue(selector);
  return val !== '' && !isNaN(Number(val)) ? Number(val) : 0;
}

function getImageSrc(selector) {
  const el = document.querySelector(selector);
  return el && el instanceof HTMLImageElement ? el.src : null;
}

function getCheckboxChecked(selector) {
  const el = document.querySelector(selector);
  return el && el instanceof HTMLInputElement && el.type === 'checkbox' ? el.checked : false;
}

function getChildInputValue(parent, selector) {
  const el = parent.querySelector(selector);
  return el && el instanceof HTMLInputElement ? el.value : '';
}

function getChildNumberValue(parent, selector) {
  const val = getChildInputValue(parent, selector);
  return val !== '' && !isNaN(Number(val)) ? Number(val) : 0;
}

function getChildImageSrc(parent, selector) {
  const el = parent.querySelector(selector);
  return el && el instanceof HTMLImageElement ? el.src : null;
}

export function getCharacter() {
  const root = '.MuiDialogContent-root';
  return {
    kind: 'character',
    data: {
      name: getInputValue(`${root} input[name="name"]`),
      memo: getInputValue(`${root} textarea[name="memo"]`),
      initiative: getNumberValue(`${root} input[name="initiative"]`),
      externalUrl: getInputValue(`${root} input[name="externalUrl"]`),
      status: Array.from(document.querySelectorAll(`${root} > form > div:nth-child(3) > div[class^="sc-"]`)).map(elm => ({
        label: getChildInputValue(elm, 'input[name*="label"]'),
        value: getChildNumberValue(elm, 'input[name*="value"]'),
        max: getChildNumberValue(elm, 'input[name*="max"]'),
      })),
      params: Array.from(document.querySelectorAll(`${root} > form > div:nth-child(4) > div[class^="sc-"]`)).map(elm => ({
        label: getChildInputValue(elm, 'input[name*="label"]'),
        value: getChildInputValue(elm, 'input[name*="value"]'),
      })),
      iconUrl: getImageSrc(`${root} > form > div:nth-child(1) > div:nth-child(1) > button > div > img`),
      faces: Array.from(
        document.querySelectorAll(
          `${root} > form > div:nth-child(2) > div[class^="sc-"]`
        )
      ).map(elm => ({
        iconUrl: getChildImageSrc(elm, 'img'),
        label: getChildInputValue(elm, 'input'),
      })),
      x: getNumberValue(`${root} input[name="x"]`),
      y: getNumberValue(`${root} input[name="y"]`),
      width: getNumberValue(`${root} input[name="width"]`),
      height: getNumberValue(`${root} input[name="width"]`),
      active: true,
      secret: getCheckboxChecked(`${root} input[name="secret"][type="checkbox"]`),
      invisible: getCheckboxChecked(`${root} input[name="invisible"][type="checkbox"]`),
      hideStatus: getCheckboxChecked(`${root} input[name="hideStatus"][type="checkbox"]`),
      color: '#757575',
      commands: getInputValue(`${root} textarea[name="commands"]`),
      owner: null
    },
  };
}