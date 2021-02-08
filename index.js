// eslint-disable-next-line import/no-unresolved
const sql = require('mssql');
const password = 'sdadsdas';

exports.handler = async (event, context, callback) => {
  const config = {
    user: 'admin',
    password: '',
    server: '',
    database: 'SALTO_SPACE_',
  };

  try {
    const d = new Date();
    let dateString = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    dateString += `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
    const connection = await sql.connect(config);
    const q = `exec msdb.dbo.rds_backup_database
    @source_db_name='${config.database}',
    @s3_arn_to_backup_to='arn:aws:s3:::goldprop-dbbackup/salto:${dateString}.sql.but',
    @overwrite_s3_backup_file=0,
    @type='FULL'`;
    const result = await connection.request()
      .query(q);
    // eslint-disable-next-line no-console
    console.log('Backup result', result);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  sql.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    callback(err);
  });
};
