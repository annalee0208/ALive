document.addEventListener('DOMContentLoaded', async () => {
    const URL = "https://teachablemachine.withgoogle.com/models/IHFCPocsu/";
    let recognizer;

    async function createModel() {
        const checkpointURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        recognizer = speechCommands.create("BROWSER_FFT", undefined, checkpointURL, metadataURL);
        await recognizer.ensureModelLoaded();
        return recognizer;
    }

    recognizer = await createModel(); // 모델을 페이지 로드 시 미리 로드합니다.

    function updateResults(result) {
        const scores = result.scores;
        const classLabels = recognizer.wordLabels();
        const labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '';
        let stopRecording = false;

        classLabels.forEach((label, i) => {
            if (scores[i] > 0.8) {
                switch(label) {
                    case 'Class 2': window.location.href = '1. first.html'; break;
                    case 'Class 3': window.location.href = '2. seo.html'; break;
                    case 'Class 4': window.location.href = '3. third.html'; break;
                    case 'Class 5': window.location.href = '4. fourth.html'; break;
                    case 'Class 6': window.location.href = '5. fifth.html'; break;
                }
            }
        });

        if (stopRecording) {
            recognizer.stopListening();
            document.getElementById('status').innerHTML = "녹음 완료";
            document.getElementById('status').className = 'stopped';
        }
    }

    const startButton = document.querySelector('.button');
    const setContainer = document.querySelector('.container')
    const selectContent = document.querySelector('.select_content');
    const msgText = document.getElementById("msg_text");

    const set1 = document.getElementById('set1');
    const set2 = document.getElementById('set2');

    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    const btn3 = document.getElementById('btn3');
    const btn4 = document.getElementById('btn4');
    const btn5 = document.getElementById('btn5');

    startButton.addEventListener('click', () => {
        setContainer.style.display = 'none';
        document.getElementById("logo").style.display = 'block';
        selectContent.style.display = 'block';
    });

    set1.addEventListener('click', () => {
        selectContent.style.display = 'none';
        const v_content = document.querySelector(".voice_content");
        v_content.style.display = "flex";
        v_content.style.alignItems = "center";
        v_content.style.justifyContent= "center";
        v_content.style.flexDirection= "column";

        let index = 0;
        const msg_text = "음성 인식 중...";
        // msgText.innerHTML = msg_text
        function animateText() {
            msgText.innerHTML = msg_text.slice(0, index);
            index++;
            if (index > msg_text.length) {
                index = 0;
            }
            setTimeout(animateText, 150);
        }

        animateText();

        const statusElement = document.getElementById('status');
        statusElement.innerHTML = "녹음 중...";
        statusElement.className = 'recording';

        recognizer.listen(updateResults, {
            includeSpectrogram: true,
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50
        });
    });

    set2.addEventListener('click', () => {
        selectContent.style.display = "none";
        document.querySelector(".btn_content").style.display = "block";
    });

    [btn1, btn2, btn3, btn4, btn5].forEach((btn, index) => {
        btn.addEventListener('click', () => {
            console.log(`Image ${index + 1} clicked`);
            switch(index) {
                case 0: window.location.href = '1. first.html'; break;
                case 1: window.location.href = '2. seo.html'; break;
                case 2: window.location.href = '3. third.html'; break;
                case 3: window.location.href = '4. fourth.html'; break;
                case 4: window.location.href = '5. fifth.html'; break;
            }
        });
    });
});
