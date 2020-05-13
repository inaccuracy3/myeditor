const fs = require('fs');
const {BrowserWindow, dialog} = require('electron').remote;

let inputArea = null;
let inputTxt = null;
let footerArea = null;

let currentPath = '';
let editor = null;
let sp_let = null;
window.addEventListener('DOMContentLoaded', onLoad);

/**
 * Webページ読み込み時の処理
 */
function onLoad() {
  // 入力関連領域
  inputArea = document.getElementById('input_area');
  // 入力領域
  inputTxt = document.getElementById('input_txt');
  // フッター領域
  footerArea = document.getElementById('footer_fixed');

  editor = ace.edit('input_txt');
  editor.getSession().setMode('ace/mode/javascript');
  editor.setTheme('ace/theme/twilight');

  // ドラッグ&ドロップ関連処理
  // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
  document.addEventListener('dragover', (event) => {
    event.preventDefault();
  });
  document.addEventListener('drop', (event) => {
    event.preventDefault();
  });

  // 入力部分の処理
  inputArea.addEventListener('dragover', (event) => {
    event.preventDefault();
  });
  inputArea.addEventListener('dragleave', (event) => {
    event.preventDefault();
  });
  inputArea.addEventListener('dragend', (event) => {
    event.preventDefault();
  });
  inputArea.addEventListener('drop', (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    readFile(file.path);
  });

  inputTxt.addEventListener('keydown',function(){
    // if(event.keyCode==17&&event.keyCode==48){
    // }
    //editor.insert(event.keyCode.toString());
    if(event.ctrlKey){
      sp_let = numberCheck(event.keyCode);
      editor.insert(sp_let);
}
  });

  // 「読み込む」ボタンの制御
  document.querySelector('#btnLoad').addEventListener('click', () => {
    openLoadFile();
  });
  // 「保存する」ボタンの制御
  document.querySelector('#btnSave').addEventListener('click', () => {
    openLoadFile();
  });

  document.querySelector("#pdfmaker").addEventListener('click', () => {
    pdfmake(editor.getValue());
  })
};

/**
 * ファイルを開きます。
 */
function openLoadFile() {
  const win = BrowserWindow.getFocusedWindow();

  dialog.showOpenDialog(
    win,
    // どんなダイアログを出すかを指定するプロパティ
    {
      properties: ['openFile'],
      filters: [
        {
          name: 'Documents',
          extensions: ['txt', 'text', 'html', 'js']
        }
      ]
    },
    // [ファイル選択]ダイアログが閉じられた後のコールバック関数
    (fileNames) => {
      if (fileNames) {
        readFile(fileNames[0]);
      }
    });
}

/**
 * テキストを読み込み、テキストを入力エリアに設定します。
 */
function readFile(path) {
  currentPath = path;
  fs.readFile(path, (error, text) => {
    if (error != null) {
      alert('error : ' + error);
      return;
    }
    // フッター部分に読み込み先のパスを設定する
    footerArea.innerHTML = path;
    // テキスト入力エリアに設定する
    editor.setValue(text.toString(), -1);
  });
}

/**
 * ファイルを保存します。
 */
function saveFile() {

  //　初期の入力エリアに設定されたテキストを保存しようとしたときは新規ファイルを作成する
  if (currentPath === '') {
    saveNewFile();
    return;
  }

  const win = BrowserWindow.getFocusedWindow();

  dialog.showMessageBox(win, {
      title: 'ファイルの上書き保存を行います。',
      type: 'info',
      buttons: ['OK', 'Cancel'],
      detail: '本当に保存しますか？'
    },
    // メッセージボックスが閉じられた後のコールバック関数
    (response) => {
      // OKボタン(ボタン配列の0番目がOK)
      if (response === 0) {
        const data = editor.getValue();
        writeFile(currentPath, data);
      }
    }
  );
}

/**
 * ファイルを書き込みます。
 */
function writeFile(path, data) {
  fs.writeFile(path, data, (error) => {
    if (error != null) {
      alert('error : ' + error);
    }
  });
}

/**
 * 新規ファイルを保存します。
 */
function saveNewFile() {

  const win = BrowserWindow.getFocusedWindow();
  dialog.showSaveDialog(
    win,
    // どんなダイアログを出すかを指定するプロパティ
    {
      properties: ['openFile'],
      filters: [
        {
          name: 'Documents',
          extensions: ['txt', 'text', 'html', 'js']
        }
      ]
    },
    // セーブ用ダイアログが閉じられた後のコールバック関数
    (fileName) => {
      if (fileName) {
        const data = editor.getValue();
        currentPath = fileName;
        writeFile(currentPath, data);
      }
    }
  );
}

function numberCheck(keyCode){
  let number;
  switch(keyCode){
    case 48:
    number = "⁰";
    break;
    case 49:
    number = "¹";
    break;
    case 50:
    number = "²";
    break;
    case 51:
    number = "³";
    break;
    case 52:
    number = "⁴";
    break;
    case 53:
    number = "⁵";
    break;
    case 54:
    number = "⁶";
    break;
    case 55:
    number = "⁷";
    break;
    case 56:
    number = "⁸";
    break;
    case 57:
    number = "⁹";
    break;
    default:
    number = null;
    break;
  }
  return number;
}
function pdfmake(txt){
  pdfMake.fonts = {
    IPAgothic: {
            normal:      'ipagp.ttf',
            bold:        'ipagp.ttf',
            italics:     'ipagp.ttf',
            bolditalics: 'ipagp.ttf'
       }
};
//PDF作成処理
var docDef = {
  content:[
    {text: txt, fontSize: 20}
  ],
  defaultStyle: {
    font: 'IPAgothic',
  },
};
pdfMake.createPdf(docDef).download("test.pdf");
}
