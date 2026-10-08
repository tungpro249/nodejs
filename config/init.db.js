const mysql = require("mysql2/promise");
require('dotenv').config();

class Database {
    constructor() {
        // Nếu đã có instance tồn tại, trả về luôn instance đó
        if (Database.instance) {
            return Database.instance;
        }

        this.connect();

        // Lưu instance này vào static property
        Database.instance = this;
    }

    // Hàm khởi tạo Pool kết nối
    connect() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test kết nối ngay khi khởi tạo
        this.pool.getConnection()
            .then(conn => {
                console.log("Connected to MySQL Database successfully!");
                conn.release();
            })
            .catch(err => {
                console.error("Error connecting to database:", err.message);
            });
    }

    // Static method chuẩn Singleton
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    // Helper: Thực thi query thông thường
    query(sql, params) {
        return this.pool.query(sql, params);
    }

    // Helper: Thực thi Prepared Statement (chống SQL Injection)
    execute(sql, params) {
        return this.pool.execute(sql, params);
    }

    // Helper: Lấy connection riêng lẻ (dùng cho Transaction)
    getConnection() {
        return this.pool.getConnection();
    }
}

// Khởi tạo và export instance duy nhất
const instance = Database.getInstance();
module.exports = instance;
