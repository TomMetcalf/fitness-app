import { useEffect, useState } from 'react';
import { useWorkoutContext } from '../hooks/useWorkoutsContext';
import FadeLoader from 'react-spinners/FadeLoader';
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';

function Home() {
  let [loading, setLoading] = useState(true);
  const { workouts, dispatch } = useWorkoutContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('/api/workouts');
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: json });
      }
      setLoading(false);
    };

    fetchWorkouts();
  }, [dispatch]);

  return (
    <div className="home">
      {loading ? (
        <FadeLoader
          color={'#000'}
          loading={loading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
          height={30}
          margin={30}
        />
      ) : (
        <div className="workouts">
          {workouts &&
            workouts.map((workout) => (
              <WorkoutDetails key={workout._id} workout={workout} />
            ))}
        </div>
      )}
      <WorkoutForm />
    </div>
  );
}

export default Home;
