let model, webcam, maxPredictions, labelContainer;
let isPlaying = true;  // 웹캠이 현재 재생 중인지 추적하는 플래그

function setProgress(percent) {
    const progressBar = document.getElementById('cir-progress');
    progressBar.style.width = percent + '%';
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    console.log("Predictions: ", prediction);  // 예측 결과 로깅

    // 메시지 출력을 위한 초기화
    if (labelContainer.children[0]) {
        labelContainer.children[0].innerHTML = "";  // 기존 내용을 초기화
    }
    
    for (let i = 0; i < maxPredictions; i++) {
        const probability = prediction[i].probability.toFixed(2);
        if (i === 0) {  // 클래스 0에 대한 조건만 확인
            console.log("Class 0 probability: ", probability);  // 확률 로깅
            setProgress(probability*100);
            if (probability >= 0.95) {
                addMessage(" 완벽합니다.");
            } else if (probability >= 0.8) {
                addMessage(" 하나만 더 찾으세요");
            } else if (probability >= 0.6) {
                addMessage(" 거의 다 왔어요");
            } else if (probability >= 0.4) {
                addMessage(" 조금만 더 생각해봐요");
            } else if (probability >= 0.2) {
                addMessage(" 분발하셔야 합니다");
            }
        }
    }
}

function addMessage(message) {
    labelContainer.innerHTML = message;  // 메시지 추가
    if (labelContainer.children[0]) {
        labelContainer.children[0].innerHTML = message;  // 메시지 추가
    }
}

document.getElementById('controlButton').addEventListener('click', function() {
    const pCon = document.querySelector(".pause-container");
    const playControl = document.querySelector(".play-container")

    if (isPlaying) {
        webcam.pause();  // 웹캠 일시 정지
        pCon.style.display = "none";
        playControl.style.display = "flex";
        // this.textContent = '다 시 시 작';  // 버튼 텍스트 변경
        isPlaying = false;  // 플래그 업데이트
    } else {
        webcam.play();  // 웹캠 재시작
        pCon.style.display = "flex";
        playControl.style.display = "none";
        // this.textContent = '일 시 정 지';  // 버튼 텍스트 변경
        isPlaying = true;  // 플래그 업데이트
    }
});

async function init() {
    const modelURL = 'https://teachablemachine.withgoogle.com/models/r7PomgsUD/model.json';
    const metadataURL = 'https://teachablemachine.withgoogle.com/models/r7PomgsUD/metadata.json';

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(323, 323, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById('webcam-container').appendChild(webcam.canvas);
    labelContainer = document.getElementById('label-container');

    // labelContainer 내에 각 클래스의 라벨을 동적으로 생성
    for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement('div');
        labelContainer.appendChild(div);
    }
}

function loop() {
    webcam.update(); // 웹캠 업데이트
    predict(); // 예측 실행
    window.requestAnimationFrame(loop); // 반복 실행
}

document.addEventListener('DOMContentLoaded', init);

