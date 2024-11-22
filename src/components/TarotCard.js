export const TarotCard = ({card, reversed, cardText}) => {
    // console.log(card, reversed, cardText)
    const url = 'tarottool/assets'
    return(
        <div>
            {reversed ?
                <img src={`${url}/${card}.jpg`} alt="" srcSet="" className='reversed'/>
                :
                <img src={`${url}/${card}.jpg`} alt="" srcSet="" />
            }
            <p className="card-description">{cardText}</p>
        </div>
    )
}