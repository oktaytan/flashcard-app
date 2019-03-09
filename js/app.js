// event listeners
function eventListeners() {
  const showBtn = document.getElementById("show-btn");
  const form = document.querySelector("#cardForm");
  const closeBtn = document.querySelector("#close");
  const feedback = document.querySelector(".feedback");
  const questionInput = document.getElementById("question");
  const answerInput = document.getElementById("answer");
  const questionList = document.getElementById("questions-list");
  const textareas = document.querySelectorAll("textarea");
  const arrow = document.querySelector(".arrow");
  let data = [];

  // new ui instance
  const ui = new UI();
  // show question form
  showBtn.addEventListener('click', function () {
    ui.showQuestion(form);
  });
  // hide question form
  closeBtn.addEventListener('click', function () {
    ui.hideQuestion(form);
    arrow.style.top = '150%';
  });
  // arrow centering when textarea focus
  textareas.forEach(function (item) {
    item.addEventListener('focus', function () {
      ui.centerArrow(item, arrow);
    });
  })
  // add question
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const questionValue = questionInput.value;
    const answerValue = answerInput.value;

    if (questionValue === '' || answerValue === '') {
      feedback.textContent = 'Cannot add empty values.';
      feedback.classList.add('show');
      setTimeout(function () {
        feedback.classList.remove('show');
      }, 3000);
    } else {
      const question = new Question(questionValue, answerValue)
      data.push(question);
      ui.addQuestion(questionList, question);
      ui.clearFields(questionInput, answerInput);
    }
  });
  // work with a question
  questionList.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('delete-flashcard')) {

      questionList.removeChild(e.target.parentElement.parentElement);

      // rest of data
      let id = e.target.dataset.id;
      const tempData = data.filter(function (item) {
        return item.id !== id;
      });
      data = tempData;

    } else if (e.target.classList.contains('show__answer')) {

      e.target.nextElementSibling.classList.toggle('show');

    } else if (e.target.classList.contains('edit-flashcard')) {

      // delete question from DOM
      let id = e.target.dataset.id;
      questionList.removeChild(e.target.parentElement.parentElement);
      // show the question card
      ui.showQuestion(form);
      // spesific question
      const tempQuestion = data.filter(function (item) {
        return item.id === id;
      });
      // rest of data
      const tempData = data.filter(function (item) {
        return item.id !== id;
      });
      data = tempData;
      questionInput.value = tempQuestion[0].title;
      answerInput.value = tempQuestion[0].answer;
    }
  });
}

// ui constructor
function UI() {

}
// show qustion card
UI.prototype.showQuestion = function (element) {
  element.classList.add('show');
}
// hide qustion card
UI.prototype.hideQuestion = function (element) {
  element.classList.remove('show');
}
// arrow centering 
UI.prototype.centerArrow = function (item, arrow) {
  let center = item.offsetTop + (item.offsetHeight / 2) + 258;
  arrow.style.top = `${center}px`;
}
// add question
UI.prototype.addQuestion = function (element, question) {
  let card = document.createElement('DIV');
  card.classList.add('card');
  card.innerHTML = `
    <h4 class="questionResult">${question.title}</h4>
    <a href="#" class="show__answer">Show / Hide answer</a>
    <h4 class="answerResult">${question.answer}</h4>
    <div class="flashcard__btn">
      <button type="button" id="edit-flashcard" class="btn small edit-flashcard" data-id="${question.id}">Edit</button>
      <button type="button" id="delete-flashcard" class="btn small delete-flashcard" data-id="${question.id}">Delete</button>
    </div>`;
  element.appendChild(card);
}

// clear fields
UI.prototype.clearFields = function (question, answer) {
  question.value = '';
  answer.value = '';
}

// qustion constructor
function Question(title, answer) {
  this.id = uuid.v4();
  this.title = title;
  this.answer = answer;
}

// DOM event listeners
document.addEventListener('DOMContentLoaded', function () {
  eventListeners();
});