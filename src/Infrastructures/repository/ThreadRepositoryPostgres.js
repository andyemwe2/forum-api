const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;

    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return new CreatedThread(result.rows[0]);
  }

  async verifyThreadIsExist(thread) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [thread],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getDetailThread(thread) {
    const query = {
      text: `
        SELECT threads.id, threads.title, threads.body, threads.date, users.username
        FROM threads
        INNER JOIN users ON threads.owner = users.id
        WHERE threads.id = $1
      `,
      values: [thread],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;

