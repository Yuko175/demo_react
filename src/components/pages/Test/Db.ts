// import SQLite from "better-sqlite3";
const SQLite = require("better-sqlite3");

try {
  // SQLiteデータベースの初期化
  const db = new SQLite("src/components/pages/DbsPastQuestion/dbs_past_question.db");

  // 集計クエリの実行
  const query = db.prepare("SELECT * FROM dbs_past_question ORDER BY RANDOM() LIMIT 10;");
  const result = query.all();

  // 結果のログ出力
  console.log(result);
} catch (error) {
  console.error("データベース操作中にエラーが発生しました:", error);
}
