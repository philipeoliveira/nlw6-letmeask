import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
   code: string;
};

export function RoomCode(props: RoomCodeProps) {
   const code = props.code;

   function copyRoomCodeToClipboard() {
      navigator.clipboard.writeText(code);
   }

   return (
      <button
         className='room-code'
         title={`Copiar o Código: ${code}`}
         onClick={copyRoomCodeToClipboard}
      >
         <div>
            <img src={copyImg} alt='Copiar' />
         </div>
         <p>
            Código da sala: <span>{code}</span>
         </p>
      </button>
   );
}
