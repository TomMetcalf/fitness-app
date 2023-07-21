import { useState } from 'react';
import { useWorkoutContext } from '../hooks/useWorkoutsContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useAuthContext } from '../hooks/useAuthContext';

function WorkoutDetails({ workout }) {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(workout.title);
  const [editedLoad, setEditedLoad] = useState(workout.load);
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
    setEditedReps(workout.reps);
    setIsEditing(false);
  };

  return (
    <div className="workout-details">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <input
            type="number"
            value={editedLoad}
            onChange={(e) => setEditedLoad(e.target.value)}
          />
          <input
            type="number"
            value={editedReps}
            onChange={(e) => setEditedReps(e.target.value)}
          />
        </>
      ) : (
        <>
          <h4>{workout.title}</h4>
          <p>
            <strong>Load (kg): </strong>
            {workout.load}
          </p>
          <p>
            <strong>Reps: </strong>
            {workout.reps}
          </p>
          <p>
            {formatDistanceToNow(new Date(workout.createdAt), {
              addSuffix: true,
            })}
          </p>
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
