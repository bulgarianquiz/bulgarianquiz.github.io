class App {
    constructor() {
        this.flag = false;
        this.question = null;
        this.container = document.querySelector('.container');
        this.timer = null;

        this.attachEvents();
        this.generateQuestion();
    }

    attachEvents() {
        document.body.addEventListener('click', (ev) => {
            let el = ev.target;

            do {
                if (el === document.body) {
                    return;
                }

                if (this.hasClass(el, 'js-answer')) {
                    this.checkAnswer(el);

                    return;
                } else if (this.hasClass(el, 'js-next-question')) {
                    el.parentNode.removeChild(el);

                    this.generateQuestion();

                    return;
                }

                el = el.parentNode;
            } while (el);
        });
    }

    generateQuestion() {
        this.flag = true;

        this.container.innerHTML = '';
        this.question = Questions.get();

        this.showTimer();
        this.showQuestion();
        this.showAnswers();
    }

    showTimer() {
        const div = document.createElement('div');
        const wrap = document.createElement('div');
        const mask = document.createElement('div');
        const line = document.createElement('div');

        wrap.className = 'wrap';
        mask.className = 'mask';
        line.className = 'line';
        div.className = 'timer';

        wrap.appendChild(mask);
        wrap.appendChild(line);
        div.appendChild(wrap);

        this.container.insertAdjacentElement('beforeend', div);

        let seconds = 30;

        this.timer = setInterval(() => {
            seconds--;

            line.style.width = ((seconds * 100) / 30) + '%';

            if (seconds === 0) {
                clearInterval(this.timer);

                this.showNextQuestionButton();

                Array.from(this.container.querySelectorAll('.js-answer')).forEach((answer) => {
                    this.addClass(answer, 'is-disabled')
                });

                this.flag = false;
            }
        }, 1000);
    }

    showQuestion() {
        const div = document.createElement('div');

        div.className = 'question';
        div.innerHTML = this.question.question;
        div.onanimationend = (ev) => {
            console.log(this, ev, div);
        };

        this.container.insertAdjacentElement('beforeend', div);
    }

    showAnswers() {
        const div = document.createElement('div');

        div.className = 'answers';

        this.question.answers.forEach((answer, index) => {
            const button = document.createElement('button');

            button.className = 'answer js-answer';
            button.setAttribute('data-answer', index);
            button.innerHTML = answer;

            div.appendChild(button);
        });

        this.container.insertAdjacentElement('beforeend', div);
    }

    showNextQuestionButton() {
        const button = document.createElement('button');

        button.className = 'fab next-question-button js-next-question';
        button.title = 'Следващ въпрос';
        button.setAttribute('aria-label', 'Следващ въпрос');
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

        document.body.querySelector('main').appendChild(button);
    }

    checkAnswer(markedAnswer) {
        if (!this.flag) {
            return;
        }

        this.flag = false;

        clearInterval(this.timer);

        this.addClass(markedAnswer, 'is-marked')

        setTimeout(() => {
            if (Number(markedAnswer.getAttribute('data-answer')) === this.question.correctAnswer) {
                this.removeClass(markedAnswer, 'is-marked');
                this.addClass(markedAnswer, 'is-correct');
            } else {
                this.addClass(this.container.querySelector('.js-answer[data-answer="' + this.question.correctAnswer + '"]'), 'is-correct');
            }

            Array.from(this.container.querySelectorAll('.js-answer:not(.is-correct)')).forEach((answer) => {
                this.addClass(answer, 'is-disabled')
            });

            this.showNextQuestionButton();
        }, 1000);
    }

    addClass(element, className) {
        const classList = element.className.split(' ').filter(Boolean);

        classList.push(className);

        element.className = classList.join(' ');
    }

    removeClass(element, className) {
        const classList = element.className.split(' ').filter(Boolean);

        if (!classList.length) {
            return;
        }

        const classIndex = classList.indexOf(className);

        classList.splice(classIndex, 1);

        element.className = classList.join(' ');
    }

    hasClass(element, className) {
        const classList = element.className.split(' ');

        return classList.indexOf(className) > -1;
    }
}
