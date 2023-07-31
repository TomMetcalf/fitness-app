import { useState } from 'react';
import { useWorkoutContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';

function WorkoutForm() {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [weightUnit, setWeightUnit] = useState('kg');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const workout = { title, load, weightUnit, reps };

    const response = await fetch('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      setTitle('');
      setLoad('');
      setReps('');
      setWeightUnit('kg')
      setError(null);
      setEmptyFields([]);
      dispatch({ type: 'CREATE_WORKOUT', payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>
      <label className="workout-label" htmlFor="title">
        Exercise Title:
      </label>
      <input
        name="title"
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        id="text-input"
        className={emptyFields.includes('title') ? 'error' : ''}
      />
      <label className="workout-label" htmlFor="load">
        Load <select
          name="weight-unit"
          onChange={(e) => setWeightUnit(e.target.value)}
          value={weightUnit}
        >
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
          <option value="bodyweight">bodyweight</option>
        </select> :
      </label>
      <input
        name="load"
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes('load') ? 'error' : ''}
      />
      <label className="workout-label" htmlFor="reps">
        Reps:
      </label>
      <input
        name="reps"
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes('reps') ? 'error' : ''}
      />
      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default WorkoutForm;
