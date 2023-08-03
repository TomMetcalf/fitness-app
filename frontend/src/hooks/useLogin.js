import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));

      // update the auth context
      dispatch({ type: 'LOGIN', payload: json });

      setIsLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        // If the reset token is sent in the response, you can access it from the json object
        const resetToken = json.resetToken; // Replace 'resetToken' with the actual key used in the response

        // You can now use the resetToken as needed, for example, you might want to store it in the state
        // or pass it to another function to handle the password reset process on the frontend.
      }
    } catch (error) {
      setError('An error occurred while resetting the password.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, resetPassword, error };
};
