
const productSchema = {
 tableName: 'products',
 
 columns: {
    id: {type: 'INT AUTO_INCREMENT PRIMARY KEY'},
    category_id: {type: 'INT', required: true},
    name: {type: 'VARCHAR(100)', required: true},
    description: {type: 'TEXT', required: true},
    slug: {type: 'VARCHAR(100)', required: true},
    status: {type: 'VARCHAR(50)', default: "'active'"},
    price: {type: 'INT', required: true},
    created_at: {type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'},
    updated_at: {type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'}
 },
 

 selectFields: [
  'id',
  'category_id',
  'name',
  'description',
  'slug',
  'price',
  'status',
  'created_at AS createdAt',
  'updated_at AS updatedAt'
 ],

 fillable: ['category_id', 'name', 'description', 'slug', 'price', 'status'],

}

module.exports = productSchema;