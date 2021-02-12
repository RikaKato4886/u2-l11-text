import './assets/scss/styles.scss';
import moment from 'moment';

const SECOND = 1000; // 1000ミリ秒
const MINUTE = 60 * SECOND; // 1分のミリ秒数
const DAY = 24 * 60 * MINUTE; // 1日のミリ秒数

class App {
  constructor() {
    this.workLength = 0.5; // 25分間
    this.breakLength = 0.3; // 5分間
    this.longBreakLength = 1; // 15分間
    this.isTimerStopped = true; // 最初はタイマーは止まっている
    this.onWork = true; // 最初は作業からタイマーは始まる

    this.timeDisplay = document.getElementById('time-display');
    this.startAt = null; // カウントダウン開始時の時間
    this.endAt = null; // カウントダウン終了時の時間
    this.tempCycles = null;

    this.startTimer = this.startTimer.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.displayTime = this.displayTime.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.getHistory = App.getHistory.bind(this);
    this.saveIntervalData = this.saveIntervalData.bind(this);
    this.displayCyclesToday = this.displayCyclesToday.bind(this);
    this.displayHistory = this.displayHistory.bind(this);

    this.resetValues();
    this.getElements();
    this.toggleEvents();
    this.displayTime();
    this.displayCyclesToday();
    this.displayHistory();
    this.removeOldHistory();
    // 初期化時にdisplayTimeを呼び出す。
  }

  getElements() {
    this.timeDisplay = document.getElementById('time-display');
    this.countOfTodayDisplay = document.getElementById('count-today');
    this.percentOfTodayDisplay = document.getElementById('percent-today');
    this.historyDisplay = document.getElementById('history');
    this.startButton = document.getElementById('start-button');
    this.stopButton = document.getElementById('stop-button');
  }

  updateTimer(time = moment()) {
    const rest = this.endAt.diff(time);// 残り時間を取得
    if (rest <= 0) { // 残り時間が0以下の場合に切り替えを行う。
      if (this.onWork) {//作業時の場合
        this.saveIntervalData(time); // 作業時からの切り替り時のみsaveIntervalを呼び出す。
        this.displayCyclesToday();
        this.displayHistory();
      }
      //もしもtempCyclesが4だったら、longbreakLengthを分岐に入れる
      this.onWork = !this.onWork;
      this.startAt = time;
      if(this.onWork) {
        this.endAt = moment(time).add(this.workLength, 'minutes');
      } else if (this.tempCycles%4 === 0) {
        this.endAt = moment(time).add(this.longBreakLength, 'minutes');
      } else {
        this.endAt = moment(time).add(this.breakLength, 'minutes');
      }
    }
    this.displayTime(time);
  }

  displayTime(time = moment()) {
    // 残りの分数と秒数を与えるための変数
    let mins;
    let secs;
    if (this.isTimerStopped) {
      mins = this.workLength.toString();
      secs = 0;
    } else {
      // 与えられた時間(通常現在時刻)と、終了時刻との差を取得。差はミリ秒で得られる。
      const diff = this.endAt.diff(time);
      mins = Math.floor(diff / MINUTE); // 分数を得て、少数点以下の切り捨てを行う
      secs = Math.floor((diff % MINUTE) / 1000); // 秒数を得て、少数点以下の切り捨てを行う
    }
    const minsString = mins.toString();
    let secsString = secs.toString();
    if (secs < 10) {
      secsString = `0${secsString}`;
    }
    this.timeDisplay.innerHTML = `${minsString}:${secsString}`;
  }

  toggleEvents() {
    this.startButton.addEventListener('click', this.startTimer);
    this.stopButton.addEventListener('click', this.stopTimer);
    // ストップボタンに対するクリックイベントでstopTimerファンクションを呼び出す。
  }

  startTimer(e = null, time = moment()) {
    if (e) e.preventDefault();
    this.startButton.disabled = true;
    this.stopButton.disabled = false;
    this.isTimerStopped = false;

    this.startAt = time;
    const startAtClone = moment(this.startAt);
    this.endAt = startAtClone.add(this.workLength, 'minutes');
    // 25分後にendAtを設定する
    this.timerUpdater = window.setInterval(this.updateTimer, 500);
    // タイムラグがあるので、0.5秒ごとにアップデートする。
    this.displayTime();
  }

