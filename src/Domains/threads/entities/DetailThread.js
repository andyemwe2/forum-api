class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);
    this.thread = payload;
  }

  _verifyPayload(payload) {
    if (!payload || typeof payload !== 'string') {
      throw new Error(!payload ? 'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY' : 'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
