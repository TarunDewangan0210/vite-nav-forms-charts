import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { saveCheckIn } from '../utils/storage';
import type { CheckIn } from '../types';
import './CheckInForm.css';

interface FormData {
  name: string;
  date: string;
  activitiesSince: string;
  activitiesPlanned: string;
  blockers: string;
  stressLevel: number;
  whyStressed?: string;
  moraleLevel: number;
}

const CheckInForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0]
    }
  });

  const stressLevel = watch('stressLevel');

  const onSubmit = (data: FormData) => {
    const checkIn: CheckIn = {
      id: crypto.randomUUID(),
      name: data.name,
      date: data.date,
      activitiesSince: data.activitiesSince,
      activitiesPlanned: data.activitiesPlanned,
      blockers: data.blockers,
      stressLevel: Number(data.stressLevel),
      whyStressed: data.whyStressed,
      moraleLevel: Number(data.moraleLevel),
      timestamp: Date.now()
    };

    saveCheckIn(checkIn);
    reset();
    navigate('/');
  };

  return (
    <div className="check-in-form-container">
      <div className="form-header">
        <h1>Check-in Form</h1>
        <p>Share your current status and feelings with the team</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="check-in-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            id="date"
            type="date"
            {...register('date', { required: 'Date is required' })}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="activitiesSince">Activities since last check-in</label>
          <textarea
            id="activitiesSince"
            rows={4}
            {...register('activitiesSince')}
            placeholder="What have you been working on since the last check-in?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="activitiesPlanned">Activities planned before next check-in</label>
          <textarea
            id="activitiesPlanned"
            rows={4}
            {...register('activitiesPlanned')}
            placeholder="What do you plan to work on before the next check-in?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="blockers">Blockers/flags/needed from teammates</label>
          <textarea
            id="blockers"
            rows={4}
            {...register('blockers')}
            placeholder="Any blockers or help needed from teammates?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stressLevel">Stress Level *</label>
          <select
            id="stressLevel"
            {...register('stressLevel', { 
              required: 'Stress level is required',
              min: { value: 1, message: 'Please select a stress level' }
            })}
            className={errors.stressLevel ? 'error' : ''}
          >
            <option value="">Select stress level</option>
            <option value="1">1 - Very Low</option>
            <option value="2">2 - Low</option>
            <option value="3">3 - Medium</option>
            <option value="4">4 - High</option>
            <option value="5">5 - Very High</option>
          </select>
          {errors.stressLevel && <span className="error-message">{errors.stressLevel.message}</span>}
        </div>

        {Number(stressLevel) === 5 && (
          <div className="form-group">
            <label htmlFor="whyStressed">Why so stressed?</label>
            <textarea
              id="whyStressed"
              rows={3}
              {...register('whyStressed')}
              placeholder="Please explain what's causing the high stress level..."
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="moraleLevel">Morale Level *</label>
          <select
            id="moraleLevel"
            {...register('moraleLevel', { 
              required: 'Morale level is required',
              min: { value: 1, message: 'Please select a morale level' }
            })}
            className={errors.moraleLevel ? 'error' : ''}
          >
            <option value="">Select morale level</option>
            <option value="1">1 - Very Low</option>
            <option value="2">2 - Low</option>
            <option value="3">3 - Medium</option>
            <option value="4">4 - High</option>
            <option value="5">5 - Very High</option>
          </select>
          {errors.moraleLevel && <span className="error-message">{errors.moraleLevel.message}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => reset()} className="reset-btn">
            Reset Form
          </button>
          <button type="submit" className="submit-btn">
            Submit Check-in
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckInForm; 