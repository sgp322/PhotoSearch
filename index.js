window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();

var icon = document.querySelector('i.fa.fa-microphone')
const sound = document.querySelector('.sound');

icon.addEventListener('click', () => {
  sound.play();
  dictate();
});

const dictate = () => {
  recognition.start();
  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    

    if (event.results[0].isFinal) {
      console.log(speechToText);
	  $('#searchKey')[0].value = speechToText;
    }
  }
}

