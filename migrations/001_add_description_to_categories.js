// migrations/001_add_description_to_categories.js

module.exports = {
  // Hàm up: chạy khi gõ `npm run migrate`
  async up(db) {
    await db.query(`
      ALTER TABLE \`categories\` 
      ADD COLUMN \`description\` TEXT NULL AFTER \`name\`;
    `);
  },

  // Hàm down: chạy khi gõ `npm run migrate:rollback` (hoàn tác)
  async down(db) {
    await db.query(`
      ALTER TABLE \`categories\` 
      DROP COLUMN \`description\`;
    `);
  }
};
