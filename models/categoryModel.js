
const categorySchema = {
  tableName: 'categories',

  columns: {
    id: { type: 'INT AUTO_INCREMENT PRIMARY KEY' },
    name: { type: 'VARCHAR(100)', required: true },
    status: { type: 'VARCHAR(50)', default: "'active'" },
    created_at: { type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
  },

  selectFields: [
    'id',
    'name',
    'status',
    'created_at AS createdAt',
  ]
}

module.exports = categorySchema;