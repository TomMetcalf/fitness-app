import { useEffect, useState } from 'react';
import { useWorkoutContext } from '../hooks/useWorkoutsContext';
import FadeLoader from 'react-spinners/FadeLoader';
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';
import { useAuthContext } from '../hooks/useAuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dateFormat from 'dateformat';

function Home({ theme }) {
  let [loading, setLoading] = useState(true);
  const { workouts, dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const [value, onChange] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTotal, setSelectedTotal] = useState('');

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('/api/workouts', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: json });
      }
      setLoading(false);
    };

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

const filteredWorkouts = workouts
  ? workouts.filter((workout) => {
      const workoutDate = new Date(workout.createdAt);
      return (
        value.getDate() === workoutDate.getDate() &&
        value.getMonth() === workoutDate.getMonth() &&
        value.getFullYear() === workoutDate.getFullYear()
      );
    })
  : [];

  function hasWorkoutsForDate(workouts, date) {
    const dateString = dateFormat(date, 'ddd mmm d yyyy');
    return workouts.some(
      (workout) =>
        dateString === dateFormat(workout.createdAt, 'ddd mmm d yyyy')
    );
  }

  const filteredWorkoutTotals = filteredWorkouts.reduce((totals, workout) => {
    const key = `${workout.title}_${workout.load}_${workout.weightUnit}`;
    if (!totals[key]) {
      totals[key] = {
        title: workout.title,
        load: workout.load,
        weightUnit: workout.weightUnit,
        totalReps: workout.reps,
      };
    } else {
      totals[key].totalReps += workout.reps;
    }
    return totals;
  }, {});

  const filteredWorkoutTotalArray = Object.values(filteredWorkoutTotals);

  filteredWorkoutTotalArray.sort((a, b) => a.title.localeCompare(b.title));

  const selectedTotalObj = filteredWorkoutTotalArray.find(
    (total) => total.title === selectedTotal
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      const calendarContainer = document.querySelector('.calendar');
      if (calendarContainer && !calendarContainer.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleCalendarButtonClick = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="home">
      {loading ? (
        <div className="loader-container">
          <FadeLoader
            color={theme === 'light' ? '#000' : '#fff'}
            loading={loading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
            height={30}
            margin={30}
          />
          <div className="loading-text">
            <p>Loading workouts...</p>
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="calendar-container">
              <button
                className="calendarBtn"
                onClick={handleCalendarButtonClick}
              >
                {isOpen ? 'Close Calendar' : 'Open Calendar'}
              </button>
            </div>
            {isOpen && (
              <div className="calendar">
                <Calendar
                  onChange={onChange}
                  value={value}
                  tileContent={({ date, view }) =>
                    view === 'month' && hasWorkoutsForDate(workouts, date) ? (
                      <div className="has-workout-marker"></div>
                    ) : null
                  }
                />
              </div>
            )}
          </div>
          <div className="workouts">
            {filteredWorkouts.length === 0 ? (
              <p>No workouts to display for this date</p>
            ) : (
              filteredWorkouts.map((workout) => (
                <WorkoutDetails key={workout._id} workout={workout} />
              ))
            )}
          </div>
          <div className="totals">
            <h3>Daily Totals</h3>
            {selectedTotal !== '' && selectedTotalObj && (
              <div>
                <p>
                  Total Reps:{' '}
                  <span className="total-reps">
                    {selectedTotalObj.totalReps}{' '}
                  </span>
                </p>
              </div>
            )}
            <select
              className="workout-totals total-reps"
              value={selectedTotal}
              onChange={(e) => setSelectedTotal(e.target.value)}
            >
              <option value={null}>Select a Total</option>
              {filteredWorkoutTotalArray.map((total) => (
                <option
                  key={`${total.title}_${total.load}_${total.weightUnit}_total`}
                  value={total.title}
                >
                  {total.title} - {total.load !== 0 && `${total.load} `}
                  {total.weightUnit}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      <WorkoutForm />
    </div>
  );
}

export default Home;