  resetValues() {
    this.workLength = 0.5; // 25分間
    this.breakLength = 0.3; // 5分間
    this.longBreakLength = 1; // 15分間
    this.startAt = null;
    this.endAt = null;
    this.isTimerStopped = true;
    this.onWork = true;
    this.tempCycles = null;
  }

  stopTimer(e = null) {
    if (e) e.preventDefault();
    this.resetValues();
    this.startButton.disabled = false;
    this.stopButton.disabled = true;
    window.clearInterval(this.timerUpdater);
    this.timerUpdater = null;
    this.displayTime();
  }

  static getHistory() {
    const items = localStorage.getItem('intervalData');
    let collection = [];
    // localStorageにはArrayを直接保存出来ないので、JSON形式で保存しています。
    // 取り出す時は、JSON.parseでarrayに戻します。
    if (items) collection = JSON.parse(items);
    return collection;
  }

  saveIntervalData(momentItem) {
    const collection = this.getHistory(); // 既に保存されているデータの取得。
    collection.push(momentItem.valueOf()); // 新しいデータを追加する。
    // JSON形式で再度保存する。
    localStorage.setItem('intervalData', JSON.stringify(collection));
  }

  displayCyclesToday(time = moment()) {
    const collection = this.getHistory();
    const startOfToday = time.startOf('day');
    // 今日の始まりより後の時間のデータのみを取得してfilterItemsに格納する。
    const filterItems = collection.filter(item => (
      parseInt(item, 10) >= startOfToday.valueOf()
    ));
    const count = filterItems.length;
    this.tempCycles = count;
    const percent = count / 4 * 100;
    this.countOfTodayDisplay.innerHTML = `${count.toString()}回 / 4回`;
    this.percentOfTodayDisplay.innerHTML = `目標を${percent}％達成中です。`;

    console.log(this.tempCycles);
  }

  displayHistory(time = moment()) {
    const collection = this.getHistory();
    const startOfToday = time.startOf('day');
    const startOfTodayClone = moment(startOfToday);
    const sevenDaysAgo = startOfTodayClone.subtract(7, 'days');
    const valOfSevenDaysAgo = sevenDaysAgo.valueOf();
    const tableEl = document.createElement('table');
    tableEl.classList.add('table', 'table-bordered');
    const trElDate = document.createElement('tr');
    const trElCount = document.createElement('tr');
    for (let i = 0; i <= 6; i += 1) {
      const filterItems = collection.filter((item) => {
        const timestampOfItem = parseInt(item, 10);
        return timestampOfItem >= valOfSevenDaysAgo + i * DAY
          && timestampOfItem < valOfSevenDaysAgo + (i + 1) * DAY;
      });
      const count = filterItems.length;
      const thElDate = document.createElement('th');
      const tdElCount = document.createElement('td');
      const sevenDaysAgoCloen = moment(sevenDaysAgo);
      thElDate.innerHTML = sevenDaysAgoCloen.add(i, 'day').format('MM月DD日');
      tdElCount.innerHTML = `${count}回<br>達成率${count / 4 * 100}%`;
      trElDate.appendChild(thElDate);
      trElCount.appendChild(tdElCount);
    }
    tableEl.appendChild(trElDate);
    tableEl.appendChild(trElCount);
    this.historyDisplay.appendChild(tableEl);
  }

  removeOldHistory() {
    const now = moment();
    const startOfToday = now.startOf('day'); // 今日の開始時
    const sevenDaysAgo = startOfToday.subtract(7, 'days'); // 今日の開始時から7日前
    const collection = this.getHistory();
    // フィルター関数で今日の開始時から今日の開始時から7日前までの間のデータのみを取得する
    const newCollection = collection.filter((item) => {
      const timestampOfItem = parseInt(item, 10);
      return timestampOfItem >= sevenDaysAgo;
    });
    // 取得したデータを再度保存する。
    localStorage.setItem('intervalData', JSON.stringify(newCollection));
  }
}

// ロード時にAppクラスをインスタンス化する。
window.addEventListener('load', () => new App());
window.localStorage.removeItem('intervalData');

export default App;
