export const TarotCard = ({card, reversed, cardText}) => {
    // console.log(card, reversed, cardText)
    return(
        <div className="tarot-card">
            {reversed ?
                <img src={`assets/${card}.jpg`} alt="" srcSet="" className='reversed'/>
                :
                <img src={`assets/${card}.jpg`} alt="" srcSet="" />
            }
            <p className="card-description">{cardText}</p>
        </div>
    )
}