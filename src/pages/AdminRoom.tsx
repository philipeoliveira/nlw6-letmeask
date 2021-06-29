import { Link, useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
   id: string;
};

export function AdminRoom() {
   //const { user } = useAuth();
   const history = useHistory();
   const params = useParams<RoomParams>();
   const roomId = params.id;

   const { title, questions } = useRoom(roomId);

   async function handleEndRoom() {
      await database.ref(`rooms/${roomId}`).update({
         endedAt: new Date(),
      });

      history.push('/');
   }

   async function handleCheckQuestionAsAnswered(
      questionId: string,
      isAnswered: boolean
   ) {
      if (isAnswered) {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: false,
         });
      } else {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
         });
      }
   }

   async function handleHighLightQuestion(
      questionId: string,
      isHighlighted: boolean
   ) {
      if (isHighlighted) {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: false,
         });
      } else {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
         });
      }
   }

   async function handleDeleteQuestion(questionId: string) {
      if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
      }
   }

   return (
      <div id='page-room'>
         <header>
            <div className='content'>
               <Link to='/' title='Ir para página inicial'>
                  <img src={logoImg} alt='Logo do Letmeask' />
               </Link>
               <div>
                  <RoomCode code={roomId} />
                  <Button isOutlined onClick={handleEndRoom}>
                     Encerrar sala
                  </Button>
               </div>
            </div>
         </header>

         <main>
            <div className='room-title'>
               <h1>Sala {title}</h1>
               {questions.length === 1 && (
                  <span>{questions.length} pergunta</span>
               )}
               {questions.length > 1 && (
                  <span>{questions.length} perguntas</span>
               )}
            </div>

            {questions.length > 0 ? (
               <div className='question-list'>
                  {questions.map((question) => {
                     return (
                        <Question
                           key={question.id}
                           content={question.content}
                           author={question.author}
                           isAnswered={question.isAnswered}
                           isHighlighted={question.isHighlighted}
                        >
                           <button
                              type='button'
                              className={
                                 question.isAnswered ? 'answered-icons' : ''
                              }
                              title={`${
                                 question.isAnswered
                                    ? 'Remarcar pergunta como NÃO Respondida'
                                    : 'Marcar pergunta como Respondida'
                              }`}
                              onClick={() =>
                                 handleCheckQuestionAsAnswered(
                                    question.id,
                                    question.isAnswered
                                 )
                              }
                           >
                              <svg
                                 width='24'
                                 height='24'
                                 viewBox='0 0 24 24'
                                 fill='none'
                                 xmlns='http://www.w3.org/2000/svg'
                              >
                                 <circle
                                    cx='12.0003'
                                    cy='11.9998'
                                    r='9.00375'
                                    stroke='#737380'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                 />
                                 <desc>
                                    Ícone de círculo com um sinal interno de
                                    check simbolizando uma ação de verificado
                                 </desc>
                                 <path
                                    d='M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193'
                                    stroke='#737380'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                 />
                              </svg>
                           </button>
                           <button
                              type='button'
                              className={
                                 question.isHighlighted
                                    ? 'highlighted-icons'
                                    : ''
                              }
                              title={`${
                                 question.isHighlighted
                                    ? 'Remover o Destaque da pergunta'
                                    : 'Destacar visualmente a pergunta'
                              }`}
                              onClick={() =>
                                 handleHighLightQuestion(
                                    question.id,
                                    question.isHighlighted
                                 )
                              }
                           >
                              <svg
                                 width='24'
                                 height='24'
                                 viewBox='0 0 24 24'
                                 fill='none'
                                 xmlns='http://www.w3.org/2000/svg'
                              >
                                 <desc>
                                    Ícone de balão representando a área que será
                                    destacada
                                 </desc>
                                 <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z'
                                    stroke='#737380'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                 />
                              </svg>
                           </button>
                           <button
                              type='button'
                              title='Excluir pergunta'
                              onClick={() => handleDeleteQuestion(question.id)}
                           >
                              <img src={deleteImg} alt='Ícone de lixeira' />
                           </button>
                        </Question>
                     );
                  })}
               </div>
            ) : (
               <div className='empty-questions-list'>
                  <img
                     src={emptyQuestionsImg}
                     alt='Nenhuma pergunta cadastrada'
                  />
                  <h2>Nenhuma pergunta cadastrada...</h2>
                  <p>Esta sala ainda não possui perguntas dos usuários.</p>
               </div>
            )}
         </main>
      </div>
   );
}
