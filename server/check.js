const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres.oicllytbkouwwvgrxgoz', 'BLTVcHJrd1XFMIQ5', {
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  dialect: 'postgres'
});

sequelize.query('ALTER TABLE banners ADD COLUMN "targetUrl" VARCHAR(255);')
  .then(() => console.log('targetUrl column added successfully.'))
  .catch(console.error)
  .finally(() => process.exit());
