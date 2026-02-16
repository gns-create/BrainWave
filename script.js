let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentIndex = 0;
let showingAnswer = false;
let quizScore = 0;
let quizOrder = [];

/* MESSAGE BAR */
function showMessage(msg,type='success'){
    const bar = document.getElementById('message-bar');
    bar.textContent = msg;
    bar.style.background = type==='success'? '#4caf50':'#f44336';
    document.body.style.background = type==='success'? '#d4f7d4':'#f7d4d4';
    bar.style.opacity = '1';
    setTimeout(()=>{
        bar.style.opacity='0';
        document.body.style.background='linear-gradient(180deg, #e6f7fb 0%, #ffffff 100%)';
    },1000);
}

/* ADD FLASHCARD */
function addFlashcard(){
    const q=document.getElementById('question').value.trim();
    const a=document.getElementById('answer').value.trim();
    if(q && a){
        flashcards.push({question:q,answer:a});
        localStorage.setItem('flashcards',JSON.stringify(flashcards));
        document.getElementById('question').value='';
        document.getElementById('answer').value='';
        showMessage('Flashcard added!');
        renderEditFlashcards();
    } else showMessage('Enter both question and answer','error');
}

/* RESET ALL */
function resetAll(){
    if(confirm("Delete all flashcards?")){
        flashcards=[]; localStorage.removeItem('flashcards'); currentIndex=0;
        document.getElementById('flashcard-display').innerHTML='';
        document.getElementById('quiz-display').innerHTML='';
        renderEditFlashcards();
        showMessage('All flashcards reset!');
    }
}

/* NAVIGATION TO EDIT */
function goToEdit(){
    document.getElementById('home-page').style.display='none';
    document.getElementById('edit-page').style.display='block';
    renderEditFlashcards();
}
function backToHome(){
    document.getElementById('edit-page').style.display='none';
    document.getElementById('home-page').style.display='block';
}

/* EDIT FLASHCARDS */
function renderEditFlashcards(){
    const editDiv=document.getElementById('edit-display');
    if(flashcards.length===0){ 
        editDiv.innerHTML='No flashcards yet.'; 
        return;
    }
    editDiv.innerHTML='';
    flashcards.forEach((card,i)=>{
        const div=document.createElement('div');
        div.className='edit-card'; // each flashcard in its own box
        div.innerHTML=`
            <input type="text" value="${card.question}" class="edit-q" placeholder="Question">
            <input type="text" value="${card.answer}" class="edit-a" placeholder="Answer">
            <div>
                <button class="save-btn">Save</button>
                <button class="del-btn">Delete</button>
            </div>
        `;
        editDiv.appendChild(div);

        div.querySelector('.save-btn').onclick = ()=>{
            const newQ = div.querySelector('.edit-q').value.trim();
            const newA = div.querySelector('.edit-a').value.trim();
            if(newQ && newA){
                flashcards[i] = {question: newQ, answer: newA};
                localStorage.setItem('flashcards', JSON.stringify(flashcards));
                showMessage('Flashcard updated!');
            } else {
                showMessage('Enter both fields','error');
            }
        };

        div.querySelector('.del-btn').onclick = ()=>{
            flashcards.splice(i,1);
            localStorage.setItem('flashcards', JSON.stringify(flashcards));
            renderEditFlashcards();
            showMessage('Flashcard deleted!');
        };
    });
}

/* STUDY FLASHCARDS */
function startStudy(){
    if(flashcards.length===0){ showMessage('No flashcards!','error'); return;}
    currentIndex=0; showingAnswer=false; showFlashcard();
    document.getElementById('next-card').style.display='inline-block';
}
function showFlashcard(){
    const display=document.getElementById('flashcard-display');
    const card=flashcards[currentIndex];
    display.innerHTML=`<div class="flashcard" onclick="toggleAnswer()">
        ${showingAnswer ? card.answer : card.question}
    </div>`;
}
function toggleAnswer(){
    showingAnswer = !showingAnswer;
    showFlashcard();
}
function nextFlashcard(){
    showingAnswer=false;
    currentIndex++;
    if(currentIndex>=flashcards.length){
        document.getElementById('flashcard-display').innerHTML='Finished studying!';
        document.getElementById('next-card').style.display='none';
    } else { showFlashcard(); }
}

/* QUIZ MODE */
function startQuiz(){
    if(flashcards.length===0){ showMessage('No flashcards!','error'); return;}
    quizScore=0; currentIndex=0;
    quizOrder = flashcards.map((_,i)=>i);
    shuffleArray(quizOrder);
    document.getElementById('start-quiz-btn').style.display='none';
    showQuizQuestion();
}
function showQuizQuestion(){
    if(currentIndex >= quizOrder.length){
        document.getElementById('quiz-display').innerHTML=`
            <h3>Quiz finished!</h3>
            <p>Your score: ${quizScore} / ${flashcards.length}</p>
        `;
        const btn = document.getElementById('start-quiz-btn');
        btn.textContent='Restart Quiz';
        btn.style.display='inline-block';
        return;
    }
    const display=document.getElementById('quiz-display');
    const card=flashcards[quizOrder[currentIndex]];
    display.innerHTML=`
        <div class="flashcard">${card.question}</div>
        <input type="text" id="quiz-answer" placeholder="Your answer">
        <button onclick="checkQuizAnswer()">Submit</button>
    `;
}
function checkQuizAnswer(){
    const user=document.getElementById('quiz-answer').value.trim().toLowerCase();
    const correct=flashcards[quizOrder[currentIndex]].answer.trim().toLowerCase();
    if(user===correct && user!==''){ quizScore++; showMessage('Correct!','success'); }
    else showMessage(`Wrong! Answer: ${flashcards[quizOrder[currentIndex]].answer}`,'error');
    currentIndex++;
    showQuizQuestion();
}

/* UTILITY: Shuffle Array */
function shuffleArray(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
}
