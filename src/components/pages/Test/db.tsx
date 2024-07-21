// import React, { useState, useEffect } from "react";
// const SQLite = require("better-sqlite3");

// const MyComponent: React.FC = () => {
//   const [data, setData] = useState<any[]>([]);

//   useEffect(() => {
//     try {
//       // SQLiteデータベースの初期化
//       const db = new SQLite("src/components/pages/DbsPastQuestion/dbs_past_question.db");

//       // 集計クエリの実行
//       const query = db.prepare("SELECT * FROM dbs_past_question ORDER BY RANDOM() LIMIT 10;");
//       const result = query.all();

//       // useStateでデータを更新
//       setData(result);

//       // 結果のログ出力
//       console.log(result);
//     } catch (error) {
//       console.error("データベース操作中にエラーが発生しました:", error);
//     }
//   }, []);

//   return (
//     <div>
//       <h1>SQLiteデータ取得</h1>
//       <ul>
//         {data.map((item, index) => (
//           <li key={index}>
//             <p>ID: {item.id}</p>
//             {/* 必要に応じて他のデータも表示 */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MyComponent;
