import React, { useState } from "react";
import { setTimeout } from "timers";
import "./DbsPastQuestion.css";

// 範囲名の定数配列
const OPTION_LIST = [
  "R05",
  "R04",
  "R03",
  "R02",
  "H31",
  "H30",
  "H29",
  "H28",
  "H27",
  "H26",
  "H25",
  "H24",
  "H23",
  "H22",
  "H21",
];
const FIELD_LIST = ["データベース", "その他"];

export default function DbsPastQuestion() {
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [startClicked, setStartClicked] = useState<boolean>(false);
  const [selectAllOptions, setSelectAllOptions] = useState(false);
  const [selectAllFields, setSelectAllFields] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>(FIELD_LIST);
  const [result, setResult] = useState<string>("-");
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [questionsList, setQuestionsList] = useState<string[]>([]);
  const [questionNumber, setQuestionNumber] = useState<number>(0);

  // !チェックボックスの選択状態を切り替える関数(開催年度)
  const handleOptionChange = (index: number) => {
    const option = OPTION_LIST[index];
    // もし選択されていたら、選択を解除する
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
      setSelectAllOptions(false);
      // もし選択されていなかったら、選択する
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  // !チェックボックスの選択状態を切り替える関数(分野)
  const handleFieldChange = (index: number) => {
    const field = FIELD_LIST[index];
    // もし選択されていたら、選択を解除する
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((item) => item !== field));
      setSelectAllFields(false);
      // もし選択されていなかったら、選択する
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  // !全てのチェックボックスを選択状態に切り替える(開催年度)
  const handleSelectAllOptions = () => {
    if (!selectAllOptions) {
      setSelectedOptions(OPTION_LIST);
    } else {
      setSelectedOptions([]);
    }
    setSelectAllOptions(!selectAllOptions);
  };

  // !全てのチェックボックスを選択状態に切り替える(分野)
  const handleSelectAllFields = () => {
    if (!selectAllFields) {
      setSelectedFields(FIELD_LIST);
    } else {
      setSelectedFields([]);
    }
    setSelectAllFields(!selectAllFields);
  };

  // !headerを隠す関数
  const handleHeaderClicked = () => {
    if (showHeader) {
      setShowHeader(false);
    } else setShowHeader(true);
  };

  // !スタートボタンがクリックされたときの処理
  const handleStartClick = () => {
    setStartClicked(true);
    setShowHeader(false);
    // リンクの作成
    //TODO:問題数を変更できるようにする
    //関数にする
    // let maxQuestionCount = 0;
    // if (selectedFields.length === 1) {
    //   if (selectedFields[0] === "データベース") {
    //      maxQuestionCount=(selectedOptions.length)*18
    //   } else {
    //     maxQuestionCount=(selectedOptions.length)*7
    //   }
    // } else {
    //   maxQuestionCount=(selectedOptions.length)*25
    // }
    //TODO:10,20,30,50,100,maxの選択肢を追加する
    //maxQuestionCountの値が下回る場合は、選択肢を表示しない
    const totalQuestionsCount = 20;

    makeQuestionUrl(totalQuestionsCount).then((response) => {
      // 画面の表示にUrlをセット
      console.log(response);
      setQuestionsList(response);
      setIframeUrl(response[questionNumber]);
    });
  };

  // !問題URLのリストを作成する関数
  const makeQuestionUrl = async (totalQuestionsCount: number): Promise<string[]> => {
    const questionsList: string[] = [];
    while (questionsList.length < totalQuestionsCount) {
      const oneQuestionUrl = await makeOneQuestionUrl();
      if (!questionsList.includes(oneQuestionUrl)) {
        questionsList.push(oneQuestionUrl);
      }
    }
    return questionsList;
  };

  // !1つの問題urlの作成
  const makeOneQuestionUrl = (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      //指定された範囲からランダムに選択
      const random = Math.floor(Math.random() * selectedOptions.length);
      const year_int = parseInt(selectedOptions[random].slice(-2));
      const year_str = selectedOptions[random].slice(-2);

      // 年に応じてシーズンを決定
      const season = year_int === 23 ? "toku" : year_int >= 21 ? "haru" : "aki";
      // 問題番号を1〜25の範囲でランダムに決定
      let number = 0;
      if (selectedFields.length === 1) {
        if (selectedFields[0] === "データベース") {
          number = Math.floor(Math.random() * 18) + 1;
        } else {
          number = Math.floor(Math.random() * 7) + 19;
        }
      } else {
        number = Math.floor(Math.random() * 25) + 1;
      }

      resolve(`https://www.db-siken.com/s/kakomon/${year_str}_${season}/am2_${number}.html`);
    });
  };

  // !結果ボタンがクリックされたときの処理
  const handleResultClicked = (resultValue: string) => {
    setResult(resultValue);
  };

  // !Nextがクリックされたときの処理
  const getNextQuestion = () => {
    // データベースに結果を登録 //TODO:終わるまで次の処理せずに待つ
    setResult("-");
    //次の問題を表示
    setIframeUrl(questionsList[questionNumber + 1]);
    setQuestionNumber(questionNumber + 1);
  };
  // !Backがクリックされたときの処理
  const getBackQuestion = () => {
    setResult("-");
    //前の問題を表示
    setIframeUrl(questionsList[questionNumber - 1]);
    setQuestionNumber(questionNumber - 1);
  };

  return (
    <div className="dbs-center">
      <div className="dbs-header">
        <div>
          <samp className="dbs-title">　　　DBS 過去問</samp>
          <button className="dbs-header-button" onClick={handleHeaderClicked}>
            {showHeader ? "閉じる🔺" : "出題設定🔻"}
          </button>
        </div>
        {showHeader && <div className="dbs-left">開催年度</div>}
        {showHeader && (
          <div className="dbs-options">
            {OPTION_LIST.map((time, index) => (
              <label key={time}>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(time)}
                  onChange={() => handleOptionChange(index)}
                />
                {`${time}`}
              </label>
            ))}
            <label>
              <input type="checkbox" checked={selectAllOptions} onChange={handleSelectAllOptions} />
              全て選択
            </label>
          </div>
        )}
        {showHeader && <div className="dbs-left">分野　　</div>}
        {showHeader && (
          <div className="dbs-options">
            {FIELD_LIST.map((time, index) => (
              <label key={time}>
                <input
                  type="checkbox"
                  checked={selectedFields.includes(time)}
                  onChange={() => handleFieldChange(index)}
                />
                {`${time}`}
              </label>
            ))}
            <label>
              <input type="checkbox" checked={selectAllFields} onChange={handleSelectAllFields} />
              全て選択
            </label>
          </div>
        )}

        {showHeader && selectedOptions.length > 0 && selectedFields.length > 0 ? (
          <button onClick={handleStartClick}>スタート</button>
        ) : (
          showHeader && <button disabled>スタート</button>
        )}
      </div>

      {startClicked && (
        <div className="dbs-body">
          <div>
            範囲：
            {selectedOptions.length > 0 ? selectedOptions.join(", ") : "なし"}
          </div>
          <div>
            分野：
            {selectedFields.length > 0 ? selectedFields.join(", ") : "なし"}
          </div>
          <iframe src={iframeUrl} width="100%" height="600px"></iframe>
        </div>
      )}

      <div className="dbs-footer">
        <div>{iframeUrl}</div>
        <button
          className={`dbs-button-marubatu ${result === "○" ? "dbs-button-marubatu-selected" : ""}`}
          onClick={() => handleResultClicked("○")}>
          ○
        </button>
        <button
          className={`dbs-button-marubatu ${result === "×" ? "dbs-button-marubatu-selected" : ""}`}
          onClick={() => handleResultClicked("×")}>
          ×
        </button>
        {/* 現在は、今回の結果を表示している */}
        <div>前回結果：{result}</div>
        <button className="dbs-left" onClick={() => getBackQuestion()}>
          ＜ Back
        </button>
        <button className="dbs-right" onClick={() => getNextQuestion()}>
          Next ＞
        </button>
      </div>
    </div>
  );
}
