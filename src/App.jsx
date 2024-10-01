import React, { useState, useEffect } from "react";
import "./App.css";

// Updated Header component with emoji
const Header = ({ money, reputation }) => {
  const getReputationEmoji = (rep) => {
    if (rep >= 4.5) return "😄";
    if (rep >= 3.5) return "😊";
    if (rep >= 2.5) return "😐";
    return "☹️";
  };

  return (
    <header className="header">
      <h1>Hotel Management Tycoon</h1>
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Money:</span>
          <span className="stat-value">${money.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Reputation:</span>
          <span className="stat-value">
            {reputation.toFixed(1)}/5.0 {getReputationEmoji(reputation)}
          </span>
        </div>
      </div>
    </header>
  );
};

const Room = ({ room, onUpgrade, onClean }) => (
  <div className="room">
    <h3>Room {room.id}</h3>
    <div className="room-stats">
      <p>
        Quality:
        <div className="stat-bar-container">
          <div
            className="stat-bar quality"
            style={{ width: `${room.quality * 20}%` }}
          ></div>
        </div>
        <span className="stat-value">{room.quality}/5</span>
      </p>
      <p>
        Cleanliness:
        <div className="stat-bar-container">
          <div
            className={`stat-bar cleanliness-${room.cleanliness}`}
            style={{ width: `${room.cleanliness * 20}%` }}
          ></div>
        </div>
        <span className="stat-value">{room.cleanliness}/5</span>
      </p>
    </div>
    <p className="room-price">Price: ${room.price}/night</p>
    <p className={`room-status ${room.occupied ? "occupied" : "vacant"}`}>
      {room.occupied ? "Occupied" : "Vacant"}
    </p>
    <div className="room-actions">
      <button onClick={() => onUpgrade(room.id)}>
        Upgrade ($500) +$50/night
      </button>
      <button onClick={() => onClean(room.id)}>Clean ($50)</button>
    </div>
  </div>
);

const StaffMember = ({ staff, onTrain, onFire }) => (
  <div className="staff-member">
    <h3>{staff.name}</h3>
    <p>
      Skill:
      <div className="stat-bar-container">
        <div
          className="stat-bar skill"
          style={{ width: `${staff.skill * 20}%` }}
        ></div>
      </div>
      <span className="stat-value">{staff.skill}/5</span>
    </p>
    <p>Salary: ${staff.salary}/day</p>
    <p>
      Happiness:
      <div className="stat-bar-container">
        <div
          className="stat-bar happiness"
          style={{ width: `${staff.happiness * 20}%` }}
        ></div>
      </div>
      <span className="stat-value">{staff.happiness.toFixed(1)}/5</span>
    </p>
    <div className="staff-actions">
      <button onClick={() => onTrain(staff.id)}>Train ($200)</button>
      <button className="fire-btn" onClick={() => onFire(staff.id)}>
        Fire
      </button>
    </div>
  </div>
);

const CustomerReview = ({ cleanliness, foodQuality, staffQuality }) => {
  const getReview = () => {
    const avgRating = (cleanliness + foodQuality + staffQuality) / 3;
    if (avgRating >= 4.5)
      return "Outstanding experience! Clean rooms, delicious food, and exceptional staff.";
    if (avgRating >= 3.5)
      return "Very good stay. Rooms were clean, food was tasty, and staff was helpful.";
    if (avgRating >= 2.5)
      return "Average experience. Some areas need improvement.";
    return "Disappointing stay. Significant improvements needed in cleanliness, food, and service.";
  };

  const averageRating = (cleanliness + foodQuality + staffQuality) / 3;

  return (
    <div className="customer-review">
      <p>{getReview()}</p>
      <div className="review-stars">
        {"★".repeat(Math.round(averageRating))}
        {"☆".repeat(5 - Math.round(averageRating))}
      </div>
    </div>
  );
};

const GameInfo = ({
  day,
  lastReviewCleanliness,
  lastReviewFood,
  lastReviewStaff,
  foodStock,
  onBuyFood,
}) => (
  <div className="game-info">
    <h2>Day {day}</h2>
    <div className="info-grid">
      <div className="info-item">
        <h3>Latest Review</h3>
        <CustomerReview
          cleanliness={lastReviewCleanliness}
          foodQuality={lastReviewFood}
          staffQuality={lastReviewStaff}
        />
      </div>
      <div className="info-item">
        <h3>Food Stock</h3>
        <p>{foodStock} units</p>
        <button onClick={onBuyFood}>Buy Food ($1000 for 100 units)</button>
      </div>
    </div>
  </div>
);

const GameControls = ({
  onReset,
  isRunning,
  onToggleSimulation,
  onBuyRoom,
  onHireEmployee,
  onCleanAllRooms,
}) => (
  <div className="game-controls">
    <button onClick={onReset}>Reset Game</button>
    <button onClick={onToggleSimulation}>
      {isRunning ? "Pause Simulation" : "Start Simulation"}
    </button>
    <button onClick={onBuyRoom}>Buy New Room ($5000)</button>
    <button onClick={onHireEmployee}>Hire Employee ($1000)</button>
    <button onClick={onCleanAllRooms}>Clean All Rooms</button>
  </div>
);

function App() {
  const [money, setMoney] = useState(10000);
  const [reputation, setReputation] = useState(3);
  const [rooms, setRooms] = useState([
    { id: 1, quality: 3, cleanliness: 5, price: 700, occupied: false },
  ]); // Start with only one room
  const [staff, setStaff] = useState([
    { id: 1, name: "John Doe", skill: 3, salary: 100, happiness: 3 },
  ]); // Start with only one staff member
  const [day, setDay] = useState(1);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [lastReviewCleanliness, setLastReviewCleanliness] = useState(3);
  const [foodStock, setFoodStock] = useState(100); // New state for food stock
  const [lastReviewFood, setLastReviewFood] = useState(3); // New state for food review
  const [lastReviewStaff, setLastReviewStaff] = useState(3); // New state for staff review

  useEffect(() => {
    let gameLoop;
    if (isSimulationRunning) {
      gameLoop = setInterval(() => {
        simulateDay();
      }, 5000); // Each day lasts 5 seconds in real time
    }
    return () => clearInterval(gameLoop);
  }, [isSimulationRunning, rooms, staff, foodStock]);

  const simulateDay = () => {
    setDay((prevDay) => prevDay + 1);

    // Calculate daily income and expenses
    const dailyIncome = rooms.reduce(
      (sum, room) => sum + (room.occupied ? room.price : 0),
      0
    );
    const dailyExpenses = staff.reduce((sum, member) => sum + member.salary, 0);
    const foodExpenses = rooms.filter((room) => room.occupied).length * 10; // $10 food cost per occupied room

    setMoney(
      (prevMoney) => prevMoney + dailyIncome - dailyExpenses - foodExpenses
    );

    // Update room occupancy and reduce cleanliness for occupied rooms
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        const newOccupied =
          Math.random() < (room.quality + room.cleanliness) / 10;
        let newCleanliness = room.cleanliness;

        if (room.occupied) {
          // Reduce cleanliness by a random number between 1 and 3 if the room was occupied
          const cleanlinessReduction = Math.floor(Math.random() * 3) + 1;
          newCleanliness = Math.max(1, room.cleanliness - cleanlinessReduction);
        }

        return {
          ...room,
          occupied: newOccupied,
          cleanliness: newCleanliness,
        };
      })
    );

    // Update food stock and calculate food quality
    const foodConsumed = rooms.filter((room) => room.occupied).length * 5; // 5 units per occupied room
    setFoodStock((prevStock) => Math.max(0, prevStock - foodConsumed));
    const foodQuality = foodStock > 50 ? 5 : foodStock > 25 ? 3 : 1;

    // Update staff happiness
    setStaff((prevStaff) =>
      prevStaff.map((member) => ({
        ...member,
        happiness: Math.max(
          1,
          Math.min(5, member.happiness + (Math.random() > 0.5 ? 0.1 : -0.1))
        ),
      }))
    );

    // Calculate averages
    const avgCleanliness =
      rooms.reduce((sum, room) => sum + room.cleanliness, 0) / rooms.length;
    const avgQuality =
      rooms.reduce((sum, room) => sum + room.quality, 0) / rooms.length;
    const avgStaffSkill =
      staff.reduce((sum, member) => sum + member.skill, 0) / staff.length;
    const avgStaffHappiness =
      staff.reduce((sum, member) => sum + member.happiness, 0) / staff.length;

    // Calculate new reputation with staff impact
    const newReputation =
      avgQuality * 0.2 +
      avgCleanliness * 0.2 +
      avgStaffSkill * 0.2 +
      avgStaffHappiness * 0.2 +
      foodQuality * 0.2;
    setReputation(Math.min(5, Math.max(1, newReputation)));

    // Generate new reviews
    setLastReviewCleanliness(avgCleanliness);
    setLastReviewFood(foodQuality);

    // New: Generate staff review
    const staffReview = (avgStaffSkill + avgStaffHappiness) / 2;
    setLastReviewStaff(staffReview);
  };

  const resetGame = () => {
    setDay(1);
    setMoney(10000);
    setReputation(3);
    setRooms([
      { id: 1, quality: 3, cleanliness: 5, price: 700, occupied: false },
    ]); // Reset to one room
    setStaff([
      { id: 1, name: "John Doe", skill: 3, salary: 100, happiness: 3 },
    ]); // Reset to one staff member
    setIsSimulationRunning(false);
    setFoodStock(100);
  };

  const nextDay = () => {
    simulateDay();
  };

  const upgradeRoom = (roomId) => {
    if (money >= 500) {
      setMoney((prevMoney) => prevMoney - 500);
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                quality: Math.min(5, room.quality + 1),
                price: room.price + 50, // Increase price by $50 per upgrade
              }
            : room
        )
      );
    }
  };

  const cleanRoom = (roomId) => {
    if (money >= 50) {
      setMoney((prevMoney) => prevMoney - 50);
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId ? { ...room, cleanliness: 5 } : room
        )
      );
    }
  };

  const trainStaff = (staffId) => {
    if (money >= 200) {
      setMoney((prevMoney) => prevMoney - 200);
      setStaff((prevStaff) =>
        prevStaff.map((member) =>
          member.id === staffId
            ? { ...member, skill: Math.min(5, member.skill + 1) }
            : member
        )
      );
    }
  };

  const fireStaff = (staffId) => {
    setStaff((prevStaff) =>
      prevStaff.filter((member) => member.id !== staffId)
    );
  };

  const buyNewRoom = () => {
    if (money >= 5000) {
      setMoney((prevMoney) => prevMoney - 5000);
      setRooms((prevRooms) => [
        ...prevRooms,
        {
          id: prevRooms.length + 1,
          quality: 3,
          cleanliness: 5,
          price: 700,
          occupied: false,
        },
      ]);
    }
  };

  const hireEmployee = () => {
    if (money >= 1000) {
      setMoney((prevMoney) => prevMoney - 1000);
      setStaff((prevStaff) => [
        ...prevStaff,
        {
          id: prevStaff.length + 1,
          name: `Employee ${prevStaff.length + 1}`,
          skill: 3,
          salary: 100,
          happiness: 3, // Add initial happiness for new employees
        },
      ]);
    }
  };

  const buyFood = () => {
    if (money >= 1000) {
      setMoney((prevMoney) => prevMoney - 1000);
      setFoodStock((prevStock) => Math.min(prevStock + 100, 200)); // Max stock is 200
    }
  };

  const cleanAllRooms = () => {
    const dirtyRooms = rooms.filter((room) => room.cleanliness < 5);
    const totalCost = dirtyRooms.length * 50; // $50 per room

    if (money >= totalCost) {
      setMoney((prevMoney) => prevMoney - totalCost);
      setRooms((prevRooms) =>
        prevRooms.map((room) => ({ ...room, cleanliness: 5 }))
      );
    } else {
      alert("Not enough money to clean all rooms!");
    }
  };

  return (
    <div className="app">
      <Header money={money} reputation={reputation} />
      <main>
        <GameInfo
          day={day}
          lastReviewCleanliness={lastReviewCleanliness}
          lastReviewFood={lastReviewFood}
          lastReviewStaff={lastReviewStaff}
          foodStock={foodStock}
          onBuyFood={buyFood}
        />
        <GameControls
          onReset={resetGame}
          isRunning={isSimulationRunning}
          onToggleSimulation={() =>
            setIsSimulationRunning(!isSimulationRunning)
          }
          onBuyRoom={buyNewRoom}
          onHireEmployee={hireEmployee}
          onCleanAllRooms={cleanAllRooms}
        />
        <section className="hotel-management">
          <div className="rooms-section">
            <h2>Rooms ({rooms.length})</h2>
            <div className="rooms-grid">
              {rooms.map((room) => (
                <Room
                  key={room.id}
                  room={room}
                  onUpgrade={upgradeRoom}
                  onClean={cleanRoom}
                />
              ))}
            </div>
          </div>
          <div className="staff-section">
            <h2>Staff ({staff.length})</h2>
            <div className="staff-grid">
              {staff.map((member) => (
                <StaffMember
                  key={member.id}
                  staff={member}
                  onTrain={trainStaff}
                  onFire={fireStaff}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
