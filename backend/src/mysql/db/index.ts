import seq from './seq.db';
import ToolGen from '../model/tool/gen.model';
import ToolGenColumn from '../model/tool/gen_column.model';
import SysDept from '../model/system/dept.model';
import LenoUser from '../model/user.model';

// 建立模型之间的联系
const initRelation = () => {
  // 一对一关联 (关联表的关联顺序为 hasOne =》belongsTo，并且需要写在一张表内)

  // 代码生成
  ToolGen.hasMany(ToolGenColumn, { foreignKey: 'table_id', sourceKey: 'table_id', as: 'columns' });
  ToolGenColumn.belongsTo(ToolGen, { foreignKey: 'table_id', targetKey: 'table_id' });

  // user
  SysDept.hasOne(LenoUser, { foreignKey: 'dept_id', sourceKey: 'dept_id' });
  LenoUser.belongsTo(SysDept, { foreignKey: 'dept_id', targetKey: 'dept_id', as: 'dept' });
};

// 同步数据库，sequelize.sync()
const initDB = () =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise(() => {
    try {
      seq.authenticate();
      console.log('数据库连接成功');

      // 初始化model关系
      initRelation();

      seq.sync();

      // { alter: true }
    } catch (error) {
      console.log('数据库连接失败', error);
    }

    process.on('unhandledRejection', (error) => {
      // 此时解决上述数据库创建失败，catch无法捕获到
      console.log('数据库连接失败', error);
    });
  });

export default initDB;
