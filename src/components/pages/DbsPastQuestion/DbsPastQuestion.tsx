import React, { useState, useEffect } from "react";
import "./DbsPastQuestion.css";

//TODO:未解答問題からの出題
//TODO:間違えた問題からの出題
//TODO:連続正解を除く(2回連続正解のものは出題しない)
//FIXME:前回の値表示を修正する(本物の値を表示する)

//DBは、年度(複合主キー),問題番号(複合主キー),url,前回の値、前々回の値

// NOTE:範囲名の定数配列
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
const QUESTION_COUNT: (number | "max")[] = [10, 20, 30, 50, 100, "max"];

export default function DbsPastQuestion() {
  const [showHeader, setShowHeader] = useState<boolean>(true);

  const [startClicked, setStartClicked] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>(FIELD_LIST);
  const [selectedCount, setSelectedCount] = useState<number | "max" | null>("max");
  const [selectAllOptions, setSelectAllOptions] = useState(false);
  const [selectAllFields, setSelectAllFields] = useState(true);

  const [questionsList, setQuestionsList] = useState<string[]>([]);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [iframeUrl, setIframeUrl] = useState<string>("");

  const [accuracyList, setAccuracyList] = useState<boolean[]>([]);
  const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);

  const [result, setResult] = useState<string>("-");

  const [finishClicked, setFinishClicked] = useState<boolean>(true);
  const [showResults, setShowResults] = useState<boolean>(false);

  // NOTE:チェックボックスの選択状態を切り替える関数(開催年度)
  const handleOptionChange = (index: number) => {
    const option = OPTION_LIST[index];
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
      setSelectAllOptions(false);
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
    // 'max' ボタンの状態を更新
    if (selectedOptions.length === 0) {
      setSelectedCount("max");
    }
  };

  // NOTE:チェックボックスの選択状態を切り替える関数(分野)
  const handleFieldChange = (index: number) => {
    const field = FIELD_LIST[index];
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((item) => item !== field));
      setSelectAllFields(false);
    } else {
      setSelectedFields([...selectedFields, field]);
    }
    // 'max' ボタンの状態を更新
    if (selectedFields.length === 0) {
      setSelectedCount("max");
    }
  };

  // NOTE:全てのチェックボックスを選択状態に切り替える(開催年度)
  const handleSelectAllOptions = () => {
    if (!selectAllOptions) {
      setSelectedOptions(OPTION_LIST);
    } else {
      setSelectedOptions([]);
    }
    setSelectAllOptions(!selectAllOptions);
    // 'max' ボタンの状態を更新
    if (OPTION_LIST.length === 0) {
      setSelectedCount("max");
    }
  };

  // NOTE:全てのチェックボックスを選択状態に切り替える(分野)
  const handleSelectAllFields = () => {
    if (!selectAllFields) {
      setSelectedFields(FIELD_LIST);
    } else {
      setSelectedFields([]);
    }
    setSelectAllFields(!selectAllFields);
    // 'max' ボタンの状態を更新
    if (FIELD_LIST.length === 0) {
      setSelectedCount("max");
    }
  };

  // NOTE:スタートボタンがクリックされたときの処理
  const handleStartClick = () => {
    setResult("-");
    setQuestionsList([]);
    setAccuracyList([]);
    setQuestionNumber(0);
    setShowResults(false);
    setFinishClicked(false);
    setStartClicked(true);
    setShowHeader(false);

    let maxQuestionCount = 0;
    if (selectedFields.length === 1) {
      if (selectedFields[0] === "データベース") {
        maxQuestionCount = selectedOptions.length * 18;
      } else {
        maxQuestionCount = selectedOptions.length * 7;
      }
    } else {
      maxQuestionCount = selectedOptions.length * 25;
    }

    // FIXME:totalQuestionsCountを上で変数にする
    const totalQuestionsCount = selectedCount === "max" ? maxQuestionCount : selectedCount || 0;

    makeQuestionUrl(totalQuestionsCount).then((response) => {
      setQuestionsList(response);
      setIframeUrl(response[questionNumber]);
    });
  };

  // NOTE:問題URLのリストを作成する関数
  const makeQuestionUrl = async (totalQuestionsCount: number): Promise<string[]> => {
    const questionsList: string[] = [];
    // TODO:データベースから、前回の値を持ってくる処理

    //*データベースから、年度と問題番号を指定した[totalQuestionsCount(問)]分の行取得する
    //order by rand()でランダムに取得する
    //limit totalQuestionsCount
    //SELECT * FROM テーブル名 ORDER BY RAND() LIMIT totalQuestionsCount;
    //*questionsListにobjectとして追加する
    while (questionsList.length < totalQuestionsCount) {
      const oneQuestionUrl = await makeOneQuestionUrl();
      if (!questionsList.includes(oneQuestionUrl)) {
        questionsList.push(oneQuestionUrl);
      }
    }
    return questionsList;
  };

  // NOTE:1つの問題urlの作成(要らなくなる)
  const makeOneQuestionUrl = (): Promise<string> => {
    return new Promise<string>((resolve) => {
      const random = Math.floor(Math.random() * selectedOptions.length);
      const year_str = selectedOptions[random].slice(-2);

      const season = year_str === "23" ? "toku" : parseInt(year_str) >= 21 ? "haru" : "aki";
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

  // NOTE:headerを隠す関数
  const handleHeaderClicked = () => {
    setShowHeader(!showHeader);
  };

  // NOTE:結果ボタン(まるばつ)がクリックされたときの処理
  const handleResultClicked = (resultValue: string) => {
    setResult(resultValue);
  };

  // NOTE:Nextがクリックされたときの処理
  const getNextQuestion = () => {
    if (questionNumber < questionsList.length - 1) {
      const currentAccuracy = result === "○";
      setAccuracyList([...accuracyList, currentAccuracy]);
      setQuestionNumber(questionNumber + 1);
      setIframeUrl(questionsList[questionNumber + 1]);
      setResult("-");
      setIsLastQuestion(questionNumber + 1 === questionsList.length - 1);
    }
  };

  // NOTE:Backがクリックされたときの処理
  const getBackQuestion = () => {
    if (questionNumber > 0) {
      const newAccuracyList = [...accuracyList];
      newAccuracyList.pop(); // 最後の正誤を削除
      setAccuracyList(newAccuracyList);
      setQuestionNumber(questionNumber - 1);
      setIframeUrl(questionsList[questionNumber - 1]);
      setResult("-");
      setIsLastQuestion(false);
    }
  };

  // NOTE:正答率を計算する関数
  const calculateAccuracy = () => {
    if (accuracyList.length === 0) return "-%";
    const correctCount = accuracyList.filter((accuracy) => accuracy).length;
    const accuracy = (correctCount / accuracyList.length) * 100;
    return `${accuracy.toFixed(2)}%`;
  };

  // NOTE: 終了ボタンがクリックされたときの処理
  const handleFinishClicked = () => {
    const currentAccuracy = result === "○";
    // currentAccuracy が "-" の場合は accuracyList に追加しない
    if (result !== "-") {
      setAccuracyList([...accuracyList, currentAccuracy]);
      setQuestionNumber(questionNumber + 1);
    }

    setFinishClicked(true);
    setShowResults(true);

    // TODO: データベースにセットする処理
  };

  // NOTE:リスタートの処理
  const restart = () => {
    setStartClicked(false);
    setShowHeader(true);
    setShowResults(false);
    setResult("-");
    setQuestionsList([]);
    setQuestionNumber(0);
    setSelectedCount("max");
    setAccuracyList([]);
    setIsLastQuestion(false);
    setShowResults(false);
  };

  // NOTE:question_countのmaxの計算
  let maxQuestionCount = 0;
  if (selectedFields.length === 1) {
    if (selectedFields[0] === "データベース") {
      maxQuestionCount = selectedOptions.length * 18;
    } else {
      maxQuestionCount = selectedOptions.length * 7;
    }
  } else {
    maxQuestionCount = selectedOptions.length * 25;
  }

  // NOTE:question_countボタンがクリック可能かどうかを判定する関数
  const isButtonClickable = (value: number | "max" | null) => {
    if (value === "max") {
      return true;
    }
    return value !== null && value <= maxQuestionCount;
  };

  // NOTE:question_countボタンにおいて、selectedOptionをチェックし、クリックできなかったら"max"に更新する
  if (!isButtonClickable(selectedCount) && selectedCount !== null) {
    setSelectedCount("max");
  }

  // NOTE:結果
  return (
    <div className="dbs-center">
      <div className="dbs-header">
        <div className="dbs-header-container">
          <span className="dbs-header-title">DBS 過去問</span>
          <button className="dbs-header-button" onClick={handleHeaderClicked}>
            {showHeader ? "閉じる　🔺" : "出題設定🔻"}
          </button>
        </div>

        {showHeader && (
          <div className="dbs-section">
            <div className="dbs-left">開催年度</div>
            <div className="dbs-options">
              {OPTION_LIST.map((time, index) => (
                <label key={time}>
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(time)}
                    onChange={() => handleOptionChange(index)}
                  />
                  {time}
                </label>
              ))}
              <label>
                <input
                  type="checkbox"
                  checked={selectAllOptions}
                  onChange={handleSelectAllOptions}
                />
                全て選択
              </label>
            </div>
          </div>
        )}

        {showHeader && (
          <div className="dbs-section">
            <div className="dbs-left">分野</div>
            <div className="dbs-options">
              {FIELD_LIST.map((field, index) => (
                <label key={field}>
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => handleFieldChange(index)}
                  />
                  {field}
                </label>
              ))}
              <label>
                <input type="checkbox" checked={selectAllFields} onChange={handleSelectAllFields} />
                全て選択
              </label>
            </div>
          </div>
        )}

        {showHeader && (
          <div className="dbs-section">
            <div className="dbs-left">問題数</div>
            <div className="dbs-options">
              {QUESTION_COUNT.map((option) => (
                <label
                  key={option}
                  style={{ color: isButtonClickable(option) ? "inherit" : "gray" }}>
                  <input
                    type="radio"
                    name="questionCount"
                    value={option}
                    checked={selectedCount === option}
                    onChange={() => setSelectedCount(option)}
                    disabled={!isButtonClickable(option)}
                    style={{
                      cursor: isButtonClickable(option) ? "pointer" : "not-allowed",
                    }}
                  />
                  {option === "max" ? "全て出題" : option}
                </label>
              ))}
            </div>
          </div>
        )}

        {showHeader && selectedOptions.length > 0 && selectedFields.length > 0 && finishClicked ? (
          <button className="dbs-button" onClick={handleStartClick}>
            スタート
          </button>
        ) : (
          showHeader && (
            <button className="dbs-button" disabled>
              スタート
            </button>
          )
        )}

        {showHeader && !finishClicked && (
          <button
            className="dbs-finish-button"
            onClick={handleFinishClicked}
            disabled={finishClicked}>
            終了
          </button>
        )}

        {showHeader && !finishClicked && (
          <div style={{ color: "red", fontWeight: "bold" }}>※ 終了ボタンを押してください</div>
        )}
      </div>
      {startClicked && showResults && <h2>結果</h2>}
      {startClicked && (
        <div className="dbs-body">
          {!finishClicked && (
            <div className="dbs-body-title">
              {questionNumber + 1}問目({questionsList.length}問中)
            </div>
          )}
          <div className="dbs-body-accuracy">
            {questionNumber}問中{accuracyList.filter((accuracy) => accuracy).length}
            問正解　/　正解率：{calculateAccuracy()}
          </div>
          {!finishClicked && <iframe src={iframeUrl} width="100%" height="100%"></iframe>}
          {finishClicked && (
            <button className="dbs-button" onClick={restart}>
              他の問題を解く
            </button>
          )}
          {showResults && (
            <div className="dbs-body-results">
              <ul>
                {questionsList.slice(0, questionNumber).map((question, index) => (
                  <div key={index}>
                    <a href={question} target="_blank" rel="noopener noreferrer">
                      {question}
                    </a>{" "}
                    : {accuracyList[index] ? "○" : "×"}
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="dbs-footer">
        {startClicked && !finishClicked && (
          <>
            {/* <div>{iframeUrl}</div> */}
            <button
              className={`dbs-button-marubatu ${
                result === "○" ? "dbs-button-marubatu-selected" : ""
              }`}
              onClick={() => handleResultClicked("○")}
              disabled={result === "○"}>
              ○
            </button>
            <button
              className={`dbs-button-marubatu ${
                result === "×" ? "dbs-button-marubatu-selected" : ""
              }`}
              onClick={() => handleResultClicked("×")}
              disabled={result === "×"}>
              ×
            </button>
            <div>前回結果：{result}</div>
            <button
              className="dbs-back-button"
              onClick={getBackQuestion}
              disabled={questionNumber === 0 || finishClicked}>
              ＜ Back
            </button>
            <button
              className="dbs-finish-button"
              onClick={handleFinishClicked}
              disabled={finishClicked}>
              終了
            </button>

            {isLastQuestion ? (
              <button
                className="dbs-next-button"
                onClick={handleFinishClicked}
                disabled={finishClicked}>
                終了 ＞
              </button>
            ) : (
              <button
                className="dbs-next-button"
                onClick={getNextQuestion}
                disabled={questionNumber === questionsList.length - 1}>
                Next ＞
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
