import { useState } from 'react';
import { useWorkoutContext } from '../hooks/useWorkoutsContext';
import dateFormat from 'dateformat';
import { useAuthContext } from '../hooks/useAuthContext';

function WorkoutDetails({ workout }) {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(workout.title);
  const [editedLoad, setEditedLoad] = useState(workout.load);
  const [editedWeightUnit, setEditedWeightUnit] = useState(workout.weightUnit);
  const [editedReps, setEditedReps] = useState(workout.reps);

  const handleClickDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json });
    }
  };

  const handleClickEdit = () => {
    if (!user) {
      return;
    }

    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        title: editedTitle,
        load: editedLoad,
        weightUnit: editedWeightUnit,
        reps: editedReps,
      }),
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_WORKOUT', payload: json });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(workout.title);
    setEditedLoad(workout.load);
    setEditedWeightUnit(workout.weightUnit);
    setEditedReps(workout.reps);
    setIsEditing(false);
  };

  const weightUnits = ['kg', 'lbs', 'bodyweight'];

  return (
    <div className="workout-details">
      {isEditing ? (
        <>
          <label htmlFor="exercise-title">Exercise Title:</label>
          <input
            name="exercise-title"
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <label htmlFor="load">Load</label>
          <select
            className="weight-unit"
            value={editedWeightUnit}
            onChange={(e) => setEditedWeightUnit(e.target.value)}
          >
            {weightUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>{' '}
          :
          <input
            name="load"
            type="number"
            value={editedLoad}
            onChange={(e) => setEditedLoad(e.target.value)}
          />
          <label htmlFor="reps">Reps:</label>
          <input
            name="reps"
            type="number"
            value={editedReps}
            onChange={(e) => setEditedReps(e.target.value)}
          />
        </>
      ) : (
        <>
          <h4>{workout.title}</h4>
          {workout.weightUnit === 'bodyweight' ? (
            <p>
              <strong>Load: </strong>Bodyweight
            </p>
          ) : workout.load !== 0 ? (
            <p>
              <strong>Load ({workout.weightUnit}): </strong>
              {workout.load}
            </p>
          ) : null}{' '}
          <p>
            <strong>Reps: </strong>
            {workout.reps}
          </p>
          <p>{dateFormat(workout.createdAt, 'dddd mmmm dS yyyy, h:MM TT')}</p>
        </>
      )}

      {isEditing ? (
        <>
          <button className="editBtn" onClick={handleSaveChanges}>
            Save
          </button>
          <button className="editBtn" onClick={handleCancelEdit}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <span
            onClick={handleClickEdit}
            className="material-symbols-outlined edit_note"
          >
            edit_note
          </span>
          <span
            onClick={handleClickDelete}
            className="material-symbols-outlined"
          >
            delete
          </span>
        </>
      )}
    </div>
  );
}

export default WorkoutDetails;
