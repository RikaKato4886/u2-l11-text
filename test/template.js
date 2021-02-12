export default `
  <div class="app-wrapper">
    <header>
      <div class="container">
      </div>
    </header>
    <main>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-12">
            <div class="timer-time-wrapper card">
              <div class="card-body timer-time">
                <div id="time-display" class="time-display"></div>
                <div id="timer-button" class="timer-button">
                  <button class="btn btn-primary" id="start-button">
                    Start
                  </button>
                  <button class="btn btn-danger" id="stop-button" disabled>
                    Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-12">
            <div class="card">
              <div class="card-body count-today-wrapper">
                <h3>本日の記録</h3>
                <div id="count-today" class="count-today">
                </div>
                <div id="percent-today" class="percent-today">
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 interval-history-wrapper">
            <h3 class="section-title">過去7日間の記録</h3>
            <div id="history">
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-12 text-center justify-content-center">
            <hr>
            © CodeGrit
          </div>
        </div>
      </div>
    </footer>
  </div>
  <script src="./bundle.js"></script>
`;
