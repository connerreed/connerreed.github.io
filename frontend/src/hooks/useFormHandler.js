import { useState } from "react";
import axios from 'axios';

const useFormHandler = (submitCallback) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData) => {
        setError('');
        setLoading(true);

        try {
            await submitCallback(formData);
        } catch(error) {
            handleAxiosError(error);
        } finally {
            setLoading(false);
        }
    }

    const handleAxiosError = (error) => {
        if (axios.isAxiosError(error)) {
            if (error.response) {
              setError(
                'Login failed: ' +
                  (error.response.data.non_field_errors?.[0] || 'Invalid credentials')
              );
            } else if (error.request) {
              setError('Login failed: No response from server');
            } else {
              setError('Login failed: ' + error.message);
            }
          } else {
            setError('Login failed: An unexpected error occurred');
          }
    }

    return { loading, error, handleSubmit };
}

export default useFormHandler;