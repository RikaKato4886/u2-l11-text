import App from '../src/index';
import template from './template'; // テスト内でhtmlファイルのbody部分を読み込む。
const moment = require('moment');

describe('displayTime', () => {
  test('初期化時に25:00を表示する。', () => {
    document.body.innerHTML = template;
    const app = new App();
    const timeDisplay = document.getElementById('time-display');
    expect(app.isTimerStopped).toBeTruthy(); // 初期状態でタイマーは止まっています
    expect(timeDisplay.innerHTML).toEqual('25:00'); // 25:00が表示されていることを確認します。
  });
  test('カウントダウン中の時間を適切に表示する。', () => {
    document.body.innerHTML = template;
    const app = new App();
    const now = moment();
    const startOfToday = now.startOf('day');
    // タイマースタート後の状態を作り出す。
    app.startButton.disabled = true;
    app.stopButton.disabled = false;
    app.isTimerStopped = false;
    app.startAt = startOfToday;
    app.endAt = moment(startOfToday).add(25, 'minutes');
    // タイマースタートしてから51秒後の時間でテストを行う。
    app.displayTime(moment(startOfToday).add(51, 'seconds'));
    const timeDisplay = document.getElementById('time-display');
    expect(timeDisplay.innerHTML).toEqual('24:09'); // 51秒経過しているので残り時間は24:09
  });
});

describe('startTimer', () => {
  test('スタートボタンにdisable属性を追加', () => {
    document.body.innerHTML = template;
    const app = new App();
    app.startTimer();
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    expect(startButton.disabled).toEqual(true);
    expect(stopButton.disabled).toEqual(false);
    expect(app.isTimerStopped).toEqual(false);
  });
  test('startAtとendAtを適切に設定する。', () => {
    document.body.innerHTML = template;
    const app = new App();
    const now = moment(); // 現在時刻のmomentインスタンスを作成
    app.startTimer(null, now);
    expect(app.startAt.valueOf()).toEqual(now.valueOf()); // startAtに現在時刻が与えられているかをテスト
    expect(app.endAt.valueOf()).toEqual(now.add(25, 'minutes').valueOf());
    // endAtがstartAtから25分後になっているかテスト
  });
});

describe('updateTimer', () => {
  test('作業時間が終わったら5分の休憩時間に切り替える。', () => {
    document.body.innerHTML = template;
    const app = new App();
    const now = moment();
    const startOfToday = now.startOf('day');
    // 作業中の状態を作り出す。
    app.startButton.disabled = true;
    app.stopButton.disabled = false;
    app.isTimerStopped = false;
    app.startAt = startOfToday;
    app.endAt = moment(startOfToday).add(25, 'minutes');
    // 終了時刻から100ミリ秒後の時間でテストを行う。
    app.updateTimer(moment(startOfToday).add(25, 'minutes').add(100, 'millisecond'));
    const timeDisplay = document.getElementById('time-display');
    expect(timeDisplay.innerHTML).toEqual('5:00');
    expect(app.onWork).not.toBeTruthy(); // 休憩時間に切り替わっている。
  });
  test('作業時間が終わったら15分の休憩時間に切り替える。', () => {
    document.body.innerHTML = template;
    const app = new App();
    const now = moment();
    const startOfToday = now.startOf('day');
    // 作業中の状態を作り出す。
    app.startButton.disabled = true;
    app.stopButton.disabled = false;
    app.isTimerStopped = false;
    app.tempCycles = 4;//tempCyclesを3にする
    app.startAt = startOfToday;
    app.endAt = moment(startOfToday).add(25, 'minutes');
    // 終了時刻から100ミリ秒後の時間でテストを行う。
    app.updateTimer(moment(startOfToday).add(25, 'minutes').add(100, 'millisecond'));
    const timeDisplay = document.getElementById('time-display');
    expect(timeDisplay.innerHTML).toEqual('15:00');
    expect(app.onWork).not.toBeTruthy(); // 休憩時間に切り替わっている。
    expect(app.tempCycles).toEqual(0);//tempCyclesがゼロになっている
  });
  test('休憩時間が終わったら作業時間に切り替える。', () => {
    document.body.innerHTML = template;
    const app = new App();
    const now = moment();
    const startOfToday = now.startOf('day');
    // 休憩中の状態を作り出す。
    app.onWork = false;
    app.startButton.disabled = true;
    app.stopButton.disabled = false;
    app.isTimerStopped = false;
    app.startAt = startOfToday;
    app.endAt = moment(startOfToday).add(5, 'minutes');
    // 終了時刻から100ミリ秒後の時間でテストを行う。
    app.updateTimer(moment(startOfToday).add(5, 'minutes').add(100, 'millisecond'));
    const timeDisplay = document.getElementById('time-display');
    expect(timeDisplay.innerHTML).toEqual('25:00');
    expect(app.onWork).toBeTruthy(); // 作用時間に切り替わっている。
  });
});