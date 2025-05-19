function DashboardBox({ title, price, direction, dollarChange, percentChange, colorClass, time}) {
    return (
    <div className={colorClass}>
        <div className="ticker-container">
            <p className="ticker">{title}</p>
            <p className="ticker">{price}</p>  
        </div>      
        <div className="direction-container">
            <p className="direction">{direction}</p>
            <div className="direction-sub">
                <p className="direction">{dollarChange}&nbsp;</p>
                <p className="direction" class="x">{percentChange}</p>
            </div>
        </div>
        <div className="updated-container">
          <p>LAST | {time} EDT</p>
        </div>
      </div>
    );
  }

export default DashboardBox;