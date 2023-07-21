import { useEffect, useState } from 'react';
import { useWorkoutContext } from '../hooks/useWorkoutsContext';
import FadeLoader from 'react-spinners/FadeLoader';
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';
import { useAuthContext } from '../hooks/useAuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dateFormat from 'dateformat';

function Home() {
  let [loading, setLoading] = useState(true);
  const { workouts, dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const [value, onChange] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const valueStr = String(value).substring(0, 15);

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

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const filteredWorkouts = workouts
    ? workouts.filter(
        (workout) =>
          valueStr === dateFormat(workout.createdAt, 'ddd mmm d yyyy')
      )
    : [];

  return (
    <div className="home">
      {loading ? (
        <div className="loader-container">
          <FadeLoader
            color={'#000'}
            loading={loading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
            height={30}
            margin={30}
          />
          <div className="loading-text">
            <p>Loading workouts</p>
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="calendar-container">
              <button className="calendarBtn" onClick={handleButtonClick}>
                {isOpen ? 'Close Calendar' : 'Open Calendar'}
              </button>
            </div>
            {isOpen && (
              <div className="calendar">
                <Calendar onChange={onChange} value={value} />
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
        </>
      )}
      <WorkoutForm />
    </div>
  );
}

export default Home;
