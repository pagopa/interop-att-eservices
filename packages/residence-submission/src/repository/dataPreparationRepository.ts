import { Pool } from 'pg';
import { RichiestaAR001 } from '../model/domain/models.js';

const pool = new Pool({
  // ...existing configuration...
});

class DataPreparationRepository {
  async getBySubjectId(subjectId: string) {
    const query = 'SELECT * FROM users WHERE subject_id = $1';
    const result = await pool.query(query, [subjectId]);
    return result.rows[0];
  }

  async getByPersonalInfo(criteria: any) {
    const query = 'SELECT * FROM users WHERE name = $1 AND surname = $2 AND birth_date = $3';
    const result = await pool.query(query, [criteria.name, criteria.surname, criteria.birthDate]);
    return result.rows;
  }

  async getById(id: string) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async updateById(id: string, request: RichiestaAR001) {
    const query = 'UPDATE users SET data = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [request, id]);
    return result.rows[0];
  }

  async create(request: RichiestaAR001) {
    const query = 'INSERT INTO users (data) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [request]);
    return result.rows[0];
  }

  async findAllByKey(key: string, value: any) {
    const query = `SELECT * FROM users WHERE ${key} = $1`;
    const result = await pool.query(query, [value]);
    return result.rows;
  }

  async saveAllByKey(key: string, value: any, data: RichiestaAR001[]) {
    const query = `UPDATE users SET data = $1 WHERE ${key} = $2 RETURNING *`;
    const results = [];
    for (const item of data) {
      const result = await pool.query(query, [item, value]);
      results.push(result.rows[0]);
    }
    return results;
  }
}

export default new DataPreparationRepository();
