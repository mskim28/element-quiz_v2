document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        "H": "수소", "He": "헬륨", 
        "Li": "리튬", "Be": "베릴륨", "B": "붕소",
        "C": "탄소", "N": "질소", "O": "산소", "F": "플루오린", "Ne": "네온",
        "Na": "나트륨(소듐)", "Mg": "마그네슘", "Al": "알루미늄", "Si": "규소", "P": "인",
        "S": "황", "Cl": "염소", "Ar": "아르곤", "K": "칼륨(포타슘)", "Ca": "칼슘",
        "Fe": "철", "Cu": "구리", "Zn": "아연", "Ag": "은", "Au": "금",
        "I": "아이오딘", "Pb": "납", "Hg": "수은", "Mn": "망가니즈", "Ba": "바륨",
    };

    const alternativeNames = {
        "Na": ["나트륨", "소듐"],
        "K": ["칼륨", "포타슘"]
    };

    let shuffledElements = [];
    let currentIndex = 0;
    let currentQuestion = {};
    let currentQuestionType = ""; // 각 문제의 유형
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let answered = false;
    let attempt = 0;
    let resultRecorded = false;  // 각 문제별 결과 기록 여부
    let resultDetails = [];      // 문제 결과 전체 기록
    let currentAttempts = [];    // 현재 문제의 모든 시도 기록

    let userName = "";

    // 화면 요소들
    const startScreen = document.getElementById("startScreen");
    const typeSelectionScreen = document.getElementById("typeSelectionScreen");
    const quizScreen = document.getElementById("quizScreen");
    const finalScreen = document.getElementById("finalScreen");
    const finalScoreDisplay = document.getElementById("finalScore");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const analysisDetails = document.getElementById("analysisDetails");
    const restartQuizFinal = document.getElementById("restartQuizFinal");
    // exportBtn는 제거하고, 동적으로 추가할 예정

    // 유형 선택 관련 요소
    const quizTypeSelect = document.getElementById("quizType");
    const confirmTypeBtn = document.getElementById("confirmType");

    // 퀴즈 화면 관련 요소
    const startQuizBtn = document.getElementById("startQuiz");
    const userNameInput = document.getElementById("userNameInput");
    const questionDisplay = document.getElementById("question");
    const userInput = document.getElementById("userInput");
    const submitBtn = document.getElementById("submit");
    const nextBtn = document.getElementById("next");
    const revealBtn = document.getElementById("reveal");
    const stopBtn = document.getElementById("stop");
    const resultDisplay = document.getElementById("result");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const progressDisplay = document.getElementById("progressDisplay");

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function initializeQuiz() {
        shuffledElements = shuffleArray(Object.keys(elements));
        currentIndex = 0;
        score = 0;
        correctCount = 0;
        incorrectCount = 0;
        resultDetails = [];
        updateScoreDisplay();
        updateProgressDisplay();
        generateQuestion();
    }

    function getNextElement() {
        const symbol = shuffledElements[currentIndex];
        currentIndex++;
        return { symbol: symbol, name: elements[symbol] };
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `점수: ${score} | 정답 개수: ${correctCount} | 오답 개수: ${incorrectCount}`;
    }

    function updateProgressDisplay() {
        const totalQuestions = shuffledElements.length;
        const solved = currentIndex;
        const remaining = totalQuestions - solved;
        progressDisplay.textContent = `문제: ${solved}/${totalQuestions} (남은 문제: ${remaining})`;
    }

    function generateQuestion() {
        if (currentIndex >= shuffledElements.length) {
            showFinalScreen();
            return;
        }
        answered = false;
        attempt = 0;
        resultRecorded = false;
        currentAttempts = [];
        revealBtn.style.display = "none";
        resultDisplay.classList.remove("blinking", "blinking2");
        let type = quizTypeSelect.value;
        if (type === "mixed") {
            const types = ["symbolToName", "nameToSymbol"];
            currentQuestionType = types[Math.floor(Math.random() * types.length)];
        } else {
            currentQuestionType = type;
        }
        currentQuestion = getNextElement();
        if (currentQuestionType === "symbolToName") {
            questionDisplay.textContent = `원소 기호: ${currentQuestion.symbol}`;
        } else if (currentQuestionType === "nameToSymbol") {
            questionDisplay.textContent = `원소 이름: ${currentQuestion.name}`;
        }
        resultDisplay.textContent = "";
        nextBtn.style.display = "none";
        userInput.value = "";
        updateProgressDisplay();
    }

    function checkAnswer() {
        if (answered) return;
        const answer = userInput.value.trim();
        if (!answer) return;
        currentAttempts.push(answer);
        let correctAnswer = "";
        if (currentQuestionType === "symbolToName") {
            if (alternativeNames[currentQuestion.symbol]) {
                const possibleAnswers = alternativeNames[currentQuestion.symbol];
                if (possibleAnswers.includes(answer)) {
                    correctAnswer = answer;
                }
            } else {
                correctAnswer = currentQuestion.name;
            }
        } else if (currentQuestionType === "nameToSymbol") {
            correctAnswer = currentQuestion.symbol;
        }
        // 결과 기록: 첫 시도 기준으로 O/X 판별
        if (answer === correctAnswer) {
            if (!resultRecorded) {
                resultDetails.push({
                    symbol: currentQuestion.symbol,
                    name: currentQuestion.name,
                    questionType: currentQuestionType,
                    attempts: currentAttempts.slice(),
                    correct: currentAttempts[0] === correctAnswer
                });
                resultRecorded = true;
            }
            if (attempt >= 1) {
                resultDisplay.classList.add("blinking2");
                resultDisplay.textContent = "이번에는 정답입니다!";
            } else {
                score += 2;
                correctCount++;
                resultDisplay.textContent = "정답입니다!";
            }
            resultDisplay.classList.remove("blinking");
            answered = true;
            nextBtn.style.display = "inline-block";
            revealBtn.style.display = "none";
        } else {
            score--;
            attempt++;
            incorrectCount++;
            revealBtn.style.display = "inline-block";
            resultDisplay.textContent = "오답입니다. 다시 입력하세요.";
            if (attempt >= 2) {
                score++;
                incorrectCount--;
                resultDisplay.classList.add("blinking");
            }
        }
        updateScoreDisplay();
    }

    function revealAnswer() {
        resultDisplay.textContent = `정답: ${currentQuestion.symbol} (${currentQuestion.name})`;
        resultDisplay.classList.remove("blinking");
        answered = true;
        revealBtn.style.display = "none";
        nextBtn.style.display = "inline-block";
        if (!currentAttempts.length) {
            currentAttempts.push("(입력 없음)");
        }
        if (!resultRecorded) {
            resultDetails.push({
                symbol: currentQuestion.symbol,
                name: currentQuestion.name,
                questionType: currentQuestionType,
                attempts: currentAttempts.slice(),
                correct: currentAttempts[0] === (currentQuestionType === "symbolToName" ? currentQuestion.name : currentQuestion.symbol)
            });
            resultRecorded = true;
        }
    }

    function resetQuiz() {
        score = 0;
        correctCount = 0;
        incorrectCount = 0;
        updateScoreDisplay();
    }

    function showFinalScreen() {
        quizScreen.style.display = "none";
        finalScreen.style.display = "block";
        finalScoreDisplay.textContent = `최종 점수: ${score} | 정답 개수: ${correctCount} | 오답 개수: ${incorrectCount}`;
    }

    
    analyzeBtn.addEventListener("click", () => {
        // 테이블 스타일링 포함하여 resultDetails를 HTML로 변환
        let analysisHTML = `
            <table style="border-collapse: collapse; width: calc(100% - 40px); margin: 0 20px 20px 20px;">
                <thead>
                    <tr style="background-color: #f5f5f5;">
                        <th style="border: 1px solid #ccc; padding: 8px;">문제 번호</th>
                        <th style="border: 1px solid #ccc; padding: 8px;">문제 내용</th>
                        <th style="border: 1px solid #ccc; padding: 8px;">정답</th>
                        <th style="border: 1px solid #ccc; padding: 8px;">사용자 입력 (시도 순)</th>
                        <th style="border: 1px solid #ccc; padding: 8px;">결과</th>
                    </tr>
                </thead>
                <tbody>
        `;

        resultDetails.forEach((result, index) => {
            let questionStr = "";
            let correctAnswer = "";
            if (result.questionType === "symbolToName") {
                questionStr = `원소 기호: ${result.symbol}`;
                correctAnswer = result.name;
            } else {
                questionStr = `원소 이름: ${result.name}`;
                correctAnswer = result.symbol;
            }
            let attemptsStr = result.attempts.join(" → ");
            let outcome = result.correct ? "O" : "X";

            analysisHTML += `
                <tr>
                    <td style="border: 1px solid #ccc; padding: 8px;">${index + 1}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${questionStr}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${correctAnswer}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${attemptsStr}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${outcome}</td>
                </tr>
            `;
        });

        analysisHTML += `
                </tbody>
            </table>
        `;

        // 결과 분석 표를 analysisDetails 영역에 반영
        analysisDetails.innerHTML = analysisHTML;
        analysisDetails.style.display = "block";

        // "파일 내보내기" 버튼을 동적으로 추가
        let exportBtnInner = document.createElement("button");
        exportBtnInner.id = "exportBtnInner";
        exportBtnInner.textContent = "파일 내보내기";
        exportBtnInner.style.padding = "10px 15px";
        exportBtnInner.style.border = "none";
        exportBtnInner.style.borderRadius = "5px";
        exportBtnInner.style.cursor = "pointer";
        exportBtnInner.style.fontSize = "1em";
        exportBtnInner.style.margin = "10px";
        analysisDetails.appendChild(exportBtnInner);


        // PDF 내보내기 이벤트
        exportBtnInner.addEventListener("click", () => {
            // analysisDetails를 클론하여 원본에는 영향을 주지 않음
            const analysisClone = analysisDetails.cloneNode(true);
            // 클론된 요소에서 "파일 내보내기" 버튼 제거 (id가 exportBtnInner인 요소)
            const exportButton = analysisClone.querySelector("#exportBtnInner");
            if (exportButton) {
                exportButton.remove();
            }

            // 임시 컨테이너에 사용자 정보 + 결과 + 분석 표(버튼 제거된 클론의 내용)를 넣음
            const exportContainer = document.createElement("div");
            exportContainer.style.position = "absolute";
            exportContainer.style.left = "-9999px";
            exportContainer.style.width = "800px";
            exportContainer.style.padding = "0 40px"; // 좌우에 40px의 패딩 (20px씩)
            exportContainer.style.fontFamily = "sans-serif"; 

            exportContainer.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="font-size:1.5em; margin-top: 30px; margin-bottom: 10px;"> < 퀴즈 결과 분석 > </h1>
                    <p style="font-size:0.8em; margin-bottom:5px;">
                        <span>📍 사용자: ${userName}</span>
                        <span style="margin-left: 40px;">✅ ${finalScoreDisplay.textContent}</span>
                    </p>
                    <hr style="margin:20px 0; border: none; border-top: 1px solid #ccc;">
                </div>
                <div style="font-size:0.9em;">
                    ${analysisClone.innerHTML}
                </div>
            `;

            document.body.appendChild(exportContainer);

            // html2canvas으로 exportContainer를 캡처해서 PDF 변환
            html2canvas(exportContainer, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jspdf.jsPDF("p", "mm", "a4");

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgProps = pdf.getImageProperties(imgData);

                const pdfImgWidth = pageWidth;
                const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

                let heightLeft = pdfImgHeight;
                let position = 0;

                // 첫 페이지에 이미지 삽입
                pdf.addImage(imgData, "PNG", 0, position, pdfImgWidth, pdfImgHeight);
                heightLeft -= pageHeight;

                // 이미지가 한 페이지에 다 들어가지 않을 경우 추가 페이지 생성
                while (heightLeft > 0) {
                    position = heightLeft - pdfImgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, position, pdfImgWidth, pdfImgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save("quiz_results.pdf");
                document.body.removeChild(exportContainer);
            });
        });





    });

    

    restartQuizFinal.addEventListener("click", () => {
        finalScreen.style.display = "none";
        analysisDetails.innerHTML = "";
        analysisDetails.style.display = "none";
        resultDetails = [];
        currentAttempts = [];
        // 사용자 이름 입력 필드와 변수 초기화
        userNameInput.value = "";
        userName = "";
        startScreen.style.display = "block";
    });

    startQuizBtn.addEventListener("click", () => {
        userName = userNameInput.value.trim();
        if (!userName) {
            alert("사용자 정보를 입력해 주세요.");
            return;
        }
        startScreen.style.display = "none";
        typeSelectionScreen.style.display = "block";
    });

    confirmTypeBtn.addEventListener("click", () => {
        typeSelectionScreen.style.display = "none";
        quizScreen.style.display = "block";
        resetQuiz();
        initializeQuiz();
    });

    stopBtn.addEventListener("click", () => {
        alert(`** 원소 퀴즈 종료! **\n정답 개수: ${correctCount}\n오답 개수: ${incorrectCount}\n최종 점수: ${score}`);
        quizScreen.style.display = "none";


        // 퀴즈 화면, 최종 화면, 분석 화면 숨기기
        quizScreen.style.display = "none";
        finalScreen.style.display = "none";
        analysisDetails.innerHTML = "";
        analysisDetails.style.display = "none";
        
        // 모든 변수 초기화
        resultDetails = [];
        currentAttempts = [];
        score = 0;
        correctCount = 0;
        incorrectCount = 0;
        currentIndex = 0;
        userNameInput.value = "";
        userName = "";

        startScreen.style.display = "block";
    });

    nextBtn.addEventListener("click", () => {
        userInput.focus();
        generateQuestion();
    });

    submitBtn.addEventListener("click", checkAnswer);
    revealBtn.addEventListener("click", revealAnswer);
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });
});
