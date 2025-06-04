import useStockData from "./useStockData";

function DashboardBox({ title, name }) {

  const { priceReal, changeReal, percentReal, timeReal, change } = useStockData(title);

  const direction = changeReal > 0 ? "▲" : changeReal < 0 ? "▼" : "-";
  const colorClass = changeReal > 0
    ? "data-box-green"
    : changeReal < 0
    ? "data-box-red"
    : "data-box-grey";


  return (
    <div className={colorClass}>
        <div className="ticker-container">
            <p className="ticker">{name}</p>
            <p className="ticker">{priceReal}</p>  
        </div>      
        <div className="direction-container">
            <p className="direction">{direction}</p>
            <div className="direction-sub">
                <p className="direction">{change}&nbsp;</p>
                <p className="direction" class="x">{percentReal}</p>
            </div>
        </div>
        <div className="updated-container">
          <p>LAST | {timeReal}</p>
        </div>
      </div>
  );
}

export default DashboardBox;