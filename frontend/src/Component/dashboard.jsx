import car from"../images/car_back.jpg"
import "./dashboard.css"
function Dashboard() {
    return (
        <>
            <div className="dashboard_whole">
                <h1>WELCOME TO THE AUTOSHOP</h1>
                <h2>Hope you are doing great</h2>
            </div>
            
            <img className= "cars" src={car} alt="car"  />
        </>
    );
}

export default Dashboard;
