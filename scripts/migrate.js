// scripts/migrate.js
const fs = require('fs');
const path = require('path');
const db = require('../config/init.db');

const MIGRATIONS_DIR = path.join(__dirname, '../migrations');

async function runMigrations() {
  const isRollback = process.argv.includes('--rollback');

  try {
    // 1. Tạo bảng migrations nếu chưa có để lưu lịch sử
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`migrations\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL UNIQUE,
        \`executed_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Lấy danh sách các file migration đã thực thi trước đó
    const [rows] = await db.query('SELECT `name` FROM `migrations` ORDER BY `id` ASC');
    const executedMigrations = rows.map(r => r.name);

    // 3. Đọc toàn bộ file trong thư mục migrations/ và sắp xếp theo tên
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.js')).sort();

    if (isRollback) {
      // ROLLBACK: Lấy file chạy gần nhất để hoàn tác
      const lastExecuted = executedMigrations[executedMigrations.length - 1];
      if (!lastExecuted) {
        console.log('⚠️ Không có migration nào để rollback.');
        return process.exit(0);
      }

      console.log(`↩️ Đang rollback: ${lastExecuted}...`);
      const migration = require(path.join(MIGRATIONS_DIR, lastExecuted));
      if (typeof migration.down === 'function') {
        await migration.down(db);
        await db.query('DELETE FROM `migrations` WHERE `name` = ?', [lastExecuted]);
        console.log(`✅ Rollback thành công: ${lastExecuted}`);
      } else {
        console.warn(`⚠️ File ${lastExecuted} không có hàm down()!`);
      }
      return process.exit(0);
    }

    // MIGRATE UP: Chạy các file mới chưa từng chạy
    const pendingMigrations = files.filter(f => !executedMigrations.includes(f));

    if (pendingMigrations.length === 0) {
      console.log('✅ Database đã ở trạng thái mới nhất! Không có migration nào cần chạy.');
      return process.exit(0);
    }

    for (const file of pendingMigrations) {
      console.log(`⏳ Đang chạy migration: ${file}...`);
      const migration = require(path.join(MIGRATIONS_DIR, file));
      
      // Chạy hàm up()
      await migration.up(db);

    // Lưu lại vào bảng migrations để lần sau không chạy lại
      await db.query('INSERT INTO `migrations` (`name`) VALUES (?)', [file]);
      console.log(`✅ Hoàn thành: ${file}`);
    }

    console.log('🎉 Toàn bộ migrations đã được thực thi thành công!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi chạy migration:', error.message);
    process.exit(1);
  }
}

runMigrations();
