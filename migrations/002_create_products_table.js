// migrations/002_create_products_table.js

module.exports = {
  async up(db) {
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`products\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`category_id\` INT NOT NULL,
        \`name\` VARCHAR(100) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`slug\` VARCHAR(100) NOT NULL,
        \`price\` INT NOT NULL,
        \`status\` VARCHAR(50) DEFAULT 'active',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        -- 👇 ĐÂY LÀ FOREIGN KEY (KHÓA NGOẠI)
        CONSTRAINT \`fk_products_categories\` 
        FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`)
        ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  },

  async down(db) {
    await db.query(`DROP TABLE IF EXISTS \`products\`;`);
  }
};
